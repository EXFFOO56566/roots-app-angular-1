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

  app.controller('emailComposeController', function( $scope ){
    
    /* These are all the options that you can use
    cordova.plugins.email.open({
        to:          Array, // email addresses for TO field
        cc:          Array, // email addresses for CC field
        bcc:         Array, // email addresses for BCC field
        attachments: Array, // file paths or base64 data streams
        subject:    String, // subject of the email
        body:       String, // email body (for HTML, set isHtml to true)
        isHtml:    Boolean, // indicats if the body is HTML or plain text
    }, callback, scope);
    */

    $scope.composeMail = function(){
      ons.ready(function(){
        cordova.plugins.email.open({
            to:      'hello@example.com',
            subject: 'Check out Roots!',
            body:    "It's a nice framework to build apps fast! http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999"
        });
      });
    };
      
  });


})();

