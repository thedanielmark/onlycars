/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
// import { chargers } from "./chargers";
import Link from "next/link";
import { GraphQLClient } from "graphql-request";
import vehicleConnectionsQuery from "@/utils/queries/vehicleConnections";
import { useAuth } from "@/providers/AuthProvider";
import { contractABI } from "@/utils/contractABI";
import { ethers } from "ethers";
import vehiclesOwnedQuery from "@/utils/queries/vehiclesOwned";
import vehiclesMinted from "@/utils/queries/vehiclesMinted";
import { pinata } from "@/utils/pinata";
import stationsOwned from "@/utils/queries/stationsOwned";

// const vehicles = [
//   {
//     id: 1,
//     name: "Tesla Model 3",
//     make: "Tesla",
//     model: "Model 3",
//     year: 2021,
//     vin: "5YJ3E1EA8JF006588",
//     licensePlate: "ABC123",
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Chevy Bolt",
//     make: "Chevy",
//     model: "Bolt",
//     year: 2021,
//     vin: "1G1FW6S03H4100001",
//     licensePlate: "DEF456",
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "Nissan Leaf",
//     make: "Nissan",
//     model: "Leaf",
//     year: 2021,
//     vin: "1N4AZ1CP6JC304871",
//     licensePlate: "GHI789",
//     status: "Active",
//   },
// ];

interface IVehicle {
  name: string;
  chargerType: string;
  connectorType: string;
  make: string;
  model: string;
  year: number;
  source: string;
}

interface ICharger {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  chargers: any;
  rapidChargerConnectors: any;
  fastChargerConnectors: any;
  slowChargerConnectors: any;
}

