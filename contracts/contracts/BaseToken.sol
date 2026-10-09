// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

// ajouter burnable et pausable ?

contract BaseToken is ERC20, Ownable, ERC20Burnable, ERC20Pausable {
   mapping(address => bool) public minters;

   event MinterSet(address indexed account, bool allowed);

   constructor(
       string memory name_,
       string memory symbol_
   ) ERC20(name_, symbol_) Ownable(msg.sender) {
        minters[msg.sender] = true; 
   }

   modifier onlyMinter() {
       require(minters[msg.sender], "Not minter");
       _;
   }

    // update
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }

    // setMinter
    function setMinter(address account, bool allowed) external onlyOwner {
       minters[account] = allowed;
       emit MinterSet(account, allowed);
    }

    function checkMint(address account) public view returns(bool) {
        return minters[account];
    }

    // pausable
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // deposit/wirhdraw
    function deposit(address to, uint256 amount) external onlyMinter {
       _mint(to, amount);
    }

    function withdraw(address from, uint256 amount) external onlyMinter {
       _burn(from, amount);
    }
}
