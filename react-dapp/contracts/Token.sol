pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Token {
    string public name = "Calvin Torra";
    string public symbol = "NDT";
    uint public totalSupply = 1000000;
    mapping(address => uint) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _amount) external {
        require(balances[msg.sender] >= _amount, "Not enough Tokens");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function balanceOf(address _account) external view returns (uint) {
        return balances[_account];
    }
}