import Layout from "../../components/Layout";
import { Form, Button, Input, Message, Flag } from "semantic-ui-react";
import { useState } from "react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const CampaignNew = () => {
  const [minContribution, setMinContribution] = useState("");

  const [errMessage, setErrMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [campaignDescription, setDescription] = useState("");

  const submitCampaign = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minContribution, campaignDescription)
        .send({ from: accounts[0] });
      //we dont need to specify the gas value, metamask does that
      Router.pushRoute("/");
    } catch (err) {
      setErrMessage(err.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={submitCampaign} error={!!errMessage}>
        {/* initially errmessage is empty string which is falsy value, error gets false value and not shown on screen */}
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minContribution}
            onChange={(event) => setMinContribution(event.target.value)}
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Description of campaign</label>
          <Input
            label="Goal"
            labelPosition="left"
            value={campaignDescription}
            onChange={(event) => setDescription(event.target.value)}
          ></Input>
        </Form.Field>
        <Message
          error
          header="An error occurred"
          content={errMessage}
        ></Message>
        {/* the Message tag is not automatically shown by default , we need error prop in the form tag */}
        <Button loading={loading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
