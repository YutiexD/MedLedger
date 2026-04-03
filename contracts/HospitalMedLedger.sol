// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract HospitalMedLedger is AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    mapping(uint256 => address) public bookings;

    event SlotBooked(uint256 indexed slotId, address indexed patient);
    event SlotCancelled(uint256 indexed slotId, address indexed patient);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function bookSlot(uint256 slotId) public {
        require(bookings[slotId] == address(0), "Slot already booked");
        bookings[slotId] = msg.sender;
        emit SlotBooked(slotId, msg.sender);
    }

    function cancelSlot(uint256 slotId) public {
        require(bookings[slotId] == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized to cancel");
        address patient = bookings[slotId];
        bookings[slotId] = address(0);
        emit SlotCancelled(slotId, patient);
    }
}
