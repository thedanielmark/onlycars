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
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  ChevronUpDownIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { ethers, toUtf8Bytes } from "ethers";
import { contractABI } from "@/utils/contractABI";
import { RotatingLines } from "react-loader-spinner";
import { deviceDefinitions } from "@/utils/deviceDefinitions";

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

// const dimoCars = [
//   {
//     tokenId: 100387,
//     owner: "0x8Db0bE570F1Fdbb89b11F2629d284a952e2c6C39",
//   },
//   {
//     tokenId: 81202,
//     owner: "0x7DFBe182BED2A945eD8E8eDcCF9f71b43D5036E0",
//   },
//   {
//     tokenId: 81201,
//     owner: "0x7DFBe182BED2A945eD8E8eDcCF9f71b43D5036E0",
//   },
//   {
//     tokenId: 81200,
//     owner: "0x7DFBe182BED2A945eD8E8eDcCF9f71b43D5036E0",
//   },
//   {
//     tokenId: 22892,
//     owner: "0xB8E514da5E7b2918AebC139ae7CbEFc3727f05D3",
//   },
//   {
//     tokenId: 22279,
//     owner: "0xbA88168Abd7E9d53A03bE6Ec63f6ed30d466C451",
//   },
//   {
//     tokenId: 21957,
//     owner: "0xf9D26323Ab49179A6d57C26515B01De018553787",
//   },
//   {
//     tokenId: 3,
//     owner: "0xd744468B9192301650f8Cb5e390BdD824DFA6Dd9",
//   },
// ];

