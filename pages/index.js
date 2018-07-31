import React, { Component } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";

export default class CampaignIndex extends Component {
  // static make initial data loading possible without render the component
  // static function belong to class, not instance
  static async getInitialProps({ req }) {
    const campaings = await factory.methods.getDeployedCampaigns().call();

    return { campaings };
  }

  renderCampaigns() {
    const items = this.props.campaings.map(address => {
      return {
        header: address,
        description: <a>View Campaigns</a>,
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Button
            floated="right"
            content="create Campaign"
            icon="add circle"
            primary
          />
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}
