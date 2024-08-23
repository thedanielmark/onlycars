"use client";

import { Map } from "@/components/Map";
import { useAuth } from "@/providers/AuthProvider";
import { MapProvider } from "@/providers/MapProvider";

export default function Home() {
  const { loggedIn, login, logout, getUserInfo, getAccounts } = useAuth();

  return (
    <>
      <MapProvider>
        {loggedIn ? (
          <>
            {/* <button onClick={getUserInfo}>Get User Info</button>
              <button onClick={getAccounts}>Get Accounts</button>
              <button onClick={logout}>Logout</button> */}
            <Map />
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </MapProvider>
    </>
  );
}
