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
  var api = 'http://auth.studio31.co/api/';

  // Filter to convert HTML content to string by removing all HTML tags
  app.filter('htmlToPlaintext', function() {
      return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
      }
    }
  );

  // This functions will help us save the JSON in the localStorage to read the website content offline

  Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
  }  

  // Init controller
  app.controller('initController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    $scope.init = function(){
      
      // Check if it has a cookie saved
      if (window.localStorage.getItem("rootsCookie") != null ) {

        $http.jsonp(api+'user/validate_auth_cookie/?cookie='+window.localStorage.getItem("rootsCookie")+'&callback=JSON_CALLBACK').success(
          function(response) {
            console.log(response);
            if(response.status=='ok' && response.valid==true){
              $scope.menu.setMainPage('latest.html', {closeMenu: true}); // if logged in send to latest.html
            } else {
              $scope.menu.setMainPage('login.html', {closeMenu: true}); // if login didn't work send back to login.html
            }
          }
        );

      } else {
        
        $scope.menu.setMainPage('login.html', {closeMenu: true}); // if login didn't work send back to login.html

      }
    
    };

  }]);

  // Log In Controller
  app.controller('loginController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    $scope.nonce = '';
    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
            
      if($scope.username==='' && $scope.password===''){
        
        ons.notification.alert({message: "You can't leave any fields empty"});

      } else {
        
        modal.show();

        $http.jsonp(api+'get_nonce/?controller=user&method=generate_auth_cookie&callback=JSON_CALLBACK').success(
          function(response) {
            console.log(response);
            if(response.status=='ok'){
              
              $scope.nonce = response.nonce;

              $http.jsonp(api+'user/generate_auth_cookie/?nonce='+$scope.nonce+'&username='+$scope.username+'&password='+$scope.password+'&callback=JSON_CALLBACK').success(
                function(response){
                  
                  if(response.status=='ok'){

                    // We save the cookie
                    window.localStorage.setItem("rootsCookie", response.cookie);
                    modal.hide();
                    $scope.menu.setMainPage('latest.html', {closeMenu: true});

                  } else{

                    modal.hide();
                    ons.notification.alert({message: 'Your username/password was incorrect, please try again.'});

                  }
                    
                }
              );

            } else {

              modal.hide();
              ons.notification.alert({message: 'There was an error trying to connect to the server, please try again.'});

            }
          }
        );

      }

    };

  }]);

  // Sign up Controller
  app.controller('signupController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    $scope.username = '';
    $scope.password = '';
    $scope.email    = '';

    $scope.register = function(){
      
      if($scope.username==='' && $scope.password==='' && $scope.email===''){
        
        ons.notification.alert({message: "You can't leave any fields empty"});

      } else if( $scope.password.length<6 ){

        ons.notification.alert({message: "Your password must have 6 characters or more."});

      } else {

        modal.show();

        $http.jsonp(api+'get_nonce/?controller=user&method=register&callback=JSON_CALLBACK').success(
          function(response) {
            console.log(response);
            if(response.status=='ok'){
              
              $scope.nonce = response.nonce;

              $http.jsonp(api+'user/register/?username='+$scope.username+'&email='+$scope.email+'&nonce='+$scope.nonce+'&user_pass='+$scope.password+'&display_name='+$scope.username+'&notify=no&callback=JSON_CALLBACK').success(
                function(response){
                  
                  if(response.status=='ok'){

                    // We save the cookie
                    window.localStorage.setItem("rootsCookie", response.cookie);
                    modal.hide();
                    $scope.menu.setMainPage('latest.html', {closeMenu: true});

                  } else if(response.status=='error'){
                  
                    modal.hide();
                    ons.notification.alert({message: response.error });

                  } else {

                    modal.hide();
                    ons.notification.alert({message: 'There was a problem trying to create your account, please try again.'});

                  }
                    
                }
              );

            } else {

              modal.hide();
              ons.notification.alert({message: 'There was an error trying to connect to the server, please try again.'});

            }
          }
        );

      }

    };

  }]);  


  // Show Latest Posts
  // This controller gets all the posts from our WordPress site and inserts them into a variable called $scope.items
  app.controller('latestController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    $scope.yourAPI = api+'get_posts/?post_type=post';
    $scope.items = [];
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.pageNumber = 1;
    $scope.isFetching = true;
    $scope.lastSavedPage = 0;
    $scope.cookie = '';

    // Let's initiate this on the first Controller that will be executed.
    ons.ready(function() {
      
      // Cache Images Setup
      // Set the debug to false before deploying your app
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


    $scope.pullContent = function(){
      
      $http.jsonp($scope.yourAPI+'&page='+$scope.pageNumber+'&cookie='+$scope.cookie+'&callback=JSON_CALLBACK').success(function(response) {

        if($scope.pageNumber > response.pages){

          // hide the more news button
          $('#moreButton[rel=home]').fadeOut('fast');  

        } else {

          $scope.items = $scope.items.concat(response.posts);
          window.localStorage.setObject('rootsPostsHome', $scope.items); // we save the posts in localStorage
          window.localStorage.setItem('rootsDateHome', new Date());
          window.localStorage.setItem("rootsLastPageHome", $scope.currentPage);
          window.localStorage.setItem("rootsTotalPagesHome", response.pages);

          // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
          // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

          $scope.totalPages = response.pages;
          $scope.isFetching = false;

          if($scope.pageNumber == response.pages){

            // hide the more news button
            $('#moreButton[rel=home]').fadeOut('fast'); 

          }

        }

      });

    }

    $scope.getAllRecords = function(pageNumber){

      $scope.isFetching = true;    

      if (window.localStorage.getItem("rootsCookie") == null ) {
      
        $scope.menu.setMainPage('login.html', {closeMenu: true});

      } else {
        
        $scope.cookie = window.localStorage.getItem("rootsCookie");

        if (window.localStorage.getItem("rootsLastPageHome") == null ) {

          $scope.pullContent();

        } else {
          
          var now = new Date();
          var saved = new Date(window.localStorage.getItem("rootsDateHome"));

          var difference = Math.abs( now.getTime() - saved.getTime() ) / 3600000;

          // Lets compare the current dateTime with the one we saved when we got the posts.
          // If the difference between the dates is more than 24 hours I think is time to get fresh content
          // You can change the 24 to something shorter or longer

          if(difference > 24){
            // Let's reset everything and get new content from the site.
            $scope.currentPage = 1;
            $scope.pageNumber = 1;
            $scope.lastSavedPage = 0;
            window.localStorage.removeItem("rootsLastPageHome");
            window.localStorage.removeItem("rootsPostsHome");
            window.localStorage.removeItem("rootsTotalPagesHome");
            window.localStorage.removeItem("rootsDateHome");

            $scope.pullContent();
          
          } else {
            
            $scope.lastSavedPage = window.localStorage.getItem("rootsLastPageHome");

            // If the page we want is greater than the last saved page, we need to pull content from the web
            if($scope.currentPage > $scope.lastSavedPage){

              $scope.pullContent();
            
            // else if the page we want is lower than the last saved page, we have it on local Storage, so just show it.
            } else {

              $scope.items = window.localStorage.getObject('rootsPostsHome');
              $scope.currentPage = $scope.lastSavedPage;
              $scope.totalPages = window.localStorage.getItem("rootsTotalPagesHome");
              $scope.isFetching = false;

            }

          }

        }
      
      }

    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };

    $scope.showPost = function(index){
        
      $rootScope.postContent = $scope.items[index];
      $scope.ons.navigator.pushPage('post.html');

    };

    $scope.nextPage = function(){

      $scope.currentPage++; 
      $scope.pageNumber = $scope.currentPage;                 
      $scope.getAllRecords($scope.pageNumber);        

    }

  }]);

  // This controller let us print the Post Content in the post.html template
  app.controller('postController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
    
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

  app.controller('menuController', [ '$scope',  function($scope){

    $scope.logOut = function(){
      
      window.localStorage.removeItem("rootsCookie");
      $scope.menu.setMainPage('loading.html', {closeMenu: true});

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

