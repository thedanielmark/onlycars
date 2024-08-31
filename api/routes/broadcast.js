const express = require("express");
const { sendBroadcastMessage } = require("../broadcast-func");

const router = express.Router();

router.post("/broadcast", (req, res) => {
  const { address, message } = req.body;

  // Call the sendBroadcastMessage function with the address and message
  sendBroadcastMessage(address, message);

  res.status(200).json({ success: true });
});

module.exports = router;
