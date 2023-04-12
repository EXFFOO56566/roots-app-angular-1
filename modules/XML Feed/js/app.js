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

  app.filter('htmlToPlaintext', function() {
      return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
      }
    }
  );

  // We create a new X2JS object, it will let us convert the XML to JSON
  var x2js = new X2JS();

  // XML Feed Controller
  app.controller('xmlFeedController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){
   
    $scope.feedURL = 'http://dev.studio31.co/feed/';

    $scope.json ='';

    $scope.items = [];

    $http.get($scope.feedURL).success(function(response) {

      // We got the response in XML and we convert it to JSON
      $scope.json = x2js.xml_str2json( response );
      $scope.items = $scope.json.rss.channel.item;

    }).error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(data);
    });

    $scope.openLink = function(index){
      // We are going to open the link in the system browser
      window.open($scope.items[index].link, '_system');
    };

  }]);



})();

