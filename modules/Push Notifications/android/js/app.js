/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';

  function initPushwoosh() {
    var pushNotification = window.plugins.pushNotification;
 
    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification', function(event) {
      var title = event.notification.title;
      var userData = event.notification.userdata;
                               
      if(typeof(userData) != "undefined") {
          console.warn('user data: ' + JSON.stringify(userData));
      }
                                   
      alert(title);
    });
  
    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    // Insert your Google Project ID and your PushWoosh App ID
    pushNotification.onDeviceReady({ projectid: "924094748644", appid : "08BFA-004C0" });
     
    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = status;
            console.warn('push token: ' + pushToken);
        },
        function(status) {
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );

  }  

  var app = angular.module('app', ['onsen']);

  app.controller('pushController', function($scope){
    
    ons.ready(function(){
      initPushwoosh();
    });
    
  });

})();

