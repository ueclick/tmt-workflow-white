var CSS3DSlider = (function () {
  if(!C3D){
    console.log("no import C3D");
    return;
  }

  // private
  var staticProp = 2;
  var cont,sliderCont,navCont;
  var sliderArr = [];
  var navArr = [];
  var pageNum = 0;
  var pageId = 0;
  var autoplay = false;

  var Slider = {};
  Slider.autoplay = false;
  Slider.autodelay = 2;  // s
  Slider.nav = true;
  Slider.cont = null;
  Slider.sliderCont = null;
  Slider.navCont = null;

  function initNav() {
    clearNav();

    if(navCont){
      var btn;
      for(var i=0;i<pageNum;i++){
        btn = new C3D.Plane();
        btn.size(11,11).position(0,0,0).rotation(0,0,0).scale(1.1).material({
        image: '../img/bar.png'
        }).origin('50%','50%','0%').update();
        navCont.addChild(btn);
      }
    }
  }

  function clearNav() {
    var nav;
    for(var i=0;i<navArr.length;i++){
      nav = navArr[i];
      nav.remove();
    }
    navArr = [];
  }


  // 构造函数
  // function Slider() {
  //   this.protoProp = 1;
  // }

  // public


  Slider.init = function(){
    // console.log(this.protoProp);
    if(!this.cont){
      this.cont = new C3D.Sprite();
      this.cont.position(0, 0, 0).update();

      this.sliderCont = new C3D.Sprite();
      this.sliderCont.position(0, 0, 0).update();
      this.cont.addChild(this.sliderCont);

      this.navCont = new C3D.Sprite();
      this.navCont.position(0, 0, 0).update();
      this.cont.addChild(this.navCont);

    }

    return Slider;
  }

  Slider.initPages = function(pages){
    var page,cont;
    for(var i=0;i<pages.length;i++){
      page = pages[i];
      cont = page.cont;
      if(cont)this.sliderCont.addChild(cont);
      console.log(cont,i);
    }
    sliderArr = pages;
    pageNum = pages.length;

    initNav();
  }

  Slider.clearPages = function(){

  }

  // console.log(PageView);

  return Slider;
})();
