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

  // Filters for split the Photos into columns (2 column grid or 3 column grid)
  app.filter('partition', [
    'filterStabilize',
    function(stabilize) {

      function partition(arr, size) {

        var newArr = [];

        for (var i=0; i<arr.length; i+=size) {
          newArr.push(arr.slice(i, i+size));
        }

        return newArr;

      }

      return stabilize(partition);

    }
  ])

  app.factory('filterStabilize', [
    'memoize',
    function(memoize) {

      function service(fn) {

        function filter() {
          var args = [].slice.call(arguments);
          // always pass a copy of the args so that the original input can't be modified
          args = angular.copy(args);
          // return the `fn` return value or input reference (makes `fn` return optional)
          var filtered = fn.apply(this, args) || args[0];
          return filtered;
        }

        var memoized = memoize(filter);

        return memoized;

      }

      return service;

    }
  ])

  app.factory('memoize', [
    function() {

      function service() {
        return memoizeFactory.apply(this, arguments);
      }

      function memoizeFactory(fn) {

        var cache = {};

        function memoized() {

          var args = [].slice.call(arguments);

          var key = JSON.stringify(args);

          if (cache.hasOwnProperty(key)) {
            return cache[key];
          }

          cache[key] = fn.apply(this, arguments);

          return cache[key];

        }

        return memoized;

      }

      return service;

    }
  ]);  

  // This functions will help us save the JSON in the localStorage to read the website content offline

  Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
  }

  // Gallery Controller
  // This controller gets all the photo posts from our WordPress site and inserts them into a variable called $scope.items
  app.controller('galleryController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    $scope.yourAPI = 'http://dev.studio31.co/api/get_posts/?post_type=photo';
    $scope.items = [];
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.pageNumber = 1;
    $scope.isFetching = true;

    ons.ready(function() {
      
      // Cache Images Setup
      ImgCache.options.debug = true;

      ImgCache.init(function(){

        //console.log('ImgCache init: success!');
        $rootScope.$broadcast('ImgCacheReady');
        // from within this function you're now able to call other ImgCache methods
        // or you can wait for the ImgCacheReady event

      }, function(){
        //console.log('ImgCache init: error! Check the log for errors');
      });

    });

    $scope.getAllRecords = function(pageNumber){

      $scope.isFetching = true;

      if (window.localStorage.getItem("rootsPhotoPaginating") !='false') {
        
        $http.jsonp($scope.yourAPI+'&page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

          $scope.items = $scope.items.concat(response.posts);
          window.localStorage.setObject('rootsPhotos', $scope.items); // we save the posts in localStorage
          window.localStorage.setItem('rootsPhotosDate', new Date());

          // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
          // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

          $scope.totalPages = response.pages;
          $scope.isFetching = false;
          if($scope.currentPage==$scope.totalPages){
            $('.gallery-page #moreButton').fadeOut('fast');  
            window.localStorage.setItem('rootsPhotoPaginating', 'false');
          }

        });

      } else {

        if (window.localStorage.getItem("rootsPhotosDate") != null && window.localStorage.getObject("rootsPhotos") != null ) {
          
          var now = new Date();
          var saved = new Date(window.localStorage.getItem('rootsPhotosDate'));

          var difference = Math.abs( now.getTime() - saved.getTime() ) / 3600000;

          // Lets compare the current dateTime with the one we saved when we got the posts.
          // If the difference between the dates is more than 12 hours I think is time to get fresh content
          // You can change the 12 to something shorter or longer

          if(difference > 12){
            
            window.localStorage.setItem('rootsPhotoPaginating', 'true');            
            window.localStorage.removeItem('rootsPhotos');
            window.localStorage.removeItem('rootsPhotosDate');

            $http.jsonp($scope.yourAPI+'/?page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

              $scope.items = $scope.items.concat(response.posts);
              window.localStorage.setObject('rootsPhotos', $scope.items); // we save the posts in localStorage
              window.localStorage.setItem('rootsPhotosDate', new Date());

              // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
              // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

              $scope.totalPages = response.pages;
              $scope.isFetching = false;
              if($scope.currentPage==$scope.totalPages){
                $('.gallery-page #moreButton').fadeOut('fast');  
              }

            });

          } else {
            
            $scope.items = window.localStorage.getObject('rootsPhotos');
            $scope.totalPages = $scope.items.pages;
            $scope.isFetching = false;
            $('.gallery-page #moreButton').fadeOut('fast');  
            
          }

        }
        
      }

    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };

    $scope.showPhoto = function(index){
        
      $rootScope.postContent = $scope.items[index];
      $scope.ons.navigator.pushPage('photo.html');

    };

    $scope.nextPage = function(){
      
      $scope.pageNumber = ($scope.currentPage + 1);
      if($scope.pageNumber <= $scope.totalPages){
        $scope.getAllRecords($scope.pageNumber);
        $scope.currentPage++;
      }

    }


  }]);

  // This controller let us print the Post Content in the photo.html template
  app.controller('photoController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
    
    $scope.item = $rootScope.postContent;

    $scope.renderHtml = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };    

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

