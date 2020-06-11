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
  getCommentsFromServlet();
  // Only load map on pages where the "map" div is present.
  if (document.getElementById('map') !== null) {
    loadMap();
  }
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

/**
 * Fetches the comments from the Java servlet to display
 */
async function getCommentsFromServlet() {
  const response = await fetch('/data');
  const commentData = await response.json();
  const comments = document.getElementById('comments-container');
  comments.innerHTML = '';
  commentData.forEach(comment => {
    comments.appendChild(createCommentDiv(comment))
    comments.appendChild(document.createElement('br'));
  });
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

function loadMap() {
  let script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key='
      + apiKey + '&callback=initMap';
  script.defer = true;
  script.async = true;

  // Attach the callback function to the `window` object
  // Executes once the API is loaded and available.
  window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.730610, lng: -73.935242},
      zoom: 12
    });

    // TODO: Retrieve list of names/addresses from back end.
    let address = "132 W 31st St, New York, NY 10001";
    placeMarker(address, "Ichiran Ramen", map);
  }

  document.head.appendChild(script);
}



// Uses the Geocoding API to get the Latitude/Longitude of an address,
// for use in placing markers.
// TODO: Possibly use Places API instead; couldn't get it working earlier.
function placeMarker(address, name, map) {
  let latLng = {};
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( {'address' : address}, function(results, status) {
    if (status == 'OK') {
      let location = results[0].geometry.location;
      latLng = {lat : location.lat(), lng: location.lng()};
      console.log(latLng);
      let marker = new google.maps.Marker({
        position: latLng,
        title: name,
        visible: true
      });
      marker.setMap(map);
    }
  });
}
