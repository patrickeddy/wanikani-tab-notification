// ==UserScript==
// @name        WaniKani Tab Notification
// @namespace   http://patrickeddy.com
// @description Simple notification on your browser tab when reviews are available.
// @include			https://www.wanikani.com/*
// @include     https://www.wanikani.com/dashboard
// @author      Bleu
// @version     1.0
// @grant       none
// ==/UserScript==
$(document).ready(function () {
  /*
   * === CUSTOMIZE ===
   * Change the message or speed in seconds
   */
  var titleMessage = '(!) Reviews are waiting';
  var speed = 3;
  /*
   * === ADVANCED ===
   * Don't touch if you don't know what you're doing
   *
   */
  var $reviewElement = $('time.timeago');
  checkReviews();
  $reviewElement.bind('DOMSubtreeModified', checkReviews);
  function checkReviews() {
    if ($reviewElement.html().indexOf('ago') >= 0 || $reviewElement.html().indexOf('Available Now') >= 0) {
      setInterval(function () {
        document.title = titleMessage;
        setTimeout(function () {
          document.title = 'WaniKani / Dashboard';
        }, (speed * 1000) / 2);
      }, (speed * 1000));
    }
  }
});