function MyDevicesPage() {
  const { address, getSigner } = useAuth();
  const [vehicleConections, setVehicleConnections] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [metadataIPFSHash, setMetadataIPFSHash] = useState("");
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);

  const [chargers, setChargers] = useState<ICharger[]>([]);
  const [selectedCharger, setSelectedCharger] = useState<any>();

  const convertToDMS = (decimal: number) => {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60);

    return `${degrees}° ${minutes}' ${seconds}"`;
  };

  // Get vehicle connections for the user from DIMO
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const client = new GraphQLClient(
  //         process.env.NEXT_PUBLIC_DIMO_GRAPHQL_URL || ""
  //       );
  //       const query = vehicleConnectionsQuery(
  //         process.env.NEXT_PUBLIC_DIMO_CLIENT_ID || ""
  //       );
  //       const result: any = await client.request(query);
  //       setVehicleConnections(result.vehicles.nodes);
  //     } catch (err: any) {
  //       console.log(err.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Get vehicle data for the user from DIMO
  // useEffect(() => {
  //   const fetchData = async (vehicle: any) => {
  //     try {
  //       const client = new GraphQLClient(
  //         process.env.NEXT_PUBLIC_DIMO_GRAPHQL_URL || ""
  //       );
  //       const query = vehiclesOwnedQuery(vehicle.tokenId);
  //       const result: any = await client.request(query);

  //       // add vehicle to vehicles array
  //       setVehicles((vehicles: any) => [
  //         ...vehicles,
  //         {
  //           chargerType: "",
  //           connectorType: "",
  //           make: result.vehicle.definition.make,
  //           model: result.vehicle.definition.model,
  //           year: result.vehicle.definition.year,
  //           source: "DIMO",
  //         },
  //       ]);
  //     } catch (err: any) {
  //       console.log(err.message);
  //     }
  //   };

  //   if (vehicleConections.length > 0) {
  //     vehicleConections.forEach((vehicle: any) => {
  //       fetchData(vehicle);
  //     });
  //   }
  // }, [vehicleConections]);

  // Getting cars owned by the user from Envio indexer
  useEffect(() => {
    const fetchData = async (address: any) => {
      try {
        const client = new GraphQLClient("http://localhost:8080/v1/graphql");
        const query = vehiclesMinted(address);
        const vehiclesMintedByUser: any = await client.request(query);

        const vehicleFromFetch = await Promise.all(
          vehiclesMintedByUser.OnlyCars_VehicleRegistered.map(
            async (vehicle: any) => {
              console.info(
                "Getting Pinata data for vehicle: ",
                vehicle.metadata
              );
              return fetch(
                `https://gateway.pinata.cloud/ipfs/${vehicle.metadata}`
              )
                .then((response) => response.json())
                .then((response) => {
                  console.log({
                    name: response.name,
                    chargerType: response.chargerType,
                    connectorType: response.connectorType,
                    make: response.make,
                    model: response.model,
                    year: response.year,
                    source: "Morph",
                  });
                  return {
                    name: response.name,
                    chargerType: response.chargerType,
                    connectorType: response.connectorType,
                    make: response.make,
                    model: response.model,
                    year: response.year,
                    source: "Morph",
                  };
                })
                .catch((err) => console.error(err));
            }
          )
        );

        setVehicles(vehicleFromFetch);
        // console.log("vehiclesFromPinata set");
        console.log(vehicles);
        // if (vehiclesFromPinata) {
        //   setVehicles(vehiclesFromPinata);
        // }
      } catch (err: any) {
        console.log(err.message);
      }
    };

    if (address) {
      fetchData(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // CHARGING INFORMATIOM
  // Getting charging stations owned by the user from Envio indexer
  useEffect(() => {
    const fetchData = async (address: any) => {
      try {
        const client = new GraphQLClient("http://localhost:8080/v1/graphql");
        const query = stationsOwned(address);
        const stationsRegistsredByUser: any = await client.request(query);
        console.log(stationsRegistsredByUser.OnlyCars_StationRegistered.length);

        const chargersFromPinata = await Promise.all(
          stationsRegistsredByUser.OnlyCars_StationRegistered.map(
            async (station: any) => {
              console.info(
                "Getting Pinata data for station: ",
                station.metadata
              );
              return fetch(
                `https://gateway.pinata.cloud/ipfs/${station.metadata}`
              )
                .then((response) => response.json())
                .then((response) => {
                  console.log({
                    name: response.name,
                    address: response.address,
                    latitude: response.latitude,
                    longitude: response.longitude,
                    chargers: response.chargers,
                    fastChargerConnectors: response.fastChargerConnectors,
                    rapidChargerConnectors: response.rapidChargerConnectors,
                    slowChargerConnectors: response.slowChargerConnectors,
                  });
                  return {
                    name: response.name,
                    address: response.address,
                    latitude: response.latitude,
                    longitude: response.longitude,
                    chargers: response.chargers,
                    fastChargerConnectors: response.fastChargerConnectors,
                    rapidChargerConnectors: response.rapidChargerConnectors,
                    slowChargerConnectors: response.slowChargerConnectors,
                  };
                })
                .catch((err) => console.error(err));
            }
          )
        );

        setChargers(chargersFromPinata);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    if (address) {
      fetchData(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    console.log(chargers);
  }, [chargers]);

  return (
    <>
      <div className="my-10">
        <div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">Your registered vehicles</div>
            <Link
              href="/dashboard/my-devices/register-vehicle"
              className="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Register Vehicle
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-5">
            {vehicles.length > 0 &&
              vehicles.map((vehicle: any, index: number) => (
                <div
                  key={index}
                  className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${vehicle.make}${vehicle.model}&background=random`}
                          alt={vehicle.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {vehicle.name}
                          </div>
                          <div className="text-sm text-zinc-400">
                            {vehicle.make} {vehicle.model} {vehicle.year}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="inline-flex items-center rounded-md bg-sky-900 px-2 py-1 text-xs font-medium text-sky-200 ring-1 ring-inset ring-sky-600-700/10">
                        DIMO / MorphL2
                      </span>
                    </div>
                  </div>
                  {vehicle.chargerType && (
                    <div className="mt-5 flex items-center">
                      <div className="text-sm text-zinc-400 mr-4">
                        {vehicle.chargerType && (
                          <span>{vehicle.chargerType}</span>
                        )}
                        {" -"}
                        {vehicle.connectorType && (
                          <span> {vehicle.connectorType} Connector</span>
                        )}
                      </div>
                      {vehicle.connectorType && (
                        <div className="text-sm text-zinc-500"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
          <Link
            href="/dashboard/my-devices/register-vehicle"
            className="mt-5 relative block w-full rounded-lg border-2 border-dashed border-zinc-800 p-12 text-center hover:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            <img src="/logo.png" className="h-12 w-12 mx-auto" />
            <span className="mt-2 block text-sm font-semibold text-zinc-400">
              Register a new vehicle
            </span>
          </Link>
        </div>

        <div className="my-12 border-b border-zinc-800" />

        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto text-2xl font-bold">
              Your registered chargers
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                href="/dashboard/my-devices/register-charger"
                className="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Register Charger
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-zinc-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-400 sm:pl-0"
                      >
                        S.No
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-zinc-400"
                      >
                        Charger Name
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-zinc-400"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-zinc-400"
                      >
                        Coordinates
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-zinc-400"
                      >
                        Connections
                      </th>
                      <th
                        scope="col"
                        className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Connections</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {chargers.length > 0 &&
                      chargers.map((charger, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-500 sm:pl-0">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-white">
                            {charger.name}
                          </td>
                          <td className="px-2 py-2 text-sm text-zinc-200 text-wrap">
                            {charger.address}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-200">
                            {convertToDMS(charger.latitude)},{" "}
                            {convertToDMS(charger.longitude)}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-200">
                            {charger.chargers.length} charger(s)
                          </td>
                          <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 cursor-pointer">
                            <span
                              onClick={() => {
                                setSelectedCharger(charger);
                                setModalOpen(true);
                              }}
                              className="text-sky-600 hover:text-sky-900"
                            >
                              View Connections
                              <span className="sr-only"></span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with charger info start */}
      <Dialog open={modalOpen} onClose={setModalOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-5xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                {selectedCharger && (
                  // map and iterate through the connections
                  <div>
                    <DialogTitle className="text-lg font-semibold text-white">
                      {selectedCharger.name}
                    </DialogTitle>
                    <div className="text-sm text-zinc-400">
                      {selectedCharger.address}
                    </div>

                    <div className="mt-5">
                      <div className="text-xl font-semibold text-white">
                        Connections
                      </div>

                      <div className="mt-2">
                        {selectedCharger.chargers.map(
                          (charger: any, index: number) => (
                            <div key={index} className="grid grid-cols-2">
                              <div className="p-2">
                                <div className="text-sm font-semibold text-white">
                                  {charger.type}
                                </div>
                                <div className="text-sm text-zinc-400">
                                  {charger.time}
                                </div>
                                <div className="mt-2 text-sm text-zinc-200">
                                  Wattage: {charger.wattage}
                                </div>
                              </div>

                              <div>
                                {charger.type === "Rapid Charger" && (
                                  <div className="mt-2 bg-zinc-900/70 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-semibold text-white">
                                      Rapid Charger Connectors
                                    </h3>
                                    {selectedCharger.rapidChargerConnectors.map(
                                      (connector: any) => (
                                        <div
                                          key={connector.id}
                                          className="mt-1 text-sm text-zinc-200"
                                        >
                                          {connector.type} ({connector.pins}{" "}
                                          pins) - {connector.wattage}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}

                                {charger.type === "Fast Charger" && (
                                  <div className="mt-2 bg-zinc-900/70 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-semibold text-white">
                                      Fast Charger Connectors
                                    </h3>
                                    {selectedCharger.fastChargerConnectors.map(
                                      (connector: any) => (
                                        <div
                                          key={connector.id}
                                          className="mt-1 text-sm text-zinc-200"
                                        >
                                          {connector.type} ({connector.pins}{" "}
                                          pins) - {connector.wattage}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}

                                {charger.type === "Slow Charger" && (
                                  <div className="mt-2 bg-zinc-900/70 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-semibold text-white">
                                      Slow Charger Connectors
                                    </h3>
                                    {selectedCharger.slowChargerConnectors.map(
                                      (connector: any) => (
                                        <div
                                          key={connector.id}
                                          className="mt-1 text-sm text-zinc-200"
                                        >
                                          {connector.type} ({connector.pins}{" "}
                                          pins) - {connector.wattage}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Go back to dashboard
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* Modal with charger info end */}
    </>
  );
}

export default MyDevicesPage;
