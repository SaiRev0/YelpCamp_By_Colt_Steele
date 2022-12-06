mapboxgl.accessToken = "pk.eyJ1IjoiYW1pdHNoYXJtYTUxMiIsImEiOiJjbGJhYjIwbGExMzlhM3BxaGc3OXY3aHR6In0.JT5HsrUk1nmI12_E63D99g" ;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates , // starting position [lng, lat]
    zoom: 9, // starting zoom
    });

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset : 25})
        .setHTML(
            `<h3>${campground.title}</h3><p>${campground.Location}</p>`
        )
    )
    .addTo(map)