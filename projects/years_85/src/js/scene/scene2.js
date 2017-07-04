var Scene2 = (function () {

  // 构造函数
  var sc2 = {};

  var sc;
  var page1Arr,page2Arr,page3Arr,page1,page2,page3;


  sc2.pageId = 0;

  function afterLoad(anchorLink,index){
    console.log("afterLoad:"+index);

  }

  function onLeave(index, nextIndex, direction){
    console.log("onLeave:"+index+","+nextIndex+","+direction);
  }

  function page1Show(){

  }

  function page1Stop(){

  }

  function page2Show(){

  }

  function page2Stop(){

  }

  function page3Show(){

  }

  function page3Stop(){

  }

  function resetIt(){

  }

  //public
  sc2.init = function(){
    sc = $("#sc2");
    page1Arr = [$("#sc2_1bg"), $("#sc2_drop1"), $("#sc2_drop2"), $("#sc2_drop3"), $("#sc2_tip1"), $("#sc2_tip2"), $("#sc2_tip3"), $("#sc2_tip4"), $("#sc2_tip5"),$("#sc2_t1")];
    page2Arr = [$("#sc2_2bg"), $("#sc2_drop4"), $("#sc2_drop5"), $("#sc2_tip4"), $("#sc2_tip5"), $("#sc2_t2")];
    page1 = $("#sc2_1");
    page2 = $("#sc2_2");
    page3 = $("#sc2_3");

    // console.log(sliderNav.width())
    setTimeout(function(){
      var sliderNav = $("#sc2 div .fp-slidesNav");
      var navw = sliderNav.width();
      // sliderNav.css("left","50%")
      // sliderNav.css("margin-left",navw/2+"px")
      console.log(sliderNav.width(),"!");
      sc.hide();
    },100);
    // console.log("sc2 init");
  }

  sc2.showIt = function(){
    resetIt();

    console.log("showIt",sc);
    sc.show();
  }

  sc2.hideIt = function(){
    sc.hide();
  }

  sc2.showPage = function(c){
    console.log("show: ",c);
  }

  // start 0
  sc2.stopPage = function(c){
    console.log("stop: ",c);
  }

  sc2.resetPage = function(c){
    console.log("reset: ",c);
  }

  return sc2;
})();
