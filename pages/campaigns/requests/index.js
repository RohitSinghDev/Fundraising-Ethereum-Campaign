import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";
import { useState } from "react";
import { act } from "@testing-library/react";

const RequestIndex = (props) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const [activeReq, setActiveReq] = useState();
  // const countActiveReq = 0;

  const renderRow = () => {
    return props.requests.map((requests, index) => {
      return (
        <RequestRow
          key={index}
          request={requests}
          address={props.address}
          id={index}
          donatorsCount={props.donatorsCount}
        />
      );
    });

    // setActiveReq(countActiveReq);
  };
  let tempReq = 0;
  const countActiveRequests = () => {
    props.requests.map((requests, index) => {
      if (!requests.complete) {
        tempReq++;
      }
    });
    if (tempReq == activeReq) {
      return activeReq;
    }
    setActiveReq(tempReq);
    return activeReq;
  };

  return (
    <Layout>
      <h3>Requests Page</h3>
      <Link route={`/campaigns/${props.address}/requests/new`}>
        <Button primary floated="right" style={{ marginBottom: 10 }}>
          Create Requests
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRow()}</Body>
      </Table>
      <h4>Requests found : {countActiveRequests()}</h4>
    </Layout>
  );
};

RequestIndex.getInitialProps = async (ctx) => {
  const { address } = ctx.query;
  const campaign = Campaign(address);
  const requestsCount = await campaign.methods.getRequestCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  // console.log(requests);

  const donatorsCount = await campaign.methods.approversCount().call();

  return { address, requests, requestsCount, donatorsCount };
};

export default RequestIndex;
