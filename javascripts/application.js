
// 320 x 480

var img_position_left = 0;

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

var currentImg;
var soundTrack;

function loadTracksCallback(tracks){
  $.each(tracks, function(){
    $('<img src="'+ this.artwork_url +'" />')
      .load(function(){
        rotateScalePositionImg(this);
      })
    .appendTo("#viewer")
    .wrap("<div>")
    .parents("div").data("track",this);
  });
  
  currentImg = $("#viewer div:first");
  
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
      var track = currentImg.data("track");
      if(soundTrack) {
        soundTrack.pause();
      }
      soundTrack = new Audio(track.stream_url + "?consumer_key=jwtest");
      soundTrack.play();
    }
  });

  $("#container").bind("swipeleft",function() {
    $("#viewer").css({left:parseInt($("#viewer").css("left")) - 320 + 'px'});

    // play next track
    currentImg = currentImg.next();    
    var track = currentImg.data("track");
    if(soundTrack) {
      var fadeDown = setInterval(function() {
        console.log(soundTrack.volume);
        if(soundTrack.volume > 0.05) {
          soundTrack.volume -= 0.05;          
        } else {
          clearInterval(fadeDown);
          soundTrack.pause();
          soundTrack = new Audio(track.stream_url + "?consumer_key=jwtest");
          soundTrack.volume = 1;
          soundTrack.play();          
        }
      },100);
    }
  });  

});