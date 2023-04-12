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

  app.controller('barcodeController', function( $scope ){
    
    $scope.barcode = {
      'result': '',
      'format': '',
      'cancelled': ''
    }

    $scope.startScanner = function(){
      
      cordova.plugins.barcodeScanner.scan(
        function (result) {

          $scope.$apply(function(){
            $scope.barcode = {
              'result': result.text,
              'format': result.format,
              'cancelled': result.cancelled
            } 
          });
                       
        }, 
        function (error) {

          alert("Scanning failed: " + error);
          
        }
      );

    };
      
  });


})();

