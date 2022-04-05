
# Fundraising Ethereum Campaign
A decentralised web application where a user can either create fundraising campaigns to 
receive donations in ether or donate to some existing campaigns. It is deployed upon Rinkeby Ethereum testnet.

## Detailed description and working:
* A user first needs to login to his metamask account.
* If the user wishes to create a campaign to receive donations in ether, he needs to set a minimum contribution value and give a description about the campaign.
* If the owner of the campaign wishes to spend these received donations, he needs to create a request mentioning the details where the tokens will be used along with the account address where the requested amount of tokens will be transfered.
* The donators of this campaign can vote for the request and if the count of received votes is more than or equal to half of the donators, campaign owner can finalize the request and requested amount will be transfered to the mentioned account address.
* Other users can donate to this campaign in ether using their metamask accounts. The donators of a particular campaign can also vote for a request created in the same campaign as well.

## Languages and Frameworks used:
* Solidity -- 0.8.9
* React.js
* Vanilla JS
* Web3.js
* Next.js
* Ganache-cli
* Mocha 
* semantic-ui-React
