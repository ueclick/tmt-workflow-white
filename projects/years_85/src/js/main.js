
function initMain(){
  var fps = 30;
  var now;
  var then = Date.now();
  var interval = 1000/fps;
  var delta;

  var stageWidth = 750;
	var stageHeight = 1207;
	var ratio = window.innerWidth/stageWidth;

  var page = -1;
  var flipx = 0;
  var g =0;
  var isright = 0;
  var shockPos = {x: 0,y: 0};
  var isflip = false;
  var isScene =false;

  var isDown = false;
  var isPan = false;
  var panx = 0;

  var motionDeg = 0;
  var motionX = 200;

  var loading = $('#loading p');

  var stage,scene,camera;

  var $enter_page = $("#enter_page");
  var $main = $("#main");
  var $video = $("#video_2_1");
  var $videowrap = $("#div_video");
  var $menu = $("#menu");
  var $top_wrap = $("#top_wrap");
  var $cont = $("#cont");
  var $backBtn = $("#btn_back");
  var $pageCont = $(".cont_sc");

  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var isEnterPage = true;

  var sc = window.innerWidth/750;
  var isgyro = true;

  var sc_t1,sc_t2,sc_t3,sc_t4,sc_cloud1,sc_cloud2;
  var ani_cloud1,ani_cloud2;
  var beforetime=0;
  var currentSc;
  // alert(window.innerWidth+","+window.innerHeight);

  var scAni;
  var slider;
  var scId;    //当前场景id
  var sc1,sc2,sc3;
  var pageId,tempPageId;

  // console.log(C3D);
  // console.log(isAndroid+"!");
  // if(isAndroid)$("#enter_page").hide();

  initLoading();

  function initLoading(){
      if(texture_LH){
          loadManager = new LoadManager_LH(texture_LH,"../img/");
          loadManager.onLoadProgress = loadProgress;
          loadManager.onLoadComplete = loadComplete;
          loadManager.load();
      }

      isAnimate = true;
  }

  function loadProgress(per){
      // setLoading(parseInt(per*100));
      $('#loading span').html(parseInt(per*100) +'%');
      console.log(per);
  }

  function setLoading(per){

  }

  function hideLoading(){
      $('#loading').remove();
  }

  function loadComplete(event){
      hideLoading();
      init();
  }

  function initScale(){
    $(".sc").css("transform-origin","0 0");
    $(".sc").css("transform","scale("+sc+")");
  }

  function init(){
      initScale();
      initScene();
      // initVideo();
      initBars();
      // initCanvasVideo();
      $main.show();

      // skip video
      $enter_page.hide();
      $video.hide();
      startScene();

      console.log($video);
      // JT.to( $video, 1, {opacity:0});
      //alert('是否是Android：'+isAndroid);
      //alert('是否是iOS：'+isiOS);
  }

  function initVideo(){
    $enter_page.on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      $video[0].play();
    });

    $video.on("play", function() {
      // $("#video_2_1").hide();
      $enter_page.hide();
      console.log("play");
    });

    $video.on("timeupdate", function() {
      // $("#video_2_1").hide();
      // if(this.currentTime>=15)showScene();
      // if(this.currentTime-beforetime>1){
      //   alert(">0");
      //   this.currentTime = 0;
      // }else if(this.ended){
      //   // var cancelFullScreen = this.exitFullscreen || this.mozCancelFullScreen || this.webkitExitFullscreen;
      //   this.webkitExitFullscreen();
      //   showScene();
      // }
      //
      // beforetime=this.currentTime;
      // console.log(this.currentTime);
      if(this.currentTime>0 && isEnterPage){
        $enter_page.hide();
        isEnterPage =false;
      }
    });

    $video.on("ended", function() {
      // alert("ended");
      // var cancelFullScreen = this.exitFullscreen || this.mozCancelFullScreen || this.webkitExitFullscreen;
      $enter_page.hide();
      this.webkitExitFullscreen();
      showScene();
    });

    if(isiOS)$enter_page.hide();
    // $video[0].currentTime = 1;
    $video[0].play();
    // $video.show();
    // $enter_page.show();
    // setTimeout(function(){$video[0].play();alert("")},1000);
  }

  function showScene(){
    JT.to($video, 0.5, {opacity:0,onEnd:startScene});
  }

  function startScene(){
    $video.hide();
    $videowrap.hide();
    JT.to($menu, 0.5, {opacity:1});
    JT.to($top_wrap, 0.5, {opacity:1});

    JT.to(sc_t2, 1, {rotationX:10,rotationY:40,rotationZ:-3,alpha:1,
        onUpdate:function(){
              this.target.updateT().updateV();
        },ease: JT.Quad.Out
    });
    JT.to(sc_t3, 1, {delay:0.3,rotationX:15,rotationY:-34,rotationZ:11,alpha:1,
        onUpdate:function(){
              this.target.updateT().updateV();
        },ease: JT.Quad.Out
    });
    cloudMove();
    initCtrl();

    isScene = true;
    isflip = true;
  }

  function initScene(){

      stage = new C3D.Stage();
      stage.size(window.innerWidth, window.innerHeight).material({
          color : "#ff"
      }).update();
      document.getElementById('main').appendChild(stage.el);

      scene = new C3D.Sprite();
      scene.position(0, 0, 0).update();
      stage.addChild(scene);
      camera = stage.camera;
      // camera.position(0, 0, 750).update();

      var bgCont = new C3D.Sprite();
      bgCont.position(0, 0, -500).update();
      scene.addChild(bgCont);

      var imgUrl = '../img/';
      var bg4 = new C3D.Plane();
      bg4.size(1207,252).position(-3,-166,120).rotation(0,0,0).scale(1.1).material({
      image: imgUrl + 'bg4.jpg'
      }).origin('50%','50%','0%').update();
      bgCont.addChild(bg4);

      var bg3x2 = new C3D.Plane();
      bg3x2.size(460,69).position(16,-61,150).rotation(0,0,0).scale(1).material({
      image: imgUrl + 'bg3x2.png'
      }).origin('50%','50%','0%').update();
      bgCont.addChild(bg3x2);

      sc_cloud2 = new C3D.Plane();
      sc_cloud2.size(442,135).position(10,-7,175).rotation(0,0,0).scale(0.5).material({
      image: imgUrl + 'cloud1.png'
      }).origin('50%','50%','0%').update();
      bgCont.addChild(sc_cloud2);
      //
      var bg2x2 = new C3D.Plane();
      bg2x2.size(834,192).position(-79,-20,180).rotation(0,0,0).scale(0.9).material({
      image: imgUrl + 'bg2x2.png'
      }).origin('50%','50%','0%').update();
      bgCont.addChild(bg2x2);

      var bg1x2 = new C3D.Plane();
      bg1x2.size(1807,550).position(-3,-1,210).rotation(0,0,0).scale(0.82).material({
      image: imgUrl + 'bg1x2.png'
      }).origin('50%','50%','0%').update();
      bgCont.addChild(bg1x2);

      bg1x2.on("touchstart", function() {
          console.log("click!");
      });

      sc_cloud1 = new C3D.Plane();
      sc_cloud1.size(442,135).position(190,180,230).rotation(0,0,0).scale(1).material({
      image: imgUrl + 'cloud1.png'
      }).origin('50%','50%','0%').update();
      bgCont.addChild(sc_cloud1);

      // var cloud1b = new C3D.Plane();
      // cloud1b.size(442,135).position(190,80,230).rotation(0,-180,0).scale(0.8).material({
      // image: imgUrl + 'cloud1.png'
      // }).origin('50%','50%','0%').update();
      // bgCont.addChild(cloud1b);

      sc_t1  = new C3D.Plane();
      sc_t1.size(532,234).position(-230, 90, 280).rotation(30,40,-14).scale(0.2).material({
      image: imgUrl + 't1.png'
      }).origin('50%','50%','50%').update();
      bgCont.addChild(sc_t1);
      //

      var line1 = new C3D.Plane();
      line1.size(54,46).position(480,0,0).rotation(0,0,190).scale(2).material({
      image: imgUrl + 'line1.png'
      }).origin('50%','50%','0%').update();
      sc_t1.addChild(line1);

      sc_t2 = new C3D.Plane();
      sc_t2.size(382,234).position(-140, 20, 270).rotation(0,-50,0).scale(0.16).material({
      image: imgUrl + 't2.png'
      }).origin('50%','50%','50%');
      sc_t2.alpha =0;
      sc_t2.update();
      bgCont.addChild(sc_t2);
      //
      var line2 = new C3D.Plane();
      line2.size(54,46).position(480,10,0).rotation(0,0,190).scale(2).material({
      image: imgUrl + 'line1.png'
      }).origin('50%','50%','0%').update();
      sc_t2.addChild(line2);

      sc_t3 = new C3D.Plane();
      sc_t3.size(477,235).position(108,-80,260).rotation(0,50,0).scale(0.3).material({
      image: imgUrl + 't3.png'
      }).origin('50%','50%','50%');
      sc_t3.alpha =0;
      sc_t3.update();
      bgCont.addChild(sc_t3);

      var line3 = new C3D.Plane();
      line3.size(54,46).position(-70,80,0).rotation(0,0,0).scale(2).material({
      image: imgUrl + 'line1.png'
      }).origin('50%','50%','0%').update();
      sc_t3.addChild(line3);
  }

  function cloudMove(){
    if(!ani_cloud1){
      ani_cloud2 = JT.fromTo(sc_cloud2, 60, {x:240}, {x:-240,repeat: -1,yoyo: false,
          onUpdate:function(){
                this.target.updateT();
          }
      });

      ani_cloud1 = JT.fromTo(sc_cloud1, 40, {x:750}, {x:-750,repeat: -1,yoyo: false,
          onUpdate:function(){
                this.target.updateT();
          }
      });
    }
  }

  function cloudStop(){
    if(ani_cloud1){
      ani_cloud1.pause();
      ani_cloud2.pause();

    }
  }

  function cloudMove(){
    if(ani_cloud1){
      ani_cloud1.play();
      ani_cloud2.play();
    }
  }

  function initCtrl(){
    // stage.on("mousedown", mouseDown);
    // stage.on("mouseup", mouseup);
    console.log("initCtrl");

    // console.log(CSS3DSlider.cont,"!");
    // slider.init();

    Ctrl.init();
    initPanEvent();

    sc_t1.on("touchstart", function() {
      showBar(1);
    });
    sc_t2.on("touchstart", function() {
      showBar(2);
    });
    sc_t3.on("touchstart", function() {
      showBar(1);
    });
    // sc_t4.on("touchstart", function() {
    //   showBar(1);
    // });
      // btn.on("touchstart", function() {

  }

  function initBars(){
    $pageCont.fullpage({
        'verticalCentered': false,
        'css3': true,
        'navigation': false,
        'controlArrows': false,
        // 'navigationPosition': 'right',

        'slidesNavigation': true,
        'slidesNavPosition': 'bottom',
        'loopHorizontal': false,
        'controlArrows': false,

        'afterLoad': function(anchorLink, index){
          console.log(anchorLink,index);
        },

        'onLeave': function(index, nextIndex, direction){
          console.log(index, nextIndex, direction);
        },

        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){
          // console.log(index, slideAnchor, slideIndex);
          slideLoad(slideIndex);
        },
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){
          // console.log(index, slideIndex, direction, nextSlideIndex);
          slideLeave(slideIndex,nextSlideIndex);
        }
    });

    // $.fn.fullpage.setAllowScrolling(false);
    $.fn.fullpage.setKeyboardScrolling(false);

    Scene1.init();
    Scene2.init();

    $backBtn.on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      hideBar();
    });

    setTimeout(function(){
        $(".slide").css("overflow","hidden");
        $cont.hide();
    },200);
  }

  function slideLoad(idx){
    console.log("load",idx);
    if(currentSc){
      currentSc.showPage(idx);
    }
  }

  function slideLeave(idx,nextIdx){
    console.log("leave: ",idx,nextIdx);

    if(currentSc){
      currentSc.stopPage(idx);
      currentSc.resetPage(nextIdx);
    }
  }

  function showBar(c){
    console.log("showBar",c);
    isflip =false;
    isScene =false;

    Ctrl.showGuideSlide();
    $.fn.fullpage.moveTo(c,0);
    // show cont
    $cont.show();
    JT.set($cont,{opacity:0});
    JT.to( $cont, 0.5, {opacity:1});

    var sc = this["Scene"+c];
    sc.showIt();

    pageId = 1;
    scId = c;
    currentSc = sc;
  }

  function hideBar(){
    if(currentSc){
      console.log("hideBar");

      JT.to($cont, 0.4, {opacity:0,onEnd:function(){
        currentSc.hideIt();
        $cont.hide();
        currentSc = null;

        isflip =true;
        isScene =true;
      }});
    }
  }

  function initPanEvent(){
    var myElement = document.getElementById('main');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);
    // let the pan gesture support all directions.
    // this will block the vertical scrolling on a touch-device while on the element
    mc.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    // listen to events...
    mc.on("panstart panmove panend pancancel tap press", function(ev) {
        ev.preventDefault();
        // console.log(ev.type +" gesture detected.");
        var type = ev.type;
        if(type == "panstart"){
          panstart(ev);
        }else if(type == "panmove"){
          panmove(ev);
        }else if(type == "panend" || "pancancel"){
          panend(ev);
        }
    });
  }

  function panstart(e){
    isPan = true;
    console.log(e.center.x);
    panx = e.center.x;
  }

  function panmove(e){
    var cx  =  e.center.x;
    var g = (cx - panx)/(stageWidth/2)*0.2;

    flipx = Math.max(Math.min(flipx+g,1),-1);
  }

  function panend(e){
    isPan = false;
  }

  function mouseDown(e){
    isPan = true;
    console.log("mousedown",e);
  }

  function mouseup(e){
    isDown = false;
    console.log("mouseup",e);
  }

  //响应屏幕调整尺寸
  function resize() {
      if(stage){
          stage.size(window.innerWidth, window.innerHeight).update();
      }
  };

  window.onresize = function() {
      resize();
  };

  if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation',onDeviceorientation,true);
  } else {
      console.log('This device does not support deviceorientation');
  }

