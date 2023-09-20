// SPDX-License-Identifier: MIT LICENSE
pragma solidity >0.5.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CosmetaMarket is ERC721URIStorage,ReentrancyGuard, Ownable {


    uint royalityFee;
    address public constant cosmetaTokenAddress = 0x77a9643E81f881F7BAE88CAb9a4b8fB4Ebc6309C;
    using Counters for Counters.Counter;
    Counters.Counter private totalItems;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter public _tokenIds;
    address payable holder;
    IERC20 public cri;
    uint256 public listingFee = 0.005 ether;
    uint256 public mintingFee = 0.005 ether;
    mapping(uint => AuctionStruct) auctionedItem;
    mapping(uint => bool) auctionedItemExist;
    mapping(string => uint) existingURIs;
    mapping(uint => BidderStruct[]) biddersOf;

  constructor(uint _royaltyFee) ERC721("Cosmeta", "CRI") ERC721URIStorage() {
    cri = IERC20(cosmetaTokenAddress);
    holder = payable(owner());
    royalityFee = _royaltyFee;
  }

    struct BidderStruct {
        address bidder;
        uint price;
        uint timestamp;
        bool refunded;
        bool won;
    }

    struct AuctionStruct {
        string name;
        string description;
        string image;
        uint tokenId;
        address seller;
        address owner;
        address winner;
        uint price;
        bool sold;
        bool live;
        bool biddable;
        uint bids;
        uint duration;
    }

    event AuctionItemCreated(
        uint indexed tokenId,
        address seller,
        address owner,
        uint price,
        bool sold
    );


  function getListingFee() public view returns (uint256) {
    uint256 fee;
    fee = listingFee;
    return fee;
  }

    function mintToken(string memory tokenURI) internal returns (bool) {
        totalItems.increment();
        _tokenIds.increment();
        _itemIds.increment();
        uint tokenId = totalItems.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        setApprovalForAll(address(this), true);
        return true;
    }


    function createAuction(string memory name,string memory description,string memory image,string memory tokenURI,uint price) public payable nonReentrant {
        uint256 fee;
        fee = listingFee;
        require(price > 0 ether, "Sales price must be greater than 0 ethers.");
        require(msg.value >= fee,"Price must be up to the listing price.");

        require(mintToken(tokenURI), "Could not mint token");
        
        uint tokenId = totalItems.current();

        AuctionStruct memory item;
        item.tokenId = tokenId;
        item.name = name;
        item.description = description;
        item.image = image;
        item.price = price;
        item.duration = getTimestamp(0, 0, 0, 0);
        item.seller = msg.sender;
        item.owner = msg.sender;

        auctionedItem[tokenId] = item;
        auctionedItemExist[tokenId] = true;

        //payTo(companyAcc, listingFee);
        cri.allowance(msg.sender, address(this));
        require(cri.approve(address(this), fee),"Approval False");
        require(cri.transferFrom(msg.sender,address(this), fee),"CRI transferFrom error");

        emit AuctionItemCreated(tokenId, msg.sender, address(0), price, false);
    }

  function cosmetaMarketSale(uint256 itemId) public payable nonReentrant {
    uint price = auctionedItem[itemId].price;
    uint royality = (price * royalityFee) / 100;
    require(cri.balanceOf(msg.sender) >= (price - royality), "Insufficient CRI balance");

    require(cri.approve(msg.sender, (price - royality)),"Approve not working1");
    require(cri.transferFrom(msg.sender, auctionedItem[itemId].seller,(price - royality)),"Something wrong");
    require(cri.approve(msg.sender, royality),"Approve not working2");
    require(cri.transferFrom(msg.sender,address(this), royality), "Sending Failed");

    uint tokenId = auctionedItem[itemId].tokenId;
    setApprovalForAll(address(this), true);
    IERC721(address(this)).safeTransferFrom(auctionedItem[itemId].owner, payable(msg.sender), tokenId);

    auctionedItem[itemId].owner = payable(msg.sender);
    auctionedItem[itemId].sold = true;
    _itemsSold.increment();
  }

    function listReSale(uint256 tokenId, uint256 price) public payable nonReentrant {
      uint fee = listingFee;
      require(price > 0, "Amount must be higher than 0");
      require(msg.value == fee, "Please transfer 0.5 cri to pay listing fee");

      cri.allowance(address(this), payable(msg.sender));
      require(cri.approve(address(this), fee), "Approve not working");
      require(cri.transferFrom(msg.sender,address(this), fee),"CRI transferFrom now working");

      auctionedItem[tokenId].sold = false;

      emit AuctionItemCreated(tokenId, msg.sender, address(this), price, false);
  }

    function offerAuction(uint tokenId,bool biddable,uint sec,uint min,uint hour,uint day) public {
        require(auctionedItem[tokenId].owner == msg.sender,"Unauthorized entity");
        require(auctionedItem[tokenId].bids == 0,"Winner should claim prize first");

        if (!auctionedItem[tokenId].live) {
            setApprovalForAll(address(this), true);
            IERC721(address(this)).transferFrom(msg.sender,address(this),tokenId);
        }

        auctionedItem[tokenId].bids = 0;
        auctionedItem[tokenId].live = true;
        auctionedItem[tokenId].sold = false;
        auctionedItem[tokenId].biddable = biddable;
        auctionedItem[tokenId].duration = getTimestamp(sec, min, hour, day);
    }

    function placeBid(uint tokenId) public payable {
        uint256 fee;
        fee = listingFee;
        require(msg.value >= auctionedItem[tokenId].price,"Insufficient Amount");
        require(auctionedItem[tokenId].duration > getTimestamp(0, 0, 0, 0),"Auction not available");
        require(auctionedItem[tokenId].biddable, "Auction only for bidding");

        BidderStruct memory bidder;
        bidder.bidder = msg.sender;
        bidder.price = msg.value;
        bidder.timestamp = getTimestamp(0, 0, 0, 0);

        cri.approve(address(this), msg.value);
        cri.transferFrom(msg.sender, address(this), msg.value);

        biddersOf[tokenId].push(bidder);
        auctionedItem[tokenId].bids++;
        auctionedItem[tokenId].price = msg.value;
        auctionedItem[tokenId].winner = msg.sender;
    }

    function claimPrize(uint tokenId, uint bid) public {
        uint256 fee;
        fee = listingFee;
        require(getTimestamp(0, 0, 0, 0) > auctionedItem[tokenId].duration,"Auction still Live");
        require(auctionedItem[tokenId].winner == msg.sender,"You are not the winner");

        biddersOf[tokenId][bid].won = true;
        uint price = auctionedItem[tokenId].price;
        address seller = auctionedItem[tokenId].seller;

        auctionedItem[tokenId].winner = address(0);
        auctionedItem[tokenId].live = false;
        auctionedItem[tokenId].sold = true;
        auctionedItem[tokenId].bids = 0;
        auctionedItem[tokenId].duration = getTimestamp(0, 0, 0, 0);


        uint royality = (price * royalityFee) / 100;
        cri.approve(address(this), (price - royality));
        cri.transferFrom(address(this),auctionedItem[tokenId].owner, (price - royality));
        //payTo(auctionedItem[tokenId].owner, (price - royality));
        cri.approve(address(this), royality);
        cri.transferFrom(address(this),seller, royality);
        //payTo(seller, royality);
        IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        auctionedItem[tokenId].owner = msg.sender;

        performRefund(tokenId);
    }

    function performRefund(uint tokenId) internal {
        uint256 fee;
        fee = listingFee;
        for (uint i = 0; i < biddersOf[tokenId].length; i++) {
            if (biddersOf[tokenId][i].bidder != msg.sender) {
                biddersOf[tokenId][i].refunded = true;
                cri.approve(address(this), biddersOf[tokenId][i].price);
                cri.transferFrom(address(this),biddersOf[tokenId][i].bidder, biddersOf[tokenId][i].price);
                // payTo(
                //     biddersOf[tokenId][i].bidder,
                //     biddersOf[tokenId][i].price
                // );
            } else {
                biddersOf[tokenId][i].won = true;
            }
            biddersOf[tokenId][i].timestamp = getTimestamp(0, 0, 0, 0);
        }

        delete biddersOf[tokenId];
    }

    function getAuction(uint id) public view returns (AuctionStruct memory) {
        require(auctionedItemExist[id], "Auctioned Item not found");
        return auctionedItem[id];
    }

    function getAllAuctions() public view returns (AuctionStruct[] memory Auctions){
        uint totalItemsCount = totalItems.current();
        Auctions = new AuctionStruct[](totalItemsCount);

        for (uint i = 0; i < totalItemsCount; i++) {
            Auctions[i] = auctionedItem[i + 1];
        }
    }

    function getMyAuctions() public view returns (AuctionStruct[] memory Auctions){
        uint totalItemsCount = totalItems.current();
        uint totalSpace;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].owner == msg.sender) {
                totalSpace++;
            }
        }

        Auctions = new AuctionStruct[](totalSpace);

        uint index;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].owner == msg.sender) {
                Auctions[index] = auctionedItem[i + 1];
                index++;
            }
        }
    }

    function getLiveAuctions() public view returns (AuctionStruct[] memory Auctions){
        uint totalItemsCount = totalItems.current();
        uint totalSpace;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].duration > getTimestamp(0, 0, 0, 0)) {
                totalSpace++;
            }
        }

        Auctions = new AuctionStruct[](totalSpace);

        uint index;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].duration > getTimestamp(0, 0, 0, 0)) {
                Auctions[index] = auctionedItem[i + 1];
                index++;
            }
        }
    }

    function getBidders(uint tokenId) public view returns (BidderStruct[] memory){
        return biddersOf[tokenId];
    }

    function getTimestamp(uint sec,uint min,uint hour,uint day) internal view returns (uint) {
        return
            block.timestamp +
            (1 seconds * sec) +
            (1 minutes * min) +
            (1 hours * hour) +
            (1 days * day);
    }

  function withdraw() public payable onlyOwner() {
    require(payable(msg.sender).send(address(this).balance));
    cri.transfer(msg.sender,cri.balanceOf(address(this)));
  }
}