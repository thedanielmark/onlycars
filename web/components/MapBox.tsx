"use client";

import { useEffect, useState } from "react";
import { GeolocateControl, Map, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapBox = () => {
  const [viewport, setViewport] = useState([0, 0]);

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
    <div className="w-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        initialViewState={{
          longitude: -118.277316,
          latitude: 34.0427325,
          zoom: 12,
        }}
        style={{ width: viewport[0], height: viewport[1] }}
        mapStyle="mapbox://styles/thedanielmark/cm0e8dvwt00vb01qs9uzz5r8o"
      >
        <GeolocateControl />
        <NavigationControl />
      </Map>
    </div>
  );
};

export { MapBox };
