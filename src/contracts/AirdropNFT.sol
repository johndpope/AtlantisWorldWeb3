// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {SafeMath} from "./utils/SafeMath.sol";

contract AirdropNFT is ERC721URIStorage, IERC721Receiver, AccessControl {
    using SafeMath for uint256;

    uint256 public tokenCounter;
    // super admin
    address public Validator;

    struct Raffle {
        string tittle;
        string description;
        string jpeg;
        string metaUrl;
    }

    mapping(uint256 => Raffle) public Raffles;
    
    address[] public owners;
    mapping(address => bool) public ownerByAddress;

    modifier onlyOwner() {
        require(ownerByAddress[msg.sender] == true);
        _;
    }

    constructor() ERC721("Altantis", "Raffle") {
        tokenCounter = 0;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        
        ownerByAddress[msg.sender] = true;
        Validator = msg.sender;
    }

    function setOwner( address _owner ) public onlyOwner {
        ownerByAddress[_owner] = true;
    }

    function createNFT(
        string memory _tittle,
        string memory _description,
        string memory _jpeg,
        string memory _metaUrl
    ) public onlyOwner returns (uint256) {
        tokenCounter = tokenCounter + 1;
        uint256 newItemId = tokenCounter;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _metaUrl);

        Raffles[newItemId] = Raffle(
            _tittle,
            _description,
            _jpeg,
            _metaUrl
        );

        return newItemId;
    }

    function modifyNFT(
        uint256 tokenId,
        string memory _tittle,
        string memory _description,
        string memory _jpeg,
        string memory _metaUrl
    ) public onlyOwner returns (bool) {
        Raffle memory _asset = Raffles[tokenId];

        _asset.tittle = _tittle;
        _asset.description = _description;
        _asset.jpeg = _jpeg;
        _asset.metaUrl = _metaUrl;

        Raffles[tokenId] = _asset;
        return true;
    }

    function changeMetaData(
        uint256 tokenId,
        string memory _metaUrl
    ) public onlyOwner {
        Raffle memory _asset = Raffles[tokenId];

        _asset.metaUrl = _metaUrl;
        Raffles[tokenId] = _asset;
    }

    function rewardNFT(
        uint256 tokenId,
        address _to
    ) public onlyOwner {
        safeTransferFrom(msg.sender, _to, tokenId);
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}