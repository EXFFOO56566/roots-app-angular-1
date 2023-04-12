/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';
 
  var app = angular.module('app', ['onsen', 'ngMap']);


  // Map Markers Controller

  app.controller('markersController', function($scope, $compile){
    
    $scope.infoWindow = {
      title: 'title',
      content: 'content'
    };

    // These are our marker locations and content
    $scope.markers = [
      {
        'title' : 'Location #1',
        'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
        'location'  : [40.7112, -74.213]
      }, 
      {
        'title' : 'Location #2',
        'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
        'location'  : [40.7243, -74.2014]
      }, 
      {
        'title' : 'Location #3',
        'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
        'location'  : [40.7312, -74.1923]
      }
    ];

    // This function grabs the correct marker and inserts the content in the infoWindow then opens it.
    $scope.showMarker = function(event){

      $scope.marker = $scope.markers[this.id];
        $scope.infoWindow = {
        title: $scope.marker.title,
        content: $scope.marker.content
      };
      $scope.$apply();
      $scope.showInfoWindow(event, 'marker-info', this.getPosition());

    }

  });



})();

