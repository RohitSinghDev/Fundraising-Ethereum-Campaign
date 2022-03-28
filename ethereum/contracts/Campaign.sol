// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;



contract campaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minimum, string memory description)public{
        address newCampaign = address(new Campaign(minimum,msg.sender,description));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
    // when we deploy this contract, we need to address of the campaign contract deployed by this factory hence the above function
}




contract Campaign{

    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete; 
        uint approvalCount;
        mapping(address => bool) approvals;
    }
 

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    string public campaignInfo;
    // above vars are storage data

    modifier restricted(){
        require(msg.sender == manager,"access not authorised");
        _;
    }

    constructor(uint minm, address creator, string memory description){
        manager = creator;
        minimumContribution = minm; 
        campaignInfo = description;
    }

    function contribute()public payable {
        require(msg.value>minimumContribution,"please increase contri money");

        if(approvers[msg.sender]){
            return;
        }

        approvers[msg.sender] = true;
        approversCount++;

    }

    function createRequest(string memory description, uint value, address payable recipient) public  restricted{
      
        Request storage newRequest = requests.push();
        newRequest.description= description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete=false;
        newRequest.approvalCount=0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender],"cannot vote without contri");
        require(!request.approvals[msg.sender],"");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount/2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);

        request.complete = true;

    }

    function getSummary() public view returns(uint , uint, uint , uint , address){

        return(
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }


    function getRequestCount() public view returns(uint){
        return requests.length;
    }

    




}
