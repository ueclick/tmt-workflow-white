var Page = (function () {
  var staticProp = 2;

  function PageView() {
    this.protoProp = 1;
    console.log(staticProp);
  }

  PageView.prototype.test = function(){
    console.log(staticProp);
  }

  PageView.create = function(){
    console.log(staticProp);
  }
  
  // console.log(PageView);

  return PageView;
})();
