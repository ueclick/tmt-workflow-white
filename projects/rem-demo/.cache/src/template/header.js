/*TMODJS:{"version":1,"md5":"21fc15a92f82af13812fdd413d19c87b"}*/
template('/WORKS/LABS/rem-demo/src/template/header',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,message=$data.message,$each=$utils.$each,fruits=$data.fruits,fruit=$data.fruit,$index=$data.$index,$out='';$out+=' <p>';
$out+=$escape(message);
$out+='</p> <ul> ';
$each(fruits,function(fruit,$index){
$out+=' <li>';
$out+=$escape(fruit);
$out+='</li> ';
});
$out+=' </ul>';
return new String($out);
});