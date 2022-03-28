import Layout from "../../../components/Layout";
import { Form, Button, Input, Message, Flag, Label } from "semantic-ui-react";
import { useState } from "react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

const newRequest = (props) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [sentAddress, setSentAddress] = useState("");
  const [errorMessage, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRequest = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const campaign = Campaign(props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(value, "ether"),
          sentAddress
        )
        .send({
          from: accounts[0],
        });
      Router.replaceRoute(`/campaigns/${props.address}/requests`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <Link route={`/campaigns/${props.address}/requests`}>
        <a>Back to Requests</a>
      </Link>
      <h3>Create a request</h3>
      <Form onSubmit={submitRequest} error={!!errorMessage}>
        <Form.Field>
          <label>Description of request</label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          ></Input>
        </Form.Field>
        <Form.Field>
          <Input
            label="ether"
            labelPosition="right"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          ></Input>
        </Form.Field>
        <Form.Field>
          <Input
            label="deliver address"
            labelPosition="right"
            value={sentAddress}
            onChange={(event) => setSentAddress(event.target.value)}
          ></Input>
        </Form.Field>
        <Message
          error
          header="An error occurred"
          content={errorMessage}
        ></Message>
        <Button loading={loading} primary>
          submit request
        </Button>
      </Form>
    </Layout>
  );
};

newRequest.getInitialProps = async (ctx) => {
  const { address } = ctx.query;
  return { address };
};

export default newRequest;
