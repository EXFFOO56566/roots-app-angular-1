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

  // Carousel Controller
  app.controller('carouselController', [  '$scope', '$rootScope', function( $scope, $rootScope){
    
    $scope.hideIntro = true;

    ons.ready(function(){
      // If the user viewed the instructions we are gonna send it to another page if not we will show the intro.      
      if (window.localStorage.getItem("rootsIntro") == null ){
        $scope.$apply(function () {
          $scope.hideIntro = false;    
        });
            
      } else {
        $scope.myNavigator.pushPage('home.html');
      }

    });

    // We listen till the carousel has started
    document.addEventListener('ons-carousel:init', function(ev) {
      var carousel = ev.component;
      // We are listen to the carousel current item position
      // so we can update the dot indicator
      carousel.on('postchange', function() {
        var index = $scope.myCarousel.getActiveCarouselItemIndex();
        $('.carousel-dots ul li').removeClass('active');
        $('.carousel-dots ul li:eq('+index+')').addClass('active');
      });
    });

    $scope.goHome = function(){
      // If the user clicked any of the buttons we will suppose they check out all the instructions
      // We are going to save in the localStorage that he already viewed it. 
      window.localStorage.setItem("rootsIntro", 'viewed');
      $scope.hideIntro = true;
      $scope.myNavigator.pushPage('home.html');
    };


  }]);



})();

