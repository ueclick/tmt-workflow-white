var LoadManager_LH=function(t,i){this.isComplete=!1,this.texData=t,this.resultData={},this.loader=null,this.onLoadProgress=null,this.onLoadComplete=null,this.onFileComplete=null,this.init(i)};LoadManager_LH.prototype={init:function(t){this.isComplete=!1,this.loader=new createjs.LoadQueue((!0),t||""),this.loader.on("fileload",this.handleFileLoad,this),this.loader.on("complete",this.handleComplete,this),this.loader.on("progress",this.handleProgress,this),this.loader.on("error",this.handleError,this),this.initData()},initData:function(){var t=this.texData;if(t)for(var i in t){var a=t[i];"object"==typeof a&&this.analyzeData(i,a)}},load:function(){this.loader.load()},analyzeData:function(t,i){var a=i.type;"ani"==a?(this.analyzeAni(t,i),this.resultData[t]=[]):(this.addSrc(t,i.src),this.resultData[t]=null)},analyzeAni:function(t,i){var a=i.start,e=i.end,o=0,n=a,s=e,l=1,r=Math.max(e,a).toString().length;if(a&&e)for(a>e&&(n=a,s=e,l=-1),this.loadAniImg(t,n,o,i.prefix,i.suffix,r),console.log(n,s,l);;)if(n+=l,o++,this.loadAniImg(t,n,o,i.prefix,i.suffix,r),n==s)return},loadAniImg:function(t,i,a,e,o,n){var s="",l=i.toString().length;if(l<n)for(var r=0;r<l;r++)s+="0";var h=e+s+i+o,d="ani#"+t+"#"+a;this.addSrc(d,h)},addSrc:function(t,i){console.log(t,i),this.loader.loadFile({id:t,src:i})},analyzeSrc:function(t){if(t){var i=t.id,a=i.split("#");if(a.length>=3){if("ani"==a[0]){var e=parseInt(a[2]),o=a[1];this.resultData[o][e]=t.result}}else this.resultData[i]=t.result}},handleFileLoad:function(t){var i=t.item;i.result=t.result,this.analyzeSrc(i),this.onFileComplete&&this.onFileComplete(t)},handleProgress:function(t){this.onLoadProgress&&this.onLoadProgress(t.progress)},handleComplete:function(t){console.log(this.resultData),this.isComplete=!0,this.onLoadComplete&&this.onLoadComplete(this.resultData)},handleError:function(t,i){console.log("Error_LoadManager_LH----------------------"),console.log(t)}};