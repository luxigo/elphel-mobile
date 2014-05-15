(function($){

  function ajaxQ(options){   
    if (!(this instanceof ajaxQ)) {
      return new ajaxQ(options);
    }
    this.options=options;  
    this.init();
  }
   
  $.extend(true,ajaxQ.prototype,{
    defaults: {
      queue: [],
      queue_success: function() {},
      queue_error: function() {},
    },

    init: function() {
      var ajaxq=this;
      $.extend(true,this,ajaxq.defaults,ajaxq.options);
    },

    push: function(request){
      var ajaxq=this;
      ajaxq.queue.push(request);
    },

    processOne: function(index) {
      var ajaxq=this;
      if (!index) {
        ajaxq.abort=0;
      }
      if (ajaxq.abort) return;
      index=(index)?index:++ajaxq.index;
      ajaxq.index=index;
      var request=$.extend(true,{},ajaxq.queue[index],{
        ajaxq: ajaxq,
        index: index,
        originalRequest: ajaxq.queue[index],
        success: function() {
          var args=Array.prototype.slice.call(arguments);
          ajaxq.request_success.apply(this,args);
        },
        error: function() {
          var args=Array.prototype.slice.call(arguments);
          ajaxq.request_error.apply(this,args);
        }
      });
      request.context=request;
      $.ajax(request);
    },

    request_success: function() {
      var request=this;
      var ajaxq=request.ajaxq;
      ajaxq.processed[i]={
        request: request,
        result: args,
        error: false
      };
      if (ajaxq.abort) return;
      var args=Array.prototype.slice.call(arguments);
      request.originalRequest.success.apply(request,args);
      ajaxq.processed[i].done=true;
      if (ajaxq.abort) return;
      if (ajaxq.serial) {
        setTimeout(ajaxq.processOne,0);
      }
    },

    request_error: function(index) {
      var request=this;
      var ajaxq=request.ajaxq;
      ajaxq.processed[i]={
        request: request,
        result: args,
        error: true
      };
      if (ajaxq.abort) return;
      var args=Array.prototype.slice.call(arguments);
      request.originalRequest.error.apply(request,args);
      ajaxq.processed[i].done=true;
      ajaxq.queue_error(request,args);
      if (ajaxq.abort) return;
      if (ajaxq.serial) {
         setTimeout(ajaxq.processOne,0);
      }
    },

    processQueue: function(serial){
      var ajaxq=this;
      ajaxq.serial=serial;
      ajaxq.processed={};
      if (ajaxq.serial) {
        ajaxq.processOne.apply(ajaxq,[0]);
      } else {
        $.each(ajaxq.queue,function(i,request){
          ajaxq.processOne.apply(ajaxq,[i]);
        });
      }
    }

  });

  $.ajaxQ=ajaxQ;

})(jQuery);

