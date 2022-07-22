"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">
        <i class="bi bi-star" >
        </i>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function generateFavoriteStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">
        <i class="bi bi-star-fill" >
        </i>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    let $story;
    if (currentUser.favorites.includes(story)){
      $story = generateFavoriteStoryMarkup(story);
    } else {
      $story = generateStoryMarkup(story);
    }
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Get data from the Submit form,
 * create {title, author, url} to call .addStory with current user
 * put story on the page */
async function submitStory() {

  const title = $("#create-title").val();
  const author = $("#create-author").val();
  const url = $("#create-url").val();
  const storyFormObj = { title, author, url };

  const makeStoryInstanceFromForm = await storyList.addStory(
    currentUser, storyFormObj
  );
  console.debug("story submitted");

  const $submittedStory = generateStoryMarkup(makeStoryInstanceFromForm);
  $allStoriesList.prepend($submittedStory);

}

$submitForm.on("submit", async function (evt) {
  await submitStory();
  hideSubmitForm();
});

async function favoriteStoryWithStar(evt) {
  let idOfTargetStory = evt.target.parentElement.parentElement.getAttribute("id");
  let targetedStory = storyList.stories.filter(story => (story.storyId === idOfTargetStory));
  await currentUser.addFavorite(targetedStory[0]);
};

async function unFavoriteWithStar(evt) {
  let idOfTargetStory = evt.target.parentElement.parentElement.getAttribute("id");
  let targetedStory = storyList.stories.filter(story => (story.storyId === idOfTargetStory));
  await currentUser.unFavorite(targetedStory[0]);
}

$(".stories-list").on("click", ".star", toggleFavoriteStar);

async function toggleFavoriteStar(evt) {
  let classOfTargetStar = evt.target.getAttribute("class");
  console.log(classOfTargetStar);
  if (classOfTargetStar === "bi bi-star") {
    evt.target.setAttribute("class", "bi bi-star-fill");
    await favoriteStoryWithStar(evt);
  }
  else {
    evt.target.setAttribute("class", "bi bi-star");
    await unFavoriteWithStar(evt);
  }
}

