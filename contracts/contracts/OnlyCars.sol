// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract OnlyCars is ERC721 {
    uint256 private _nextStationId = 1;
    uint256 private _nextVehicleId = 1;

    struct Station {
        uint256 id;
        address owner;
        string metadata;
        bool isActive;
        bytes attestationUID;
    }

    struct Vehicle {
        uint256 id;
        address owner;
        string metadata;
        bytes attestationUID;
    }

    mapping(uint256 => Station) public stations;
    mapping(uint256 => Vehicle) public vehicles;
    mapping(address => uint256) public balances;

    event StationRegistered(
        uint256 indexed stationId,
        address indexed owner,
        string metadata
    );
    event VehicleRegistered(uint256 indexed vehicleId, address indexed owner);
    event BalanceTopUp(address indexed user, uint256 amount);
    event StationUsed(
        uint256 indexed stationId,
        uint256 indexed vehicleId,
        uint256 amount
    );
    event StationReported(
        uint256 indexed stationId,
        address indexed reporter,
        string issue
    );

    constructor() ERC721("OnlyCars Vehicle", "OCV") {}

    function registerStation(
        string memory metadata,
        bytes memory attestationUID
    ) external {
        // TODO: Implement signature verification for signedUID
        uint256 newStationId = _nextStationId++;

        stations[newStationId] = Station(
            newStationId,
            msg.sender,
            metadata,
            true,
            attestationUID
        );
        emit StationRegistered(newStationId, msg.sender, metadata);
    }

    function mintVehicle(
        string memory metadata,
        bytes memory attestationUID
    ) external {
        uint256 newVehicleId = _nextVehicleId++;

        _safeMint(msg.sender, newVehicleId);
        vehicles[newVehicleId] = Vehicle(
            newVehicleId,
            msg.sender,
            metadata,
            attestationUID
        );
        emit VehicleRegistered(newVehicleId, msg.sender);
    }

    function topUp() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit BalanceTopUp(msg.sender, msg.value);
    }

    function useStation(
        uint256 stationId,
        uint256 vehicleId,
        uint256 amount
    ) external {
        require(stations[stationId].isActive, "Station is not active");
        require(ownerOf(vehicleId) == msg.sender, "You don't own this vehicle");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        payable(stations[stationId].owner).transfer(amount);

        emit StationUsed(stationId, vehicleId, amount);
    }

    function reportStation(uint256 stationId, string memory issue) external {
        require(stations[stationId].isActive, "Station is not active");
        emit StationReported(stationId, msg.sender, issue);
    }

    // Additional helper functions can be added here
}
