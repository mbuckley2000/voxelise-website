import React, { Component } from 'react';
import axios from 'axios';
import { Header, Button, Grid, Modal, Tab, Message } from 'semantic-ui-react';
import Iframe from 'react-iframe';
import { navigate } from 'gatsby';
import { OBJModel } from 'react-3d-viewer';
import _ from 'lodash';
import Layout from '../components/Layout';
import MeshList from '../components/MeshList';
import MeshViewer from '../components/MeshViewer';

const capitalise = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
class Mesh extends Component {
  state = {
    mesh: {},
    user: { id: '' },
    jwt: '',
  };

  componentWillMount() {
    if (typeof localStorage !== 'undefined') {
      const jwt = localStorage.getItem('jwt');
      const user = JSON.parse(localStorage.getItem('user'));
      const meshID = getQueryString('id');

      this.setState({ jwt, user });

      if (!jwt || !user) {
        // Not logged in
        navigate('login');
      }

      console.log(user);

      axios
        .get(`https://voxelise-api.mattbuckley.org/meshes/${meshID}`)
        .then(response => {
          this.setState({ mesh: response.data });
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

  isOurMesh() {
    return this.state.user._id === this.state.mesh.user._id;
  }

  renderDownloadButtons() {
    if (!_.get(this.state, 'mesh.volume.file.url')) {
      return null;
    }

    return (
      <a
        href={`https://voxelise-api.mattbuckley.org${
          this.state.mesh.volume.file.url
          }`}>
        <Button
          content="Download RAW"
          icon="cloud download"
          labelPosition="right"
        />
      </a>
    );
  }

  renderDeleteButton() {
    if (!this.isLoggedIn() || !this.isOurMesh()) {
      return null;
    }

    return (
      <Modal
        trigger={<Button color="red">Delete</Button>}
        header="Delete"
        content={`Are you sure you want to delete ${this.state.mesh.name}?`}
        actions={['No', { key: 'yes', content: 'Yes', negative: true }]}
        onActionClick={() => this.deleteMesh()}
      />
    );
  }

  renderVolume() {
    const { volume } = this.state.mesh;

    if (!volume) {
      return (
        <Message
          header='Please wait'
          content={<p>Your mesh is being voxelised. Try <a href="javascript:window.location.href=window.location.href">refreshing the page</a> in a few seconds</p>}
        />
      );
    }

    const volumeURL = `https://voxelise-api.mattbuckley.org${volume.file.url}`;

    const names = volume.file.name.split('/');
    const volumeName = `${names[names.length - 1].replace(/\./g, '')}`;
    return (
      <div>

        <Iframe
          url={`/view_volume/?url=${volumeURL}&filename=/${volumeName}`}
          width="100%"
          height="500px"
          id="myId"
          className="myClassname"
          display="initial"
          position="relative"
          frameBorder="0"
          style={{ overflow: 'hidden', backgroundColor: 'black' }}
        />
        <p>Mouse Controls: Left-click + drag to rotate, scroll to zoom, right-click + drag to pan.</p>
        <p>Touch Controls: One finger drag to rotate, pinch to zoom, two finger drag to pan.</p>
        <p>About: This is your Voxelised mesh in 100x100x100 UINT8 RAW format</p>
      </div>

    );
  }

  deleteMesh() {
    console.log('Delete mesh');
    axios
      .delete(`https://voxelise-api.mattbuckley.org/meshes/${this.state.mesh._id}`)
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
    if (this.state.mesh.file) {
      const {
        name, file, user,
      } = this.state.mesh;

      return (
        <Layout location={location}>
          <Grid columns={2}>
            <Grid.Row textAlign="left">
              <Grid.Column >
                <MeshViewer url={`https://voxelise-api.mattbuckley.org${file.url}`} />
              </Grid.Column>
              <Grid.Column>
                <br />
                <Header as="h1" style={{ 'margin-bottom': 0 }}>{capitalise(name)}</Header>
                <p>{capitalise(user.username)}</p>
                {this.renderDownloadButtons()}
                {this.renderDeleteButton()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <br />
          {this.renderVolume()}

        </Layout>
      );
    }

    return null;
  }
}

export default Mesh;

const getQueryString = (field, url) => {
  const href = url || window.location.href;
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i');
  const string = reg.exec(href);
  return string ? string[1] : null;
};
