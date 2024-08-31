/* eslint-disable @next/next/no-img-element */
"use client";

import { MapBox } from "@/components/MapBox";
import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export interface IGitHubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
}

// Function to reverse geocode and get the country code
const reverseGeocode = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to reverse geocode location.");
  }

  const data = await response.json();
  const addressComponents = data.results[0].address_components;

  const countryComponent = addressComponents.find(
    (component: { types: string | string[] }) =>
      component.types.includes("country")
  );

  return countryComponent ? countryComponent.short_name : null;
};

// Function to fetch chargers from OpenChargeMap API by country
const fetchChargersByCountry = async (countryCode: any) => {
  const response = await fetch(
    `https://api.openchargemap.io/v3/poi/?output=json&countrycode=${countryCode}&maxresults=100&key=${process.env.NEXT_PUBLIC_OPEN_CHARGE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chargers.");
  }

  const chargers = await response.json();
  return chargers;
};

// Function to calculate the distance between two coordinates using the Haversine formula
const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
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
  const distance = R * c; // Distance in km
  return distance;
};

function DashboardPage() {
  const [location, setLocation] = useState<any>(null);
  const [countryCode, setCountryCode] = useState(null);
  const [chargers, setChargers] = useState<any>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (chargers.length > 0) {
      console.log("Chargers", chargers);
    }
  }, [chargers]);

  // From
  const [gitHubProfile, setGitHubProfile] = useState<IGitHubProfile>();
  const [gitHubUsernameQuery, setGitHubUsernameQuery] = useState("");
  const [gitHubProfilesList, setGitHubProfilesList] = useState([]);
  const [filteredGitHubProfiles, setFilteredGitHubProfiles] = useState([]);

  useEffect(() => {
    if (gitHubProfilesList.length > 0) {
      const filteredGitHubProfilesTemp = gitHubProfilesList.filter(
        (githubProfile: { login: string }) => {
          return githubProfile.login
            .toLowerCase()
            .includes(gitHubUsernameQuery.toLowerCase());
        }
      );

      // eslint-disable-next-line no-console
      console.log("Filtered GitHub Profiles: ", filteredGitHubProfilesTemp);
      setFilteredGitHubProfiles(filteredGitHubProfilesTemp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gitHubProfilesList]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      async function getUsers() {
        fetch(`/api/github-search?username=${gitHubUsernameQuery}`).then(
          (response) => {
            response.json().then((data) => {
              setGitHubProfilesList(data.results);
            });
          }
        );
      }
      if (gitHubUsernameQuery) getUsers();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [gitHubUsernameQuery]);

  // Getting current user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // setLocation({ latitude, longitude });

          // Setting the location to Los Angeles for demo purposes
          setLocation({ latitude: 33.8852882, longitude: -117.9787195 });

          try {
            // Reverse geocode to get the country code
            // TODO: Uncomment this for production
            // const countryCode = await reverseGeocode(latitude, longitude);
            // setCountryCode(countryCode);

            // Fetch chargers by country code
            // TODO: Uncomment this for production
            // const chargers = await fetchChargersByCountry(countryCode);
            // TODO: Comment this out for production. We're setting the country to USA for demo purposes
            const chargers = await fetchChargersByCountry("US");

            // Sort chargers by distance from current location
            const sortedChargers = chargers
              .map(
                (charger: {
                  AddressInfo: { Latitude: number; Longitude: number };
                }) => ({
                  ...charger,
                  distance: getDistanceFromLatLonInKm(
                    latitude,
                    longitude,
                    charger.AddressInfo.Latitude,
                    charger.AddressInfo.Longitude
                  ),
                })
              )
              .sort(
                (a: { distance: number }, b: { distance: number }) =>
                  a.distance - b.distance
              );

            setChargers(sortedChargers);
          } catch (err) {
            // setError(err.message);
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
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //         });
  //         console.log(
  //           `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`
  //         );
  //       },
  //       (error) => {
  //         setError(error.message);
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  return (
    <div className="relative">
      {/* <div className="absolute m-3 bg-zinc-900/70 rounded-xl overflow-hidden z-50">
        <div className="max-w-3xl p-5 bg-black shadow-lg">
          <div className="w-full">
            <Combobox
              as="div"
              value={gitHubProfile}
              onChange={(selectedGitHubProfile) => {
                setGitHubUsernameQuery("");
                setGitHubProfile(selectedGitHubProfile ?? undefined);
              }}
            >
              <div className="relative">
                <ComboboxInput
                  className="w-full rounded-md border-0 bg-zinc-900 py-1.5 pl-3 pr-12 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  onChange={(event) =>
                    setGitHubUsernameQuery(event.target.value)
                  }
                  onBlur={() => setGitHubUsernameQuery("")}
                  displayValue={(gitHubUser: { login?: string }) =>
                    gitHubUser?.login || ""
                  }
                  placeholder="Type to search"
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-zinc-400"
                    aria-hidden="true"
                  />
                </ComboboxButton>

                {filteredGitHubProfiles.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredGitHubProfiles.map(
                      (gitHubProfile: IGitHubProfile) => (
                        <ComboboxOption
                          key={gitHubProfile.id}
                          value={gitHubProfile}
                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-900 data-[focus]:bg-purple-600 data-[focus]:text-white"
                        >
                          <div className="flex items-center">
                            <img
                              src={gitHubProfile.avatar_url}
                              alt=""
                              className="h-6 w-6 flex-shrink-0 rounded-full"
                            />
                            <span className="ml-3 truncate group-data-[selected]:font-semibold">
                              {gitHubProfile.login}
                            </span>
                          </div>

                          <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-purple-600 group-data-[selected]:flex group-data-[focus]:text-white">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </ComboboxOption>
                      )
                    )}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
          </div>
        </div>
      </div> */}

      {/* Conditionally render the MapBox component only when location is set */}
      {location && chargers.length > 0 && (
        <MapBox location={location} chargers={chargers} />
      )}

      {/* Optionally, show an error message if there was an issue fetching the location */}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}

export default DashboardPage;
