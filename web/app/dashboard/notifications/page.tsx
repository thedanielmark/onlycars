"use client";
import { useAuth } from "@/providers/AuthProvider";
import { Client, useClient, XMTPProvider } from "@xmtp/react-sdk";
import { useEffect } from "react";

function NotificationsPage() {
  const { client, error, isLoading, initialize } = useClient();
  const { loggedIn, getSigner } = useAuth();

  useEffect(() => {
    const getConversations = async () => {
      const signer = await getSigner();
      const options = {};

      var keys = await Client.getKeys(signer, {
        ...options,
        skipContactPublishing: true,
        persistConversations: false,
        env: "production",
      });
      await initialize({ keys, options, signer });
    };

    if (loggedIn) {
      getConversations();
    }
  }, []);

  return <XMTPProvider>Notifications</XMTPProvider>;
}

export default NotificationsPage;
