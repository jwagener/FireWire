$(function() {
  $("#image-viewer-container").bind("swiperight",function() {
    $("#image-viewer").css({left:parseInt($("#image-viewer").css("left")) + 320 + 'px'});
  });

  $("#image-viewer-container").bind("swipeleft",function() {
    $("#image-viewer").css({left:parseInt($("#image-viewer").css("left")) - 320 + 'px'});
  });
  
  // prevent safari from scrolling
  $("body").bind("touchmove",function(ev) {
    ev.preventDefault();
  });

  // $("#image-viewer").bind("tap",function() {
  //   $("#image-viewer").css({background:'blue'});
  // });
  // 
  // $("#image-viewer").bind("click",function() {
  //   $("#image-viewer").css({background:'blue'});
  // });

});