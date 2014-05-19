var prefs={
  camera_count: 26,
  camera: [
    { 
      ip:'192.168.0.220',
      slaves: 25
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
    if (settings.slaves) {
      var ipTable=settings.ip.split('.');
      var base=parseInt(ipTable.pop(),10);
      var net=ipTable.join('.')+'.';
      for (var i=0; i<=settings.slaves; ++i) {
        addCamera($.extend(true,{},settings,{
              ip: net+(base+i)
        }));
      }
    } else {
      addCamera(settings);
    }
  });
});

function addCamera(settings) {
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
      if (count==prefs.camera_count) { 
        camera.show_status('#camera_status');
        $.mobile.loading('hide');
      }
    }
  })));
}

