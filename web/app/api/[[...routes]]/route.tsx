/** eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { pinata } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const app = new Frog({
  title: "OnlyCars",
  assetsPath: "/",
  basePath: "/api",
  hub: pinata(),
  imageOptions: {
    fonts: [{ name: "Krona One", source: "google" }],
  },
});

app.frame("/test/:name", async (c) => {
  const params = c.req.param();

  return c.res({
    image: (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgb(39 39 42)",
          fontSize: 32,
          fontWeight: 600,
          color: "white",
        }}
      >
        Hello {params.name}!
      </div>
    ),
    // intents: [
    //   <Button.Link
    //     href={`https://dropcast.thedanielmark.app/claim/${airdropId}`}
    //   >
    //     Claim now
    //   </Button.Link>,
    //   <Button.Link
    //     href={`https://base-sepolia.easscan.org/attestation/view/${airdrop.attestationId}`}
    //   >
    //     Verify Attestation
    //   </Button.Link>,
    // ],
  });
});

app.composerAction(
  "/composer",
  (c) => {
    return c.res({
      title: "OnlyCars",
      url: "https://onlycars.thedanielmark.app/",
    });
  },
  {
    name: "OnlyCars Composer action",
    description:
      "OnlyCars is an EV charging network on the blockchain that allows users to find and pay for charging stations using cryptocurrency.",
    icon: "image",
    imageUrl: "https://onlycars.thedanielmark.app/logo.png",
  }
);

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
