pragma solidity >=0.6.0 <8.10.0;

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

    function getInterest(address _account) internal returns(uint){
        require(accounts[_account].owner == _account, "account doesn't exist");
        require(msg.sender == accounts[_account].owner, "can't perform operation not the owner");
        Account memory accountInfo = accounts[_account];
        uint timePassed = block.timestamp - accounts[_account].timeStamp;
        //(Simple Interest × 100)/(Principal × Time)
        uint newBalance = accountInfo.balance + uint((timePassed * interestRate * accountInfo.balance)/ (100 * 365 * 24 * 60 * 60));
        return newBalance;

    }

    function withdrawAll() public{
        require(accounts[msg.sender].owner == msg.sender, "account doesn't exist");
        address payable reciever = payable(msg.sender);
        uint amount = getInterest(reciever);

        require(totalether > amount, "There isn't enough funds in the contract");
        reciever.transfer(amount);
        accounts[msg.sender].timeStamp = block.timestamp;
        accounts[msg.sender].balance = 0;

        totalether = totalether - amount;
    }

    receive() external payable{
        totalether = totalether + msg.value;
    }
}