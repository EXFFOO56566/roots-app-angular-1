/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';
 
  var app = angular.module('app', ['onsen', 'angular-images-loaded', 'ngMap']);

  // Filter to convert HTML content to string by removing all HTML tags
  app.filter('htmlToPlaintext', function() {
      return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
      }
    }
  );

  app.controller('networkController', function($scope){

    // Check if is Offline
    document.addEventListener("offline", function(){

      offlineMessage.show();

      /* 
       * With this line of code you can hide the modal in 8 seconds but the user will be able to use your app
       * If you want to block the use of the app till the user gets internet again, please delete this line.       
       */

      setTimeout('offlineMessage.hide()', 8000);  

    }, false);

    document.addEventListener("online", function(){
      // If you remove the "setTimeout('offlineMessage.hide()', 8000);" you must remove the comment for the line above      
      // offlineMessage.hide();
    });

  });

  // This functions will help us save the JSON in the localStorage to read the website content offline

  Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
  }

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

  // Map Markers Controller
  var map;

  app.controller('branchesController', function($http, $scope, $compile, $sce){
    
    $scope.getAll = true;
    $scope.locationsType = 'map';
    $scope.centerMap = [40.7112, -74.213]; // Start Position
    $scope.API = 'http://dev.studio31.co/api/get_posts/?post_type=banks&posts_per_page=-1';
    $scope.isFetching = true;
    $scope.locations = [];
    $scope.userLat = 0;
    $scope.userLng = 0;
    $scope.closestLocations = [];
    $scope.minDistance = 2000; // Km
    $scope.markers = [];
    $scope.infoWindow = {
      id: '',
      title: '',
      content: '',
      address: '',
      hours: '',
      phone: '',
      distance: ''
    };

    // true is to show ALL locations, false to show ONLY closests locations
    $scope.start = function(value, locationType){
        $scope.getAll = value;
        $scope.locationsType = locationType;
        
        if(locationType=='list'){
          $scope.init();
        }
    }

    $scope.$on('mapInitialized', function(event, evtMap) {
      map = evtMap;
      $scope.init();
      });

      $scope.init = function(){           

      navigator.geolocation.getCurrentPosition(function(position){
        $scope.drawMyLocation( position.coords.latitude, position.coords.longitude );
        $scope.userLat = position.coords.latitude;
        $scope.userLng = position.coords.longitude;
      }, function(error){
        console.log("Couldn't get the location of the user.");
        console.log(error);
      }, {
        maximumAge:60000,
        timeout:10000,
        enableHighAccuracy: true
      });

      }

      $scope.drawMyLocation = function( lat, lng){
        
        $scope.getAllRecords();

        if($scope.locationsType=='map'){
          var pinLayer;
        var swBound = new google.maps.LatLng(lat, lng);
        var neBound = new google.maps.LatLng(lat, lng);
        var bounds = new google.maps.LatLngBounds(swBound, neBound);  
         
        pinLayer = new PinLayer(bounds, map);
      }

      $scope.centerMap = [ lat, lng ];

      }

    $scope.getAllRecords = function(pageNumber){

      $scope.isFetching = true;

          $http.jsonp($scope.API+'&callback=JSON_CALLBACK').success(function(response) {

        $scope.locations = response.posts;
        $scope.isFetching = false;

        if($scope.getAll==true){
          // Get all locations
          $scope.allLocations();
        } else{
          // Get closest locations
          $scope.closestLocation();
        }
        

        });
     
    }

    $scope.allLocations = function(){
      
      $.each($scope.locations, function( index, value ) {

        var distance = Haversine( $scope.locations[ index ].custom_fields.location[0].lat, $scope.locations[ index ].custom_fields.location[0].lng, $scope.userLat, $scope.userLng );

        $scope.markers.push({
          'id'    : index,
          'title'   : $scope.locations[ index ].title,
          'content'   : $scope.locations[ index ].custom_fields.description[0],
          'address' : $scope.locations[ index ].custom_fields.address[0],
          'hours'   : $scope.locations[ index ].custom_fields.hours[0],
          'phone'   : $scope.locations[ index ].custom_fields.phone[0],
          'distance'  : (Math.round(distance * 100) / 100),
          'location'  : [$scope.locations[ index ].custom_fields.location[0].lat, $scope.locations[ index ].custom_fields.location[0].lng]
        });

      });

    }

    $scope.closestLocation = function(){    

      for(var i = 0; i < $scope.locations.length; i++){

        // Get lat and lon from each item
        var locationLat = $scope.locations[ i ].custom_fields.location[0].lat;
        var locationLng = $scope.locations[ i ].custom_fields.location[0].lng;

        // get the distance between user's location and this point
              var dist = Haversine( locationLat, locationLng, $scope.userLat, $scope.userLng );

              if ( dist < $scope.minDistance ){
                  $scope.closestLocations.push(i);
              }

      }

      $.each($scope.closestLocations, function( index, value ) {

        var distance = Haversine( $scope.locations[ value ].custom_fields.location[0].lat, $scope.locations[ value ].custom_fields.location[0].lng, $scope.userLat, $scope.userLng );

        $scope.markers.push({
          'id'    : index,
          'title'   : $scope.locations[ value ].title,
          'content'   : $scope.locations[ value ].custom_fields.description[0],
          'address' : $scope.locations[ value ].custom_fields.address[0],
          'hours'   : $scope.locations[ value ].custom_fields.hours[0],
          'phone'   : $scope.locations[ value ].custom_fields.phone[0],
          'distance'  : (Math.round(distance * 100) / 100),
          'location'  : [$scope.locations[ value ].custom_fields.location[0].lat, $scope.locations[ value ].custom_fields.location[0].lng]
        });

      });

    }

      $scope.showMarker = function(event){

      $scope.marker = $scope.markers[this.id];
        $scope.infoWindow = {
          id    : $scope.marker.id,
        title   : $scope.marker.title,
        content : $scope.marker.content,
        address : $scope.marker.address,
        hours : $scope.marker.hours,
        phone : $scope.marker.phone,
        distance: $scope.marker.distance
      };
      $scope.$apply();
      $scope.showInfoWindow(event, 'marker-info', this.getPosition());

      }

      $scope.renderHtml = function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
      }

      // Get Directions
    $(document).on('click', '.get-directions', function(e){
      e.preventDefault();

      var marker = $scope.markers[$(this).attr('data-marker')];

      // Apple
      window.location.href = 'maps://maps.apple.com/?q='+marker.location[0]+','+marker.location[1];
          
      // Google Maps (Android)
      //var ref = window.open('http://maps.google.com/maps?q='+marker.location[0]+','+marker.location[1], '_system', 'location=yes');

    });
          
      // Call
    $(document).on('click', '.call-phone', function(e){

      e.preventDefault();

      var phone = $(this).attr('data-phone');
      phone = phone.replace(/\D+/g, "");

      window.open('tel:'+phone, '_system')

    });

  });


  // Maps Functions //

  // Math Functions
  function Deg2Rad( deg ) {
     return deg * Math.PI / 180;
  }

  // Get Distance between two lat/lng points using the Haversine function
  // First published by Roger Sinnott in Sky & Telescope magazine in 1984 ("Virtues of the Haversine")
  function Haversine( lat1, lon1, lat2, lon2 ){
      var R = 6372.8; // Earth Radius in Kilometers

      var dLat = Deg2Rad(lat2-lat1);  
      var dLon = Deg2Rad(lon2-lon1);  

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                      Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) * 
                      Math.sin(dLon/2) * Math.sin(dLon/2);  
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; 

      // Return Distance in Kilometers
      return d;
  }

  // Pulse Marker Icon
  function PinLayer(bounds, map) {
      this.bounds = bounds;
      this.setMap(null);
      this.setMap(map);
  }

  PinLayer.prototype = new google.maps.OverlayView();

  PinLayer.prototype.onAdd = function() {

    // Container
    var container = document.createElement('DIV');
    container.className = "pulse-marker";

    // Pin
      var marker = document.createElement('DIV');
      marker.className = "pin";

      // Pulse
      var pulse = document.createElement('DIV');
      pulse.className = 'pulse';

      container.appendChild(marker);
      container.appendChild(pulse);

      this.getPanes().overlayLayer.appendChild(container);

      container.appendChild(document.createElement("DIV"));
      this.div = container;
  }

  PinLayer.prototype.draw = function() {
      var overlayProjection = this.getProjection();
      var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
      var div = this.div;
      div.style.left = sw.x - 8 + 'px';
      div.style.top = ne.y - 15 + 'px';
  }  

})();

