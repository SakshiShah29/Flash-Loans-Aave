//SPDX-License-Identifier:MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

 contract FlashLoanExample is FlashLoanSimpleReceiverBase {
    using SafeMath for uint;
    event Log(address asset, uint val);

    constructor(
        IPoolAddressesProvider provider
    ) FlashLoanSimpleReceiverBase(provider) {}

    function createFlashLoan(address asset, uint amount) external {
        address receiver = address(this);
        bytes memory params = ""; // use this to pass arbitrary data to executeOperation
        uint16 referralCode = 0;

        POOL.flashLoanSimple(receiver, asset, amount, params, referralCode);
    }

    function excecuteOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata prarams
    ) external returns (bool) {
        //do things like arbritrage and liquidations

        uint amountToPayBack = amount.add(premium);
        IERC20(asset).approve(address(POOL), amountToPayBack);
        emit Log(asset, amountToPayBack);
        return true;
    }
}
