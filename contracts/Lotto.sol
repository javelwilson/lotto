pragma solidity ^0.4.25;

contract Lotto {
    address public manager;
    uint public entryFee;
    address[] players;
    address[] previousWinners;

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

    function pickWinner() public {
        require(msg.sender == manager);
        uint index = random();
        address winner = players[index];
        previousWinners.push(winner);
        players = new address[](0);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, manager, players, previousWinners))) % players.length;
    }

    function getPreviousWinners() public view returns (address[]) {
        return previousWinners;
    }
}