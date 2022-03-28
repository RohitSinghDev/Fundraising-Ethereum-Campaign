import { useState } from "react";
import { Form, Input, Message, Button, Grid } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = (props) => {
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const [errMessage, setErrMessage] = useState("");

  const contributeFormSub = async (event) => {
    setLoading(true);
    setErrMessage("");
    event.preventDefault();
    const campaign = Campaign(props.campaignAddress);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });
      Router.replaceRoute(`/campaigns/${props.campaignAddress}`);
      // reload page without requiring to go back twice to index page
    } catch (err) {
      setErrMessage(err.message);
    }
    setLoading(false);
  };
  return (
    <Form onSubmit={contributeFormSub} error={!!errMessage}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        ></Input>
      </Form.Field>
      <Message error header="error occurred" content={errMessage}></Message>
      <Button primary loading={loading}>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
