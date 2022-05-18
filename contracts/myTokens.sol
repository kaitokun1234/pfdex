// SPDX-License-Identifier: Unlicence
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract DAI is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("Dai", "DAI") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract LINK is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("ChainLink", "LINK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract COMP is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("Compound", "COMP") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}