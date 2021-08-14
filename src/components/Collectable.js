
import Web3 from 'web3';
import React, { Component } from 'react';
import axios from "axios";
import cors from 'cors';
import ImageUploader from 'react-images-upload';

import './Collectable.css';
//import TokenFactory from '../abis/TokenFactory.json'
import AssetFactory from '../abis/Assets.json'
import AirdropNFT from '../abis/AirdropNFT.json'

require('dotenv').config();

const { create } = require('ipfs-http-client')
const client = create('http://ipfs.infura.io:5001')


class CreateHash extends Component {
    constructor(props) {
        super(props)

        this.state = {
            account: '',
            name: '',
            loading: true,
            description: '',
            buffer: null,
            image: '',
            ipfsHash: '',
            touched: {
                name: false,
                symbol: false
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this)
        this.loadBlockchainData = this.loadBlockchainData.bind(this)
    }

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) window.web3 = new Web3(window.web3.currentProvider)
        else window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })

        const networkId = await web3.eth.net.getId()
        const networkData = AssetFactory.networks[networkId]

        if (networkData) {
            // const tokenFactory = new web3.eth.Contract(TokenFactory.abi, networkData.address)
            // this.setState({ tokenFactory })

            const assetFactory = new web3.eth.Contract(AssetFactory.abi, networkData.address)
            this.setState({ assetFactory })

            const airdropNFT = new web3.eth.Contract(AirdropNFT.abi, networkData.address)
            this.setState({ airdropNFT })

            this.setState({ loading: false })

        } else {
            window.alert("Asset contract is not deployed to detected network")
        }
    }

    async handleSubmit(event) {
        event.preventDefault()
        //console.log(process.env.METAMASK_WALLET_SECRET);
        
        if (this.state.ipfsHash) {  
            console.log();
            await this.state.assetFactory.methods.createCollectible(
                this.state.name,
                window.web3.utils.toWei(this.state.price.toString(), 'Ether') || 0,
                this.state.ipfsHash
            )
            .send({ from: this.state.account })
            .once('receipt', (receipt) => {
                this.setState({ loading: false })
            })

        } else {
            alert('Document still uploading on IPFS')
        }
    }

    async handleFileInput(e) {
        try  {
            this.setState({ loading: true })
            console.log('minor changes');
            let file;
        
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onloadend = async () => {
                this.setState({ buffer: Buffer(reader.result) })
                await client.add(this.state.buffer)
                    .then(function (result) {
                        file = `https://ipfs.io/ipfs/${result.path}`
                        console.log('file', result.path);
                    })

                console.log('file out', file);
                this.setState({ image: file });

                let ipfsHash;
                // await client.add(Buffer.from(JSON.stringify({
                //     "name": this.state.name,
                //     "image": this.state.image,
                //     "description": this.state.description
                //     //"price": this.state.price
                // })))
                //     .then(function (result) {
                //         console.log('r', result.path);
                //         //this.setState({ ipfsHash: `https://ipfs.io/ipfs/${result.path}` })
                //         ipfsHash = `https://ipfs.io/ipfs/${result.path}`
                //         console.log('IPFS', ipfsHash)
                //     })
                //     .catch(function (err) {
                //         console.log('Fail: ', err)
                //     })
                
                // console.log(ipfsHash);
                // this.setState({ ipfsHash: ipfsHash })
                const data = {
                    name: this.state.name,
                    image: this.state.image,
                    price: this.state.price || 0
                }

                console.log('here', data);
                let data1 = await axios.post(`https://api.nft.storage/upload`, data, {
                    headers: {
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDUyRjBjYmVDZGY4NzZmMjI2YURkNDkzRjRCZjJEM2NDYTJCOEI0NUQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODYyMTQ3ODkzNSwibmFtZSI6InVwbG9hZEFrIn0.mHurMAGI5S9-g3VnBja0q4vnHuQUmG6C07GvKSR7V5Q"
                    }
                }).then(res =>{
                    ipfsHash = `https://api.nft.storage/${res.data.value.cid}`
                    console.log('nft Storage', res.data.value.cid);
                    console.log(res.data);
                })

                console.log('data', ipfsHash);
                
                this.setState({ ipfsHash: ipfsHash })
                this.setState({ loading: false })
                alert('Image pinned to nft storage')
                console.log('ip',this.state);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div className="main">
                <form onSubmit={this.handleSubmit}>
                    <div className="container">

                        <div className="form-el">
                            <label className='text-header1'>Name of the Asset</label> <br />
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.name}
                                onChange={event => this.setState({ name: event.target.value })}
                            />
                        </div>

                        <div className="form-el">
                            <label className='text-header1'>Price</label> <br />
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.price}
                                onChange={event => this.setState({ price: event.target.value })}
                            />
                        </div>

                        <div className="form-el">
                            <label className='text-header1'>Image</label>
                            <input
                                id="myFile"
                                className="button-file"
                                name="filename"
                                type="file"
                                onChange={(e) => this.handleFileInput(e)}
                            />
                        </div>

                        <button type="submit" className="Button">Create</button>
                    </div>
                </form>
            </div>
        );
    }
}


export default CreateHash;
