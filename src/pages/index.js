import React, { Component } from 'react';
import { Image, Header, Loader, Message } from 'semantic-ui-react';
import axios from 'axios';
import MeshList from '../components/MeshList';
import logo from '../images/logo.png';
import Layout from '../components/Layout';

class StoreIndex extends Component {
  state = {
    meshes: [],
    loading: true,
  };

  componentWillMount() {
    axios
      .get('https://voxelise-api.mattbuckley.org/meshes')
      .then(response => {
        this.setState({ meshes: response.data, loading: false });
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderMeshList() {
    if (this.state.loading) {
      return <Loader active />;
    }

    if (this.state.meshes.length === 0) {
      return (
        <Message warning>
          <Message.Header>No meshes have been uploaded yet</Message.Header>
          <p>Try uploading one!</p>
        </Message>
      );
    }

    return <MeshList products={this.state.meshes} />;
  }

  render() {
    const { location } = this.props;

    return (
      <Layout location={location}>
        <Header
          as="h3"
          icon
          textAlign="center"
          style={{
            marginBottom: '2em',
          }}>
          <Header.Content
            style={{
              width: '60%',
              margin: '0 auto',
            }}>
            <Image
              style={{ margin: '20 auto', width: '100%' }}
              src={logo}
              alt="logo"
            />
          </Header.Content>
        </Header>
        {this.renderMeshList()}
      </Layout>
    );
  }
}

export default StoreIndex;
