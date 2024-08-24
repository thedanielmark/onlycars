// import Chat from "@/components/Chat";
// import { Map } from "@/components/Map";
// import { useAuth } from "@/providers/AuthProvider";
// import { MapProvider } from "@/providers/MapProvider";
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "./config";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      action: "link",
      label: "OnchainKit",
      target:
        "https://github.com/builders-garden/open-frames-starter-onchainkit",
    },
    {
      action: "post",
      label: "Post",
      target: `${NEXT_PUBLIC_URL}/api/post`,
    },
    {
      action: "tx",
      label: "Tx",
      target: `${NEXT_PUBLIC_URL}/api/tx`,
      postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
    },
  ],
  state: {
    count: 0,
  },
  isOpenFrame: true,
  accepts: { xmtp: "vNext" },
  image: {
    src: `${NEXT_PUBLIC_URL}/api/images?title=${"title"}`,
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: "Open Frames Starter - OnchainKit Next.js",
  description: "Starter Suite for Open Frames with OnchainKit and Next.js",
  openGraph: {
    title: "Open Frames Starter - OnchainKit Next.js",
    description: "Starter Suite for Open Frames with OnchainKit and Next.js",
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  // const { loggedIn, login, logout, getUserInfo, getAccounts } = useAuth();

  return (
    <>
      Hello World
      {/* <MapProvider>
        {loggedIn ? (
          <>
            <button onClick={getUserInfo}>Get User Info</button>
              <button onClick={getAccounts}>Get Accounts</button>
              <button onClick={logout}>Logout</button>
            <Map />
            <Chat />
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </MapProvider> */}
    </>
  );
}
