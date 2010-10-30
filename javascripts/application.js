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

function rotateScaleImg(img){
  var boundX = 300;
  var boundY = 400;
  
  if(img.clientWidth > img.clientHeight){
    $(img).addClass('rot90');
  }
}

$(function(){
  loadTracks({
    callback: function(tracks){
      $.each(tracks, function(){
        var img = $('<img src="'+ this.artwork_url +'" />').load(function(){
          rotateScaleImg(this);
        });
        $('.container').append(img);
        console.log(this.permalink);
      });
    }
  });
});