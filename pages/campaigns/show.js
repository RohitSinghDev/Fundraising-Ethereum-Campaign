import factory from "../../ethereum/factory";
import { useEffect, useState } from "react";
import { Card, Button, Grid } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { Link } from "../../routes";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

const CampaignShow = (props) => {
  const DetailsCards = () => {
    // balance always taken from contract is in wei
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager,
    } = props;

    const items = [
      {
        header: manager,
        description:
          "manager created this campaign and can create requests to withdraw tokens",
        meta: "address of manager",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        description: "minimum amount that can be donated to become a aprrover",
        meta: "minimum contribution",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        description: "total amount received from donations until now",
        meta: "Amount received in ether",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        description: "A request tries to withdraw tokens from the contract",
        meta: "requests count",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        description: "numbers of people / approvers donated to this campaign",
        meta: "count of donators",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h2>Campaign details:</h2>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{DetailsCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm campaignAddress={props.address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${props.address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (ctx) => {
  // console.log(ctx.query.address);

  const campaign = Campaign(ctx.query.address);

  const summary = await campaign.methods.getSummary().call();

  // console.log(summary);
  return {
    address: ctx.query.address,
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};

// when we call a function in contract to return multiple values, it returns the vallues with int keys

export default CampaignShow;
