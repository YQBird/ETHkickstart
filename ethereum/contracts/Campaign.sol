pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvers;
        uint approverCount;
    }
    
    address public manager;
    uint public minimumContribution;
    uint public approverCount;
    mapping(address => bool) public approvers;
    Request[] public requests;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor (uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        approverCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted{
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approverCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvers[msg.sender]);
        
        request.approvers[msg.sender] = true;
        request.approverCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approverCount > (approverCount / 2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    
}