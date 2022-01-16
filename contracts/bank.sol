pragma solidity >=0.4.21 <8.10.0;

contract Bank{

    struct Account{
        address owner;
        uint balance;
        uint timeStamp;
    }

    mapping(address => Account) public accounts;
    uint public interestRate = 3;
    uint public totalether = 0;


    function creatAccount() public{
        Account memory newAccount = Account(msg.sender, 0, 0);
        accounts[msg.sender] = newAccount;
    }

    function deposit(address _account) public payable{
        require(msg.value > 0, "Insuffienct amount of funds");
        accounts[_account].balance = accounts[_account].balance + msg.value;
        accounts[_account].timeStamp = block.timestamp;
        totalether = totalether + msg.value;
        // add interest
    }

    function getBalance(address _account) public returns(uint){
        require(accounts[_account].owner == _account, "account doesn't exist");
        Account memory accountInfo = accounts[_account];
        uint timePassed = block.timestamp - accounts[_account].timeStamp;
        //(Simple Interest × 100)/(Principal × Time)
        uint newBalance = accountInfo.balance + uint((timePassed * interestRate * accountInfo.balance)/ (100 * 365 * 24 * 60 * 60));
        return newBalance;

    }

    function withdrawAll() public{
        require(accounts[msg.sender].owner == msg.sender, "account doesn't exist");
        address payable reciever = payable(msg.sender);
        uint amount = getBalance(reciever);

        require(totalether > amount, "There isn't enough funds in the contract");
        reciever.transfer(amount);
        accounts[msg.sender].timeStamp = block.timestamp;

        totalether = totalether - amount;
    }

    fallback() external payable{
        totalether = totalether + msg.value;
    }
}