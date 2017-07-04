var Scene1 = (function () {

  // 构造函数
  var sc1 = {};

  var sc;
  var page1Arr,page2Arr,page3Arr,page1,page2,page3;
  // page1Arr = [$("#sc1_1bg"), $("#sc1_drop1"), $("#sc1_drop2"), $("#sc1_drop3"), $("#sc1_tip1"), $("#sc1_tip2"), $("#sc1_tip3"), $("#sc1_tip4"), $("#sc1_tip5"),$("#sc1_t1")];
  // page2Arr = [$("#sc1_2bg"), $("#sc1_drop4"), $("#sc1_drop5"), $("#sc1_tip4"), $("#sc1_tip5"), $("#sc1_t2")];

  sc1.pageId = 0;

  function afterLoad(anchorLink,index){
    console.log("afterLoad:"+index);

  }

  function onLeave(index, nextIndex, direction){
    console.log("onLeave:"+index+","+nextIndex+","+direction);
  }

  function page1Show(){
    console.log("page1Show");
    TweenMax.fromTo(page1Arr[4],1,{scaleX:0.3,scaleY:0.3,alpha:1,ease:JT.Quad.Out},{scaleX:1.2,scaleY:1.2,alpha:0,repeat:-1,repeatDelay:1});
    TweenMax.fromTo(page1Arr[5],1,{scaleX:0.3,scaleY:0.3,alpha:1,ease:JT.Quad.Out},{scaleX:1.2,scaleY:1.2,alpha:0,repeat:-1,repeatDelay:1});
    TweenMax.fromTo(page1Arr[6],1,{scaleX:0.3,scaleY:0.3,alpha:1,ease:JT.Quad.Out},{scaleX:1.2,scaleY:1.2,alpha:0,repeat:-1,repeatDelay:1});

    TweenMax.to(page1Arr[1],1,{scaleX:1.1,scaleY:1.1,yoyo:true,repeat:-1,ease:JT.Quad.InOut});
    TweenMax.to(page1Arr[2],1,{scaleX:1.1,scaleY:1.1,yoyo:true,repeat:-1,ease:JT.Quad.InOut});
    TweenMax.to(page1Arr[3],1,{scaleX:1.1,scaleY:1.1,yoyo:true,repeat:-1,ease:JT.Quad.InOut});

    page1Arr[1].on('click', function(event) {
      event.preventDefault();
      showBar(1);
    });
    page1Arr[2].on('click', function(event) {
      event.preventDefault();
      showBar(2);
    });
    page1Arr[3].on('click', function(event) {
      event.preventDefault();
      showBar(3);
    });
  }

  function page1Stop(){
    console.log("page1Stop");
    TweenMax.killTweensOf(page1Arr[1]);
    TweenMax.killTweensOf(page1Arr[2]);
    TweenMax.killTweensOf(page1Arr[3]);
    TweenMax.killTweensOf(page1Arr[4]);
    TweenMax.killTweensOf(page1Arr[5]);
    TweenMax.killTweensOf(page1Arr[6]);

    page1Arr[1].off('click');
    page1Arr[2].off('click');
    page1Arr[3].off('click');
  }

  function page1Reset(){
    console.log("page1Reset");
    TweenMax.set(page1Arr[1],{scaleX:1,scaleY:1});
    TweenMax.set(page1Arr[2],{scaleX:1,scaleY:1});
    TweenMax.set(page1Arr[3],{scaleX:1,scaleY:1});
    TweenMax.set(page1Arr[4],{scaleX:0.3,scaleY:0.3});
    TweenMax.set(page1Arr[5],{scaleX:0.3,scaleY:0.3});
    TweenMax.set(page1Arr[6],{scaleX:0.3,scaleY:0.3});
  }

  function page2Show(){
    console.log("page2Show");
    TweenMax.fromTo(page2Arr[3],1,{scaleX:0.3,scaleY:0.3,alpha:1,ease:JT.Quad.Out},{scaleX:1.2,scaleY:1.2,alpha:0,repeat:-1,repeatDelay:1});
    TweenMax.fromTo(page2Arr[4],1,{scaleX:0.3,scaleY:0.3,alpha:1,ease:JT.Quad.Out},{scaleX:1.2,scaleY:1.2,alpha:0,repeat:-1,repeatDelay:1});

    TweenMax.to(page2Arr[1],1,{scaleX:1.1,scaleY:1.1,yoyo:true,repeat:-1,ease:JT.Quad.InOut});
    TweenMax.to(page2Arr[2],1,{scaleX:1.1,scaleY:1.1,yoyo:true,repeat:-1,ease:JT.Quad.InOut});
  }

  function page2Stop(){
    console.log("page2Stop");
    TweenMax.killTweensOf(page2Arr[1]);
    TweenMax.killTweensOf(page2Arr[2]);
    TweenMax.killTweensOf(page2Arr[3]);
    TweenMax.killTweensOf(page2Arr[4]);
  }

  function page2Reset(){
    console.log("page2Reset");
    TweenMax.set(page2Arr[1],{scaleX:1,scaleY:1});
    TweenMax.set(page2Arr[2],{scaleX:1,scaleY:1});
    TweenMax.set(page2Arr[3],{scaleX:0.3,scaleY:0.3});
    TweenMax.set(page2Arr[4],{scaleX:0.3,scaleY:0.3});
  }

  function page3Show(){
    console.log("page3Show");

  }

  function page3Stop(){
    console.log("page3Stop");

  }

  function page3Reset(){
    console.log("page3Reset");

  }

  function resetIt(){

  }

  function showBar(c){
    alert("showBar: "+c);
  }
  //
  // function initBar(){
  //   // var sc2Arr = [$("#sc2_1"), $("#sc2_drop"), $("#sc2_tip1"), $("#sc2_tip2"), $("#sc2_tip3"), $("#sc2_tip4"), $("#sc2_tip5")];
  //   var sc2_drop = sc2Arr[1];
  //   var sc2_tip1 = sc2Arr[2];
  //   var sc2_tip2 = sc2Arr[3];
  //   var sc2_tip3 = sc2Arr[4];
  //   var sc2_tip4 = sc2Arr[5];
  //   var sc2_tip5 = sc2Arr[6];
  //   var sc2_t1 = sc2Arr[7];
  //
  //   var dw = 1379*sc - window.innerWidth;
  //   console.log(dw);
  //
  //   // TweenMax.to(sc2_1,0,{x:0,force3D:true});
  //   TweenMax.to(sc2_t1,0,{x:0,y:0});
  //   TweenMax.to(sc2_tip2,0,{alpha:0});
  //   TweenMax.to(sc2_tip3,0,{alpha:0});
  //   TweenMax.to(sc2_tip4,0,{alpha:0});
  //   TweenMax.to(sc2_tip5,0,{alpha:0});
  //   TweenMax.to(sc2_drop,0,{x:0,y:0});
  //
  //   TweenMax.to(sc2_drop,1,{scaleX:1.2,scaleY:1.2,yoyo:true,repeat:-1,ease:JT.Quad.Out});
  //
  //   TweenMax.to(sc2_tip1,0.5,{delay:3,alpha:0});
  //   TweenMax.to(sc2_drop,2,{delay:3,x:-33.5,y:99,ease:Quad.easeInOut,onComplete:function(){
  //     TweenMax.to(sc2_tip2,0.5,{alpha:1});
  //
  //     TweenMax.to(sc2_tip2,0.5,{delay:3,alpha:0});
  //     TweenMax.to(sc2_drop,2,{delay:3,x:-66,y:659,ease:Quad.easeInOut,onComplete:function(){
  //       TweenMax.to(sc2_tip3,0.5,{alpha:1});
  //
  //       TweenMax.to(sc2_tip3,0.5,{delay:3,alpha:0});
  //
  //       TweenMax.to(sc2_t1,2,{delay:3,x:299,y:-69,ease:Quad.easeInOut});
  //       TweenMax.to(sc2_drop,2,{delay:3,x:573,y:599,ease:Quad.easeInOut});
  //       TweenMax.to(sc2_1,2,{delay:3,x:-dw+1,ease:Quad.easeInOut,onComplete:function(){
  //         TweenMax.to(sc2_tip4,0.5,{alpha:1});
  //         TweenMax.to(sc2_tip5,0.5,{delay:2,alpha:1});
  //       }});
  //     }});
  //   }});
  // }

  //public
  sc1.init = function(){
    sc = $("#sc1");
    page1Arr = [$("#sc1_1bg"), $("#sc1_drop1"), $("#sc1_drop2"), $("#sc1_drop3"), $("#sc1_dot1"),$("#sc1_dot2"),$("#sc1_dot3"), $("#sc1_tip1"), $("#sc1_tip2"), $("#sc1_tip3"), $("#sc1_tip4"), $("#sc1_tip5"),$("#sc1_t1")];
    page2Arr = [$("#sc1_2bg"), $("#sc1_drop4"), $("#sc1_drop5"), $("#sc1_dot4"),$("#sc1_dot5"), $("#sc1_tip4"), $("#sc1_tip5"), $("#sc1_t2")];
    page1 = $("#sc1_1");
    page2 = $("#sc1_2");
    page3 = $("#sc1_3");

    // $.fn.fullpage.moveSlideRight();
    // $(".fp-slidesNav").css("left","0%")

    // console.log(sliderNav.width())
    setTimeout(function(){
      var sliderNav = $("#sc1 div .fp-slidesNav");
      var navw = sliderNav.width();
      // sliderNav.css("left","50%")
      // sliderNav.css("margin-left",navw/2+"px")
      // console.log(sliderNav.width(),"!");
      sc.hide();
    },100);
    // console.log("sc1 init");
  }

  sc1.showIt = function(){
    resetIt();
    console.log("showIt",sc);

    // $.fn.fullpage.moveTo(0, 0);
    sc.show();
  }

  sc1.hideIt = function(){
    sc.hide();
  }

  sc1.showPage = function(c){
    console.log("show: ",c);
    var id = c+1;

    if(id==1){
      page1Show();
    }else if(id==2){
      page2Show();
    }else if(id==3){
      page3Show();
    }
  }

  // start 0
  sc1.stopPage = function(c){
    console.log("stop: ",c);
    var id = c+1;

    if(id==1){
      page1Stop();
    }else if(id==2){
      page2Stop();
    }else if(id==3){
      page3Stop();
    }
  }

  sc1.resetPage = function(c){
    console.log("reset: ",c);
    var id = c+1;

    if(id==1){
      page1Reset();
    }else if(id==2){
      page2Reset();
    }else if(id==3){
      page3Reset();
    }
  }

  return sc1;
})();
