/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { GeolocateControl, Map, NavigationControl, Marker } from "react-map-gl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import "mapbox-gl/dist/mapbox-gl.css";
import { ICharger } from "@/utils/types/ICharger";

const MapBox = ({
  location,
  chargers,
}: {
  location: { latitude: number; longitude: number };
  chargers: Array<any>;
}) => {
  const [viewport, setViewport] = useState([0, 0]);
  // const [addressOnMap, setAddressOnMap] = useState(null);
  // const [markers, setMarkers] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [PopUpData, setPopUpData] = useState<ICharger>();

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

  // Sample markers
  const markers = [
    {
      firstName: "Daniel",
      lastName: "Mark",
      address: "Kilpauk, Chennai, Chennai, Tamil Nadu, India",
      latitude: 13.083215,
      longitude: 80.237986,
      chargerCapacity: "120",
      title:
        "New Charging Station At Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    },
    {
      firstName: "Daniel",
      lastName: "Mark",
      address:
        "Aspiran Garden Colony, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
      latitude: 13.085186,
      longitude: 80.237952,
      chargerCapacity: "150",
      title:
        "New Charging Station At Aspiran Garden Colony, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    },
    {
      firstName: "Fabian",
      lastName: "Ferno",
      address:
        "Mandapam Road, Aspiran Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
      latitude: 13.0845332,
      longitude: 80.2358215,
      chargerCapacity: "200",
      title:
        "New Charging Station At Mandapam Road, Aspiran Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    },
    {
      firstName: "Richard",
      lastName: "Hendricks",
      address:
        "Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
      latitude: 13.0849401,
      longitude: 80.2339489,
      chargerCapacity: "200",
      title:
        "New Charging Station At Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    },
  ];

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
          {chargers.map((charger: ICharger, index: number) => (
            <Marker
              key={index}
              longitude={charger.AddressInfo.Longitude}
              latitude={charger.AddressInfo.Latitude}
              anchor="bottom"
              onClick={() => {
                setPopUpData(charger);
                setShowPopUp(true);
              }}
              color="#0ea5e9"
            />
          ))}
          {showPopUp && (
            <div className="absolute top-3 left-3 bg-black px-5 py-3 rounded-md shadow-lg border border-zinc-800">
              <XMarkIcon
                className="h-6 w-6 text-zinc-400 absolute top-3 right-3 cursor-pointer"
                aria-hidden="true"
                onClick={() => setShowPopUp(false)}
              />
              {PopUpData?.AddressInfo.AddressLine1 && (
                <div className="font-semibold text-white tracking-tight text-xl pr-8 max-w-lg">
                  {PopUpData?.AddressInfo.AddressLine1}
                </div>
              )}
              {PopUpData?.AddressInfo.Title && (
                <div className="text-zinc-400 text-sm">
                  {PopUpData?.AddressInfo.Title}
                </div>
              )}

              <div className="my-3 border-b border-zinc-800" />

              <div className="font-medium text-zinc-200 text-sm">
                Charging Unit(s)
              </div>
              <div className="mt-2 flex items-center gap-x-2 font-medium text-zinc-500 text-sm">
                <img
                  src="/logo.png"
                  width={100}
                  height={100}
                  alt="Logo"
                  className="h-4 w-4"
                />
                <span>
                  {/* Print out all the connections here */}
                  {PopUpData?.Connections.map((connection) => (
                    <span key={connection.ID}>{connection.Level.Title}</span>
                  ))}
                </span>
              </div>

              <div className="my-3 border-b border-zinc-800" />

              <div className="font-medium text-zinc-200 text-base">Address</div>
              <table className="mt-1">
                <tbody>
                  {PopUpData?.AddressInfo.Town && (
                    <tr>
                      <td className="text-zinc-500 text-sm">Town</td>
                      <td className="text-zinc-200 text-sm pl-3">
                        {PopUpData?.AddressInfo.Town}
                      </td>
                    </tr>
                  )}
                  {PopUpData?.AddressInfo.StateOrProvince && (
                    <tr>
                      <td className="text-zinc-500 text-sm">State/Province</td>
                      <td className="text-zinc-200 text-sm pl-3">
                        {PopUpData?.AddressInfo.StateOrProvince}
                      </td>
                    </tr>
                  )}
                  {PopUpData?.AddressInfo.Postcode && (
                    <tr>
                      <td className="text-zinc-500 text-sm">Postcode</td>
                      <td className="text-zinc-200 text-sm pl-3">
                        {PopUpData?.AddressInfo.Postcode}
                      </td>
                    </tr>
                  )}
                  {PopUpData?.AddressInfo.Country.Title && (
                    <tr>
                      <td className="text-zinc-500 text-sm">Country</td>
                      <td className="text-zinc-200 text-sm pl-3">
                        {PopUpData?.AddressInfo.Country.Title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-8 mb-3">
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${PopUpData?.AddressInfo.Latitude}%2C${PopUpData?.AddressInfo.Longitude}`}
                  target="_blank"
                  passHref={true}
                  className="w-full block text-center rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Start Driving
                </Link>
              </div>
            </div>
          )}
        </Map>
      )}
    </div>
  );
};

export { MapBox };
