/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  // DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CheckIcon,
  ChevronUpDownIcon,
  WalletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { IUserPayload } from "@/utils/types/IUserData";
import { RotatingLines } from "react-loader-spinner";
import { ethers, formatEther, JsonRpcSigner, parseEther } from "ethers";
import {
  createConsentMessage,
  createConsentProofPayload,
} from "@xmtp/consent-proof-signature";
import { contractABI } from "@/utils/contractABI";
// import { deviceDefinitions } from "@/utils/deviceDefinitions";
import { GraphQLClient } from "graphql-request";
import vehiclesMinted from "@/utils/queries/vehiclesMinted";

const navigation = [
  { name: "Navigate", href: "/dashboard" },
  { name: "Wallet", href: "/dashboard/wallet" },
  { name: "My Devices", href: "/dashboard/my-devices" },
  { name: "Trips", href: "/dashboard/trips" },
];

const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface LayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    loggedIn,
    logout,
    user,
    address,
    getBalance,
    signMessage,
    provider,
    getSigner,
  } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(false);
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);
  const [useStationModal, setUseStationModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | any>(null);
  const [onlyCarsBalance, setOnlyCarsBalance] = useState<number | any>();
  const [selectedDIMOCar, setSelectedDIMOCar] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[] | any>([]);
  const [stationId, setStationId] = useState<string | any>(null);

  useEffect(() => {
    const stationId = searchParams.get("stationId");
    if (stationId) {
      console.log("stationId:", stationId);
      setStationId(stationId);
    }
  }, []);

  // Getting Web3Auth wallet balance
  useEffect(() => {
    const getTheBalance = async () => {
      const balance = await getBalance();
      console.log("Balance:", balance);
      setBalance(balance);
    };

    if (loggedIn) {
      getTheBalance();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  // Getting user data from the API
  useEffect(() => {
    const userPayload: IUserPayload = user;

    const sendUserData = async (payload: IUserPayload) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        switch (response.status) {
          case 200: // OK
            const data200 = await response.json();
            setMessage(data200.message);
            console.log("Response message:", data200.message);
            console.log("Address", address);
            fetchAddressStatus(address);
            break;

          case 201: // Created
            const data201 = await response.json();
            setMessage(data201.message);
            console.log("User created message:", data201.message);
            fetchAddressStatus(address);
            break;

          case 400: // Bad Request
            const error400 = await response.json();
            setMessage(`Bad Request: ${error400.error || "Invalid data"}`);
            console.error("Bad Request:", error400);
            break;

          case 404: // Not Found
            setMessage("Endpoint not found");
            console.error("Endpoint not found");
            break;

          case 500: // Internal Server Error
            const error500 = await response.json();
            setMessage(
              `Server Error: ${
                error500.error || "An unexpected error occurred"
              }`
            );
            console.error("Server Error:", error500);
            break;

          default:
            throw new Error(`Unexpected HTTP status: ${response.status}`);
        }
      } catch (error) {
        setMessage("Error sending user data");
        console.error("Error sending user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (loggedIn) {
      user && address.length < 43 && sendUserData(userPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, address]);

  // Checking if user exists on XMTP
  const fetchAddressStatus = async (address: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/check-user-on-xmtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        }
      );

      switch (response.status) {
        case 200: // OK
          const data200 = await response.json();
          setMessage(
            data200.registered
              ? "Address is registered on XMTP."
              : "Address is not registered on XMTP."
          );
          connectToXMTP();
          break;

        case 400: // Bad Request
          const error400 = await response.json();
          setMessage(`Bad Request: ${error400.error || "Invalid address"}`);
          break;

        case 404: // Not Found
          setMessage("Address not found on XMTP network.");
          break;

        case 500: // Internal Server Error
          const error500 = await response.json();
          setMessage(
            `Server Error: ${error500.error || "An unexpected error occurred"}`
          );
          break;

        default:
          throw new Error(`Unexpected HTTP status: ${response.status}`);
      }
    } catch (error) {
      setMessage("Error checking address registration.");
      console.error("Error checking address registration:", error);
    }
  };

  // Setting Wallet
  useEffect(() => {
    const getDetails = async () => {
      if (loggedIn) {
        const wallet = await getWallet();
        setWallet(wallet);
      }
    };
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, loggedIn]);

  // Get wallet
  const getWallet = async (): Promise<JsonRpcSigner | null> => {
    if (!provider) {
      // uiConsole("provider not initialized yet");
      return null;
    }
    const ethersProvider = new ethers.BrowserProvider(provider);

    return ethersProvider.getSigner();
  };

  // Connect to XMTP
  const connectToXMTP = async () => {
    // Get consent from user
    const timestamp = Date.now();
    const message = createConsentMessage(
      process.env.NEXT_PUBLIC_BROADCAST_ADDRESS || "",
      timestamp
    );
    console.log("Message:", message);
    const signature = await signMessage({
      account: address,
      message,
    });
    const payloadBytes = createConsentProofPayload(signature, timestamp);
    const base64Payload = Buffer.from(payloadBytes).toString("base64");

    // Get device information
    const browserInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };

    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;

    const deviceInfo = {
      ipAddress,
      browserInfo,
    };

    console.log("Device Info:", deviceInfo);

    const subscribeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_ROUTE}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          broadcastAddress: process.env.NEXT_PUBLIC_BROADCAST_ADDRESS,
          consentProof: base64Payload,
          deviceInfo,
        }),
      }
    );
    await subscribeResponse.json();
    setSubscriptionStatus(true);
    console.log("Subscription response:", subscribeResponse);
  };

  // Sign Into DIMO
  // const signIntoDimo = async () => {
  //   console.log("Signing into DIMO");
  //   // POST request
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_DIMO_AUTH_URL}/auth/web3/generate_challenge?client_id=${process.env.NEXT_PUBLIC_DIMO_CLIENT_ID}&domain=${process.env.NEXT_PUBLIC_DIMO_REDIRECT_URI}&scope=openid+email&response_type=code&address=${address}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ address }),
  //     }
  //   );
  //   const data = await response.json();
  //   console.log("Sign in response:", data);
  // };

  // Handle Top up wallet
  const handleTopUpWallet = async () => {
    try {
      const signer = await getSigner();

      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      const contract = new ethers.Contract(
        contractAddress,
        JSON.parse(JSON.stringify(contractABI)),
        signer
      );

      const topUpAmount = parseEther("0.0005"); // Top up with 0.0005 Ether, adjust as needed

      const tx = await contract.topUp({ value: topUpAmount });
      console.log(tx);

      // Wait for transaction to finish
      const receipt = await tx.wait();
      if (receipt.hash) {
        setWalletModalOpen(false);
        console.log("Top up successful");
      } else {
        setWalletModalOpen(false);
        console.log("Top up failed");
      }
    } catch (error) {
      console.error("Error during top up:", error);
    }
  };

  // Getting OnlyCars wallet balance
  useEffect(() => {
    const getContractBalance = async () => {
      const signer = await getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log(signer.address);
      try {
        // Call the balances function with the address parameter
        const balance = await contract.balances(signer.address); // Note: view function, no .wait()
        console.log(balance);
        setOnlyCarsBalance(`${formatEther(balance)}`);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    if (loggedIn) {
      getContractBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  // Check if url has stationId query param
  useEffect(() => {
    if (stationId) {
      console.log("stationId:", stationId);
      // use station logic here
      setUseStationModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  // Getting cars owned by the user from Envio indexer
  useEffect(() => {
    const fetchData = async (address: any) => {
      try {
        const client = new GraphQLClient("http://localhost:8080/v1/graphql");
        const query = vehiclesMinted(address);
        const vehiclesMintedByUser: any = await client.request(query);

        const vehiclesFromFetch = await Promise.all(
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
                    id: vehicle.vehicleId,
                  });
                  return {
                    name: response.name,
                    chargerType: response.chargerType,
                    connectorType: response.connectorType,
                    make: response.make,
                    model: response.model,
                    year: response.year,
                    source: "Morph",
                    id: vehicle.vehicleId,
                  };
                })
                .catch((err) => console.error(err));
            }
          )
        );

        setVehicles(vehiclesFromFetch);
        setSelectedDIMOCar(vehiclesFromFetch[0]);
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

  const handleUseStation = async () => {
    try {
      const signer = await getSigner();

      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      const contract = new ethers.Contract(
        contractAddress,
        JSON.parse(JSON.stringify(contractABI)),
        signer
      );

      console.log(selectedDIMOCar);

      const tx = await contract.useStation(
        stationId,
        selectedDIMOCar.id,
        parseEther("0.0001")
      );
      console.log(tx);

      // Wait for transaction to finish
      const receipt = await tx.wait();
      if (receipt.hash) {
        // POST request to API
        const url = `${process.env.NEXT_PUBLIC_API_ROUTE}/broadcast/charge-successful`;

        const payload: { [key: string]: any } = {
          address,
        };

        // Push inputs into payload using map
        Object.keys(selectedDIMOCar).map((key: any) => {
          payload[key] = selectedDIMOCar[key];
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
            setUseStationModal(false);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        console.log("Payment failed");
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center gap-x-3">
          <RotatingLines
            visible={true}
            width="20"
            strokeColor="#ffffff"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
          <span className="font-medium">Preparing your dashboard</span>
        </div>
      ) : (
        <div
          className="min-h-full h-full w-full"
          style={
            pathname === "/dashboard"
              ? { overflow: "hidden" }
              : { overflow: "" }
          }
        >
          <Disclosure as="nav" className="bg-black text-white shadow-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center gap-x-2">
                    <img
                      alt="OnlyCars"
                      src="/logo.png"
                      className="block h-8 w-8"
                    />
                    <span className="text-xl font-black text-sky-500">
                      Only
                      <span className="font-black text-sky-600">Cars</span>
                    </span>
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.href === pathname
                            ? "border-sky-500 text-white"
                            : "border-transparent text-zinc-400 hover:border-sky-300 hover:text-zinc-200",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <button
                    onClick={() => setWalletModalOpen(true)}
                    className="relative rounded-full bg-zinc-900/70 p-2 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Wallet</span>
                    <WalletIcon aria-hidden="true" className="h-6 w-6" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    {user && (
                      <div>
                        <MenuButton className="relative flex rounded-full bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            alt=""
                            src={user.profileImage}
                            className="h-8 w-8 rounded-full"
                          />
                        </MenuButton>
                      </div>
                    )}
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            href={item.href}
                            className="block px-4 py-2 text-sm text-zinc-700 data-[focus]:bg-zinc-100"
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                      <MenuItem>
                        <div
                          className="block px-4 py-2 text-sm text-zinc-700 data-[focus]:bg-zinc-100"
                          onClick={logout}
                        >
                          Logout
                        </div>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                  {loggedIn && (
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white group-hover:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs font-medium text-zinc-500 group-hover:text-zinc-200">
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon
                      aria-hidden="true"
                      className="block h-6 w-6 group-data-[open]:hidden"
                    />
                    <XMarkIcon
                      aria-hidden="true"
                      className="hidden h-6 w-6 group-data-[open]:block"
                    />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.href === pathname
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800",
                      "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
              <div className="border-t border-zinc-200 pb-3 pt-4">
                {user && (
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        alt=""
                        src={user.profileImage}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-zinc-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-zinc-500">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                )}
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block px-4 py-2 text-base font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                  <DisclosureButton
                    as="a"
                    href="#"
                    className="block px-4 py-2 text-base font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                  >
                    Logout
                  </DisclosureButton>
                </div>
              </div>
            </DisclosurePanel> */}
          </Disclosure>

          <div
            className={
              pathname === "/dashboard"
                ? "flex items-center justify-center"
                : "min-h-full h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            }
            style={{ minHeight: "calc(100vh - 64px)" }}
          >
            {children}
          </div>
        </div>
      )}

      {/* Modal with charger info start */}
      <Dialog
        open={walletModalOpen}
        onClose={setWalletModalOpen}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div>
                  <DialogTitle className="px-2 text-xl font-bold text-white">
                    Your Wallets
                  </DialogTitle>
                  <div className="text-sm text-zinc-400"></div>

                  <div className="mt-3 bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-semibold text-white">
                      Web3Auth Wallet Balance <br />
                      <span className="text-zinc-400 font-light text-xs">
                        ({address})
                      </span>
                    </h3>
                    <div className="mt-3 flex items-center gap-x-2">
                      <div>
                        <img
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                          alt="Eth"
                          className="h-6 w-6 mx-auto"
                        />
                      </div>
                      <div className="text-sm">{balance && balance} ETH</div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-zinc-400">
                    This balance is used to pay for transactions inside the app.
                    Ensure sufficient funds are available to avoid transaction
                    failures.
                  </div>

                  <div className="border-t border-zinc-800 my-5 w-full" />

                  <div className="mt-3 bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-semibold text-white">
                      OnlyCars Wallet Balance <br />
                      <span className="text-zinc-400 font-light text-xs">
                        ({process.env.NEXT_PUBLIC_CONTRACT_ADDRESS})
                      </span>
                    </h3>
                    <div className="mt-3 flex items-center gap-x-2">
                      <div>
                        <img
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                          alt="Eth"
                          className="h-6 w-6 mx-auto"
                        />
                      </div>
                      <div className="text-sm">
                        {onlyCarsBalance && onlyCarsBalance} ETH
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-zinc-400">
                    This balance is used to pay for usage of chargers. You have
                    to keep this topped up before you can start charging your
                    vehicle.
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleTopUpWallet}
                  className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Top Up Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setWalletModalOpen(false)}
                  className="mt-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold border border-zinc-200 text-zinc-900 shadow-sm hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* Modal with charger info end */}

      {/* Modal with charger info start */}
      <Dialog
        open={useStationModal}
        onClose={setUseStationModal}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div>
                  <DialogTitle className="px-2 text-xl font-bold text-white">
                    Pony Up <span className="ml-2">🦄</span>
                  </DialogTitle>
                  {vehicles?.length > 0 && selectedDIMOCar && (
                    <div className="mt-5">
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
                                  {selectedDIMOCar.make} {selectedDIMOCar.model}{" "}
                                  {selectedDIMOCar.year} (
                                  <span className="text-sky-600">
                                    {selectedDIMOCar.id}
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
                                {vehicles.map((car: any, index: number) => (
                                  <ListboxOption
                                    key={index}
                                    value={car}
                                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-200 data-[focus]:bg-sky-600 data-[focus]:text-white"
                                  >
                                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                      {car.make} {car.model} {car.year} (
                                      {car.id})
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
                    </div>
                  )}

                  <div className="mt-3 bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-semibold text-white">
                      You are about to pay 0.0001 ETH for usage of the charging
                      station from your OnlyCars wallet.
                    </h3>
                    <table className="mt-5">
                      <tbody>
                        <tr>
                          <td className="text-sm flex items-center text-zinc-200">
                            <div>Current Balance</div>
                          </td>
                          <td className="text-sm">
                            <div className="ml-3 flex items-center gap-x-2">
                              <div>
                                <img
                                  src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                                  alt="Eth"
                                  className="h-4 w-4 mx-auto"
                                />
                              </div>
                              <div className="text-sm font-semibold text-white">
                                {onlyCarsBalance && onlyCarsBalance} ETH
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-sm flex items-center">
                            <div className="mt-3">Amount Payable</div>
                          </td>
                          <td className="text-sm">
                            <div className="mt-3 ml-3 flex items-center gap-x-2">
                              <div>
                                <img
                                  src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                                  alt="Eth"
                                  className="h-4 w-4 mx-auto"
                                />
                              </div>
                              <div className="text-sm font-semibold text-white">
                                0.0001 ETH
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleUseStation}
                  className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Pay Amount
                </button>
                <button
                  type="button"
                  onClick={() => setUseStationModal(false)}
                  className="mt-2 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold border border-red-800 text-white shadow-sm hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* Modal with charger info end */}
    </>
  );
};

export default DashboardLayout;
