import Nweetchain from '../abis/Nweetchain.json'
import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    // var nweetchainContract = window.web3.Contract([{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"hash","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"tipAmount","type":"uint256"},{"indexed":false,"internalType":"address payable","name":"author","type":"address"}],"name":"ImageCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"hash","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"tipAmount","type":"uint256"},{"indexed":false,"internalType":"address payable","name":"author","type":"address"}],"name":"ImageTipped","type":"event"},{"constant":true,"inputs":[],"name":"imageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"images","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"tipAmount","type":"uint256"},{"internalType":"address payable","name":"author","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"tipImageOwner","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_imgHash","type":"string"},{"internalType":"string","name":"_description","type":"string"}],"name":"uploadImage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    // const networkData = Decentragram.networks[networkId]
    // if(networkData) {
      const nweetchain = new web3.eth.Contract(Nweetchain, "0x1eAe2dDaBa3b10F19d759c18ADDa6CbbbB130CF3")
      this.setState({ nweetchain })
      const nweetsCount = await nweetchain.methods.nweetCount().call({from: this.state.account})
      this.setState({ nweetsCount })
      console.log(nweetsCount);
      // Load images
      for (var i = 1; i <= nweetsCount; i++) {
        const nweet = await nweetchain.methods.nweets(i).call({from: this.state.account})
        console.log(nweet);
        this.setState({
          nweets: this.state.nweets?[...this.state.nweets, nweet]:[nweet]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        nweets: this.state.nweets.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    // } else {
    //   window.alert('Decentragram contract not deployed to detected network.')
    // }
  }

  
  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadNweet = description => {
    console.log("Submitting file to ipfs...")

    if(this.state.buffer){
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Ipfs result', result)
        if(error) {
          console.error(error);
          return;
        }
  
        this.setState({ loading: true })
        this.state.nweetchain.methods.uploadNweet(result[0].hash).send({ from: this.state.account }).on('transactionHash', (hash) => {
          this.setState({ loading: false })
        })
      })
    }else{
      this.setState({ loading: true })
      this.state.nweetchain.methods.uploadNweet(description,"").send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    }
    //adding file to the IPFS
    
  }

  tipNweetOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.nweetchain.methods.tipNweetOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      decentragram: null,
      images: [],
      loading: true
    }

    this.uploadNweet = this.uploadNweet.bind(this)
    this.tipNweetOwner = this.tipNweetOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  render() {
    return (
      <div className="app">
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center"><p>Loading...</p></div>
          : <Main
              nweets={this.state.nweets}
              captureFile={this.captureFile}
              uploadNweet={this.uploadNweet}
              tipNweetOwner={this.tipNweetOwner}
            />
        }
      </div>
    );
  }
}

export default App;