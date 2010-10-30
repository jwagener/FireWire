
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
  var params = 'consumer_key=' + consumer_key + '&created_with_app_id=64&offset=' + offset + '&limit=' + limit;
  
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
  var boundX = 320;
  var boundY = 480;
  
  $img.css('left', img_position_left + 'px');
  img_position_left += $img.width();
  
  var orig_width  = $img.width();
  var orig_height = $img.height();
  
  
  
//  if($img.width() > $img.height()){ //}.clientWidth > img.clientHeight){
  if(orig_width > orig_height){
    $img.addClass('rot90');    
    $img.css('margin-left',   ((orig_height - orig_width) / 2) + 'px');
//    $img.css('margin-right',  (-(orig_height - orig_width) / 2) + 'px');

//    $img.css('margin-right',  '-' + (orig_width  - orig_height) + 'px');
//    $img.css('margin-top',    (orig_width  - orig_height) + 'px');
//    $img.css('margin-bottom', (orig_width - orig_height ) + 'px');

    // fix the margin
  }
}


function loadTracksCallback(tracks){
  var i =0;
  $.each(tracks, function(){
    console.log(tracks);
    i++;
    var img = $('<img data-i='+ i +' src="'+ this.artwork_url +'" />').load(function(){
      rotateScalePositionImg(this);
      console.log('jo');
    });
    var x =$('.container').append(img);
  });
}

$(function(){
//  loadTracks({callback: loadTracksCallback});
});