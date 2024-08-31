/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Disclosure,
  DisclosureButton,
  // DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IUserPayload } from "@/utils/types/IUserData";
import { RotatingLines } from "react-loader-spinner";
import { ethers, JsonRpcSigner } from "ethers";
import {
  createConsentMessage,
  createConsentProofPayload,
} from "@xmtp/consent-proof-signature";

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
  const { loggedIn, logout, user, address, signMessage, provider } = useAuth();
  // const { client, error, isLoading: isXMTPLoading, initialize } = useClient();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(false);

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

    if (user && address) {
      sendUserData(userPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, address]);

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

  const getWallet = async (): Promise<JsonRpcSigner | null> => {
    if (!provider) {
      // uiConsole("provider not initialized yet");
      return null;
    }
    const ethersProvider = new ethers.BrowserProvider(provider);

    return ethersProvider.getSigner();
  };

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
          className="min-h-full h-full w-full overflow-x-hidden"
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
                    type="button"
                    className="relative rounded-full bg-zinc-900/70 p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
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
    </>
  );
};

export default DashboardLayout;