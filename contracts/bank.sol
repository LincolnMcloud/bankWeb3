pragma solidity >=0.4.21 <8.10.0;

contract Bank{

    struct Account{
        address owner;
        uint balance;
        uint depositTime;
    }

    mapping(address => Account) public accounts;
    uint public interestRate = 3;


    function creatAccount() public{
        Account memory newAccount = Account(msg.sender, 0, 0);
        accounts[msg.sender] = newAccount;
    }

    function deposit() public payable{
        require(msg.value > 0, "Insuffienct amount of funds");
        accounts[msg.sender].balance = accounts[msg.sender].balance + msg.value;
        // add interest
    }

    // function interestCal() internal{

    // }
}