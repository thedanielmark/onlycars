/* eslint-disable @next/next/no-img-element */
"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  Bars3Icon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftRightIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/providers/AuthProvider";

import Footer from "@/components/Footer";
import Link from "next/link";

const navigation = [
  { name: "Locate", href: "/" },
  { name: "Wallet", href: "/wallet" },
  { name: "My Devices", href: "/my-devices" },
  { name: "Navigate", href: "/navigate" },
  { name: "Trips", href: "/trips" },
];

const solutions = [
  {
    name: "Inbox",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: InboxIcon,
  },
  {
    name: "Messaging",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "#",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: "Live Chat",
    description: "Your customers' data will be safe and secure.",
    href: "#",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Knowledge Base",
    description: "Connect with third-party tools that you're already using.",
    href: "#",
    icon: QuestionMarkCircleIcon,
  },
];

export default function Home() {
  const { login, loggedIn, user } = useAuth();

  return (
    <>
      <div>
        <header>
          <Popover className="relative bg-black">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:justify-start md:space-x-10 lg:px-8">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/" className="flex items-center gap-x-3">
                  <span className="sr-only">Your Company</span>
                  <img alt="" src="/logo.png" className="h-8 w-auto sm:h-10" />
                  <span className="text-3xl font-black text-sky-500">
                    Only
                    <span className="font-black text-sky-600">Cars</span>
                  </span>
                </Link>
              </div>
              <div className="-my-2 -mr-2 md:hidden">
                <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                </PopoverButton>
              </div>

              <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                {loggedIn && (
                  <div className="flex items-center">
                    <div>
                      <img
                        alt=""
                        src={user.profileImage}
                        className="inline-block h-9 w-9 rounded-full"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                <Link
                  href={loggedIn ? "/dashboard" : "/"}
                  className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in md:hidden"
            >
              <div className="divide-y-2 divide-zinc-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-5 pb-6 pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <img
                        alt="Your Company"
                        src="https://tailwindui.com/img/logos/mark.svg?color=sky&shade=600"
                        className="h-8 w-auto"
                      />
                    </div>
                    <div className="-mr-2">
                      <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </PopoverButton>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid grid-cols-1 gap-7">
                      {solutions.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-m-3 flex items-center rounded-lg p-3 hover:bg-zinc-50"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-sky-600 text-white">
                            <item.icon aria-hidden="true" className="h-6 w-6" />
                          </div>
                          <div className="ml-4 text-base font-medium text-zinc-900">
                            {item.name}
                          </div>
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="px-5 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-base font-medium text-zinc-900 hover:text-zinc-700"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="mt-6">
                    <p className="mt-6 text-center text-base font-medium text-zinc-500">
                      Existing customer?
                      <button onClick={login} className="text-zinc-900">
                        Open Dashboard
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
        </header>

        <main>
          <div>
            {/* Hero card */}
            <div className="relative">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-zinc-900/70" />
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                  <div className="absolute inset-0">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    >
                      <source src="/tesla.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-sky-700 mix-blend-multiply" />
                  </div>
                  <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
                    <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                      <span className="block text-white">
                        The Future of EV Charging is Here
                      </span>
                      <span className="block text-sky-200">
                        Share, Charge, Earn.
                      </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-lg text-center text-xl text-sky-200 sm:max-w-3xl">
                      Transform your EV charger into a revenue stream. Our
                      platform connects you with drivers looking to charge,
                      letting you earn with ease.
                    </p>
                    <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                      <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                        <button
                          className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-sky-700 shadow-sm hover:bg-sky-50 sm:px-8"
                          onClick={login}
                        >
                          Get started
                        </button>
                        <a
                          href="https://github.com/thedanielmark/onlycars"
                          className="flex items-center justify-center rounded-md border border-transparent bg-sky-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8"
                        >
                          Source Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo cloud */}
            <div className="bg-zinc-900/70">
              <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <p className="text-center text-base font-semibold text-zinc-500">
                  The OnlyCars network works with every major EV manufacturer
                  around the world
                </p>
                <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
                  <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
                    <img alt="Tesla" src="/logos/tesla.png" className="h-12" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
                    <img alt="BYD" src="/logos/byd.png" className="h-20" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1">
                    <img alt="Audi" src="/logos/audi.png" className="h-20" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center md:col-span-2 md:col-start-2 lg:col-span-1">
                    <img
                      alt="Volkswagen"
                      src="/logos/volkswagen.png"
                      className="h-12"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center md:col-span-2 md:col-start-4 lg:col-span-1">
                    <img
                      alt="Toyota"
                      src="/logos/toyota.png"
                      className="h-14"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
