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
import { chargers } from "./chargers";
import Link from "next/link";
import { GraphQLClient } from "graphql-request";
import vehicleConnectionsQuery from "@/utils/queries/vehicleConnections";
import { useAuth } from "@/providers/AuthProvider";
import { contractABI } from "@/utils/contractABI";
import { ethers } from "ethers";
import vehiclesOwnedQuery from "@/utils/queries/vehiclesOwned";
import testEnvio from "@/utils/queries/testEnvio";

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

function MyDevicesPage() {
  const { address, getSigner } = useAuth();
  const [vehicleConections, setVehicleConnections] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState(chargers[0]);
  const [metadataIPFSHash, setMetadataIPFSHash] = useState("");
  const [vehicles, setVehicles] = useState<any>([]);

  // Get vehicle connections for the user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new GraphQLClient(
          process.env.NEXT_PUBLIC_DIMO_GRAPHQL_URL || ""
        );
        const query = vehicleConnectionsQuery(
          process.env.NEXT_PUBLIC_DIMO_CLIENT_ID || ""
        );
        const result: any = await client.request(query);
        setVehicleConnections(result.vehicles.nodes);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(vehicleConections);
  }, [vehicleConections]);

  // Get vehicle data for the user
  useEffect(() => {
    const fetchData = async (vehicle: any) => {
      try {
        const client = new GraphQLClient(
          process.env.NEXT_PUBLIC_DIMO_GRAPHQL_URL || ""
        );
        const query = vehiclesOwnedQuery(vehicle.tokenId);
        const result: any = await client.request(query);
        console.log(result.vehicle);
        // add vehicle to vehicles array
        setVehicles((vehicles: any) => [...vehicles, result.vehicle as any]);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    if (vehicleConections.length > 0) {
      vehicleConections.forEach((vehicle: any) => {
        fetchData(vehicle);
      });
    }
  }, [vehicleConections]);

  useEffect(() => {
    console.log(vehicleConections);
  }, [vehicleConections]);

  useEffect(() => {
    const writeData = async () => {
      // Write to contract
      const signer = await getSigner();

      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      const contract = new ethers.Contract(
        contractAddress,
        JSON.parse(JSON.stringify(contractABI)),
        signer
      );

      const tx = await contract.mintVehicle(
        metadataIPFSHash,
        "0xb860d1f279575747c7A7b18f8a2b396EdF648023"
      );
      console.log(tx);
      // Wait for transaction to finish
      const receipt = await tx.wait();
      console.log(receipt);
    };

    if (metadataIPFSHash) {
      writeData();
      console.log("Called");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataIPFSHash]);

  useEffect(() => {
    const readData = async () => {
      // Write to contract
      const signer = await getSigner();

      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      const contract = new ethers.Contract(
        contractAddress,
        JSON.parse(JSON.stringify(contractABI)),
        signer
      );

      // TODO - Read from contract
      // const tx = await contract.mintVehicle(
      //   metadataIPFSHash,
      //   "0xb860d1f279575747c7A7b18f8a2b396EdF648023"
      // );
      // console.log(tx);
      // // Wait for transaction to finish
      // const receipt = await tx.wait();
      // console.log(receipt);
    };

    if (address) {
      readData();
      console.log("Called");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new GraphQLClient("http://localhost:8080/v1/graphql");
        const query = testEnvio();
        const result: any = await client.request(query);
        console.log(result);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mt-5">
        <div>
          <div className="text-2xl font-bold">Your registered vehicles</div>
          <div className="mt-5 grid grid-cols-3 gap-5">
            {vehicles.map((vehicle: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${vehicle.definition.make}${vehicle.definition.model}&background=random`}
                      alt={vehicle.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-white">
                      {vehicle.definition.make} {vehicle.definition.model}{" "}
                      {vehicle.definition.year}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {vehicle.definition.make}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-zinc-500 mr-4">
                    {vehicle.licensePlate}
                  </div>
                  <div className="text-sm text-zinc-500">{vehicle.status}</div>
                </div>
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
                        Contact Number
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-zinc-400"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-zinc-400"
                      >
                        Date Created
                      </th>
                      <th
                        scope="col"
                        className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {chargers.map((charger, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-500 sm:pl-0">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-white">
                          {charger.AddressInfo.Title}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-200">
                          {charger.AddressInfo.ContactTelephone1}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-200">
                          {charger.UsageCost}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-200">
                          {new Date(charger.DateCreated).toLocaleDateString()}
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
              className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                {selectedCharger && (
                  // map and iterate through the connections
                  <div>
                    <DialogTitle className="text-lg font-semibold text-white">
                      {selectedCharger.AddressInfo.Title}
                    </DialogTitle>
                    <table className="mt-3">
                      <tbody>
                        {selectedCharger?.AddressInfo.Town && (
                          <tr>
                            <td className="text-zinc-500 text-sm">Town</td>
                            <td className="text-zinc-200 text-sm pl-3">
                              {selectedCharger?.AddressInfo.Town}
                            </td>
                          </tr>
                        )}
                        {selectedCharger?.AddressInfo.StateOrProvince && (
                          <tr>
                            <td className="text-zinc-500 text-sm">
                              State/Province
                            </td>
                            <td className="text-zinc-200 text-sm pl-3">
                              {selectedCharger?.AddressInfo.StateOrProvince}
                            </td>
                          </tr>
                        )}
                        {selectedCharger?.AddressInfo.Postcode && (
                          <tr>
                            <td className="text-zinc-500 text-sm">Postcode</td>
                            <td className="text-zinc-200 text-sm pl-3">
                              {selectedCharger?.AddressInfo.Postcode}
                            </td>
                          </tr>
                        )}
                        {selectedCharger?.AddressInfo.Country.Title && (
                          <tr>
                            <td className="text-zinc-500 text-sm">Country</td>
                            <td className="text-zinc-200 text-sm pl-3">
                              {selectedCharger?.AddressInfo.Country.Title}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <div className="mt-5">
                      <div className="text-sm font-semibold text-white">
                        Connections
                      </div>
                      <div className="mt-2">
                        {selectedCharger.Connections.map(
                          (connection, index) => (
                            <div
                              key={index}
                              className="bg-zinc-900/70 p-4 rounded-lg shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-white">
                                  {connection.ConnectionType.Title}
                                </div>
                                {connection.Level && connection.Level.Title && (
                                  <div className="text-sm text-zinc-200">
                                    {connection.Level.Title}
                                  </div>
                                )}
                              </div>
                              {connection.Quantity && (
                                <div className="mt-2 text-sm text-zinc-200">
                                  {connection.Quantity} Unit(s)
                                </div>
                              )}
                              {connection.Amps && (
                                <div className="mt-2 text-sm text-zinc-200">
                                  {connection.Amps} Amps
                                </div>
                              )}
                              {connection.Voltage && (
                                <div className="mt-2 text-sm text-zinc-200">
                                  {connection.Voltage}V
                                </div>
                              )}
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
