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

router.post("/", async (req, res) => {
  const { address, broadcastAddress, consentProof } = req.body;

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
    await conversation.send(
      "You are now subscribed to receive updates from OnlyCars on any XMTP enabled platform!"
    );
    res.status(200).send({ topic: conversation.topic });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
