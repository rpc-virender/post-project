import React, { Suspense, useEffect ,useState} from 'react';
import L from 'leaflet';

import { reCenterIcon } from '../images/commonSvgs';
import { mapMarkerIcon, projectprops } from '../images/commonImages';
// import S from "./mapIcon.svg"

export default function MapPage({lat, lan, projName, pType}) {
    const [state,setState] = useState();

    let latD = 12.942146818890464;
    let lanD = 77.75722429638671;

    useEffect(()=>{
        var latlng = L.latLng(lat !== "" ? lat : latD, lan !== "" ? lan : lanD);

        var map = state != undefined && state.map != undefined ? state.map
            :
            L.map('newOneMap', {
                center: latlng,
                zoom: 14,
            }); 
        
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
        },300);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var markarIcon = L.icon({
            iconUrl: mapMarkerIcon,
            iconSize: [42, 59],
        });

        var marker0 = state != undefined && state.marker != undefined ? state.marker 
                : 
                L.marker(latlng, {icon: markarIcon}).addTo(map);

        marker0.setLatLng(latlng).update();

        var tooltip = L.tooltip(latlng, {
            direction: "top",
            permanent: true,
            className: 'newMapToolTip',
            content: `<p>${pType !== undefined && pType == projectprops.independent ? "Listing" : "Project"} you are exploring<br/><span>${projName.length > 30 ? `${projName.slice(0, 30)}...` : projName}</span></p>`
        });

        marker0.bindTooltip(tooltip);

        setState({map: map, marker: marker0, tooltip: tooltip });

    },[projName, lat, lan]);

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
                    <span>Re-Center</span> {reCenterIcon}
                </button>
                <div id="newOneMap" className='displayMapContainerClass'></div>
            </div>
        </Suspense>
    )
}