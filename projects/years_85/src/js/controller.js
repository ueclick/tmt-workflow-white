var Ctrl = (function () {
  //private
  var g_swing,g_slide,guide;
  var tween;


  // 构造函数
  function ctrl() {
    // this.protoProp = 1;
    // console.log(staticProp);
  }

  //private
  function showGuide(){
    JT.kill(guide);

    JT.set(guide,{opacity:0});
    // JT.set(g_slide,{opacity:1});
    // JT.set(g_swing,{opacity:0});
    tween = JT.to(guide,0.5,{opacity:1,onEnd:function(){
      JT.to(guide,0.5,{delay:2,opacity:0,onEnd:function(){
        guide.hide();
      }})
    }});
  }

  //public
  ctrl.init = function(){
    // g_swing = $("");
    guide = $("#guide");
    g_slide = $("#g_slide");
    g_swing = $("#g_swing");

    if(!g_slide)console.log("no g_slide");
    if(!g_swing)console.log("no g_swing");
  }

  ctrl.showGuideSlide = function(){
    if(g_slide){
      console.log("showGuideSlide");
      guide.show();
      g_slide.show();
      g_swing.hide();

      showGuide();
    }
  }

  ctrl.showGuideSwing = function(){
    if(g_swing){
      console.log("showGuideSwing");
      guide.show();
      g_slide.hide();
      g_swing.show();

      showGuide();
    }
  }

  ctrl.hideGuide = function(){
    JT.kill(guide);
    JT.to(guide,0.1,{opacity:0,onEnd:function(){
      guide.hide();
    }})
  }

  // console.log(PageView);

  return ctrl;
})();
