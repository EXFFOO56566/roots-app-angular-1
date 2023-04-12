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


  app.config(function($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })

  app.controller('cameraController', function( $scope, $compile){
    
    $scope.lastPhoto = 'images/profile.png';

    $scope.camOptions = {};

    var originalPhoto = document.getElementById('photo');

    // This function takes care of opening the camera and getting the URL
    $scope.openCamera = function(){
      ons.ready(function() {
        $scope.camOptions = { 
          quality : 100,
          destinationType : navigator.camera.DestinationType.FILE_URI,
          sourceType : navigator.camera.PictureSourceType.CAMERA,
          allowEdit : true,
          encodingType: navigator.camera.EncodingType.JPEG,
          targetWidth: 640,
          targetHeight: 640,
          saveToPhotoAlbum: true 
        };      
        navigator.camera.getPicture( $scope.onSuccess, $scope.onFail, $scope.camOptions );
      });
    }

    // This is the function that will trigger if we succeded taking the picture
    $scope.onSuccess = function(imageURI) {
      console.log(imageURI);
      $scope.$apply(function(){
        $scope.lastPhoto = imageURI;
      });
    }

    // This is the function that will trigger if we failed to take a picture
    $scope.onFail = function(message) {
        console.log('Failed because: ' + message);
    }


  });


})();

