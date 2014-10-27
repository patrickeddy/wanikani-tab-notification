// ==UserScript==
// @name        WaniKani Tab Notification
// @namespace   http://patrickeddy.com
// @description Simple notification on your browser tab when reviews are available.
// @include     https://www.wanikani.com/*
// @author      Bleu
// @version     1.1
// @grant       none
// ==/UserScript==
$(document).ready(function () {
  /*
   * === CUSTOMIZE ===
   * Change the message or speed in seconds
   */
  var titleMessage = 'Reviews are available';
  var speed = 3;
  /*
   * === API KEY ===
   * If you supply your API key, the number of reviews will be prepended to your message 
   * and this script will work across the site
   */
  var api_key = 'YOU_API_KEY';
  var checkEvery = 2; // check for reviews every 2 minutes (default)
  /*
   * === ADVANCED ===
   * Don't touch if you don't know what you're doing
   *
   */
  var reviews = 0;
  var $reviewElement = $('time.timeago');
  var previousWindowTitle = document.title;
  var checkTimer;
  var titleAnimation;
  checkReviews();
  if (!hasAPIKey())
    $reviewElement.bind('DOMSubtreeModified', checkReviews);
  function checkReviews() {
    if (hasAPIKey() && window.location.href !== ('https://' + window.location.host + '/review/session')) {
      console.log('API key specified, getting reviews with key...');
      checkTimer = setInterval(function () {
        getReviewNumber();
        if (reviews > 0) {
          displayTitle();
          clearInterval(checkTimer);
        }
      }, (checkEvery * 60000));
    } else if (window.location.href == ('https://' + window.location.host + '/') || window.location.href == ('https://' + window.location.host + '/dashboard')) {
      if ($reviewElement.length > 0 && $reviewElement.html().indexOf('ago') >= 0 || $reviewElement.html().indexOf('Available Now') >= 0) {
        displayTitle();
      }
    }
  }
  function displayTitle() {
    console.log('Displaying reviews');
    titleAnimation = setInterval(function () {
      if (reviews !== 0) {
        document.title = '(' + reviews + ') ' + titleMessage;
      } else {
        document.title = titleMessage;
      }
      setTimeout(function () {
        document.title = previousWindowTitle;
      }, (speed * 1000) / 2);
    }, (speed * 1000));
  }
  function getReviewNumber() {
    console.log('Getting number of reviews');
    if (hasAPIKey()) {
      $.ajax({
        type: 'GET',
        url: 'https://www.wanikani.com/api/user/' + api_key + '/study-queue?callback=?',
        dataType: 'JSON',
        success: function (data) {
          if (typeof data.requested_information !== "undefined") {
            reviews = data.requested_information.reviews_available;
            console.log(reviews + ' reviews found.');
          } else {
            alert('WaniKani Notification: API key invalid. Please enter a valid API key');
            clearInterval(checkTimer);
          }
        }
      });
    }
  }
  function hasAPIKey() {
    return api_key !== 'YOUR_API_KEY';
  }
});
