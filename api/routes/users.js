var express = require("express");
var router = express.Router();
const db = require("../db");

// API to look up a user by email and insert if not found
router.post("/", async (req, res) => {
  const {
    appState,
    email,
    aggregateVerifier,
    name,
    profileImage,
    typeOfLogin,
    verifier,
    verifierId,
    dappShare,
    isMfaEnabled,
  } = req.body;

  try {
    // Check if the user already exists
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      // User exists, return the user data with status 200
      return res.status(200).json(result.rows[0]);
    }

    // User does not exist, insert the new user
    const insertResult = await db.query(
      `INSERT INTO users (
        app_state, email, aggregate_verifier, name, profile_image, type_of_login,
        verifier, verifier_id, dapp_share,
        is_mfa_enabled
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`,
      [
        appState,
        email,
        aggregateVerifier,
        name,
        profileImage,
        typeOfLogin,
        verifier,
        verifierId,
        dappShare,
        isMfaEnabled,
      ]
    );

    // Respond with success message and created user data
    res.status(201).json({
      message: "User created successfully",
      user: insertResult.rows[0],
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
