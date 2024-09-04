"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

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

  return (
    <>
      <div className="mt-10 space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
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
                      placeholder="Lexus"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
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
                      placeholder="RX 350"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
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
                      placeholder="2024"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
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
