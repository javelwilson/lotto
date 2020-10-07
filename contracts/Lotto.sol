pragma solidity ^0.4.25;

contract Lotto {
    address public manager;
    uint public entryFee;

    constructor(uint amount) {
        require(amount * 1 ether >= 1 ether)
        manager = msg.sender;
        entryFee = amount;
    }
}