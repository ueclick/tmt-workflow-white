/**
 * Created by white on 16/3/10.
 */

var GAMangaer = {

};

GAMangaer.sendEventClick = function(_space,_tag){
    console.log("SendEventClick "+_space+","+_tag);
    ga('send','event',_space,_tag);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event' : _tag+"_mob"
    });
}

GAMangaer.sendPageView = function(_tag){
    console.log("SendPageView "+_tag);
    ga('send','pageview',_tag);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event' : _tag+"_mob"
    });
}
