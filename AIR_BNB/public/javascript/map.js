mapboxgl.accessToken = mapToken;// this mapToken  is coming from views\listings\listings.ejs lin no. 2 as we cant access the process.env directly in the public folder
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());

    const marker=new mapboxgl.Marker({color:"red"})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h3>HEllo world</h3>")) 
    // the offset is saying that popup the message after a distance of 25 pxels from the location
    
    .addTo(map)
