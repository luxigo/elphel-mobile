(function($){

    function cmdq(options) {
      if (!(this instanceof cmdq)) {
        return new cmdq(options);
      }
      this.options=options;
      this.init();
    }

    $.extend(true,cmdq.prototype,{
        defaults: {
          q: [],
          callback: function(){}
        },

        init: function() {
          $.extend(true,this,this.defaults,this.options);
        },

        push: function(cmd,sync) {
          this.q.push({
              cmd: cmd,
              sync: sync
          });
        },

        run: function() {
          if (!this.length) {
            this.callback();
            return:
          }
          var job=this.shift();
          job.cmd.call(this);
          if (job.sync) {
            setTimeout(this.run,0);
          }
        }
    });

    $.cmdq=cmdq;

})(jQuery);
