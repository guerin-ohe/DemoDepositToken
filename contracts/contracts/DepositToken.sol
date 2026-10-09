// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { BaseToken } from "contracts/BaseToken.sol";

contract DepositToken is BaseToken {

constructor(
       string memory name_,
       string memory symbol_
   ) BaseToken(name_, symbol_) { }
}
