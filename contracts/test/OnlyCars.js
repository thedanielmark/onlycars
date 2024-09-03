const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("OnlyCars", function () {
  async function deployOnlyCarsFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const OnlyCars = await ethers.getContractFactory("OnlyCars");
    const onlyCars = await OnlyCars.deploy();

    return { onlyCars, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { onlyCars } = await loadFixture(deployOnlyCarsFixture);
      expect(await onlyCars.name()).to.equal("OnlyCars Vehicle");
      expect(await onlyCars.symbol()).to.equal("OCV");
    });
  });

  describe("Station Registration", function () {
    it("Should register a station", async function () {
      const { onlyCars, owner } = await loadFixture(deployOnlyCarsFixture);
      const metadata = "ipfs://station-metadata";
      const signedUID = "0x"; // Placeholder for signature

      await expect(onlyCars.registerStation(metadata, signedUID))
        .to.emit(onlyCars, "StationRegistered")
        .withArgs(1, owner.address, metadata);

      const station = await onlyCars.stations(1);
      expect(station.owner).to.equal(owner.address);
      expect(station.metadata).to.equal(metadata);
      expect(station.isActive).to.be.true;
    });
  });

  describe("Vehicle Minting", function () {
    it("Should mint a vehicle", async function () {
      const { onlyCars, owner } = await loadFixture(deployOnlyCarsFixture);

      await expect(onlyCars.mintVehicle())
        .to.emit(onlyCars, "VehicleRegistered")
        .withArgs(1, owner.address);

      expect(await onlyCars.ownerOf(1)).to.equal(owner.address);
      const vehicle = await onlyCars.vehicles(1);
      expect(vehicle.owner).to.equal(owner.address);
    });
  });

  describe("Balance Top-up", function () {
    it("Should allow topping up balance", async function () {
      const { onlyCars, owner } = await loadFixture(deployOnlyCarsFixture);
      const topUpAmount = ethers.parseEther("1");

      await expect(onlyCars.topUp({ value: topUpAmount }))
        .to.emit(onlyCars, "BalanceTopUp")
        .withArgs(owner.address, topUpAmount);

      expect(await onlyCars.balances(owner.address)).to.equal(topUpAmount);
    });
  });

  describe("Station Usage", function () {
    it("Should allow using a station", async function () {
      const { onlyCars, owner, otherAccount } = await loadFixture(
        deployOnlyCarsFixture
      );
      const stationMetadata = "ipfs://station-metadata";
      const signedUID = "0x"; // Placeholder for signature
      const useAmount = ethers.parseEther("0.5");

      // Register station
      await onlyCars
        .connect(otherAccount)
        .registerStation(stationMetadata, signedUID);

      // Mint vehicle
      await onlyCars.mintVehicle();

      // Top up balance
      await onlyCars.topUp({ value: ethers.parseEther("1") });

      // Use station
      await expect(onlyCars.useStation(1, 1, useAmount))
        .to.emit(onlyCars, "StationUsed")
        .withArgs(1, 1, useAmount);

      expect(await onlyCars.balances(owner.address)).to.equal(
        ethers.parseEther("0.5")
      );
    });
  });

  describe("Station Reporting", function () {
    it("Should allow reporting a station", async function () {
      const { onlyCars, owner, otherAccount } = await loadFixture(
        deployOnlyCarsFixture
      );
      const stationMetadata = "ipfs://station-metadata";
      const signedUID = "0x"; // Placeholder for signature
      const issue = "Station not working";

      // Register station
      await onlyCars.registerStation(stationMetadata, signedUID);

      // Report station
      await expect(onlyCars.connect(otherAccount).reportStation(1, issue))
        .to.emit(onlyCars, "StationReported")
        .withArgs(1, otherAccount.address, issue);
    });
  });

  // Add more tests for other functionalities...
});
