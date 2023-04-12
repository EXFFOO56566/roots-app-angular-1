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


  // Status Bar Controller 
  app.controller('statusbarController', [ '$scope', '$rootScope', function( $scope, $rootScope){


		ons.ready(function(){

			/*
			 * Only for iOS
			 */

			// On iOS 7, make the statusbar overlay (true) or not overlay the WebView (false)
			StatusBar.overlaysWebView(false);

			// Use the default statusbar (dark text, for light backgrounds).
			//StatusBar.styleDefault();

			// Use the lightContent statusbar (light text, for dark backgrounds).
			//StatusBar.styleLightContent();

			// Use the blackOpaque statusbar (light text, for dark backgrounds).
			StatusBar.styleBlackOpaque();

			// On iOS 7, when you set StatusBar.statusBarOverlaysWebView to false, you can set the background color of the statusbar by color name.
			// Sopported colors:
			// black, darkGray, lightGray, white, gray, red, green, blue, cyan, yellow, magenta, orange, purple, brown
			// StatusBar.backgroundColorByName("red");


			// Sets the background color of the statusbar by a hex string.
			StatusBar.backgroundColorByHexString("#C0C0C0");

			/*
			 * The only methods that work for Android are StatusBar.hide(); and StatusBar.show();
			 */

		}); 
		
		$scope.hideStatusBar = function(){
			StatusBar.hide();
		};

		$scope.showStatusBar = function(){
			StatusBar.show();
		};

  }]);


})();

