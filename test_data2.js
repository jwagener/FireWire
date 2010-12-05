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