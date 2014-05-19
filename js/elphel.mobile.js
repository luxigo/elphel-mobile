var prefs={
  cameras: {
    eyesis4pi: [{
      ip:'192.168.0.220',
      model: 'eyesis4pi',
      slaves: 25
    }],
    office: [{
      ip: '192.168.0.9'
    },{
      ip: '192.168.0.10'
    }]
  }
}

var camera_group={};

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

  $.each(prefs.cameras,function(group_name,group){
    group[group_name]={
      count: 0,
      camera: []
    };
    $.each(group,function(i,settings){
      group[group_name].count+=1+(settings.slaves||0);
    });
    $.each(group,function(i,settings){
      settings.group=group_name;
      if (settings.slaves) {
        var ipTable=settings.ip.split('.');
        var base=parseInt(ipTable.pop(),10);
        var net=ipTable.join('.')+'.';
        for (var i=0; i<=settings.slaves; ++i) {
          addCamera($.extend(true,{},settings,{
             master: net+base,
             ip: net+(base+i)
          }));
        }
      } else {
        addCamera(settings);
      }
    });
  });
});

function addCamera(settings) {
  camera_group[settings.group].camera.push(new Camera($.extend(true,{},settings,{
    onload: function(){
      var camera=this;
      camera.isLoaded=true;
      var count=0;
      $.each(camera_group[settings.group].camera,function(i,camera){
        if (camera.isLoaded) {
          ++count;
        }
      });
      if (count==camera_group[settings.group].count) { 
        cameraGroup_showStatus(settings.group);
        camera_group[settings.group].loaded=true;
        var remainingGroups=0;
        $.each(camera_group,function(group_name,group){
          ++remainingGroups;
          if (group.loaded) {
            --remainingGroups;
          }
        });
        if (done) {
          $.mobile.loading('hide'); // TODO per group
        }
      }
    }
  })));
}

function cameraGroup_showStatus(group_name) {

}

