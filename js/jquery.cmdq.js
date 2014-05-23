(function($){

    function CmdQ(options) {
      if (!(this instanceof CmdQ)) {
        return new CmdQ(options);
      }
      this.options=options;
      this.init();
    }

    $.extend(true,CmdQ.prototype,{
        defaults: {
          q: [],
          callback: function(){
            console.log('cmdq empty');
          },
          error: function(e){
            console.log(e);
          },
          mode: {
            autorun: true,
            running: false
          }
        },

        init: function() {
          $.extend(true,this,this.defaults,this.options);
        },

        push: function(cmd,sync) {
          var cmdq=this;
          this.q.push({
              cmd: cmd,
              sync: sync
          });
          if (!cmdq.mode.running && cmdq.mode.autorun) {
            cmdq.run();
          }
        },

        run: function() {
          var cmdq=this;
          cmdq.mode.running=true;
          if (!cmdq.length) {
            cmdq.mode.running=false;
            cmdq.callback();
            return;
          }
          var job=cmdq.shift();
          try {
            job.cmd.call(cmdq);
          } catch(e) {
            console.log(e);
            cmdq.error(e);
          }
          if (job.sync) {
            setTimeout(function(){
              cmdq.run.call(cmdq);
            },0);
          }
        }
    });

    $.cmdq=CmdQ;

})(jQuery);
