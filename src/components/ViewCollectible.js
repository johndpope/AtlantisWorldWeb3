import Web3 from 'web3';
import React, { Component } from 'react';
import './ViewCollectable.css';
import AssetFactory from '../abis/Assets.json'
import Batch from '../abis/Batch.json'
import { Table } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

class ViewCollectable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tokenId: null,
            authenticate: null,
            batchContract: null,
            allCollections: []
        }

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
            const assetFactory = new web3.eth.Contract(AssetFactory.abi, networkData.address)
            this.setState({ assetFactory })
            
            this.setState({ loading: false })

            const collectionCounter = await this.state.assetFactory.methods.tokenCounter().call();
            const arr = []
            if (collectionCounter)
                for (let i = 1; i <= collectionCounter; i++) {
                    arr.push(await this.state.assetFactory.methods.AssetNfts(i).call());
                }
            
            this.setState({ allCollections: arr});
        } else {    
            window.alert("Asset contract is not deployed to detected network")
        }
    }

    async handleFileInput(e) {
        this.setState({ loading: true })
    }

    render() {
        return (
            <div className="container">
                <center style={{marginTop: '15vh'}}>
                    {
                        !this.state.allCollections.length
                            ? <p> No collections </p>
                            : (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Hash</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.allCollections.map((item, key) => {
                                                console.log(item, item.totalPrice)
                                                return (
                                                    <tr key={key + 1}>
                                                        <td>{key + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.ipfsHash}</td>
                                                        <td>{item.price / 1e18 }</td>
                                                        <td onClick={
                                                            () => this.props.history.push({
                                                                pathname: '/View',
                                                                state: { url: item.ipfsHash }
                                                            })
                                                        }>View nfts</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            )
                    }
                </center>
            </div>
        );
    }
}


export default withRouter(ViewCollectable);
