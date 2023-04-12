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

  app.controller('youtubeController', [ '$scope', '$rootScope', function($scope, $rootScope){

    $scope.playVideo = function(){
      console.log("play");
      callPlayer('youtubeplayer','playVideo');
    }

    $scope.stopVideo = function(){
      console.log("stop");
      callPlayer('youtubeplayer','stopVideo');
    }

    $scope.pauseVideo = function(){
      console.log("pause");
      callPlayer('youtubeplayer','pauseVideo');
    }

    $scope.nextVideo = function(){
      console.log("nextVideo");
      callPlayer('youtubeplayer','loadVideoByUrl', ['http://www.youtube.com/v/b8_H6P8kZ3Y?version=3']);
    }

    $scope.anotherVideo = function(){
      console.log("anotherVideo");
      callPlayer('youtubeplayer','loadVideoByUrl', ['http://www.youtube.com/v/PIh2xe4jnpk?version=3']);
    }

  }]);  


})();

