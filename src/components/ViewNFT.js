import Web3 from 'web3';
import React, { Component } from 'react';
import './Collectable.css';
import AssetFactory from '../abis/Assets.json'
import Batch from '../abis/Batch.json'
import { Table } from 'react-bootstrap';
import axios from "axios";

class ViewNFT extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tokenId: null,
            authenticate: null,
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

        console.log(this.props.location.state);

        let ipfsdata
        let data = await axios.get(
            `${this.props.location.state.url}`,{
            headers : {
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDUyRjBjYmVDZGY4NzZmMjI2YURkNDkzRjRCZjJEM2NDYTJCOEI0NUQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODYyMTQ3ODkzNSwibmFtZSI6InVwbG9hZEFrIn0.mHurMAGI5S9-g3VnBja0q4vnHuQUmG6C07GvKSR7V5Q"
            }}
        ).then(res =>{
            ipfsdata = `https://ipfs.io/ipfs/${res.data.value.cid}`
            console.log('cid', res.data.value.cid);
        })

        let data2 = await axios.get(
            ipfsdata
        ).then(res =>{
            this.setState({ ipfsArray: [res.data]})
            console.log('ipfs get req', res);
        })
        
        this.setState({ ipfsdata: [ipfsdata] })
        console.log('ipfs data', ipfsdata);
    }

    async handleFileInput(e) {
        this.setState({ loading: true })
    }

    render() {
        console.log(this.props.location.state.key);
        return (
            <div className="container">
                <center style={{ marginTop: '15vh' }}>
                    {
                        !this.state.ipfsdata
                            ? <p> No NFTS </p>
                            : (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Image</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.ipfsArray.map((item, key) => {
                                                console.log('item', item);
                                                return (
                                                    <tr key={key + 1}>
                                                        <td>{key + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td><img width="300px" src={item.image}></img></td>
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


export default ViewNFT;
