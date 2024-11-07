import React, { Suspense, useEffect ,useState} from 'react';
import L from 'leaflet';
import $ from 'jquery';
import { mapMarkerIcon } from '../images/commonImages';
import { reCenterIcon } from '../images/commonSvgs';
import { mapEl } from '../images/constant';

export default function MapLocationSearchBox({lat, lan, setBasicDetails, id}) {
    const [state,setState] = useState();

    let latD = 12.942146818890464;
    let lanD = 77.75722429638671;

    const getLocationByCoordinates = (lati, lang) => {
        // Construct the request URL for reverse geocoding
        var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lati + ',' + lang + '&key=AIzaSyAlRodCXfghtBJjDCXxzDBvdTTdo0toNNE';

        // Send a GET request to the Google Geocoding API
        fetch(geocodeUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Check if the response status is OK
            if (data.status === 'OK') {
            // Get the formatted address
            var formattedAddress = data.results[0].formatted_address;

            let index = formattedAddress.indexOf(" ");
            let finalAddress = formattedAddress.slice(index+1, formattedAddress.length)

            setBasicDetails((basicDetails) => ({
                ...basicDetails,
                address: finalAddress,
            }));

            $("#selectByLocation_2").val(finalAddress);
            } else {
            console.error('Reverse geocoding failed:', data.status);
            }
        })
        .catch(function(error) {
            console.error('Error fetching geocoding data:', error);
        });
    };

    useEffect(()=>{
        var latlng = L.latLng(lat !== "" ? lat : latD, lan !== "" ? lan : lanD);

        let mapStateFromStorage = mapEl.get("projectMap");

        if(mapStateFromStorage){
            mapStateFromStorage.remove();
        };

        let oldMap = state !== undefined && state.map !== undefined ? state.map : "";
        if(oldMap !== undefined && oldMap !== ""){
            oldMap.remove();
        }
            
        var map = L.map('newLocationOneMap', {
                center: latlng,
                zoom: 14,
            });

        if (!map) return;

        map.whenReady(() => {
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            map.getContainer().addEventListener('wheel', function (e) {
                e.preventDefault();
            }, { passive: false });
        
            // Optionally, disable scroll wheel zoom when the mouse leaves the map
            map.getContainer().addEventListener('mouseleave', function() {
                map.scrollWheelZoom.disable();
            });
        
            // Ensure the map captures focus on mouse enter
            map.getContainer().addEventListener('mouseenter', function() {
                map.scrollWheelZoom.enable();
            });
            
            map.setView(latlng, 14);

            setTimeout(()=>{
                map.invalidateSize();
            },200);

            var markarIcon = L.icon({
                iconUrl: mapMarkerIcon,
                iconSize: [42, 59], // size of the icon
            });

            var marker0 = state !== undefined && state.marker !== undefined ? state.marker 
                        : 
                        L.marker(latlng, {
                            icon: markarIcon,
                            draggable: true
                        }).addTo(map);

            marker0.setLatLng(latlng).update();

            // Define what happens when dragging ends
            marker0.on('dragend', function(event) {
                var marker = event.target; 
                var position = marker.getLatLng();

                getLocationByCoordinates(position.lat, position.lng);

                setBasicDetails((basicDetails) => ({
                    ...basicDetails,
                    latitude: position.lat,
                    longtitude: position.lng
                }));
            });

            mapEl.set("projectMap", map);

            setState({map: map, marker: marker0 });
        })
   
    },[lat,lan]);

    const getCenter = () =>{
        if(state && state.map ){
            state.map.invalidateSize();
            state.map.setView([lat !== "" ? lat : latD, lan !== "" ? lan : lanD], 100);
        }
    };

      
    return (
        <Suspense fallback={"Loading..."}>
            <div className='projectExistedMap'>
                <button 
                    className='recenterBtn' 
                    title='Re-Center' 
                    onClick={()=>getCenter()}
                >
                    <span className='recenterBtnSpanText'>Re-Center</span> {reCenterIcon}
                </button>

                <div id="newLocationOneMap" className='displayMapContainerClass'></div>
            </div>
        </Suspense>
    )
}