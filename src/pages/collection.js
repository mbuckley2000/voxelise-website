import React, { Component } from 'react';
import axios from 'axios';
import { Header, Button, Grid, Modal, Tab, Message, Container } from 'semantic-ui-react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import { navigate } from 'gatsby';
import { OBJModel } from 'react-3d-viewer';

class Collection extends Component {
  state = {
    collection: {},
    user: { id: '' },
    jwt: '',
  }

  componentWillMount() {
    if (typeof (localStorage) !== 'undefined') {
      const jwt = localStorage.getItem('jwt');
      const user = JSON.parse(localStorage.getItem('user'));
      const collectionID = getQueryString('id');

      this.setState({ jwt, user });

      if (!jwt || !user) {
      // Not logged in
        navigate('login');
      }

      console.log(user);

      axios
        .get(`https://voxelise-api.mattbuckley.org/collections/${collectionID}`)
        .then(response => {
          this.setState({ collection: response.data });
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  isLoggedIn() {
    return this.state.user && this.state.jwt;
  }

  isOurCollection() {
    return this.state.user._id === this.state.collection.user._id;
  }

  renderDeleteButton() {
    if (!this.isLoggedIn() || !this.isOurCollection()) {
      return null;
    }

    return (
      <Modal
        trigger={<Button color="red">Delete</Button>}
        header="Delete"
        content={`Are you sure you want to delete ${this.state.collection.name}?`}
        actions={['No', { key: 'yes', content: 'Yes', negative: true }]}
        onActionClick={() => this.deleteCollection()}
      />
    );
  }

  deleteCollection() {
    console.log('Delete collection');
    axios
      .delete(`https://voxelise-api.mattbuckley.org/collections/${this.state.collection._id}`)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        navigate('myaccount');
      });
  }

  render() {
    const { location } = this.props;
    // const filterMeshes = this.state.meshes.filter(m => m.thumbnail);
    if (this.state.collection.user) {
      const { name, description, meshes } = this.state.collection;

      return (
        <Layout location={location}>
          {/* <SEO title={slug} /> */}
          {/* <ProductSummary {...product} /> */}
          {/* <ProductAttributes {...product} /> */}
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h1">{name}</Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {this.renderDeleteButton()}
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Container><p>{description}</p></Container>
          <ProductList products={meshes} />

        </Layout>
      );
    }

    return null;
  }
}

export default Collection;

const getQueryString = (field, url) => {
  const href = url || window.location.href;
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i');
  const string = reg.exec(href);
  return string ? string[1] : null;
};
