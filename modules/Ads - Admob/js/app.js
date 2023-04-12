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

  // This is where you need to set up the the Ad IDs
  // You need to use different IDs for a banner and also a different ID for an Interstitial
	var ad_units = {
		ios : {
			banner: 'ca-app-pub-xxxxxxx/xxxxxxx', // or DFP format "/6253334/dfp_example_ad"
			interstitial: 'ca-app-pub-xxxxxxx/xxxxxxx'
		},
		android : {
			banner: 'ca-app-pub-xxxxxxx/xxxxxxx', // or DFP format "/6253334/dfp_example_ad"
			interstitial: 'ca-app-pub-xxxxxxx/xxxxxxx'
		}
	};

	// select the right Ad Id according to platform
	var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;


  // Banner Ads Controller 
  app.controller('adsController', [ '$scope', '$rootScope', function( $scope, $rootScope){


	  ons.ready(function(){

	  	if (! AdMob ) { console.log( 'admob plugin not ready' ); return; }

	  	if ( AdMob ){
	  		
		  	var defaultOptions = {
		        adSize: 'SMART_BANNER',
		        // width: integer, // valid when set adSize 'CUSTOM'
		        // height: integer, // valid when set adSize 'CUSTOM'
		        position: AdMob.AD_POSITION.BOTTOM_CENTER,
		        // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
		        bgColor: 'black', // color name, or '#RRGGBB'
		        isTesting: true, // set to true, to receiving test ad for testing purpose
		        // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
		    };

		    AdMob.setOptions( defaultOptions );		    

				// Let's create a banner 
				if(AdMob) AdMob.createBanner( {
		    adId:admobid.banner, 
		    position:AdMob.AD_POSITION.BOTTOM_CENTER, 
		    autoShow:true} );

						    
				/*
				// It will create a smart banner in bottom center using the default options
				if(AdMob) AdMob.createBanner( admobid.banner );

				// it will display smart banner at top center
				if(AdMob) AdMob.createBanner( {
				    adId:admobid.banner, 
				    position:AdMob.AD_POSITION.TOP_CENTER, 
				    autoShow:true} );

				// or, show a rect ad at bottom in overlap mode
				if(AdMob) AdMob.createBanner( {
				    adId:admobid.banner, 
				    adSize:'MEDIUM_RECTANGLE', 
				    overlap:true, 
				    position:AdMob.AD_POSITION.BOTTOM_CENTER, 
				    autoShow:true} );

				// or, show any size at any position
				if(AdMob) AdMob.createBanner( {
				    adId:admobid.banner, 
				    adSize:'CUSTOM',  width:200, height:200, 
				    overlap:true, 
				    position:AdMob.AD_POSITION.POS_XY, x:100, y:200, 
				    autoShow:true} );
				*/

		   
		  }

		  // Let's prepare and load ad resource in background, e.g. at begining of app home
			if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );

		}); 	

  }]);

  // Intersitial Ads Controller
  app.controller('interstitialController', [ '$scope', '$rootScope', function( $scope, $rootScope){    

  	// Let's show the intersitial when the user enters to the Interstitial Page
  	// If the ad doesn't appear is because it hasn't been loaded yet
  	if(AdMob) AdMob.showInterstitial();

		$scope.prepareIt = function(){
			
			if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );

		}

		$scope.showAnother = function(){

			if(AdMob) AdMob.showInterstitial();

		}
		

  }]);


})();

