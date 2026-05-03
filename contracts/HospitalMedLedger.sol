// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract HospitalMedLedger is AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    struct Doctor {
        address wallet;
        string name;
        string specialization;
        bool isActive;
    }

    struct Booking {
        uint256 slotId;
        address patient;
        bool isBooked;
    }

    struct ClinicalRecord {
        string medicines;
        string notes;
        bool exists;
    }

    mapping(address => Doctor) public doctors;
    mapping(uint256 => Booking) public bookings;
    mapping(uint256 => ClinicalRecord) public records;
    address[] public doctorList;

    event SlotBooked(uint256 indexed slotId, address indexed patient, address indexed doctor);
    event SlotCancelled(uint256 indexed slotId, address indexed patient);
    event DoctorAdded(address indexed wallet, string name, string specialization);
    event DoctorRemoved(address indexed wallet);
    event PrescriptionIssued(uint256 indexed slotId, address indexed doctor, address indexed patient);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addDoctor(address _wallet, string memory _name, string memory _specialization) public onlyRole(DEFAULT_ADMIN_ROLE) {
        doctors[_wallet] = Doctor(_wallet, _name, _specialization, true);
        _grantRole(DOCTOR_ROLE, _wallet);
        doctorList.push(_wallet);
        emit DoctorAdded(_wallet, _name, _specialization);
    }

    function removeDoctor(address _wallet) public onlyRole(DEFAULT_ADMIN_ROLE) {
        doctors[_wallet].isActive = false;
        _revokeRole(DOCTOR_ROLE, _wallet);
        emit DoctorRemoved(_wallet);
    }
    
    function bookSlot(uint256 slotId, address doctor) public {
        require(!bookings[slotId].isBooked, "Slot already booked");
        bookings[slotId] = Booking(slotId, msg.sender, true);
        emit SlotBooked(slotId, msg.sender, doctor);
    }

    function cancelSlot(uint256 slotId) public {
        require(bookings[slotId].patient == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized to cancel");
        address patient = bookings[slotId].patient;
        delete bookings[slotId];
        emit SlotCancelled(slotId, patient);
    }

    function getDoctor(address _wallet) public view returns (Doctor memory) {
        return doctors[_wallet];
    }

    function issuePrescription(uint256 slotId, string memory _medicines, string memory _notes) public onlyRole(DOCTOR_ROLE) {
        require(bookings[slotId].isBooked, "Slot is not booked");
        require(!records[slotId].exists, "Record already exists for this slot");
        
        records[slotId] = ClinicalRecord(_medicines, _notes, true);
        emit PrescriptionIssued(slotId, msg.sender, bookings[slotId].patient);
    }
}

