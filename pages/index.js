import factory from "../ethereum/factory";
import { useEffect, useState } from "react";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";
import Campaign from "../ethereum/campaign";

const campaignIndex = (props) => {
  const [deployedCampaigns, setDeployedCampaign] = useState([]);

  // use static keyword doesnt bind the function to any instance of class, but to the campaign index itself. we do not have to craeate instance

  // useEffect(() => {
  //   const asyncCall = async () => {
  //     const depCampaigns = await factory.methods.getDeployedCampaigns().call();
  //     setDeployedCampaign(depCampaigns);
  //   };
  //   asyncCall();
  // }, []);
  //   componenetdidmount method not executed on the server side, we need to use getinitialprops is a life cycle method used to fetch data

  // console.log(deployedCampaigns);

  const renderCampaigns = () => {
    const items = [];
    for (let i = 0; i < props.depCampaigns.length; i++) {
      items.push({
        header: props.depDescriptions[i],
        description: (
          <Link route={`/campaigns/${props.depCampaigns[i]}`}>
            <a>View Campaigns</a>
          </Link>
        ),
        meta: props.depCampaigns[i],
        fluid: true,
      });
    }

    // const items = props.depCampaigns.map((address) => {
    //   let temp = props.depDescriptions.find;

    //   return {
    //     header: address,
    //     description: (
    //       <Link route={`/campaigns/${address}`}>
    //         <a>View Campaigns</a>
    //       </Link>
    //     ),
    //     fluid: true,
    //   };
    // });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
          {/* anchor tag gives the right click functionality */}
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

campaignIndex.getInitialProps = async (ctx) => {
  const depCampaigns = await factory.methods.getDeployedCampaigns().call();
  const depDescriptions = [];

  for (let i = 0; i < depCampaigns.length; i++) {
    const despInitial = await Campaign(depCampaigns[i])
      .methods.campaignInfo()
      .call();
    depDescriptions.push(despInitial);
  }

  return { depCampaigns, depDescriptions };
};

export default campaignIndex;
