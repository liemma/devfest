// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonCredit {
    struct Credit {
        uint256 id;
        string name;
        uint256 value;
        address owner;
        bool forSale;
    }

    Credit[] public credits;
    address public owner;

    event CreditPurchased(uint256 indexed creditId, address indexed buyer, uint256 price);

    constructor() {
        owner = msg.sender;
        // Initialize with some mock credits
        credits.push(Credit(1, "Solar Offset", 0.02 ether, owner, true));
        credits.push(Credit(2, "Reforestation Credit", 0.05 ether, owner, true));
    }

    function buyCredit(uint256 creditId) external payable {
        require(creditId < credits.length, "Credit does not exist");
        Credit storage credit = credits[creditId];
        require(credit.forSale, "Credit is not for sale");
        require(msg.value >= credit.value, "Insufficient funds");

        address previousOwner = credit.owner;
        credit.owner = msg.sender;
        credit.forSale = false;

        payable(previousOwner).transfer(msg.value);

        emit CreditPurchased(creditId, msg.sender, msg.value);
    }

    function listCreditForSale(uint256 creditId, uint256 price) external {
        require(creditId < credits.length, "Credit does not exist");
        Credit storage credit = credits[creditId];
        require(credit.owner == msg.sender, "You are not the owner");

        credit.value = price;
        credit.forSale = true;
    }

    function getCredits() external view returns (Credit[] memory) {
        return credits;
    }
}