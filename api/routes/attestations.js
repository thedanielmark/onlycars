var express = require("express");
var router = express.Router();
const {
  SignProtocolClient,
  SpMode,
  OffChainSignType,
} = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");
require("dotenv/config");
const db = require("../db");

const privateKey = `0x${process.env.PRIVATE_KEY}`;

router.post("/attest", async (req, res) => {
  let { schemaId, data, indexingValue, type } = req.body;

  // vehicleSchemaId = `SPS_WZ-U7wZdMJyBJnWJsWJ0s`;

  console.log("Creating attestation with data:", schemaId);

  try {
    // Initialize SignProtocolClient for off-chain attestation
    const client = new SignProtocolClient(SpMode.OffChain, {
      signType: OffChainSignType.EvmEip712,
      account: privateKeyToAccount(privateKey),
    });

    let attestationInfo;

    if (type === "vehicle") {
      // Create attestation for vehicles
      attestationInfo = await client.createAttestation({
        schemaId,
        data: {
          deviceDefinitionId: data.deviceDefinitionId, // "EV-2023-TESLA-M3-LR-01",
          name: data.name, // "Tesla Model 3 Long Range",
          make: data.make, // "Tesla",
          model: data.model, // "Model 3",
          year: data.year, // "2023",
          chargerType: data.chargerType, // "Level 2",
          connectorType: data.connectorType, // "J1772",
        },
        indexingValue,
      });
    } else {
      // Create attestation for charging stations
      attestationInfo = await client.createAttestation({
        schemaId,
        data: {
          name: data.name,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          chargers: data.chargers,
          fastChargerConnectors: data.fastChargerConnectors,
          rapidChargerConnectors: data.rapidChargerConnectors,
          slowChargerConnectors: data.slowChargerConnectors,
        },
        indexingValue,
      });
    }

    console.log("Attestation Info:", attestationInfo);

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
