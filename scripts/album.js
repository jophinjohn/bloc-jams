
var createSongRow = function(songNumber, songName, songLength) {
     var songLength = filterTimeCode(songLength);
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 var $row = $(template);

 var clickHandler = function() {
      var songNumber = parseInt($(this).attr('data-song-number'));
	
     if (currentlyPlayingSong !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSong);
		currentlyPlayingCell.html(currentlyPlayingSong);
        
	}
	if (currentlyPlayingSong !== songNumber) {
		$(this).html(pauseButtonTemplate);
        // Switch from Play -> Pause button to indicate new song is playing.
		setSong(songNumber);
        
		
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        currentlyPlayingSong = songNumber;
        updatePlayerBarSong();
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
   var $volumeFill = $('.volume .fill');
   var $volumeThumb = $('.volume .thumb');
   $volumeFill.width(currentVolume + '%');
   $volumeThumb.css({left: currentVolume + '%'});
        
	} else if (currentlyPlayingSong === songNumber) {
		if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                 updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause(); 
                currentlyPlayingSong = null
            }
	}// clickHandler logic
 };
     var onHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt($(songNumberCell).attr('data-song-number'));

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }    // Placeholder for function logic
     };
     var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
        var songNumber =  parseInt($(songNumberCell).attr('data-song-number'));
         
        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(songNumber);
            
        }
         // Placeholder for function logic
     };
   
     
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
      
 };
   
 
var setCurrentAlbum = function(album) {
    console.log('album', album);
    currentAlbum = album;   
    console.log('currentAlbum', currentAlbum);
    
  var $albumTitle =       $('.album-view-title');
  var $albumArtist =      $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage =       $('.album-view-cover-art');
  var $albumSongList =    $('.album-view-song-list');
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     // #3
      $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };
var updateSeekBarWhileSongPlays = function() {
    console.log('test');
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
             setCurrentTimeInPlayerBar(this.getTime());
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };
var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;
 
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
         
     });
    $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
              if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };
// set the text of current-time class to current time in song
var setCurrentTimeInPlayerBar = function(currentTime) {
  $(".current-time").text(filterTimeCode(currentTime));
};

// sets the text of total-time to length of current song
var setTotalTimeInPlayerBar = function(totalTime) {
  $(".total-time").text(filterTimeCode(totalTime));
};

// display the time in the correct formar
var filterTimeCode = function(timeInSeconds) {
  var seconds = Math.floor(parseFloat(timeInSeconds));
  var minutes = 0;

  // if one minute or more have elapsed
  while (seconds >= 60) {
    minutes++;
    seconds -= 60;
  }
if (seconds < 10) {
    seconds = "0" + seconds;
  }

 
  var formattedTime = minutes + ":" + seconds;
  return formattedTime;
};

var getSongNumberCell = function(songNumber) {
  return $('[data-song-number="' + songNumber + '"]');
};
var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };
var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};


var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    // Update the Player Bar information
    updatePlayerBarSong();
    
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSong);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};
var previousSong = function() {
    
    // Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    // Update the Player Bar information
   updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSong);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSong = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });
    setVolume(currentVolume);
    
};

var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };
var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };
var togglePlayFromPlayerBar = function() {
  console.log('togglePlayFromPlayerBar called')
  var songNumberCell = getSongNumberCell(currentlyPlayingSong)
  
  if (currentSoundFile) {
   console.log('current soundfile exists')
   if (currentSoundFile.isPaused()) {
    console.log('current soundfile is paused. play it - show the pause button on cell and player')
    currentSoundFile.play();
    songNumberCell.html(pauseButtonTemplate);
    $playerBarClick.html(playerBarPauseButton);
   } else {
    console.log('current soundfile is playing. pause it - show the play button on cell and player')
    currentSoundFile.pause();
    songNumberCell.html(playButtonTemplate);
    $playerBarClick.html(playerBarPlayButton);    
   }
   
  }
 };



var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentSoundFile = null;
var currentlyPlayingSong = null;
var currentVolume = 80;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';


 // Store state of playing songs
 var currentAlbum = null;
 var currentSongFromAlbum = null;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playerBarClick = $('.main-controls .play-pause');


$(document).ready(function(){
   setCurrentAlbum(albumPicasso);
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);     
   $playerBarClick.click(togglePlayFromPlayerBar);
   setupSeekBars();
 });
    