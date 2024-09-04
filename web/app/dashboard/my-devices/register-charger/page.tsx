"use client";

import { useState } from "react";
import { Checkbox } from "@headlessui/react";
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

function RegisterChargerPage() {
  const [selectedChargersList, setSelectedChargersList] = useState<any>([]);
  const [selectedRapidConnectorsList, setSelectedRapidConnectorsList] =
    useState<any>([]);
  const [selectedFastConnectorsList, setSelectedFastConnectorsList] =
    useState<any>([]);
  const [selectedSlowConnectorsList, setSelectedSlowConnectorsList] =
    useState<any>([]);

  const handleChargerChange = (charger: {
    id: number;
    type: string;
    time: string;
    wattage: string;
  }) => {
    setSelectedChargersList(
      (prev: { id: number; type: string; time: string; wattage: string }[]) =>
        prev.includes(charger)
          ? prev.filter((c) => c !== charger)
          : [...prev, charger]
    );
  };

  const handleConnectorChange = (
    connectorList: { id: number; type: string; pins: string; wattage: string },
    setConnectorList: {
      (value: any): void;
      (value: any): void;
      (value: any): void;
      (arg0: (prev: any[]) => any[]): void;
    },
    connector: { id: number; type: string; pins: string; wattage: string }
  ) => {
    setConnectorList((prev: any[]) =>
      prev.includes(connector)
        ? prev.filter((c) => c !== connector)
        : [...prev, connector]
    );
  };

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
                      htmlFor="make"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Vehicle Make
                    </label>
                    <input
                      id="make"
                      name="make"
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
                      htmlFor="model"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Vehicle Model
                    </label>
                    <input
                      id="model"
                      name="model"
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
                      htmlFor="year"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Model Year
                    </label>
                    <input
                      id="year"
                      name="year"
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
                    <div className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                      {chargersList.map((charger) => (
                        <Checkbox
                          key={charger.id}
                          checked={selectedChargersList.includes(charger)}
                          onChange={() => handleChargerChange(charger)}
                          aria-label={charger.type}
                          className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none"
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
                            className={`h-5 w-5 text-sky-600 ${
                              selectedChargersList.includes(charger)
                                ? ""
                                : "invisible"
                            }`}
                          />
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${
                              selectedChargersList.includes(charger)
                                ? "border-sky-600"
                                : "border-transparent"
                            }`}
                          />
                        </Checkbox>
                      ))}
                    </div>
                  </fieldset>
                </div>
                {/* Charger type end */}

                {/* Rapid Connectors start */}
                {selectedChargersList.some(
                  (charger: { type: string }) =>
                    charger.type === "Rapid Charger"
                ) && (
                  <div className="col-span-3 sm:col-span-3">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-white">
                        Rapid Charger Connectors
                      </legend>
                      <div className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                        {rapidConnectorsList.map((connector) => (
                          <Checkbox
                            key={connector.id}
                            checked={selectedRapidConnectorsList.includes(
                              connector
                            )}
                            onChange={() =>
                              handleConnectorChange(
                                connector,
                                setSelectedRapidConnectorsList,
                                connector
                              )
                            }
                            aria-label={connector.type}
                            className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none"
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className="block text-sm font-medium text-white">
                                  {connector.type}
                                </span>
                                <span className="mt-1 flex items-center text-sm text-zinc-400">
                                  {connector.pins}
                                </span>
                                <span className="mt-3 text-sm font-medium text-zinc-200">
                                  {connector.wattage}
                                </span>
                              </span>
                            </span>
                            <CheckCircleIcon
                              aria-hidden="true"
                              className={`h-5 w-5 text-sky-600 ${
                                selectedRapidConnectorsList.includes(connector)
                                  ? ""
                                  : "invisible"
                              }`}
                            />
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${
                                selectedRapidConnectorsList.includes(connector)
                                  ? "border-sky-600"
                                  : "border-transparent"
                              }`}
                            />
                          </Checkbox>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}
                {/* Rapid Connectors end */}

                {/* Fast Connectors start */}
                {selectedChargersList.some(
                  (charger: { type: string }) => charger.type === "Fast Charger"
                ) && (
                  <div className="col-span-3 sm:col-span-3">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-white">
                        Fast Charger Connectors
                      </legend>
                      <div className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                        {fastConnectorsList.map((connector) => (
                          <Checkbox
                            key={connector.id}
                            checked={selectedFastConnectorsList.includes(
                              connector
                            )}
                            onChange={() =>
                              handleConnectorChange(
                                connector,
                                setSelectedFastConnectorsList,
                                connector
                              )
                            }
                            aria-label={connector.type}
                            className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none"
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className="block text-sm font-medium text-white">
                                  {connector.type}
                                </span>
                                <span className="mt-1 flex items-center text-sm text-zinc-400">
                                  {connector.pins}
                                </span>
                                <span className="mt-3 text-sm font-medium text-zinc-200">
                                  {connector.wattage}
                                </span>
                              </span>
                            </span>
                            <CheckCircleIcon
                              aria-hidden="true"
                              className={`h-5 w-5 text-sky-600 ${
                                selectedFastConnectorsList.includes(connector)
                                  ? ""
                                  : "invisible"
                              }`}
                            />
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${
                                selectedFastConnectorsList.includes(connector)
                                  ? "border-sky-600"
                                  : "border-transparent"
                              }`}
                            />
                          </Checkbox>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}
                {/* Fast Connectors end */}

                {/* Slow Connectors start */}
                {selectedChargersList.some(
                  (charger: { type: string }) => charger.type === "Slow Charger"
                ) && (
                  <div className="col-span-3 sm:col-span-3">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-white">
                        Slow Charger Connectors
                      </legend>
                      <div className="mt-3 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                        {slowConnectorsList.map((connector) => (
                          <Checkbox
                            key={connector.id}
                            checked={selectedSlowConnectorsList.includes(
                              connector
                            )}
                            onChange={() =>
                              handleConnectorChange(
                                connector,
                                setSelectedSlowConnectorsList,
                                connector
                              )
                            }
                            aria-label={connector.type}
                            className="group relative flex cursor-pointer rounded-lg border border-zinc-800 bg-black p-4 shadow-sm focus:outline-none"
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className="block text-sm font-medium text-white">
                                  {connector.type}
                                </span>
                                <span className="mt-1 flex items-center text-sm text-zinc-400">
                                  {connector.pins}
                                </span>
                                <span className="mt-3 text-sm font-medium text-zinc-200">
                                  {connector.wattage}
                                </span>
                              </span>
                            </span>
                            <CheckCircleIcon
                              aria-hidden="true"
                              className={`h-5 w-5 text-sky-600 ${
                                selectedSlowConnectorsList.includes(connector)
                                  ? ""
                                  : "invisible"
                              }`}
                            />
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${
                                selectedSlowConnectorsList.includes(connector)
                                  ? "border-sky-600"
                                  : "border-transparent"
                              }`}
                            />
                          </Checkbox>
                        ))}
                      </div>
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
                Register Charger
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterChargerPage;
