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


  app.controller('linksController', [ '$scope', '$rootScope', function($scope, $rootScope){

    $scope.openSite = function(){
      ons.ready(function(){
        var ref = window.open('http://google.com', '_blank');
      });
    };

    $scope.openSiteNoLocation = function(){
      ons.ready(function(){
        var ref = window.open('http://google.com', '_blank', 'location=no');
      });
    };

    $scope.openSiteSystem = function(){
      ons.ready(function(){
        var ref = window.open('http://google.com', '_system');
      });
    };

  }]);  


})();

