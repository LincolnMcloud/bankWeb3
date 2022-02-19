import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import BankContract from "./contracts/Bank.json"
import getWeb3 from "./getWeb3";

import "./App.css";

class ChangeScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {amount: '', account: '', value: ''};

    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeAccount = this.handleChangeAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleChangeAmount(event) {
    this.setState({amount: event.target.value});
  }

  handleChangeAccount(event) {
    this.setState({account: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.amount);
    event.preventDefault();
  }

  render(){
    if(this.props.data.container == "balance"){
      return <h4>Statement: {this.props.data.balance}</h4>
    }
    else if(this.props.data.container == "deposit"){
      return <form onSubmit={this.handleSubmit}>
        <label>
          account:
          <input type="text" value={this.state.account} onChange={this.handleChangeAccount} />
        </label>
        <label>
          amount:
          <input type="text" value={this.state.amount} onChange={this.handleChangeAmount} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    }
  }
}

class App extends Component {
  state = { web3: null, accounts: null, contract: null, balance: null, container: "balance" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BankContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BankContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getStatement = async() =>{
    const { accounts, contract } = this.state;
    var amount = await contract.methods.accounts(accounts[0]).call()
    console.log(amount)
    this.setState({balance: amount.balance})
  }

  createAccount = async() =>{
    const { accounts, contract } = this.state;
    await contract.methods.creatAccount().call()
    console.log("created")
  }

  deposit = async(_amount, _account) => {
    const { accounts, contract } = this.state;
    await contract.methods.deposit(_account).send({from: accounts[0], value: this.state.web3.utils.toWei(_amount, 'wei')})
  }

  depositScreen(){
    this.setState({container: 'deposit'})
  }

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="Body">
        <div className="App">
          <h1>Welcome to Lincoln's Bank</h1>
          <div className="accountBox">
            <div className="header">
              <h2 onClick={() => this.getStatement()}>Statement</h2>
              <h2 onClick={() => this.deposit('100', "0xd93A762dd2108609109095A35CDF5394EA5F8069")}>Deposit</h2>
              <h2>Withdraw</h2>
              <h2 onClick={() => this.createAccount()}>create account</h2>
            </div>

            <div className="accountContainer">
              <ChangeScreen data={this.state} depositFunc={this.deposit}/>  
            </div>
          </div>
          <p>Your Truffle Box is installed and ready.</p>
          <h2>Smart Contract Example</h2>
          <p>
            If your contracts compiled and migrated successfully, below will show
            a stored value of 5 (by default).
          </p>
          <p>
            Try changing the value stored on <strong>line 42</strong> of App.js.
          </p>
          <div>The stored value is: {this.state.storageValue}</div>
        </div>
      </div>
    );
  }
}

export default App;
