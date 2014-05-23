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

var cameraGroup_list=[];

$(document).on('mobileinit',function(){
    $.extend($.mobile,{
      defaultDialogTransition: "none",
      defaultPageTransition: "none"
    });
});

// status page
$(document).on('pagecreate','#status',function(e){
  setTimeout(function(){ 
    $('a#status').addClass('ui-btn-active');
    $.mobile.loading('show',{
        text: "Loading...",
        textVisible: true,
        theme: "a",
    });
  },0);

  $.each($.extend(true,{},prefs.cameras),function(groupName,cameraList){
    var group=new CameraGroup({
        name: groupName,
        cameras: cameraList
    });
  });
});

function CameraGroup(options){
  if (!(this instanceof CameraGroup)) {
    return new CameraGroup(options);
  }
  this.options=options;
  this.init();
  cameraGroup_list.push(this);
}

$.extend(true,CameraGroup.prototype,{
  defaults: {
    camera: [],
    count: 0
  },

  init: function cameraGroup_init() {
    var cameraGroup=this;
    $.extend(true,this,cameraGroup.defaults,cameraGroup.options);
    cameraGroup.count=0;
    $.each(cameraGroup.cameras,function(i,camera){
      cameraGroup.count+=1+(camera.slaves||0);
    });
    $.each(cameraGroup.cameras,function(i,camera){
      if (camera.slaves) {
        var ipTable=camera.ip.split('.');
        var base=parseInt(ipTable.pop(),10);
        var net=ipTable.join('.')+'.';
        for (var i=0; i<=camera.slaves; ++i) {
          cameraGroup.addCamera($.extend(true,{},camera,{
             master: net+base,
             ip: net+(base+i)
          }));
        }
      } else {
        cameraGroup.addCamera(camera);
      }
    });
  },

  addCamera: function cameraGroup_addCamera(camera) {
    var cameraGroup=this;
    cameraGroup.camera.push(new Camera($.extend(true,{},camera,{
      onload: function(){
        var camera=this;
        camera.isLoaded=true;
        var count=0;
        $.each(cameraGroup.camera,function(i,camera){
          if (camera.isLoaded) {
            ++count;
          }
        });
        if (count==cameraGroup.camera.length) { 
          cameraGroup.showStatus();
          cameraGroup.loaded=true;
          var remainingGroups=0;
          $.each(cameraGroup_list,function(index,group){
            ++remainingGroups;
            if (group.loaded) {
              --remainingGroups;
            }
          });
          if (!remainingGroups) {
            $.mobile.loading('hide'); // TODO per group
          }
        }
      }
    })));
  },

  showStatus: function cameraGroup_showStatus() {
    var cameraGroup=this;
    cameraGroup.div_status=$('#'+cameraGroup.name+'_status');
    if (!cameraGroup.div_status.length) {
      cameraGroup.div_status=$([
          '<div id="'+cameraGroup.name+'_status">',
          '</div>'
      ].join('\n'));
      $('#camera_status').append(cameraGroup.div_status);
    }
    $.each(cameraGroup.camera,function(index,camera) {
      camera.showStatus(cameraGroup.div_status);
    });
  }
});

