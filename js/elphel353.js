

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
        onload: function histogram_onload(e) {
          var histogram=this;
          histogram.camera.loaded(histogram);
        }
      },
      onload: function camera_onload() {
      }
    },
    init: function camera_init(){
      var camera=this;
      $.extend(true,camera,camera.defaults,camera.options);
      if (!camera.histogram.img) {
        camera.histogram.img=new Image();
      }
      camera.histogram=new Histogram($.extend(true,camera.histogram,{
        camera: camera
      }));

    },
    
    loaded: function camera_loaded(obj) {
      var camera=this;
      var allDone=true;
      if (camera[obj.constructor.name.toLowerCase()].isLoaded) {
        console.log(obj.constructor.name+' already loaded for camera '+camera.group+'/'+camera.ip+' !');
        return;
      }
      // check if object of type "obj.constructor.name" (eg histogram) is loaded for every camera of the same group as "camera"
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
      
    showStatus: function camera_showStatus(container) {
      var camera=this;
      var id=camera.ip+'_status';
      var div=$('#'+id,container);
      if (!div.length) {
        div=$([
          '<div class="camera_status" id="'+id+'">',
          '</div>'
        ].join('\n'));
        $(container).append(div);
        $.each(camera,function(key,value){
          if (typeof(camera[key]=="object") && typeof(camera[key].showStatus) === "function") {
            camera[key].showStatus(div);
          }
        });
      }
      return div;
    },
    log_start: function camera_logStart() {
      
    },
    log_stop: function camera_logStop() {
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
    onload: function histogram_onload(e){
    }
  },

  init: function histogram_init(){
    var histogram=this;
    $.extend(true,histogram,histogram.defaults,histogram.options);
    histogram.offscreen_img=new Image();
    
    $(histogram.offscreen_img)
    .on('load',function(e){
     histogram.img.src=histogram.offscreen_img.src;
     histogram.onload.call(histogram,e);
    })
    .on('error',function(e){
      histogram.img.src=histogram.img_loadError;
      histogram.onload.call(histogram,e);
    });

    histogram.update(histogram.settings);
  },

  update: function histogram_update(settings) {
    settings['_']=timeStamp();
    var query=toQueryString($.extend({},this.settings,settings));
    this.offscreen_img.src='http://'+this.camera.ip+this.url+'?'+query;
  },

  showStatus: function histogram_showStatus(container) {
    var histogram=this;
    var camera=histogram.camera;
    var div=$('.histogram',container);
    if (!div.length) {
      div=$([
          '<div class="histogram">',
          '  <img src="'+camera.histogram.img.src+'">',
          '</div>'
      ].join('\n'));
      $(container).append(div);
    } else {
      $('img',div).attr('src',camera.histogram.img.src);
    }
  }
});
