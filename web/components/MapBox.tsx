"use client";

import { GeolocateControl, Map, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

//Map's styling
// export const defaultMapContainerStyle = {
//   width: "100%",
//   height: "100%",
//   borderRadius: "15px 0px 0px 15px",
// };

const MapBox = () => {
  // const defaultMapCenter = {
  //   lat: 34.0427325,
  //   lng: -118.277316,
  // };
  // const defaultMapZoom = 13;
  // const defaultMapOptions = {
  //   zoomControl: true,
  //   tilt: 0,
  //   gestureHandling: "auto",
  // };

  function getViewport() {
    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != "undefined") {
      (viewPortWidth = window.innerWidth),
        (viewPortHeight = window.innerHeight);
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (
      typeof document.documentElement != "undefined" &&
      typeof document.documentElement.clientWidth != "undefined" &&
      document.documentElement.clientWidth != 0
    ) {
      (viewPortWidth = document.documentElement.clientWidth),
        (viewPortHeight = document.documentElement.clientHeight);
    }

    // older versions of IE
    else {
      (viewPortWidth = document.getElementsByTagName("body")[0].clientWidth),
        (viewPortHeight =
          document.getElementsByTagName("body")[0].clientHeight);
    }
    return [viewPortWidth, viewPortHeight - 64];
  }

  return (
    <>
      <div className="w-full">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          initialViewState={{
            longitude: -118.277316,
            latitude: 34.0427325,
            zoom: 12,
          }}
          style={{ width: getViewport()[0], height: getViewport()[1] }}
          mapStyle="mapbox://styles/thedanielmark/cm0e8dvwt00vb01qs9uzz5r8o"
        >
          <GeolocateControl />
          <NavigationControl />
        </Map>

        {/* <Map
          // mapLib={import("mapbox-gl")}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          attributionControl={false}
          initialViewState={{
            latitude: 34.0427325,
            longitude: -118.277316,
            zoom: 15,
          }}
          style={{ height: 500 }}
          // mapStyle="mapbox://styles/mapbox/navigation-day-v1"
          // mapStyle="mapbox://styles/mapbox/streets-v9"
          mapStyle="mapbox://styles/thedanielmark/cm0e8dvwt00vb01qs9uzz5r8o"
          // className="relative map-container"
        >
          <GeolocateControl />
          <NavigationControl />
          {/* {markers.map((marker) => (
            <Marker
              key={`${marker.latitude}-${marker.longitude}`}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="bottom"
              onClick={() => {
                setPopUpData(marker);
                setShowPopUp(true);
              }}
            />
          ))} */}
        {/* {showPopUp && (
            <div className="absolute top-3 left-3 bg-white px-5 py-3 rounded-md shadow-lg border border-gray-100">
              <XMarkIcon
                className="h-6 w-6 text-gray-400 absolute top-3 right-3 cursor-pointer"
                aria-hidden="true"
                onClick={() => setShowPopUp(false)}
              />
              <div className="font-semibold text-gray-900 tracking-tight text-xl pr-8 max-w-lg">
                {PopUpData.address}
              </div>
              <div className="text-gray-500 text-sm">
                Owned by {PopUpData.firstName} {PopUpData.lastName}
              </div>

              <div className="mt-3 text-gray-500 text-sm">
                Latitude: {PopUpData.latitude}
              </div>
              <div className="mt-0 text-gray-500 text-sm">
                Longitude: {PopUpData.longitude}
              </div>

              <div className="mt-5 flex items-center gap-x-2 font-medium text-gray-500 text-lg">
                <Image
                  src="/logos/logo.png"
                  width={512}
                  height={512}
                  alt="Logo"
                  className="h-6 w-6"
                />
                <span>{PopUpData.chargerCapacity} kW Charging Station</span>
              </div>

              <div className="mt-8 mb-5">
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${PopUpData.latitude}%2C${PopUpData.longitude}`}
                  target="_blank"
                  passHref={true}
                  className="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Locate on Google Maps
                </Link>
              </div>
            </div>
          )}
        </Map> */}
      </div>
    </>
  );
};

export { MapBox };
