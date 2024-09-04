var express = require("express");
var router = express.Router();
import { SignProtocolClient, SpMode, OffChainSignType } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";
const db = require("../db");

const privateKey = process.env.PRIVATE_KEY;

router.post("/attest", async (req, res) => {
  const { schemaId, data, indexingValue } = req.body;

  try {
    // Initialize SignProtocolClient for off-chain attestation
    const client = new SignProtocolClient(SpMode.OffChain, {
      signType: OffChainSignType.EvmEip712,
      account: privateKeyToAccount(privateKey),
    });

    // Create attestation
    const attestationInfo = await client.createAttestation({
      schemaId,
      data,
      indexingValue,
    });

    // Store attestation in the database
    const insertResult = await db.query(
      `INSERT INTO attestations (
        schema_id, data, indexing_value, attestation_id
      ) VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        schemaId,
        JSON.stringify(data),
        indexingValue,
        attestationInfo.attestationId,
      ]
    );

    // Respond with success message and created attestation data
    res.status(201).json({
      message: "Attestation created successfully",
      attestation: {
        ...attestationInfo,
        dbRecord: insertResult.rows[0],
      },
    });
  } catch (err) {
    console.error("Error creating attestation:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// API to look up an attestation by ID
router.get("/:attestationId", async (req, res) => {
  const { attestationId } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM attestations WHERE attestation_id = $1",
      [attestationId]
    );

    if (result.rows.length > 0) {
      // Attestation found, return the data
      return res.status(200).json(result.rows[0]);
    } else {
      // Attestation not found
      return res.status(404).json({ error: "Attestation not found" });
    }
  } catch (err) {
    console.error("Error looking up attestation:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
