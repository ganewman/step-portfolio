// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Loads the comments on every page without having to redundantly specify in HTML.
window.onload = function() {
  loadCommonFeatures();
  // Only load map on pages where the "map" div is present.
  if (document.getElementById('map') !== null) {
    loadMap();
  }
}

/** 
 * Loads HTML features which are common to all pages of the website.
 * TODO: Possibly find a way to do this which doesn't rebuild all of these
 * HTML elements each time the page refreshes (there is sometimes lag now).
 */
function loadCommonFeatures() {
  loadSidebar();
  loadCommentForm();
  loadCommentHistory();
}

/** Generates the HTML for the navigation bar. */
function loadSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';
  sidebar.appendChild(createLink('Home', '/index.html'));
  sidebar.appendChild(document.createElement('br'));
  sidebar.appendChild(createLink('About Me', '/about.html'));
  sidebar.appendChild(document.createElement('br'));
  sidebar.appendChild(createLink('Gallery', '/gallery.html'));
  sidebar.appendChild(document.createElement('br'));
  sidebar.appendChild(createLink('Hobbies', '/hobbies.html'));
}

/** Generates the HTML for the form where users input comments. */
function loadCommentForm() {
  const commentForm = document.getElementById("comments-form-container");
  const header = document.createElement('h3');
  header.innerText = "Comments";
  commentForm.appendChild(header);
  const form = document.createElement('form');
  form.action = '/data';
  form.method = 'POST';
  form.append('Name:');
  form.appendChild(document.createElement('br'));
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name-input';
  form.appendChild(nameInput);
  form.appendChild(document.createElement('br'));
  form.appendChild(document.createElement('br'));
  form.append('Comment:');
  form.appendChild(document.createElement('br'));
  const commentInput = document.createElement('textarea');
  commentInput.name = 'comment-input';
  form.appendChild(commentInput);
  const pageName = document.createElement('input');
  pageName.type = 'hidden';
  pageName.name = 'page-name';
  pageName.value = getCurrentPageName();
  console.log(pageName.value);
  form.appendChild(pageName);
  form.appendChild(document.createElement('br'));
  form.appendChild(document.createElement('br'));
  const submit = document.createElement('input');
  submit.type = 'submit';
  form.appendChild(submit);
  commentForm.appendChild(form);
}

/**
 * Fetches the comments from the Java servlet to display.
 */
async function loadCommentHistory() {
  const response = await fetch('/data');
  const commentData = await response.json();
  console.log(commentData);
  const comments = document.getElementById('comments-container');
  comments.innerHTML = '';
  commentData.forEach(comment => {
    comments.appendChild(createCommentDiv(comment))
    comments.appendChild(document.createElement('br'));
  });
}


/**
 * Adds a random fun fact to the page.
 */
function addRandomFact() {
  const facts =
      [`Gabi is an Israeli citizen`, `Gabi studied Japanese in high school
      and speaks it at a beginner level`, `Gabi is from Brooklyn, New York`, 
      `Gabi has a cat named Scout, who sadly does not currently live with her`,
      `Gabi has always wanted to visit Japan`, `Gabi's first programming
      language was Lisp/Scheme`, `Gabi's middle name, Leah, is mispelled
      on her birth certificate`];

  // Pick a random fact.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = fact; 
}

/** 
 * Picks a caption to display depending on the image clicked
 */
function displayCaption(img) {
  const id = img.id;
  const imageFacts = 
  {
	  'chinese-phoenix': `This technically isn't finished yet! A lot of outlining
        still needs to be added`,
    'gothic-cat': `This piece is a special type of embroidery called 
        'Blackwork'.`,
    'headshot': `This picture was taken in my living room with a
        phone camera.`,
    'mit-latin': `This picture was taken at the biggest collegiate competition
        of the year: MIT Open!`,
    'scout-sitting': `I love him, but this cat is totally evil.`,
    'scout-window': `Scout turned four years old this year!`,
    'selfie': `I'm pretty sure this was originally a Snapchat.`,
    'tufts-standard': `That's me with my dance partner, Cho, who graduated this
        year. :( We took this picture because we thought it'd be funny.`
  }
  const caption = imageFacts[id];
  const captionContainer = document.getElementById('caption-container');
  captionContainer.innerText = "Fun fact: " + caption;
}


function createCommentDiv(commentObj) {
  const commentDiv = document.createElement('div');
  commentDiv.className = "comment";

  const nameElement = document.createElement('h4');
  nameElement.innerText = commentObj.name;
  nameElement.className = "tooltip";
  const toolTipElement = document.createElement('span');
  toolTipElement.className = "tooltip-text";
  toolTipElement.innerText = commentObj.time;
  nameElement.appendChild(toolTipElement);
  commentDiv.appendChild(nameElement);

  const contentElement = document.createElement('p');
  contentElement.innerText = commentObj.content;
  commentDiv.appendChild(contentElement);

  // TODO: Convert from fairly useless MS time to hour/minute.

  return commentDiv;
}

function createLink(text, url) {
  let link = document.createElement('a');
  link.href = url;
  link.text = text;
  return link;
}

function getCurrentPageName() {
  const url = document.URL;
  let retStr = '/index.html';
  // Do not include index in list, as it is the default.
  const pages = ['/about.html', '/gallery.html', '/hobbies.html'];
  pages.forEach((page) => {
    if (url.includes(page)) {
      retStr = page;
    }
  });
  return retStr;
}
