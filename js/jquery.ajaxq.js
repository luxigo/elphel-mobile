function AjaxQ(options){   
  if (!(this instanceof AjaxQ)) {
    return new AjaxQ(options);
  }
  this.options=options;  
  this.init();
}
 
$.extend(true,AjaxQ.prototype,{

});