function RegisterVehiclePage() {
  const { address, getSigner } = useAuth();
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
    name: "",
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const [metadataIPFSHash, setMetadataIPFSHash] = useState<string>("");
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [attestationID, setAttestationID] = useState<string>("");

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");

  const [selectedDIMOCar, setSelectedDIMOCar] = useState(deviceDefinitions[3]);

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
    // Get device definitions by looping through the deviceDefinitions array
    const getDeviceDefinitions = async (selectedDIMOCar: any) => {
      const deviceDefinition = deviceDefinitions.find(
        (deviceDefinition) =>
          deviceDefinition.tokenId === selectedDIMOCar.tokenId
      );

      if (deviceDefinition) {
        setVehicleProfile(deviceDefinition.definition);
      }
    };

    getDeviceDefinitions(selectedDIMOCar);
  }, [selectedDIMOCar]);

  // useEffect(() => {
  //   console.log(searchQuery);
  //   console.log(inputs);
  // }, [searchQuery, inputs]);

  // Setting the make, model and year of the vehicle based on the selected vehicle profile
  useEffect(() => {
    if (vehicleProfile) {
      setInputs({
        ...inputs,
        deviceDefinitionId: vehicleProfile.id,
        make: vehicleProfile.make,
        model: vehicleProfile.model,
        year: vehicleProfile.year,
      });
      // eslint-disable-next-line no-console
      console.log("Selected Vehicle Profile: ", vehicleProfile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleProfile]);

  // Updating inputs when the selected charger type or connector changes
  useEffect(() => {
    setInputs({
      ...inputs,
      chargerType: selectedChargersList.type,
      connectorType:
        selectedChargersList.id === 1
          ? selectedRapidConnectorsList.type
          : selectedChargersList.id === 2
          ? selectedFastConnectorsList.type
          : selectedSlowConnectorsList.type,
    });
    // eslint-disable-next-line no-console
    console.log("Selected Charger: ", selectedChargersList);
    // eslint-disable-next-line no-console
    console.log("Selected Connector: ", selectedRapidConnectorsList);
    // eslint-disable-next-line no-console
    console.log("Selected Connector: ", selectedFastConnectorsList);
    // eslint-disable-next-line no-console
    console.log("Selected Connector: ", selectedSlowConnectorsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedChargersList,
    selectedRapidConnectorsList,
    selectedFastConnectorsList,
    selectedSlowConnectorsList,
  ]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setShowErrorMessage(false);

    const payload = JSON.stringify({
      schemaId: process.env.NEXT_PUBLIC_SIGN_PROTOCOL_VEHICLE_SCHEMA_ID || "",
      data: inputs,
      indexingValue: "",
    });

    // eslint-disable-next-line no-console
    console.log("Payload: ", payload);

    try {
      await axios
        .post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          {
            pinataContent: inputs,
            pinataMetadata: {
              name: "OnlyCars Vehicle Metadata",
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
              schemaId: process.env.NEXT_PUBLIC_SIGN_PROTOCOL_VEHICLE_SCHEMA_ID,
              data: {
                deviceDefinitionId: inputs.deviceDefinitionId,
                name: inputs.name,
                make: inputs.make,
                model: inputs.model,
                year: inputs.year,
                chargerType: inputs.chargerType,
                connectorType: inputs.connectorType,
              },
              indexingValue: address,
              type: "vehicle",
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

      const tx = await contract.mintVehicle(
        metadataIPFSHash,
        toUtf8Bytes(attestationID)
      );
      console.log(tx);
      // Wait for transaction to finish
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        // POST request to API
        const url = `${process.env.NEXT_PUBLIC_API_ROUTE}/broadcast/vehicle-created`;

        const payload: { [key: string]: any } = {
          address,
        };

        // Push inputs into payload using map
        Object.keys(inputs).map((key: any) => {
          payload[key] = inputs[key];
        });

        // Send a POST request
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Indicates you're sending JSON data
          },
          body: JSON.stringify(payload), // Convert the data object to JSON string
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Parse the JSON response
          })
          .then((data) => {
            console.log("Success:", data);
            setShowSuccess(true);
            setTransactionHash(receipt.hash);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };

    if (metadataIPFSHash && attestationID) {
      writeData();
      console.log("Called");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataIPFSHash, attestationID]);

  // Function to handle onChange of inputs
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    event.persist();
    setInputs((prev: any) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  return (
    <>
      <div className="my-10 space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
        <form onSubmit={handleSubmit}>
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

              <div className="grid grid-cols-6 gap-6">
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
                      required={true}
                      value={inputs.name}
                      onChange={handleInputChange}
                      placeholder="Danny's Lexus RX 350"
                      className="block w-full border-0 py-1.5 px-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {/* Name end */}
                {/* Choose DIMO test vehicle start */}
                <div className="col-span-3 sm:col-span-3">
                  <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-sky-600">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-zinc-200"
                    >
                      DIMO Test Vehicle you&apos;re emulating
                    </label>
                    <Listbox
                      value={selectedDIMOCar}
                      onChange={setSelectedDIMOCar}
                    >
                      <div className="relative">
                        <ListboxButton className="relative w-full cursor-default rounded-md text-white py-1.5 text-left shadow-sm focus:outline-none sm:text-sm sm:leading-6">
                          <span className="block truncate">
                            {selectedDIMOCar.definition.make}{" "}
                            {selectedDIMOCar.definition.model}{" "}
                            {selectedDIMOCar.definition.year} (
                            <span className="text-sky-600">
                              {selectedDIMOCar.tokenId}
                            </span>
                            )
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-zinc-400"
                            />
                          </span>
                        </ListboxButton>

                        <ListboxOptions
                          transition
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                        >
                          {deviceDefinitions.map((car, index) => (
                            <ListboxOption
                              key={index}
                              value={car}
                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-200 data-[focus]:bg-sky-600 data-[focus]:text-white"
                            >
                              <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                {car.definition.make} {car.definition.model}{" "}
                                {car.definition.year} ({car.tokenId})
                              </span>

                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-sky-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                <CheckIcon
                                  aria-hidden="true"
                                  className="h-5 w-5"
                                />
                              </span>
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </div>
                </div>
                {/* Choose DIMO test vehicle end */}
                {/* Make start */}
                <div className="col-span-3 sm:col-span-2">
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
                      value={inputs.make || ""}
                      disabled={true}
                      placeholder="Tesla"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Make end */}

                {/* Model start */}
                <div className="col-span-3 sm:col-span-2">
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
                      value={inputs.model || ""}
                      disabled={true}
                      placeholder="Model 3"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Model end */}

                {/* Year start */}
                <div className="col-span-3 sm:col-span-2">
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
                      value={inputs.year || ""}
                      disabled={true}
                      placeholder="2024"
                      className="block w-full border-0 p-0 bg-transparent text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* Year end */}

                {/* Charger type start */}
                <div className="col-span-3 sm:col-span-6">
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
                  <div className="col-span-3 sm:col-span-6">
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
                    Registering Vehicle
                  </>
                ) : (
                  "Register Vehicle"
                )}
              </button>
            </div>
          </div>
        </form>

        {showSuccess && (
          <div className="rounded-md bg-sky-900 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-sky-400"
                />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-white">
                  Your vehicle was successfully registered.
                </p>
                <p className="mt-3 flex items-center gap-x-3 text-sm md:ml-6 md:mt-0">
                  <a
                    href={`https://scan.sign.global/attestation/${attestationID}`}
                    className="whitespace-nowrap font-medium text-sky-500 hover:text-sky-200"
                    target="_blank"
                  >
                    View Attestation
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                    className="whitespace-nowrap font-medium text-sky-500 hover:text-sky-200"
                    target="_blank"
                  >
                    View Transaction
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RegisterVehiclePage;
