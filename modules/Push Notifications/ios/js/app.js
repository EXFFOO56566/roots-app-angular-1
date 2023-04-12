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
        //get the notification payload
        var notification = event.notification;

        //display alert to the user for example
        alert(notification.aps.alert);
       
        //clear the app badge
        pushNotification.setApplicationIconBadgeNumber(0);
    });
 
    //initialize the plugin
    pushNotification.onDeviceReady({pw_appid:"08BFA-004C0"}); // Insert your PushWoosh App ID
     
    //register for pushes
    pushNotification.registerDevice(
      function(status) {
        var deviceToken = status['deviceToken'];
        console.warn('registerDevice: ' + deviceToken);
      },
      function(status) {
        console.warn('failed to register : ' + JSON.stringify(status));
        alert(JSON.stringify(['failed to register ', status]));
      }
    );
     
    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);

  }  

  var app = angular.module('app', ['onsen']);

  app.controller('pushController', function($scope){
    
    ons.ready(function(){
      initPushwoosh();
    });
    
  });

})();

