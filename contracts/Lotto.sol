pragma solidity ^0.4.25;

contract Lotto {
    address public manager;
    uint public entryFee;
    address[] players;

    constructor(uint amount) public {
        require(amount * 1 ether >= 1 ether);
        manager = msg.sender;
        entryFee = amount * 1 ether;
    }

    function enter() public payable {
        require(msg.sender != manager);
        require(msg.value == entryFee);
        players.push(msg.sender);
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }
}