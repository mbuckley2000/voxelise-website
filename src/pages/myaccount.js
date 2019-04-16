import React, { Component } from 'react';
import axios from 'axios';
import { Header, Button, Grid, Message } from 'semantic-ui-react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import { navigate } from 'gatsby';

class MyAccount extends Component {
  state = {
    meshes: [],
    user: { id: '' },
    jwt: '',
  }

  componentWillMount() {
    const jwt = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user'));

    this.setState({ jwt, user });

    if (!jwt || !user) {
      // Not logged in
      navigate('login');
    }

    console.log(user);

    axios
      .get(`http://localhost:1337/meshes?user=${user._id}`)
      .then(response => {
        this.setState({ meshes: response.data });
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderMeshesList(meshes) {
    if (meshes.length === 0) {
      return (
        <Message warning>
          <Message.Header>You haven't uploaded any meshes yet!</Message.Header>
          <p>Try uploading one now.</p>
        </Message>
      );
    }

    return <ProductList products={meshes} />;
  }

  render() {
    const { location } = this.props;
    const filterMeshes = this.state.meshes.filter(m => m.thumbnail);

    return (
      <Layout location={location}>
        <SEO title="My Account" />
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">My Meshes</Header>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Button primary>Upload</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {this.renderMeshesList(filterMeshes)}
      </Layout>
    );
  }
}

export default MyAccount;
