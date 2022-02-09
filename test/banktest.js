const { assert } = require("console");

const Bank = artifacts.require("./bank.sol")

contract("Bank", (accounts) =>{

    let instance;
    let mainaccount = accounts[1]

    before(async()=>{
        // create the instance of the contract
        // put some ether in the smart contract
        // and create an bank account for the first address in accounts

        instance = await Bank.deployed();
        var amount = web3.utils.toWei("10", "ether");
        console.log(typeof(parseInt(amount)) + ": " + parseInt(amount))

        await instance.sendTransaction({from:accounts[4],value:web3.utils.toWei("10", "ether")})
        //await instance.send({from: accounts[4], value: parseInt(amount)});
        await instance.creatAccount({from: mainaccount});
        var totaletherInContract = await instance.totalether()
        console.log(totaletherInContract)
        assert(totaletherInContract == web3.utils.toWei("10", "ether"), "transaction didn't go through")
        //assert(10000 == 10000, "10000 wasn't in the first account");
        //console.log("amount of ether in the contract: ", await instance.totalether)
    })

    describe("money transfer", () =>{

        // check if you can deposit money into your own account
        it("deposit money in your own account", async() =>{
            var amount = web3.utils.toWei("1", "ether");
            await instance.deposit(accounts[0], {from: accounts[0], value:amount});
            var depositAmount = await instance.accounts(accounts[0])
            assert(depositAmount == amount, "didn't transfer")
        })
    })

    describe()

})