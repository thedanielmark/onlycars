"use client";

import {
  ChangeEventHandler,
  CSSProperties,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  createConsentMessage,
  createConsentProofPayload,
} from "@xmtp/consent-proof-signature";
import { broadcastConfigs } from "@/utils/broadcastConfig";
import { useAuth } from "@/providers/AuthProvider";

const host = process.env.NEXT_PUBLIC_API_ROUTE || "";

enum ErrorStates {
  NO_WALLET = "NO_WALLET",
  NOT_ON_NETWORK = "NOT_ON_NETWORK",
  SIGNATURE_ERROR = "SIGNATURE_ERROR",
  SUBSCRIPTION_ERROR = "SUBSCRIPTION_ERROR",
}

const styles: Record<string, CSSProperties> = {
  SubscribeButtonContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    borderRadius: "5px",
    textAlign: "center",
    alignItems: "center",
  },
  SubscribeButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    borderRadius: "5px",
    marginBottom: "2px",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontWeight: "bold",
    color: "#333333",
    backgroundColor: "#ededed",
    border: "none",
    fontSize: "12px",
  },
  ErrorText: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px",
  },
  BroadcastDropdownContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "10px",
  },
  Dropdown: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ededed",
    fontSize: "12px",
    backgroundColor: "#ededed",
    color: "#333333",
  },
};

const getErrorMessage = (error: ErrorStates) => {
  switch (error) {
    case ErrorStates.NO_WALLET:
      return "Connect your wallet to continue";
    case ErrorStates.NOT_ON_NETWORK:
      return "You are not on the XMTP network";
    case ErrorStates.SIGNATURE_ERROR:
      return "Error signing the message, please try again";
    case ErrorStates.SUBSCRIPTION_ERROR:
      return "Error subscribing, please try again";
    default:
      return "An error occurred, please try again";
  }
};

const SubscribeButton = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [errorState, setErrorState] = useState<ErrorStates | null>(null);
  const { address, login, loggedIn, signMessage } = useAuth();
  const [selectedBroadcast, setSelectedBroadcast] = useState(
    broadcastConfigs[0].address
  );

  const { address: broadcastAddress, name } = useMemo(() => {
    return (
      broadcastConfigs.find(({ address }) => address === selectedBroadcast) ??
      broadcastConfigs[0]
    );
  }, [selectedBroadcast]);

  // Define the handleClick function
  const handleSigning = useCallback(async () => {
    try {
      setLoading(true);
      setErrorState(null);
      // Get the subscriber
      if (!address) {
        throw new Error(ErrorStates.NO_WALLET);
      }
      const lookupResponse = await fetch(`${host}/lookup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          broadcastAddress,
        }),
      });
      const data = await lookupResponse.json();
      if (!data.onNetwork) {
        throw new Error(ErrorStates.NOT_ON_NETWORK);
      }
      const timestamp = Date.now();
      const message = createConsentMessage(broadcastAddress, timestamp);
      const signature = await signMessage({
        account: address,
        message,
      });
      const payloadBytes = createConsentProofPayload(signature, timestamp);
      const base64Payload = Buffer.from(payloadBytes).toString("base64");

      const subscribeResponse = await fetch(`${host}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          broadcastAddress,
          consentProof: base64Payload,
        }),
      });
      await subscribeResponse.json();
      setSubscriptionStatus(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        switch (error.message) {
          case ErrorStates.SIGNATURE_ERROR:
            setErrorState(ErrorStates.SIGNATURE_ERROR);
            break;
          case ErrorStates.SUBSCRIPTION_ERROR:
            setErrorState(ErrorStates.SUBSCRIPTION_ERROR);
            break;
          case ErrorStates.NOT_ON_NETWORK:
            setErrorState(ErrorStates.NOT_ON_NETWORK);
            break;
          case ErrorStates.NO_WALLET:
            setErrorState(ErrorStates.NO_WALLET);
            break;
        }
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, broadcastAddress]);

  const handleButtonClick = useCallback(() => {
    !loggedIn ? login() : handleSigning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, handleSigning]);

  const handleDropdownChange: ChangeEventHandler<HTMLSelectElement> =
    useCallback(
      (event) => {
        setSelectedBroadcast(event.target.value);
      },
      [setSelectedBroadcast]
    );

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div style={styles.BroadcastDropdownContainer}>
        <label htmlFor="config-dropdown">Choose a Broadcast:</label>
        <select
          style={styles.Dropdown}
          id="config-dropdown"
          value={selectedBroadcast}
          onChange={handleDropdownChange}
        >
          {broadcastConfigs.map((config) => (
            <option key={config.address} value={config.address}>
              {config.name}
            </option>
          ))}
        </select>
      </div>
      <div
        style={styles.SubscribeButtonContainer}
        className={`Subscribe ${loading ? "loading" : ""}`}
      >
        Subscribe to {name}
        <button style={styles.SubscribeButton} onClick={handleButtonClick}>
          {subscriptionStatus
            ? "Subscribed"
            : loading
            ? "Loading... "
            : "Subscribe"}
        </button>
        <div>
          {errorState && (
            <p style={styles.ErrorText}>{getErrorMessage(errorState)}</p>
          )}
        </div>
      </div>
    </main>
  );
};

function NotificationsPage() {
  return (
    <>
      <SubscribeButton />
    </>
  );
}

export default NotificationsPage;
