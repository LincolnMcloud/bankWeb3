const { assert } = require("console");

const Bank = artifacts.require("./bank.sol")

contract("Bank", (accounts) =>{

    let instance;
    let mainaccount = accounts[1]

    before(async()=>{
        // create the instance of the contract
        // put some ether in the smart contract
        // and create an bank account for the first address in accounts

        instance = await Bank.new();
        var amount = web3.utils.toWei("10", "ether");
        await instance.send({from: accounts[4], value:amount.toNumber()});
        await instance.creatAccount({from: mainaccount});

        assert.equal(instance.totalether() > 0, "transaction didn't go through")
        console.log("amount of ether in the contract: ", instance.totalether())
    })

    describe("money transfer", () =>{

        // check if you can deposit money into your own account
        it("deposit money in your own account", async() =>{
            var amount = web3.utils.toWei("1", "ether");
            await instance.deposit(accounts[0], {from: accounts[0], value:amount});
            console.log(instance.accounts(accounts[0]))
            //assert.equal(instance.accounts(accounts[0]))
        })
    })

})