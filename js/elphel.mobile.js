var prefs={
  camera_count: 1,
  camera_ip: [
    '192.168.0.9'
  ]
}

$(document).on('mobileinit',function(){
    $.extend($.mobile,{
      defaultDialogTransition: "none",
      defaultPageTransition: "none"
    });
});

$(document).on('pagecreate','#status',function(e){
  console.log(e);
  setTimeout(function(){ 
    $('a#status').addClass('ui-btn-active');
    $.mobile.loading('show',{
        text: "Loading...",
        textVisible: true,
        theme: "a",
    });
    $.each(prefs.camera_ip,function(index,value){
      var img=new Image();
      $(img).on('load',function(){
      });
      img.src='images/histogram.png';
    });
  },0);

});
