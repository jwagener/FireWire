var globalOffset = 0;
var currentImg;
var soundTrack;

function buildUrl(options){
  if(!options){
    options = {};
  }
  var offset = options['offset'] ? options['offset'] : 0;
  var limit  = options['limit']  ? options['limit']  : 200;
  var consumer_key = 'jwtest';
  
  var base = 'http://api.soundcloud.com/tracks.js';
  var params = 'consumer_key=' + consumer_key + '&filter=streamable&created_with_app_id=64&offset=' + offset + '&limit=' + limit;
  
  var url = base + '?' + params;
  return(url);
};

function filterArtwork(tracks){
  var filtered = [];
  
  $.each(tracks, function(){
    if(this.artwork_url){
      this.artwork_url = this.artwork_url.replace('large', 'crop');
      filtered.push(this);
    }
  });
  
  return filtered;
}

function loadTracks(options){
  var url = buildUrl(options);
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(tracks){
      tracks = filterArtwork(tracks);
      options['callback'](tracks);
    }
  })
}

function rotateScalePositionImg(img){
  $img = $(img);
  
  $img.width($img.width()*1.08);
  
  var orig_width  = $img.width();
  var orig_height = $img.height();
  
  if(orig_width > orig_height){
    $img.addClass('rot90');
    var marg = (orig_width - orig_height) / 2;
    $img.css('margin', marg + 'px ' + -marg + 'px');
  }
}

function loadTracksCallback(tracks){
  $.each(tracks, function(){
    $('<img src="'+ this.artwork_url +'" />')
      .load(function(){
        rotateScalePositionImg(this);
      })
    .appendTo("#viewer")
    .wrap("<div>")
    .parent("div")
      .data("track",this)
      .append("<p class='info'>hej</p>");
  });
  if(!currentImg) {
    currentImg = $("#viewer div:first");    
  }
  
}

$(function(){
  loadTracks({callback: loadTracksCallback});

  // prevent safari from scrolling
  $("body").bind("touchmove",function(ev) {
    ev.preventDefault();
  });
  
  $("#container").bind("swiperight",function() {
    if(parseInt($("#viewer").css("left")) != 0) {
      $("#viewer").css({left:parseInt($("#viewer").css("left")) + 320 + 'px'});

      // play next track
      currentImg = currentImg.prev();

      if(soundTrack) {
        soundTrack.pause();
      }
      soundTrack = new Audio(currentImg.data("track").stream_url + "?consumer_key=jwtest");
      soundTrack.load();
      soundTrack.play();
      $(soundTrack).bind('ended',function() {
        $("#container").trigger('swipeleft');
      });

    }
  })
  .bind("swipeleft",function() {
    $("#viewer").css({left:parseInt($("#viewer").css("left")) - 320 + 'px'});

    var oldCurrentImg = currentImg;

    // play next track
    currentImg = currentImg.next();
    
    // preload tracks
    if(currentImg.next().next().next().length == 0) {
      globalOffset += 200;
      loadTracks({offset: globalOffset,callback: loadTracksCallback});      
    }
    
    // set title
    currentImg.find("p").html(currentImg.data("track").title);

    if(soundTrack) {
      soundTrack.pause();
    }
    soundTrack = new Audio(currentImg.data("track").stream_url + "?consumer_key=jwtest");
    soundTrack.load();
    soundTrack.play();
    $(soundTrack).bind('ended',function() {
      $("#container").trigger('swipeleft');
    });
      
  });  

});