/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { connect } from "http2";

const chargersList = [
  {
    id: 1,
    type: "Rapid Charger",
    time: "Will take approximately 30 minutes to charge.",
    wattage: "~ Up to 3.6kW",
  },
  {
    id: 2,
    type: "Fast Charger",
    time: "Will take approximately 3-4 hours to charge.",
    wattage: "~ 7 - 22kW",
  },
  {
    id: 3,
    type: "Slow Charger",
    time: "Will take approximately 6-12 hours to charge.",
    wattage: "~ 43 - 50kW",
  },
];

const rapidConnectorsList = [
  {
    id: 1,
    type: "Type 2",
    pins: "7 pin",
    wattage: "43kW AC",
  },
  {
    id: 2,
    type: "CHAdemo",
    pins: "4 pin",
    wattage: "50kW DC",
  },
  {
    id: 3,
    type: "CCS",
    pins: "N/A",
    wattage: "50kW",
  },
];

const fastConnectorsList = [
  {
    id: 1,
    type: "Type 1",
    pins: "5 pin",
    wattage: "22kW",
  },
  {
    id: 2,
    type: "Type 2",
    pins: "7 pin",
    wattage: "22kW",
  },
];

const slowConnectorsList = [
  {
    id: 1,
    type: "Standard Plug",
    pins: "3 pin",
    wattage: "N/A",
  },
  {
    id: 2,
    type: "Type 1",
    pins: "5 pin",
    wattage: "3kW",
  },
  {
    id: 3,
    type: "Type 2",
    pins: "7 pin",
    wattage: "3kw",
  },
];

