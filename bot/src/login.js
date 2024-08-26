import jwt from "jsonwebtoken";
import fs from "fs";

var privateKey = fs.readFileSync("../../../privateKey.pem");

var token = jwt.sign(
  {
    email: "danielmark.uc@gmail.com",
    aud: "xmtp", // -> to be used in Custom Authentication as JWT Field
    iss: "https://onlycars.thedanielmark.app",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  },
  privateKey,
  { algorithm: "RS256", keyid: "031f0ebf7cf3f5f40f159063b" }
);

console.log(token);
