$(document).on("pagecreate","#dashboard",function(e){
  console.log(e);
  setTimeout(function(){ 
  $('a#dashboard').addClass('ui-btn-active');
  $.mobile.loading('show',{
      text: "Loading...",
      textVisible: true,
      theme: "a",
  });
  },0);

});
