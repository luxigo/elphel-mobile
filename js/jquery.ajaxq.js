/*
 *  jquery.ajaxq.js
 *  
 *  Copyright (C) 2014 Foxel S.A.
 *  Author: Luc Deschenaux
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
      var originalRequest=ajaxq.queue[index];
      var request=$.extend(true,{},originalRequest,{
        ajaxq: ajaxq,
        index: index,
        originalRequest: originalRequest,
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
      originalRequest.request=request
      $.ajax(request);
    },

    request_success: function request_success() {
      var request=this;
      var ajaxq=request.ajaxq;
      var args=Array.prototype.slice.call(arguments);
      ajaxq.processed[i]={
        request: request,
        result: args,
        error: false
      };
      if (ajaxq.abort) return;
      request.originalRequest.success.apply(request,args);
      ajaxq.processed[request.index].originalHandlerCalled=true;
      // original request error handler must set processed[index].done and could call request_complete asynchronously...
      if (ajaxq.abort) return;
      ajaxq.request_complete.call(request);
      if (ajaxq.serial) {
        setTimeout(ajaxq.processOne,0);
      }
    },

    request_error: function request_error() {
      var request=this;
      var ajaxq=request.ajaxq;
      var args=Array.prototype.slice.call(arguments);
      ajaxq.processed[request.index]={
        request: request,
        result: args,
        error: true
      };
      if (ajaxq.abort) return;
      request.originalRequest.error.apply(request,args);
      ajaxq.processed[request.index].originalHandlerCalled=true;
      // original request error handler may set processed[index].done and could call request_complete asynchronously...
      if (ajaxq.abort) return;
      ajaxq.request_complete.call(request);
      if (ajaxq.serial) {
         setTimeout(ajaxq.processOne,0);
      }
    },

    request_complete: function request_complete() {
      var request=this;
      var ajaxq=request.ajaxq;
      var count=0;
      var error=false;
      $.each(ajaxq.processed,function(index){
        if (ajaxq.processed[index].done) {
          ++count;
          error|=ajaxq.processed[index].error;
        }
      });
      if (count==ajaxq.queue.length) {
        if (error) {
          ajaxq.queue_error();
        } else {
          ajaxq.queue_success();
        }
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

