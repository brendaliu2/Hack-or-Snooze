"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */



function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function showSubmitForm(){
  $submitForm.show();
}

$navSubmitStory.on("click", showSubmitForm);

function hideSubmitForm(){
  $submitForm.hide();
}
//toggle for the last two functions

function showFavoritesList (){
  $favoriteStoriesList.show();
}

$navFavorites.on('click', function (e) {
  hidePageComponents();
  showFavoritesList();
  $favoriteStoriesList.empty();
  currentUser.postFavoriteStories(currentUser.favorites);
})