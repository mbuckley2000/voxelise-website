import React, { Component } from 'react';
import axios from 'axios';
import { Header, Grid, Message, Loader } from 'semantic-ui-react';
import { navigate } from 'gatsby';

import Layout from '../components/Layout';
import MeshList from '../components/MeshList';

class MyAccount extends Component {
  state = {
    meshes: [],
    user: { id: '' },
    jwt: '',
    loading: false,
    apiError: '',
  };

  componentWillMount() {
    if (typeof localStorage !== 'undefined') {
      const jwt = localStorage.getItem('jwt');
      const user = JSON.parse(localStorage.getItem('user'));

      this.setState({ jwt, user, loading: true });

      if (!jwt || !user) {
        // Not logged in
        navigate('login');
      }

      console.log(user);

      axios
        .get(`https://voxelise-api.mattbuckley.org/meshes?user=${user._id}`)
        .then(response => {
          this.setState({ meshes: response.data });
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
          this.setState({ apiError: error.message });
        })
        .then(() => {
          this.setState({ loading: false });
        });
    }
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

    return <MeshList products={meshes} />;
  }

  render() {
    const { location } = this.props;

    if (this.state.loading) {
      return (
        <Layout location={location}>
          <Loader active />
        </Layout>
      );
    }

    if (this.state.apiError) {
      return (
        <Layout location={location}>
          <Message error header="Error" content={this.state.apiError} />
        </Layout>
      );
    }

    return (
      <Layout location={location}>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">My Meshes</Header>
            </Grid.Column>
            {/* <Grid.Column textAlign="right">
              <Button onClick={() => navigate('uploadMesh')} primary>
                Upload
              </Button>
            </Grid.Column> */}
          </Grid.Row>
        </Grid>

        {this.renderMeshesList(this.state.meshes)}
      </Layout>
    );
  }
}

export default MyAccount;
