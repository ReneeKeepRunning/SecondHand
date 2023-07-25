mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'showMap', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: foundproduct.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(foundproduct.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${foundproduct.title}</h3><p>${foundproduct.location}</p>`
        )
    )
    .addTo(map)