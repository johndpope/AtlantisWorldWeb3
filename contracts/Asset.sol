// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {SafeMath} from "./utils/SafeMath.sol";

contract Assets is ERC721URIStorage, IERC721Receiver, AccessControl {
    using SafeMath for uint256;

    uint256 public tokenCounter;
    // super admin
    address public Validator;

    struct Asset {
        uint256 id;
        string name;
        string ipfsHash;
        address owner;
        uint256 price;
        bool authenticate;
        bool collateralLocked;
        bool liquidityRemoved;
        uint256 totalStake;
    }

    mapping(uint256 => Asset) public AssetNfts;
    mapping(address => uint256) public deposit;
    
    address[] public owners;
    mapping(address => bool) public ownerByAddress;

    modifier onlyOwner() {
        require(ownerByAddress[msg.sender] == true);
        _;
    }

    constructor() ERC721("Altantis", "Assets") {
        tokenCounter = 0;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        
        ownerByAddress[msg.sender] = true;
        Validator = msg.sender;
    }

    function setOwner( address _owner ) public onlyOwner {
        ownerByAddress[_owner] = true;
    }

    function createCollectible(
        string memory _name,
        uint256 _price,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        tokenCounter = tokenCounter + 1;
        uint256 newItemId = tokenCounter;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        AssetNfts[newItemId] = Asset(
            newItemId,
            _name,
            tokenURI,
            msg.sender,
            _price,
            false,
            false,
            false,
            0
        );

        return newItemId;
    }

    function modifyCollectable(
        uint256 tokenId,
        string memory name,
        string memory ipfsHash,
        address owner,
        uint256 price,
        bool authenticate,
        bool collateralLocked,
        bool liquidityRemoved,
        uint256 totalStake
    ) public onlyOwner returns (bool) {
        Asset memory _asset = AssetNfts[tokenId];

        _asset.name = name;
        _asset.ipfsHash = ipfsHash;
        _asset.owner = owner;
        _asset.price = price;
        _asset.authenticate = authenticate;
        _asset.collateralLocked = collateralLocked;
        _asset.liquidityRemoved = liquidityRemoved;
        _asset.totalStake = totalStake;

        AssetNfts[tokenId] = _asset;
        return true;
    }

    function authenticateAnAsset(
        uint256 tokenId,
        bool authencity
    ) public onlyOwner {
        Asset memory _asset = AssetNfts[tokenId];

        _asset.authenticate = authenticate;
        AssetNfts[tokenId] = _asset;
    }

    function changeMetaData(
        uint256 tokenId,
        string memory ipfsHash
    ) public onlyOwner {
        Asset memory _asset = AssetNfts[tokenId];

        _asset.ipfsHash = ipfsHash;
        AssetNfts[tokenId] = _asset;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}