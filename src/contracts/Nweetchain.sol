pragma solidity ^0.5.0;

contract Nweetchain {
  string public name;
  uint public nweetCount = 0;
  mapping(uint => Nweet) public nweets;

  struct Nweet {
    uint id;
    string hash;
    string nweetdescription;
    uint tipAmount;
    address payable author;
  }

  event NweetCreated(
    uint id,
    string hash,
    string nweetdescription,
    uint tipAmount,
    address payable author
  );

  event NweetTipped(
    uint id,
    string hash,
    string nweetdescription,
    uint tipAmount,
    address payable author
  );

  constructor() public {
    name = "Nweetchain";
  }

  function uploadNweet(string memory _nweetdescription, string memory _imgHash) public {
    // Make sure the image hash exists
    imghash = "none"
    if (bytes(_imgHash).length > 0) {
      imghash = _imgHash
    }
    // Make sure image description exists
    require(bytes(_nweetdescription).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment image id
    nweetCount ++;

    // Add Image to the contract
    nweets[nweetCount] = Nweet(nweetCount, imghash, _nweetdescription, 0, msg.sender);
    // Trigger an event
    emit NweetCreated(nweetCount, imghash, _nweetdescription, 0, msg.sender);
  }

  function tipNweetOwner(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= nweetCount);
    // Fetch the image
    Nweet memory _nweet = nweets[_id];
    // Fetch the author
    address payable _author = _nweet.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _nweet.tipAmount = _nweet.tipAmount + msg.value;
    // Update the image
    nweets[_id] = _nweet;
    // Trigger an event
    emit NweetTipped(_id, _nweet.hash, _nweet.nweetdescription, _nweet.tipAmount, _author);
  }
}