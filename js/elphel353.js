

function timeStamp() {
  return new Date().getTime();  
}

function toQueryString(obj) { 
    var query='';
    $.each(obj,function(key,value){
      if (query.length) {
        query+='&';
      }
      query+=key+'='+encodeURIComponent(value);
    });
    return query;
}
      
function Camera(options) {
  if (!(this instanceof Camera)) {
    return new Camera(options);
  }
  this.options=options;
  this.init();
}

$.extend(true,Camera.prototype,{
    defaults: {
      ip: '192.168.0.9',
      model: 353,
      master: true,
      slaves: {},
      histogram: {
        isLoaded: false,
        onload: function(e) {
          var histogram=this;
          histogram.camera.loaded(histogram);
        }
      },
      onload: function() {
      }
    },
    init: function(){
      var camera=this;
      $.extend(true,camera,camera.defaults,camera.options);
      if (!camera.histogram.img) {
        camera.histogram.img=new Image();
      }
      camera.histogram=new Histogram($.extend(true,camera.histogram,{
        camera: camera
      }));

    },
    
    loaded: function(obj) {
      var camera=this;
      var allDone=true;
      if (camera[obj.constructor.name.toLowerCase()].isLoaded) {
        console.log(obj.constructor.name+' already loaded !');
        return;
      }
      camera[obj.constructor.name.toLowerCase()].isLoaded=true;
      $.each(camera,function(key,value){
        if (typeof(camera[key]=="object") && camera[key].isLoaded === false) {
          allDone=false;
          return false;
        }
      });
      if (allDone) {
        setTimeout(function(){
          camera.onload.call(camera);
        },0);
      }
    },
      
    show_status: function(container) {
      var cam=this;
      var id=cam.ip+'_status';
      var div=$('#'+id);
      if (!div.length) {
        $(container).append($([
          '<div class="camera_status" id="'+id+'">',
          '<div class="histogram" />',
          '</div>'
        ].join('\n')));
        $('.histogram',div).append(cam.histogram.img);
      }
      return div;
    },
    gps_imu_log_start: function() {
      
    },
    gps_imu_log_stop: function() {
    }
});

function Histogram(options) {  
  if (!(this instanceof Histogram)) {
    return new Histogram(options);
  }
  this.options=options;     
  this.init();
}

$.extend(true,Histogram.prototype,{

  defaults: {
    url: '/pnghist.cgi',
    settings: {
      sqrt: 1,
      scale: 5,
      average: 5,
      height: 128,
      fillz: 1,
      linterpz: 0,
      draw: 2,
      colors: 41
    },
    onload: function(e){
    }
  },

  init: function(){
    var histogram=this;
    $.extend(true,histogram,histogram.defaults,histogram.options);
    histogram.offscreen_img=new Image();
    $(histogram.offscreen_img).on('load',function(e){
      histogram.img.src=histogram.offscreen_img.src;
      histogram.onload.call(histogram,e);
    })
    histogram.update(histogram.settings);
  },

  update: function(settings) {
    settings['_']=timeStamp();
    var query=toQueryString($.extend({},this.settings,settings));
    this.offscreen_img.src='http://'+this.camera.ip+this.url+'?'+query;
  }
});
