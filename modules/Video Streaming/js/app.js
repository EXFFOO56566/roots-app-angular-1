/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';
  
  var app = angular.module('app', ['onsen']);

  // Video Stream Controller
  app.controller('videostreamController', function($scope){
    
    $scope.playVideo = function(){
      // Change this URL with your Video Stream URL
      var videoUrl = 'https://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8';

      // Just play a video
      window.plugins.streamingMedia.playVideo(videoUrl);
    }

  });


})();

