"use client";

//Map component Component from library
import { GoogleMap } from "@react-google-maps/api";

//Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "15px 0px 0px 15px",
};

const Map = () => {
  const defaultMapCenter = {
    lat: 34.0427325,
    lng: -118.277316,
  };
  const defaultMapZoom = 13;
  const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: "auto",
  };

  return (
    <>
      <style>
        {`
      .gm-style-iw-c {
        height: calc(100vh - 64px);
        width: calc(100vw - 72px);
      }
      `}
      </style>
      <div className="gm-style-iw-c absolute top-[64px] left-[72px]">
        <GoogleMap
          mapContainerStyle={defaultMapContainerStyle}
          center={defaultMapCenter}
          zoom={defaultMapZoom}
          options={defaultMapOptions}
        />
      </div>
    </>
  );
};

export { Map };
