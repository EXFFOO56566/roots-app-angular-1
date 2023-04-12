/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';
 
  var app = angular.module('app', ['onsen', 'angular-images-loaded']);

  // Filter to convert HTML content to string by removing all HTML tags
  app.filter('htmlToPlaintext', function() {
      return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
      }
    }
  );

  // Video List Controller 
  app.controller('listController', [ '$scope', '$rootScope', function( $scope, $rootScope){

    // This is an object with all our videos.
    $scope.videos = [
      {
        'id': 1,
        'title': 'Deer',
        'desc' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'thumb': 'images/deer-thumb.jpg',
        'file': 'videos/deer.mp4',
        'poster': 'images/deer.jpg',
        'duration': '0:25'
      },
      {
        'id': 2,
        'title': 'Highway',
        'desc' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'thumb': 'images/highway-thumb.jpg',
        'file': 'videos/highway.mp4',
        'poster': 'images/highway.jpg',
        'duration': '0:32'
      },
      {
        'id': 3,
        'title': 'Raindrops',
        'desc' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'thumb': 'images/raindrops-thumb.jpg',
        'file': 'videos/raindrops.mp4',
        'poster': 'images/raindrops.jpg',
        'duration': '0:41'
      },
      {
        'id': 4,
        'title': 'Stone',
        'desc' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'thumb': 'images/stone-thumb.jpg',
        'file': 'videos/stone.mp4',
        'poster': 'images/stone.jpg',
        'duration': '0:31'
      },
      {
        'id': 5,
        'title': 'Swan',
        'desc' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'thumb': 'images/swan-thumb.jpg',
        'file': 'videos/swan.mp4',
        'poster': 'images/swan.jpg',
        'duration': '0:46'
      },
    ];

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };

    $scope.showVideo = function(index){
        
      $rootScope.video = $scope.videos[index];
      $scope.ons.navigator.pushPage('video.html');

    };


  }]);

  // This controller let us print the Post Content in the post.html template
  app.controller('videoController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
    
    $scope.video = $rootScope.video;

    $scope.renderHtml = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };    

    $scope.playVideo = function(){
      $('#video').get(0).play();
    }

  }]);

  // This directive will allow us to cache all the images that have the img-cache attribute in the <img> tag
  app.directive('imgCache', ['$document', function ($document) {
    return {
      link: function (scope, ele, attrs) {
        var target = $(ele);

        scope.$on('ImgCacheReady', function () {

          ImgCache.isCached(attrs.src, function(path, success){
            if(success){
              ImgCache.useCachedFile(target);
            } else {
              ImgCache.cacheFile(attrs.src, function(){
                ImgCache.useCachedFile(target);
              });
            }
          });
        }, false);

      }
    };
  }]);  


})();

