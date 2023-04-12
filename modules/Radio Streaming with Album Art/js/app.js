/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

// To get the Album Art from last.fm you need to create an API Account: http://www.last.fm/api/account/create
// Also you need to read the Terms of Service of last.fm http://www.last.fm/api/tos
// In the Terms of Service of January 27 of 2015 it says that you will not make more than 5 requests per originating IP address per second
// so use the interval according to your needs and don't abuse of their API or your app will be banned. 

(function(){
  'use strict';

  var app = angular.module('app', ['onsen', 'ngAudio']);

  // Radio Controller
  var radio = null;
  var isPlaying = false;

  app.controller('radioController', function($scope, $sce, ngAudio){
    
    $scope.radioHost = 'http://192.99.8.192'; // Replace this with your own radio stream URL
    $scope.radioPort = '3536'; // Replace this with the port of your Radio Stream
    $scope.lastFMKey = 'ab68e9a71c1bb15efaa9c706b646dee4';
    $scope.lastFM = 'http://ws.audioscrobbler.com/2.0/?method=track.search&format=json&limit=1&api_key='+$scope.lastFMKey+'&track=';

    $scope.radioURL = $scope.radioHost+':'+$scope.radioPort+'/;';
    $scope.buttonIcon = '<span class="ion-ios-play"></span>';

    $scope.radioOptions = {
      albumArt: 'images/cover.png',
      songName: ''
    }

    // Let's start the Shoutcast plugin to get the Song Name
    $.SHOUTcast({
       host : '192.99.8.192', // Replace this with your own radio stream URL but remove the http
       port : $scope.radioPort,
       interval : 40000, // Refresh interval in miliseconds is equal to 40 seconds.
       stream: 1, // Replace with your stream, default is 1.
       stats : function(){
          var songTitle = this.get('songtitle');
          var albumArt = '';
          
          $.getJSON( $scope.lastFM+encodeURIComponent(songTitle), function( data ) {
            if(data.error){
              console.log(data.message);
              albumArt = 'images/cover.png';    
            } else {
              console.log(data); // delete this for production
              if( data.results!== undefined ){
                if(data.results.trackmatches !="\n" ){
                  if(data.results.trackmatches.track.image !== undefined){
                    albumArt = data.results.trackmatches.track.image[3]['#text'];
                  } else {
                    albumArt = 'images/cover.png';
                  }                  
                } else {
                  albumArt = 'images/cover.png'; 
                }
              }
            }

            $scope.$apply(function(){
              $scope.radioOptions.albumArt = albumArt;
            });

          });
          
          $scope.$apply(function(){
            $scope.radioOptions.songName = songTitle;
          });
       }

    }).startStats();

    if (radio!==null) {   
        $scope.radio = radio;
        
        if(isPlaying){
          $scope.buttonIcon = '<span class="ion-ios-pause"></span>';
        } else {
          $scope.buttonIcon = '<span class="ion-ios-play"></span>';
        }
    } else {
      
      isPlaying = false;
        $scope.radio = ngAudio.load($scope.radioURL);
        radio = $scope.radio;
    }

    $scope.renderHtml = function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
      };

      $scope.startRadio = function(){

        if(!isPlaying){
          // Let's play it
          isPlaying = true;
        $scope.radio.play();

        $scope.buttonIcon = '<span class="ion-ios-pause"></span>';
        $scope.isFetching = true;

        } else {
          // Let's pause it
          isPlaying = false;
        $scope.radio.pause();
        $scope.buttonIcon = '<span class="ion-ios-play"></span>';

        }

      }

      // Check if is Offline
    document.addEventListener("offline", function(){

      isPlaying = false;
      $scope.radio.stop();
      $scope.buttonIcon = '<span class="ion-ios-play"></span>';
      $scope.radio = null;
      modal.show();
      setTimeout('modal.hide()', 8000);       

    }, false);

    document.addEventListener("online", function(){
      $scope.radio = ngAudio.load($scope.radioURL);
      radio = $scope.radio;
    });

  });

  var pad2 = function(number){
    return (number<10 ? '0' : '') + number;
  }

  app.filter('SecondsToTimeString', function() {
    return function(seconds) {
      var s = parseInt(seconds % 60);
      var m = parseInt((seconds / 60) % 60);
      var h = parseInt(((seconds / 60) / 60) % 60);
      if (seconds > 0) {
        return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
      } else {
        return '00:00:00';
      }
    }
  });


})();

