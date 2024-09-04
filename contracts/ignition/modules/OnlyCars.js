const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("OnlyCarsModule", (m) => {
  const onlyCars = m.contract("OnlyCars", []);

  return { onlyCars };
});