//   window.addEventListener("devicemotion", function(event) {
//     eventaccelerationIncludingGravity = event.accelerationIncludingGravity;
//     document.querySelector('#devicemotion').innerHTML = "accelerationIncludingGravity:<br>"+
//     eventaccelerationIncludingGravity.x+"<br>"+
//     eventaccelerationIncludingGravity.y+"<br>"+
//     eventaccelerationIncludingGravity.z
// }, false);

  function onDeviceorientation(e) {
      e.preventDefault();

      if(!isflip)return;

      // document.querySelector('#devicemotion').innerHTML = "GAMMA:<br>"+
      // e.gamma +"beta:<br>"+e.beta +"alpha:<br>"+e.alpha;

      if(Math.abs(g- e.gamma)<2 && (g- e.gamma)/isright <0){
          return;
      }else{
          isright = e.gamma - g>0?1:-1;
      };

      g = Math.round(e.gamma);
      //document.getElementById( 'output').innerHTML ="Beta: "+b+"<br>Gamma: "+g+"<br>Alpha: " +a;

      g = g > 90 ? g - 180:g;
      g = Math.min(30, Math.max(-30, Math.floor(g)));
      flipx = parseFloat(g/30);

      // if(window.orientation>0){
      //      document.getElementById('orientLayer').style.display = 'block';
      // }else{
      //      document.getElementById('orientLayer').style.display = 'none';
      // }
  }


  function updateCamera() {
      // console.log(0.1*(flipx * motionX -(stage.camera.x+shockPos.x)));
      stage.camera.x += 0.05*(-flipx * motionX -(stage.camera.x+shockPos.x));
      stage.camera.y = shockPos.y;
      stage.camera.rotationY += 0.5*(flipx* motionDeg - stage.camera.rotationY);
      stage.camera.updateT();
  }

  //刷新场景
  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
  function(callback) {
      setTimeout(callback, 1000 / fps);
  };

  function go() {
      if(isScene)updateCamera();

      requestAnimationFrame(go);
  }

  requestAnimationFrame(go);


  // DeviceOrientation ///////////
  var supportOrientation=(typeof window.orientation == "number" && typeof window.onorientationchange == "object");

  var updateOrientation=function(){
        if(supportOrientation){
            updateOrientation=function(){
                var orientation=window.orientation;
                switch(orientation){
                    case 90:
                    case -90:
                        orientation="block";  //landscape
                        break;
                    default:
                        orientation="none";  //portrait
                }
                document.getElementById("orientLayer").style.display = orientation;
            };
        }else{
            updateOrientation=function(){
                var orientation=(window.innerWidth > window.innerHeight)? "block":"none";
                document.getElementById("orientLayer").style.display = orientation;
            };
        }
        updateOrientation();
  };

  updateOrientation();
  if(supportOrientation){
      window.addEventListener("orientationchange",updateOrientation,false);
  }else{
      window.setInterval(updateOrientation,5000);
  }
}
