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

/**
 * Fetches a greeting from the Java servlet to display
 */
async function getHello(){
  const response = await fetch('/data');
  const hello = await response.text();
  document.getElementById('hello-container').innerText = hello;

}
