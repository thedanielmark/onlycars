/* eslint-disable @next/next/no-img-element */
"use client";

import { MapBox } from "@/components/MapBox";
import { useEffect, useState } from "react";
import useInput from "@/utils/useInput";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ICharger } from "@/utils/types/ICharger";
import { RotatingLines } from "react-loader-spinner";

interface ISuggestion {
  place_name: string;
  center: [number, number];
}

interface AddressComponent {
  types: string[];
  short_name: string;
}

interface ReverseGeocodeResponse {
  results: {
    address_components: AddressComponent[];
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}

interface Charger {
  AddressInfo: {
    Latitude: number;
    Longitude: number;
  };
}

const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to reverse geocode location.");
  }

  const data: ReverseGeocodeResponse = await response.json();
  const addressComponents = data.results[0].address_components;

  // console.log(data.results[0].geometry.location);

  const countryComponent = addressComponents.find((component) =>
    component.types.includes("country")
  );

  return countryComponent ? countryComponent.short_name : null;
};

const fetchChargersByCountry = async (
  countryCode: string
): Promise<Charger[]> => {
  const response = await fetch(
    `https://api.openchargemap.io/v3/poi/?output=json&countrycode=${countryCode}&maxresults=100&key=${process.env.NEXT_PUBLIC_OPEN_CHARGE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chargers.");
  }

  return response.json();
};

const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

function DashboardPage() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [PopUpData, setPopUpData] = useState<any>();
  const [goToLocation, setGoToLocation] = useState<[number, number] | null>(
    null
  );
  const customInput = useInput("");

  function handlePopUpData(data: any) {
    setPopUpData(data);
    console.log(data);
  }

  function handleShowPopUp() {
    setShowPopUp(true);
    console.log("Show Pop Up");
  }

  useEffect(() => {
    if (chargers.length > 0) {
      console.log("Chargers", chargers);
    }
  }, [chargers]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            const countryCode = await reverseGeocode(latitude, longitude);
            setCountryCode(countryCode);

            const chargers = countryCode
              ? await fetchChargersByCountry(countryCode)
              : [];

            const sortedChargers = chargers
              .map((charger) => ({
                ...charger,
                distance: getDistanceFromLatLonInKm(
                  latitude,
                  longitude,
                  charger.AddressInfo.Latitude,
                  charger.AddressInfo.Longitude
                ),
              }))
              .sort((a, b) => a.distance - b.distance);

            setChargers(sortedChargers);
          } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
          }
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div
      className="relative w-full h-full"
      style={{
        minHeight: "calc(-64px + 100vh)",
      }}
    >
      <div className="absolute w-96 top-0 left-0 m-3 p-3 bg-black rounded-xl overflow-hidden z-50">
        <input
          {...customInput}
          className="block w-full rounded-md border-0 py-1.5 bg-zinc-900 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          placeholder="Search for an address..."
        />
        {customInput.suggestions?.length > 0 && (
          <div className="mt-2 block w-full border-0 p-0 text-zinc-200 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6">
            {customInput.suggestions.map((suggestion: ISuggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  customInput.setValue(suggestion.place_name);
                  // Assume `setCenter` is defined elsewhere
                  // setCenter(suggestion.center);
                  setGoToLocation(suggestion.center);
                  console.log(suggestion.center);
                  customInput.setSuggestions([]);
                  setAddress(suggestion.place_name);
                  // setLocation(suggestion.place_name);
                }}
                className="px-2 py-2 hover:bg-sky-600 cursor-pointer rounded-sm"
              >
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}

        {showPopUp && (
          <div className="bg-black mt-5 px-2">
            <div className="flex items-start justify-between">
              <div>
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
              </div>

              <div className="h-6 w-6">
                <XMarkIcon
                  className="h-6 w-6 text-zinc-400 cursor-pointer"
                  aria-hidden="true"
                  onClick={() => setShowPopUp(false)}
                />
              </div>
            </div>

            <div className="my-3 border-b border-zinc-800" />

            <div className="font-medium text-zinc-200 text-sm">
              Charging Unit(s)
            </div>
            <div className="mt-2 flex items-center gap-x-2 font-medium text-zinc-200 text-sm">
              <img
                src="/logo.png"
                width={100}
                height={100}
                alt="Logo"
                className="h-4 w-4"
              />
              <div className="gap-y-1">
                {/* Print out all the connections here */}
                {PopUpData?.Connections.map((connection: any) => (
                  <span key={connection.ID}>{connection.Level.Title}</span>
                ))}
              </div>
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

            <div className="mt-8 mb-1">
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
      </div>

      {!location && chargers.length === 0 && (
        <div className="min-h-screen flex items-center justify-center gap-x-3">
          <RotatingLines
            visible={true}
            width="20"
            strokeColor="#ffffff"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
          <span className="font-medium">Finding EV chargers near you</span>
        </div>
      )}

      {location && chargers.length > 0 && (
        <MapBox
          location={location}
          chargers={chargers}
          goToLocation={goToLocation}
          sendPopUpData={handlePopUpData}
          sendShowPopUp={handleShowPopUp}
        />
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}

export default DashboardPage;
