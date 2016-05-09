
function initMain(){
  var stageWidth = 750;
	var stageHeight = 1207;
	var ratio = window.innerWidth/stageWidth;
	SCREEN_WIDTH_LH = stageWidth;
	SCREEN_HEIGHT_LH = window.innerHeight / ratio;

	console.log(window.devicePixelRatio,SCREEN_WIDTH_LH,SCREEN_HEIGHT_LH);

	var princeSpine;
	var scarfSpine;
	var renderer;
	var stage = new PIXI.Container();
  var imgCont = new PIXI.Container();
	var amount = 100;
	var current;

	var currentStage = stage;

  var upload_btn = $("#upload_btn");
  var filebtn = $("#file");
  var outImg = $("#outImg img")[0];

  var downx,downy;
  var csp;

	/* window resize */
	window.addEventListener('resize', onWindowResize, false);

	renderer = new PIXI.autoDetectRenderer(stageWidth, SCREEN_HEIGHT_LH, {transparent: false});
	renderer.backgroundColor = 0xFFFFFF;
	document.getElementById("canvas").appendChild(renderer.view);

	renderer.view.style.transformOrigin = "0 0"; //scale from top left
	renderer.view.style.transform = "scale("+ ratio +")";

	renderer.view.style.WebkitTransformOrigin = "0 0";
	renderer.view.style.WebkitTransform = "scale("+ ratio +")";

  // outImg.style.transformOrigin = "0 0"; //scale from top left
  // outImg.style.transform = "scale("+ ratio +")";
  // // For Mozilla browser: e.g. Firefox
  // outImg.style.WebkitTransformOrigin = "0 0"; //scale from top left
  // outImg.style.WebkitTransform = "scale("+ ratio +")";


	amount = (renderer instanceof PIXI.WebGLRenderer) ? 100 : 5;
	if(amount == 5)
	{
		isWebGL_LH = false;
		renderer.context.mozImageSmoothingEnabled = false
		renderer.context.webkitImageSmoothingEnabled = false;
		renderer.context.imageSmoothingEnabled = false;
	}else{
		isWebGL_LH = true;
	}

  init();
	initCtrl();
  addFileChange();

	function onWindowResize() {
		ratio = window.innerWidth/stageWidth;
		SCREEN_WIDTH_LH = stageWidth;
		SCREEN_HEIGHT_LH = window.innerHeight / ratio;

		renderer.resize(stageWidth, SCREEN_HEIGHT_LH);
		renderer.view.style.transformOrigin = "0 0"; //scale from top left
		renderer.view.style.transform = "scale("+ ratio +")";

		renderer.view.style.WebkitTransformOrigin = "0 0";
		renderer.view.style.WebkitTransform = "scale("+ ratio +")";
	}

  function init(){
    stage.addChild(imgCont);

    var iconCont = new PIXI.Container();
    iconCont.y = stageHeight -130;
    for(var i=0;i<4;i++){
      var icon = new PIXI.Sprite.fromImage("../img/tag_10_1.png");
      icon.interactive = true;
      icon.x = 190 *i+20;
      iconCont.addChild(icon);

      icon
         // set the mousedown and touchstart callback...
         .on('mousedown', onButtonDown)
         .on('touchstart', onButtonDown)

        //  .on('mousemove', onButtonMove)
        //  .on('touchmove', onButtonMove)

         // set the mouseup and touchend callback...
         .on('mouseup', onButtonUp)
         .on('touchend', onButtonUp)
         .on('mouseupoutside', onButtonUp)
         .on('touchendoutside', onButtonUp)
    }
    stage.addChild(iconCont);

    var masker = new PIXI.Sprite.fromImage("../img/border_1.png");
    masker.width = stageWidth;
    masker.height = stageHeight;
    stage.addChild(masker);
  }

	function initCtrl(){
    var mc = new Hammer.Manager(renderer.view);

    // create a pinch and rotate recognizer
    // these require 2 pointers
    var pinch = new Hammer.Pinch();
    var rotate = new Hammer.Rotate();
    var pan = new Hammer.Pan();

    // we want to detect both the same time
    pinch.recognizeWith(rotate);

    // add to the Manager
    mc.add([pinch, rotate, pan]);


    mc.on("pinch", function(ev) {
        // myElement.textContent += ev.type +" ";
        console.log("pinch",ev.scale);
        if(csp){
          // console.log(csp.sc);
          csp.scale.x =csp.scale.y = csp.sc * ev.scale;
        }
    });

    mc.on("rotate", function(ev) {
        // myElement.textContent += ev.type +" ";
        // csp.rotation = csp.rt + ev.;

        if(csp){
          if(!csp.ert){
            csp.ert = ev.rotation;
          }else{
            var rt = csp.rt - (csp.ert - ev.rotation)*Math.PI/180;
            csp.rotation = rt;
          }
          console.log("rotate",ev);
        }
    });

    mc.on("pan", function(ev) {
        // myElement.textContent += ev.type +" ";
        // csp.rotation = csp.rt + ev.;

        if(csp){
          if(!csp.pt){
            csp.pt = ev.center;
          }else{
            csp.x = csp.dx + (ev.deltaX)/ratio;
            csp.y = csp.dy + (ev.deltaY)/ratio;
          }
          console.log("pan",ratio);
        }
    });

		// hammerCtrl_LH = new Hammer(renderer.view);
    //
		// hammerCtrl_LH.on("tap", function (ev) {
		// 	if(current)current.tap(ev);
		// });
    //
		// hammerCtrl_LH.on("panstart",function (ev){
		// 	if(current)current.panstart(ev);
		// });
    //
		// hammerCtrl_LH.on("panmove",function (ev){
		// 	if(current)current.panmove(ev);
    //
		// });
    //
		// hammerCtrl_LH.on("panend",function (ev){
		// 	if(current)current.panend(ev);
		// });
	}
	/* end */

	function Animate() {
		requestAnimationFrame(Animate);

		renderer.render(currentStage);
	}

	Animate();

  function addButton(){
    var btn = new PIXI.Sprite.fromImage("../img/btn_6.png");
    btn.interactive = true;
    btn.anchor.x = btn.anchor.y = 0.5;
    btn.x = stageWidth/2;
    btn.y = stageHeight-btn.height;
    stage.addChild(btn);

    btn.click = btn.tap =function(data){
			// click!
			console.log("TAP!!");
			//this.alpha = 0.5;
			//
      screenShot();
		}
  }

  function screenShot(){
    var dw = 0;
    var dh = 0;
    var renderTexture = new PIXI.RenderTexture(renderer, stageWidth -dw, stageHeight-dh);


    renderTexture.render(stage);

    var screenShot = renderTexture.getBase64();
    console.log(outImg);
    outImg.src = screenShot;
  }

  function addImage(src){
    upload_btn.hide();

    var sprite = new PIXI.Sprite.fromImage(src);
    sprite.anchor.x = sprite.anchor.y = 0.5;
    sprite.name = "bgImg";
    sprite.interactive = true;
    sprite.x = stageWidth/2;
    sprite.y = stageHeight/2;
    sprite
       // set the mousedown and touchstart callback...
       .on('mousedown', onButtonDown)
       .on('touchstart', onButtonDown)

      //  .on('mousemove', onButtonMove)
      //  .on('touchmove', onButtonMove)

       // set the mouseup and touchend callback...
       .on('mouseup', onButtonUp)
       .on('touchend', onButtonUp)
       .on('mouseupoutside', onButtonUp)
       .on('touchendoutside', onButtonUp)
    // renderer.context.interactive = true;
    //
    // console.log("aaa");
    // var hammer = new Hammer.Manager(renderer.view,{
    //   'recognizers': [
    // 		// RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
    // 		[Hammer.Rotate],
    // 		[Hammer.Pinch, { enable: false }, ['rotate']],
    // 		[Hammer.Swipe,{ direction: Hammer.DIRECTION_HORIZONTAL }],
    // 	],
    //   'pixiContext': sprite
    // });

    // hammer.on("pinch", function(ev) {
    // 	console.log(ev.scale);
    // });
    // console.log("bbb");

    console.log(sprite);
    imgCont.addChild(sprite);
  }

  function onButtonDown(event){
    var target = event.target;
    target.sc = target.scale.x;
    target.dx = target.x;
    target.dy = target.y;
    target.rt = target.rotation;

    csp = target;
    csp.pt = null;
    csp.ert = null;

    // console.log("onButtonDown:",event)
    // var touchNum = event.data.originalEvent.changedTouches.length;
    // console.log(touchNum)
    //
    // if(!target.isDown){
    //   if(touchNum==1){
    //     var newPosition = event.data.originalEvent.changedTouches[0];
    //     target.dx = newPosition.clientX;
    //     target.dy = newPosition.clientY;
    //     target.tx = event.target.x;
    //     target.ty = event.target.y;
    //   }else{
    //     var newPosition = event.data.originalEvent.changedTouches[0];
    //     target.dx = newPosition.clientX;
    //     target.dy = newPosition.clientY;
    //     target.tx = event.target.x;
    //     target.ty = event.target.y;
    //   }
    //
    //   target.isDown = true;
    // }
    // event.target.
  }

  function onButtonMove(event){

    var target = event.target;
    if(target.isDown){
      var touchNum = event.data.originalEvent.changedTouches.length;
      // console.log("onButtonMove:",event);
      // console.log(touchNum);
      if(touchNum==1 && !target.dis){
        var newPosition = event.data.originalEvent.changedTouches[0];
        console.log("move:",newPosition.clientX - target.dx);
        target.x = target.tx + (newPosition.clientX - target.dx);
        target.y = target.ty + (newPosition.clientY - target.dy);
      }else if(touchNum==2){
        var pt1 = event.data.originalEvent.changedTouches[0];
        var pt2 = event.data.originalEvent.changedTouches[1];
        var dis = distance(pt1.clientX,pt1.clientY,pt2.clientX,pt2.clientY);
        if(target.dis){
          var bl = (dis / target.dis -1);
          bl = bl>0?bl/2:bl;
          target.scale.x = target.scale.y = Math.max(bl + target.sc,0.3);
        }else{
          target.sc = target.scale.x;
          target.dis = dis;
        }

        // console.log(dis,target.dis,target.scale.x);
      }

    }
  }

  function onButtonUp(event){
    var target = event.target;

    csp.pt = null;
    csp.ert = null;
    csp = null;
    // console.log("onButtonUp:",event);
    // target.isDown = false;
    // target.dis = null;
    // target.tx = event.target.x;
    // target.ty = event.target.y;
  }

  function distance(p1x,p1y,p2x,p2y) {
    var xdiff = p1x - p2x;
    var ydiff = p1y - p2y;
    return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
  }

  function addFileChange(){
    filebtn.on('change', function(){
       lrz(this.files[0], {width: 1280,height:1080})
        .then(function (rst) {

          console.log(rst);

  //					ret.canvas;
  //						 window.appendChild(ret.canvas);
          // document.body.appendChild(rst.canvas);

          //  var img=new Image();
          //  img.onload=function(){alert("img is loaded")};
          //  img.onerror=function(){alert("error!")};
          //  img.src=rst.base64;
          //  document.body.appendChild(img);

           addImage(rst.base64);
          addButton();
  //						 $.ajax({
  //						url: 'upload.php',
  //						type: 'post',
  //						data: {img: rst.base64},
  //						dataType: 'json',
  //						timeout: 200000,
  //						success: function (response) {
  //							if (response.ecd == '0') {
  //								alert('成功');
  //								return true;
  //							} else {
  //								return alert(response.msg);
  //							}
  //						},
  //
  //						error: function (jqXHR, textStatus, errorThrown) {
  //
  //							if (textStatus == 'timeout') {
  //								a_info_alert('请求超时');
  //
  //								return false;
  //							}
  //
  //							alert(jqXHR.responseText);
  //						}
  //					});

        })
        .catch(function (err) {

        })
        .always(function () {

        });
    });
  }
}
