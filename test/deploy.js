const {expect,assert} =require("chai");
const {BigNumber} = require("ethers");
const {ethers,waffle,artifacts} =require("hardhat");
const hre=require("hardhat");

const {DAI,DAI_WHALE,POOL_ADDRESS_PROVIDER}=require("../config")


describe("Deploy a flash loan", function (){
    it("Should take a flash loan and be able to return it", async function(){
        const flasloancontract=await ethers.getContractFactory("FlashLoanExample");
        const _flashloanContract=await flasloancontract.deploy(
            POOL_ADDRESS_PROVIDER
        );
        await _flashloanContract.deployed();

        const token = await ethers.getContractAt("IERC20",DAI);
        const balanceAmountInContract=ethers.utils.parseEther("2000");

        //Impersonating the DAI_WHALE and signing the transaction on the local development network
        await hre.network.provider.request({
            method:"hardhat_impersonateAccount",
            params:[DAI_WHALE],
        });
        const signer= await ethers.getSigner(DAI_WHALE);
        await token.connect(signer).transfer(_flashloanContract.address,balanceAmountInContract)// This will sen 2000 DAI to  our contract from DAI_WHALE

        const tx=await _flashloanContract.createFlashLoan(DAI,1000);
        const remainingBalance= await token.balanceOf(_flashloanContract.address);
        expect(remainingBalance.lt(balanceAmountInContract)).to.be.true;//this should be less tahn 2000
    });
});