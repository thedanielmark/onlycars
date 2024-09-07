"use client";

import { useEffect, useState } from "react";
import {
  Checkbox,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/providers/AuthProvider";
import useInput from "@/utils/useInput";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { ethers, toUtf8Bytes } from "ethers";
import { contractABI } from "@/utils/contractABI";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { GraphQLClient } from "graphql-request";
import stationsByIPFSHashQuery from "@/utils/queries/stationsByIPFSHash";

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
  const address = useInput("");
  const { address: currentWalletAddress, getSigner } = useAuth();

  const [selectedChargersList, setSelectedChargersList] = useState<any>([]);
  const [selectedRapidConnectorsList, setSelectedRapidConnectorsList] =
    useState<any>([]);
  const [selectedFastConnectorsList, setSelectedFastConnectorsList] =
    useState<any>([]);
  const [selectedSlowConnectorsList, setSelectedSlowConnectorsList] =
    useState<any>([]);

  const [Loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [center, setCenter] = useState([]);
  const [location, setLocation] = useState("");
  const [metadataIPFSHash, setMetadataIPFSHash] = useState<string>("");
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [attestationID, setAttestationID] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);
  const [chargerData, setChargerData] = useState<any>({});
  const [chargerDataIsReady, setChargerDataIsReady] = useState(false);
  const [QRCode, setQRCode] = useState("");

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

  const [inputs, setInputs] = useState({
    name: "",
    address: "",
    latitude: center[1],
    longitude: center[0],
    chargers: selectedChargersList,
    rapidChargerConnectors: selectedRapidConnectorsList,
    fastChargerConnectors: selectedFastConnectorsList,
    slowChargerConnectors: selectedSlowConnectorsList,
  });

  const handleInput = (event: any) => {
    event.persist();
    setInputs((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      address: location,
    }));
  }, [location]);

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      latitude: center[1],
      longitude: center[0],
    }));
  }, [center]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setShowErrorMessage(false);

    if (currentWalletAddress) {
      try {
        await axios
          .post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            {
              pinataContent: inputs,
              pinataMetadata: {
                name: "OnlyCars Charging Station Metadata",
              },
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (metadataResponse) => {
            try {
              const attestationPayload = JSON.stringify({
                schemaId:
                  process.env.NEXT_PUBLIC_SIGN_PROTOCOL_CHARGER_SCHEMA_ID,
                data: {
                  name: inputs.name,
                  address: inputs.address,
                  latitude: inputs.latitude,
                  longitude: inputs.longitude,
                  chargers: JSON.stringify(inputs.chargers),
                  fastChargerConnectors: JSON.stringify(
                    inputs.fastChargerConnectors
                  ),
                  rapidChargerConnectors: JSON.stringify(
                    inputs.rapidChargerConnectors
                  ),
                  slowChargerConnectors: JSON.stringify(
                    inputs.slowChargerConnectors
                  ),
                },
                indexingValue: currentWalletAddress,
                type: "chargingStation",
              });

              const response: any = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROUTE}/attestations/attest`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: attestationPayload,
                }
              );

              if (response.status === 201) {
                const responseJSON = await response.json();
                console.log(responseJSON);
                setAttestationID(responseJSON.attestation.attestationId);
                setMetadataIPFSHash(metadataResponse.data.IpfsHash);
                setFileUploading(false);
              }
            } catch (error) {
              setMessage("Error sending user data");
              setShowErrorMessage(true);
              console.error("Error sending user data:", error);
            } finally {
              setShowErrorMessage(false);
            }
          })
          .catch((err) => {
            console.error("Error uploading metadata to IPFS: ", err);
            setFileUploading(false);
          });
      } catch {
        setMessage("Error sending user data");
        setShowErrorMessage(true);
        console.error("Error sending user data");
      } finally {
        setShowErrorMessage(false);
      }
    }
  };

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

      const tx = await contract.registerStation(
        metadataIPFSHash,
        toUtf8Bytes(attestationID)
      );
      console.log(tx);
      // Wait for transaction to finish
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setShowSuccess(true);
        setTransactionHash(receipt.hash);

        // Fetch charger data
        try {
          const client = new GraphQLClient("http://localhost:8080/v1/graphql");
          const query = stationsByIPFSHashQuery(metadataIPFSHash);

          const pollForData = async () => {
            const stationsRegistsredByUser: any = await client.request(query);
            console.log(stationsRegistsredByUser);
            if (
              stationsRegistsredByUser.OnlyCars_StationRegistered.length > 0
            ) {
              clearInterval(intervalId);
              console.log(stationsRegistsredByUser);
              generateQRCode(stationsRegistsredByUser);
            }
          };
          const intervalId = setInterval(pollForData, 1000);
        } catch (err: any) {
          console.log(err.message);
        }

        setModalOpen(true);
        setIsLoading(false);
      }
    };

    function generateQRCode(stationsRegistsredByUser: any) {
      // Call a free API to generate QR code
      const qrCodeAPI = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${stationsRegistsredByUser.OnlyCars_StationRegistered[0].stationId}`;
      setQRCode(qrCodeAPI);
      setChargerDataIsReady(true);
    }

    // function getPinataData(stationsRegistsredByUser: any) {
    //   fetch(
    //     `https://gateway.pinata.cloud/ipfs/${stationsRegistsredByUser.OnlyCars_StationRegistered[0].metadata}`
    //   )
    //     .then((response) => response.json())
    //     .then((response) => {
    //       // Add charger to chargerData array
    //       setChargerData({
    //         name: response.name,
    //         address: response.address,
    //         latitude: response.latitude,
    //         longitude: response.longitude,
    //         chargers: response.chargers,
    //         fastChargerConnectors: response.fastChargerConnectors,
    //         rapidChargerConnectors: response.rapidChargerConnectors,
    //         slowChargerConnectors: response.slowChargerConnectors,
    //       });
    //       console.log({
    //         name: response.name,
    //         address: response.address,
    //         latitude: response.latitude,
    //         longitude: response.longitude,
    //         chargers: response.chargers,
    //         fastChargerConnectors: response.fastChargerConnectors,
    //         rapidChargerConnectors: response.rapidChargerConnectors,
    //         slowChargerConnectors: response.slowChargerConnectors,
    //       });
    //     })
    //     .catch((err) => console.error(err));
    // }

    if (metadataIPFSHash && attestationID) {
      writeData();
      console.log("Called");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataIPFSHash, attestationID]);

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  useEffect(() => {
    // Update inputs when chargers, connectors are selected
    setInputs((prev) => ({
      ...prev,
      chargers: selectedChargersList,
      rapidChargerConnectors: selectedRapidConnectorsList,
      fastChargerConnectors: selectedFastConnectorsList,
      slowChargerConnectors: selectedSlowConnectorsList,
    }));
  }, [
    selectedChargersList,
    selectedRapidConnectorsList,
    selectedFastConnectorsList,
    selectedSlowConnectorsList,
  ]);

  return (
    <>
      <div className="my-10 space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
        <form onSubmit={handleSubmit}>
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-zinc-900/70 border border-zinc-800 px-4 py-6 sm:p-6 overflow-hidden">
              <div>
                <h3 className="text-base font-semibold leading-6 text-white">
                  Charging Station Information
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Name start */}
                <div className="col-span-2 sm:col-span-2">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      A Friendly Name For Your Charging Station
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={inputs.name}
                      onChange={handleInput}
                      placeholder="Downtown LA Charging Station"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {/* Name end */}

                {/* Charger Locaiton Start */}
                <div className="col-span-2 sm:col-span-2 relative">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Type in an address to find the location of your charger
                    </label>
                    <input
                      {...address}
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Type your address..."
                    />
                  </div>
                  {address.suggestions?.length > 0 && (
                    <div className="absolute -mt-1 block w-full z-10 border border-zinc-800 rounded-lg px-2 bg-black text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6">
                      {address.suggestions.map((suggestion: any, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              address.setValue(suggestion.place_name);
                              setCenter(suggestion.center);
                              address.setSuggestions([]);
                              setLocation(suggestion.place_name);
                            }}
                            className="px-2 py-2 hover:bg-sky-600 text-white cursor-pointer rounded-sm"
                          >
                            {suggestion.place_name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {/* Charger Location End */}

                {/* Longitude start */}
                <div className="col-span-2 sm:col-span-1">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="longitude"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Longitude
                    </label>
                    <input
                      id="longitude"
                      name="longitude"
                      type="text"
                      value={inputs.longitude}
                      onChange={handleInput}
                      placeholder="80.123456"
                      disabled={true}
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Longitude end */}
                {/* Latitude start */}
                <div className="col-span-2 sm:col-span-1">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="latitude"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      Latitude
                    </label>
                    <input
                      id="latitude"
                      name="latitude"
                      type="text"
                      placeholder="12.123456"
                      value={inputs.latitude}
                      onChange={handleInput}
                      disabled={true}
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Latitude end */}
                {/* Charger type start */}
                <div className="col-span-2 sm:col-span-2">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-white">
                      What types of chargers and connector types does your
                      station offer?{" "}
                      <span className="ml-2 text-zinc-400">
                        (Select all that apply)
                      </span>
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

                <div className="col-span-2 grid grid-cols-3 gap-6">
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
                                  selectedRapidConnectorsList.includes(
                                    connector
                                  )
                                    ? ""
                                    : "invisible"
                                }`}
                              />
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${
                                  selectedRapidConnectorsList.includes(
                                    connector
                                  )
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
                    (charger: { type: string }) =>
                      charger.type === "Fast Charger"
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
                    (charger: { type: string }) =>
                      charger.type === "Slow Charger"
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
            </div>
            <div className="flex justify-end bg-zinc-800/70 px-4 py-3 text-right sm:px-6 border border-zinc-800">
              <button
                type="submit"
                className={`flex items-center justify-center gap-x-3 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                  isLoading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer opacity-100"
                }`}
              >
                {isLoading ? (
                  <>
                    <RotatingLines
                      visible={true}
                      width="20"
                      strokeColor="#ffffff"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />{" "}
                    Registering Charging Station
                  </>
                ) : (
                  "Register Charging Station"
                )}
              </button>
            </div>
          </div>
        </form>
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
                {chargerDataIsReady && (
                  // map and iterate through the connections
                  <div>
                    <div className="text-white text-xl font-bold text-center">
                      Congratulations! <span className="ml-2">🎉</span>
                    </div>

                    <div className="mt-3 text-sm text-white text-center">
                      Print this QR code and place it at your charging station.
                      This will allow users to scan the code and make automatic
                      payments to you.
                    </div>

                    <img
                      src="https://quickchart.io/qr?text=9&light=000000&dark=38bdf8&margin=2&size=300"
                      alt="QR Code"
                      className="mx-auto mt-4"
                    />

                    {showSuccess && (
                      <div className="mt-5 rounded-md bg-sky-900 px-2 py-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <InformationCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-sky-400"
                            />
                          </div>
                          <div className="ml-2 flex-1 text-sm text-white">
                            Your vehicle was successfully registered.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-x-3">
                <a
                  href={`https://scan.sign.global/attestation/${attestationID}`}
                  target="_blank"
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  View Attestation
                </a>
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  View Transaction
                </a>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* Modal with charger info end */}
    </>
  );
}

export default RegisterChargerPage;
