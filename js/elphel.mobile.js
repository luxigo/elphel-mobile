var prefs={
  camera: [
    { 
      ip:'192.168.0.9'
    }
  ]
}

var camera_list=[];

$(document).on('mobileinit',function(){
    $.extend($.mobile,{
      defaultDialogTransition: "none",
      defaultPageTransition: "none"
    });
});

// status page
$(document).on('pagecreate','#status',function(e){
  console.log(e);
  setTimeout(function(){ 
    $('a#status').addClass('ui-btn-active');
    $.mobile.loading('show',{
        text: "Loading...",
        textVisible: true,
        theme: "a",
    });
  },0);

  $.each(prefs.camera,function(index,settings){
    camera_list.push(new Camera($.extend(true,{},settings,{
      onload: function(){
        var camera=this;
        camera.isLoaded=true;
        var count=0;
        $.each(camera_list,function(i,camera){
          if (camera.isLoaded) {
            ++count;
          }
        });
        if (count==camera_list.length) { 
          camera.show_status('#camera_status');
          $.mobile.loading('hide');
        }
      }
    })));
  });
});
