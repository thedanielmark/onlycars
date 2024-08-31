var express = require("express");
var router = express.Router();
var ethers = require("ethers");
var { invitation } = require("@xmtp/proto");
var { Client } = require("@xmtp/xmtp-js");

function base64ToBytes(base64) {
  let binary = atob(base64);
  let bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function parsePlatform(platform) {
  const platformMap = {
    MacIntel: "macOS",
    Win32: "Windows",
    "Linux x86_64": "Linux",
    iPhone: "iOS",
    iPad: "iOS",
    Android: "Android",
    // Add other platforms as needed
  };

  return platformMap[platform] || "Unknown Platform";
}

function parseUserAgent(userAgent) {
  let browserName = "Unknown Browser";
  let browserVersion = "Unknown Version";
  let osName = "Unknown OS";

  // Detect browser name and version
  if (userAgent.includes("Chrome")) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    browserName = "Chrome";
    browserVersion = match ? match[1] : "Unknown Version";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    const match = userAgent.match(/Version\/(\d+)/);
    browserName = "Safari";
    browserVersion = match ? match[1] : "Unknown Version";
  } else if (userAgent.includes("Firefox")) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    browserName = "Firefox";
    browserVersion = match ? match[1] : "Unknown Version";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    browserName = "Internet Explorer";
    browserVersion = userAgent.match(/(MSIE|rv:)(\d+)/)[2] || "Unknown Version";
  } else if (userAgent.includes("Edge")) {
    const match = userAgent.match(/Edge\/(\d+)/);
    browserName = "Edge";
    browserVersion = match ? match[1] : "Unknown Version";
  }

  // Detect OS name
  if (userAgent.includes("Macintosh")) {
    osName = "macOS";
  } else if (userAgent.includes("Windows")) {
    osName = "Windows";
  } else if (userAgent.includes("Linux")) {
    osName = "Linux";
  } else if (userAgent.includes("Android")) {
    osName = "Android";
  } else if (userAgent.includes("like Mac OS X")) {
    osName = "iOS";
  }

  return {
    browserName,
    browserVersion,
    osName,
  };
}

function generateLoginNotification({ ipAddress, browserInfo }) {
  const { userAgent, platform } = browserInfo;
  const { browserName, browserVersion, osName } = parseUserAgent(userAgent);
  const parsedPlatform = parsePlatform(platform);

  return `Security Alert: New Login Detected\n\nWe have detected a new login to your account from a device using ${browserName} (version ${browserVersion}) on ${osName}. The login originated from the IP address ${ipAddress}.\n\nIf this was you, no further action is required. If you did not initiate this login, please secure your account immediately.\n\nThank you for ensuring your account's safety.`;
}

router.post("/", async (req, res) => {
  const { address, broadcastAddress, consentProof, deviceInfo } = req.body;

  // Validate request body
  if (typeof address !== "string") {
    res.status(400).send("Address must be a string");
    return;
  }

  if (typeof broadcastAddress !== "string") {
    res.status(400).send("Broadcast Address must be a string");
    return;
  }

  if (typeof consentProof !== "string") {
    res.status(400).send("Consent proof must be a string");
    return;
  }

  // Convert consentProof from Base64 to Uint8Array
  const consentProofUint8Array = base64ToBytes(consentProof);

  try {
    // Initialize XMTP client
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
    const xmtp = await Client.create(signer, {
      env: "production",
    });

    if (!xmtp) {
      res.status(500).send("Client not initialized");
      return;
    }

    // Decode consentProof
    const consentProofDecoded = invitation.ConsentProofPayload.decode(
      consentProofUint8Array
    );
    console.log("Creating conversation with:", {
      consentProof: consentProofDecoded,
    });

    // Create a new conversation
    const conversation = await xmtp.conversations.newConversation(
      address,
      undefined,
      consentProofDecoded
    );
    console.log("Conversation created:", conversation.topic);

    // Send greeting message
    await conversation.send(generateLoginNotification(deviceInfo));
    res.status(200).send({ topic: conversation.topic });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