function RegisterVehiclePage() {
  const [selectedChargersList, setSelectedChargersList] = useState(
    chargersList[0]
  );
  const [selectedRapidConnectorsList, setSelectedRapidConnectorsList] =
    useState(rapidConnectorsList[0]);
  const [selectedFastConnectorsList, setSelectedFastConnectorsList] = useState(
    fastConnectorsList[0]
  );
  const [selectedSlowConnectorsList, setSelectedSlowConnectorsList] = useState(
    slowConnectorsList[0]
  );
  const [inputs, setInputs] = useState<any>({
    deviceDefinitionId: "",
    make: "",
    model: "",
    year: "",
    chargerType: selectedChargersList.type,
    connectorType: selectedRapidConnectorsList.type,
  });
  const [vehicleProfile, setVehicleProfile] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vehiclesList, setVehiclesList] = useState([]);
  const [filteredVehicleProfiles, setFilteredVehicleProfiles] = useState([]);

  useEffect(() => {
    if (vehiclesList.length > 0) {
      const filteredVehicleProfilesTemp = vehiclesList.filter(
        (vehicleProfile: { id: string }) => {
          return vehicleProfile.id
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
      );

      // eslint-disable-next-line no-console
      console.log("Filtered Vehicle Profiles: ", filteredVehicleProfilesTemp);
      setFilteredVehicleProfiles(filteredVehicleProfilesTemp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiclesList]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      async function getUsers() {
        fetch(
          `${process.env.NEXT_PUBLIC_DIMO_API_URL}/device-definitions/search?query=${searchQuery}`
        ).then((response) => {
          response.json().then((data) => {
            setVehiclesList(data.deviceDefinitions);
          });
        });
      }
      if (searchQuery) getUsers();
    }, 0.5);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    console.log(searchQuery);
    console.log(inputs);
  }, [searchQuery, inputs]);

  // Setting the make, model and year of the vehicle based on the selected vehicle profile
  useEffect(() => {
    if (vehicleProfile) {
      setInputs({
        ...inputs,
        deviceDefinitionId: vehicleProfile.legacy_ksuid,
        make: vehicleProfile.make,
        model: vehicleProfile.model,
        year: vehicleProfile.year,
      });
      // eslint-disable-next-line no-console
      console.log("Selected Vehicle Profile: ", vehicleProfile);
    }
  }, [vehicleProfile]);

  return (
    <>
      <div className="my-10 space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
        <form action="#" method="POST">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-zinc-900/70 border border-zinc-800 px-4 py-6 sm:p-6 overflow-hidden">
              <div>
                <h3 className="text-base font-semibold leading-6 text-white">
                  Vehicle Information
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Name start */}
                <div className="col-span-3 sm:col-span-3">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      A Friendly Name For Your Vehicle
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Danny's Lexus RX 350"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {/* Name end */}

                {/* Search start */}
                <div className="col-span-3 sm:col-span-3">
                  <Combobox
                    as="div"
                    className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600"
                    value={vehicleProfile}
                    onChange={(selectedVehicleProfile) => {
                      setSearchQuery("");
                      setVehicleProfile(selectedVehicleProfile ?? undefined);
                    }}
                  >
                    <Label className="block text-xs font-medium text-zinc-200">
                      Enter the make or model of your vehicle
                    </Label>
                    <div className="relative mt-2">
                      <ComboboxInput
                        className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                        onChange={(event) => setSearchQuery(event.target.value)}
                        onBlur={() => setSearchQuery("")}
                        displayValue={(vehicle: { name?: string }) =>
                          vehicle?.name || ""
                        }
                        placeholder="Nissan X-Trail 2024"
                      />
                      <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <MagnifyingGlassIcon
                          className="h-5 w-5 text-zinc-400"
                          aria-hidden="true"
                        />
                      </ComboboxButton>

                      {filteredVehicleProfiles.length > 0 && (
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredVehicleProfiles.map(
                            (vehicleProfile: any) => (
                              <ComboboxOption
                                key={vehicleProfile.id}
                                value={vehicleProfile}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-200 data-[focus]:bg-sky-600 data-[focus]:text-white"
                              >
                                <div className="flex items-center">
                                  {vehicleProfile.imageUrl ? (
                                    <img
                                      src={vehicleProfile.imageUrl}
                                      alt=""
                                      className="h-6 w-6 flex-shrink-0 rounded-full"
                                    />
                                  ) : (
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-500">
                                      <span className="font-medium leading-none text-white text-xs">
                                        {`${vehicleProfile.make.charAt(
                                          0
                                        )}${vehicleProfile.model.charAt(0)}`}
                                      </span>
                                    </span>
                                  )}
                                  <span className="ml-3 truncate group-data-[selected]:font-semibold">
                                    {vehicleProfile.name}
                                  </span>
                                </div>

                                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-sky-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              </ComboboxOption>
                            )
                          )}
                        </ComboboxOptions>
                      )}
                    </div>
                  </Combobox>
                </div>
                {/* Search end */}

                {/* Make start */}
                <div className="col-span-3 sm:col-span-1">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Vehicle Make
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={inputs.make || ""}
                      disabled={true}
                      placeholder="Lexus"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Make end */}
                {/* Model start */}
                <div className="col-span-3 sm:col-span-1">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Vehicle Model
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={inputs.model || ""}
                      disabled={true}
                      placeholder="RX 350"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Model end */}
                {/* Year start */}
                <div className="col-span-3 sm:col-span-1">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Model Year
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={inputs.year || ""}
                      disabled={true}
                      placeholder="2024"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Year end */}
                {/* Charger type start */}
                <div className="col-span-3 sm:col-span-3">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-white">
                      What type of charger does your vehicle use?
                    </legend>
                    <RadioGroup
                      value={selectedChargersList}
                      onChange={setSelectedChargersList}
                      className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
                    >
                      {chargersList.map((charger) => (
                        <Radio
                          key={charger.id}
                          value={charger}
                          aria-label={charger.type}
                          className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none data-[focus]:border-sky-600 data-[focus]:ring-2 data-[focus]:ring-sky-600"
                        >
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <span className="block text-sm font-medium text-white">
                                {charger.type}
                              </span>
                              <span className="mt-1 flex items-center text-sm text-zinc-400">
                                {charger.time}
                              </span>
                              <span className="mt-3 text-sm font-medium text-zinc-200">
                                {charger.wattage}
                              </span>
                            </span>
                          </span>
                          <CheckCircleIcon
                            aria-hidden="true"
                            className="h-5 w-5 text-sky-600 [.group:not([data-checked])_&]:invisible"
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-sky-600"
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>
                {/* Charger type end */}

                {/* Rapid Connectors Start */}
                {selectedChargersList.id === 1 && (
                  <div className="col-span-3 sm:col-span-3">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-white">
                        What type of connector does your vehicle use?
                      </legend>
                      <RadioGroup
                        value={selectedRapidConnectorsList}
                        onChange={setSelectedRapidConnectorsList}
                        className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
                      >
                        {rapidConnectorsList.map((rapidConnector) => (
                          <Radio
                            key={rapidConnector.id}
                            value={rapidConnector}
                            aria-label={rapidConnector.type}
                            className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none data-[focus]:border-sky-600 data-[focus]:ring-2 data-[focus]:ring-sky-600"
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className="block text-sm font-medium text-white">
                                  {rapidConnector.type}
                                </span>
                                <span className="mt-1 flex items-center text-sm text-zinc-400">
                                  {rapidConnector.pins}
                                </span>
                                <span className="mt-3 text-sm font-medium text-zinc-200">
                                  {rapidConnector.wattage}
                                </span>
                              </span>
                            </span>
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-sky-600 [.group:not([data-checked])_&]:invisible"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-sky-600"
                            />
                          </Radio>
                        ))}
                      </RadioGroup>
                    </fieldset>
                  </div>
                )}
                {/* Rapid Connectors end */}

                {/* Fast Connectors Start */}
                {selectedChargersList.id === 2 && (
                  <div className="col-span-3 sm:col-span-3">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-white">
                        What type of connector does your vehicle use?
                      </legend>
                      <RadioGroup
                        value={selectedFastConnectorsList}
                        onChange={setSelectedFastConnectorsList}
                        className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
                      >
                        {fastConnectorsList.map((fastConnector) => (
                          <Radio
                            key={fastConnector.id}
                            value={fastConnector}
                            aria-label={fastConnector.type}
                            className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none data-[focus]:border-sky-600 data-[focus]:ring-2 data-[focus]:ring-sky-600"
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className="block text-sm font-medium text-white">
                                  {fastConnector.type}
                                </span>
                                <span className="mt-1 flex items-center text-sm text-zinc-400">
                                  {fastConnector.pins}
                                </span>
                                <span className="mt-3 text-sm font-medium text-zinc-200">
                                  {fastConnector.wattage}
                                </span>
                              </span>
                            </span>
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-sky-600 [.group:not([data-checked])_&]:invisible"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-sky-600"
                            />
                          </Radio>
                        ))}
                      </RadioGroup>
                    </fieldset>
                  </div>
                )}
                {/* Fast Connectors end */}

                {/* Slow Connectors Start */}
                {selectedChargersList.id === 3 && (
                  <div className="col-span-3 sm:col-span-3">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-white">
                        What type of connector does your vehicle use?
                      </legend>
                      <RadioGroup
                        value={selectedSlowConnectorsList}
                        onChange={setSelectedSlowConnectorsList}
                        className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
                      >
                        {slowConnectorsList.map((slowConnector) => (
                          <Radio
                            key={slowConnector.id}
                            value={slowConnector}
                            aria-label={slowConnector.type}
                            className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none data-[focus]:border-sky-600 data-[focus]:ring-2 data-[focus]:ring-sky-600"
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className="block text-sm font-medium text-white">
                                  {slowConnector.type}
                                </span>
                                <span className="mt-1 flex items-center text-sm text-zinc-400">
                                  {slowConnector.pins}
                                </span>
                                <span className="mt-3 text-sm font-medium text-zinc-200">
                                  {slowConnector.wattage}
                                </span>
                              </span>
                            </span>
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-sky-600 [.group:not([data-checked])_&]:invisible"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-sky-600"
                            />
                          </Radio>
                        ))}
                      </RadioGroup>
                    </fieldset>
                  </div>
                )}
                {/* Slow Connectors end */}
              </div>
            </div>
            <div className="bg-zinc-800/70 px-4 py-3 text-right sm:px-6 border border-zinc-800">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Register Vehicle
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterVehiclePage;
