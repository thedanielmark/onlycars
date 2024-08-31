var express = require("express");
var router = express.Router();
var { isAddressOnXmtpNetwork } = require("../utils/check-user-on-xmtp");

// Endpoint to check if an address is registered on the XMTP network
router.post("/", async (req, res) => {
  const { address } = req.body;

  console.log("Checking address:", address);

  try {
    // Check if the address is on the XMTP network
    const isOnNetwork = await isAddressOnXmtpNetwork(address);

    if (isOnNetwork) {
      // Address is on the XMTP network
      res.status(200).json({
        registered: true,
        message: `Address ${address} is on the XMTP network.`,
      });
    } else {
      // Address is not on the XMTP network
      res.status(404).json({
        registered: false,
        message: `Address ${address} is not on the XMTP network.`,
      });
    }
  } catch (error) {
    console.error("Error checking XMTP network:", error);
    res.status(500).json({ error: "Failed to check address on XMTP network" });
  }
});

module.exports = router;
