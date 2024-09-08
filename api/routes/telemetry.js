var express = require("express");
var router = express.Router();
const { ethers } = require("ethers");
const axios = require("axios");
require("dotenv/config");
const db = require("../db");

const enabledSignerPrivateKey = `0x${process.env.ENABLED_SIGNER_PRIVATE_KEY}`;
const privateKey = `0x${process.env.PRIVATE_KEY}`;

const enabledSigner = new ethers.Wallet(enabledSignerPrivateKey);
const dimoSigner = new ethers.Wallet(privateKey);

router.get("/signals", async (req, res) => {
  const { tokenId } = req.query;

  console.log("tokenId:", tokenId);

  try {
    const client_id = "0x87e083178D8E8f7001b1c42ACDEA6B96b64dE888";
    const domain = "http://onlycars-api.thedanielmark.app";
    const scope = "openid+email";
    const response_type = "code";
    const address = client_id;

    const web3ChallengeResponse = await axios.post(
      `https://auth.dimo.zone/auth/web3/generate_challenge?client_id=${client_id}&domain=${domain}&response_type=${response_type}&scope=${scope}&address=${address}`
    );

    const state = web3ChallengeResponse.data.state;
    const challenge = web3ChallengeResponse.data.challenge;

    console.log(challenge && "Got challenge");

    // Sign the challenge with the private key
    const signature = await enabledSigner.signMessage(challenge);
    const grant_type = "authorization_code";

    // Submit signed challenge to DIMO as x-www-form-urlencoded
    const accessTokenResponse = await axios.post(
      `https://auth.dimo.zone/auth/web3/submit_challenge`,
      {
        client_id,
        state,
        grant_type,
        domain,
        signature,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(signature && "Got signature");

    const access_token = accessTokenResponse.data.access_token;
    const id_token = accessTokenResponse.data.id_token;

    console.log(access_token && "Got access token");

    const nftContractAddress = "0xbA5738a18d83D41847dfFbDC6101d37C69c9B0cF";
    const privileges = [1];

    // Token exchange for priveledged access token
    const tokenExchangeResponse = await axios.post(
      `https://token-exchange-api.dimo.zone/v1/tokens/exchange`,
      {
        nftContractAddress,
        privileges,
        tokenId: parseInt(tokenId),
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const priveledgedAccessToken = tokenExchangeResponse?.data?.token;

    console.log(priveledgedAccessToken && "Got priveledged access token");

    // Call the telemetry API (graphql) with the access token
    const signalsResponse = await axios
      .post(
        "https://telemetry-api.dimo.zone/query",
        {
          query: `
            query {
              signalsLatest(
                  tokenId: ${parseInt(tokenId)} 
              ) {
                  powertrainRange {
                    timestamp
                    value
                  }
                  powertrainTractionBatteryChargingChargeLimit {
                    timestamp
                    value
                  }
                  powertrainTractionBatteryChargingIsCharging {
                    timestamp
                    value
                  }
                  powertrainTractionBatteryCurrentPower {
                    timestamp
                    value
                  }
                  powertrainTractionBatteryStateOfChargeCurrent {
                    timestamp
                    value
                  }
                  powertrainTransmissionTravelledDistance {
                    timestamp
                    value
                  }
                  speed {
                    timestamp
                    value
                  }
                }
            }
          `,
          variables: {},
        },
        {
          headers: {
            Authorization: `Bearer ${priveledgedAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.log("Error fetching telemetry API:", err);
      });

    console.log("signalsResponse", signalsResponse);
    const signals = signalsResponse?.data?.data?.signalsLatest;

    // Respond with success message and created attestation data
    res.status(200).json({
      signals: signals,
      access_token,
      // id_token,
    });
  } catch (err) {
    console.error(
      "Error fetching signals:",
      err?.response?.data?.message || err
    );
    res.status(500).json({
      error: "Server error",
      message: err?.response?.data?.message || err,
    });
  }
});

module.exports = router;
