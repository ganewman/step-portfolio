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

function loadMap() {
  let script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key='
      + apiKey + '&callback=initMap&libraries=places';
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
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( {'address' : address}, function(results, status) {
    if (status == 'OK') {
      let location = results[0].geometry.location;
      let latLng = {lat : location.lat(), lng: location.lng()};
      let marker = new google.maps.Marker({
        position: latLng,
        title: name,
        visible: true
      });
      marker.setMap(map);
    }
  });
}

