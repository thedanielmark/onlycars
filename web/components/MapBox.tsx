/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  GeolocateControl,
  Map,
  NavigationControl,
  Marker,
  useMap,
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { ICharger } from "@/utils/types/ICharger";

function GoToAddress() {
  const { current: map } = useMap();

  const onClick = () => {
    if (map) {
      map.flyTo({ center: [-122.4, 37.8] });
    }
  };

  return (
    <button className="z-50 m-12" onClick={onClick}>
      Go to Location
    </button>
  );
}

const MapBox = ({
  location,
  chargers,
  setPopUpData,
  setShowPopUp,
}: {
  location: { latitude: number; longitude: number };
  chargers: Array<any>;
  setPopUpData: any;
  setShowPopUp: any;
}) => {
  const [viewport, setViewport] = useState([0, 0]);
  // const [addressOnMap, setAddressOnMap] = useState(null);
  // const [markers, setMarkers] = useState([]);

  const sendPopUpData = (data: ICharger) => {
    setPopUpData(data);
  };

  const sendShowPopUp = () => {
    setShowPopUp(true);
  };

  // Use effect to get the viewport dimensions
  useEffect(() => {
    function getViewport() {
      let viewPortWidth;
      let viewPortHeight;
      if (typeof window !== "undefined") {
        viewPortWidth = window.innerWidth;
        viewPortHeight = window.innerHeight - 64; // Adjust for any header/footer
        setViewport([viewPortWidth, viewPortHeight]);
      }
    }

    getViewport();

    // Optionally, add a listener for window resize
    window.addEventListener("resize", getViewport);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", getViewport);
    };
  }, []);

  if (viewport[0] === 0 && viewport[1] === 0) {
    // Return null or a loading indicator while the viewport is being calculated
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      {location && (
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          attributionControl={false}
          initialViewState={{
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 8,
          }}
          style={{ width: viewport[0], height: viewport[1] }}
          mapStyle="mapbox://styles/thedanielmark/cm0e8dvwt00vb01qs9uzz5r8o"
        >
          {console.log(location.latitude, location.longitude)}
          <GeolocateControl />
          <NavigationControl />
          <GoToAddress />
          {chargers.map((charger: ICharger, index: number) => (
            <Marker
              key={index}
              longitude={charger.AddressInfo.Longitude}
              latitude={charger.AddressInfo.Latitude}
              anchor="bottom"
              onClick={() => {
                sendPopUpData(charger);
                sendShowPopUp();
              }}
              color="#0ea5e9"
            />
          ))}
        </Map>
      )}
    </div>
  );
};

export { MapBox };
