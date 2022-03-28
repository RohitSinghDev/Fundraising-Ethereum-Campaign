import Layout from "../components/Layout";
import { Button, Table, Message } from "semantic-ui-react";
import { Link, Router } from "../routes";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { useState } from "react";

const RequestRow = (props) => {
  const [loadingApprove, setloadingApprove] = useState(false);

  const [loadingFinalize, setloadingFinalize] = useState(false);

  const [errMessage, setErrMessage] = useState("");

  const { Row, Cell } = Table;

  const onApprove = async () => {
    setloadingApprove(true);
    setErrMessage("");
    const campaign = Campaign(props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(props.id).send({
        from: accounts[0],
      });
      Router.replaceRoute(`/campaigns/${props.address}/requests`);
    } catch (err) {
      setErrMessage(err.message);
    }

    setloadingApprove(false);
  };

  const onFinalize = async () => {
    setloadingFinalize(true);
    setErrMessage("");
    const campaign = Campaign(props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(props.id).send({
        from: accounts[0],
      });
      Router.replaceRoute(`/campaigns/${props.address}/requests`);
    } catch (err) {
      setErrMessage(err.message);
    }

    setloadingFinalize(false);
  };

  const readyToFinalize =
    props.request.approvalCount >= props.donatorsCount / 2;

  return (
    <Row
      disabled={props.request.complete}
      positive={readyToFinalize && !props.request.complete}
    >
      <Cell>{props.id}</Cell>
      <Cell>{props.request.description}</Cell>
      <Cell>{web3.utils.fromWei(props.request.value, "ether")}</Cell>
      <Cell>{props.request.recipient}</Cell>
      <Cell>
        {props.request.approvalCount}/{props.donatorsCount}
      </Cell>
      <Cell error={!!errMessage}>
        {props.request.complete ? null : (
          <Button
            color="green"
            basic
            onClick={onApprove}
            loading={loadingApprove}
          >
            Approve
          </Button>
        )}

        {/* <Message error header="error occurred" content={errMessage}></Message> */}
      </Cell>
      <Cell>
        {props.request.complete ? null : (
          <Button
            color="teal"
            basic
            onClick={onFinalize}
            loading={loadingFinalize}
          >
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
