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
  const script = document.createElement('script');
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
    const query = "Ichiran";
    placeMarker(query, map);
  }

  document.head.appendChild(script);
}


/** Uses the Places API to find a place and place a marker there.*/
function placeMarker(query, map) {
  const request = {
    query: query,
    fields: ['name', 'geometry', 'formatted_address'],
  };

  const service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results[0]);
      const location = results[0].geometry.location;
      const latLng = {lat : location.lat(), lng: location.lng()};
      const marker = new google.maps.Marker({
        position: latLng,
        title: results[0].name,
        visible: true,
        map: map
      });
      const contentString = '<div class="info-window">' +
            '<h1>' + results[0].name+ '</h1>'+
            '<p>' + results[0].formatted_address + '</p>'
            '</div>';
      let infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 150
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    }
  });
}

