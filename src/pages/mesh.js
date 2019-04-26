import React, { Component } from 'react';
import axios from 'axios';
import { Header, Button, Grid, Modal, Tab, Message } from 'semantic-ui-react';
import Iframe from 'react-iframe';
import { navigate } from 'gatsby';
import { OBJModel } from 'react-3d-viewer';
import _ from 'lodash';
import Layout from '../components/Layout';
import MeshList from '../components/MeshList';

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
      const { name, file, volume } = this.state.mesh;

      const panes = [
        {
          menuItem: 'Mesh',
          render: () => (
            <Tab.Pane textAlign="center">
              <OBJModel
                width="670"
                height="400"
                // position={{x:0,y:-100,z:0}}
                src={`https://voxelise-api.mattbuckley.org${file.url}`}
                onLoad={() => {
                  // ...
                }}
                onProgress={xhr => {
                  // ...
                }}
              />
            </Tab.Pane>
          ),
        },
        {
          menuItem: 'Voxelised',
          render: () => {
            if (!this.state.mesh.processed) {
              return (
                <Tab.Pane>
                  <Message
                    header="Please wait"
                    content="Your mesh is being voxelised"
                  />
                </Tab.Pane>
              );
            }

            const volumeURL = `https://voxelise-api.mattbuckley.org${
              this.state.mesh.volume.file.url
            }`;

            const names = this.state.mesh.volume.file.name.split('/');
            const volumeName = `${names[names.length - 1].replace(/\./g, '')}`;

            return (
              <Iframe
                url={`/view_volume/?url=${volumeURL}&filename=/${volumeName}`}
                width="100%"
                height="550px"
                id="myId"
                className="myClassname"
                display="initial"
                position="relative"
              />
            );
          },
        },
      ];

      return (
        <Layout location={location}>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h1">{name}</Header>
                <Header as="h3">Preview</Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {this.renderDownloadButtons()}
                {this.renderDeleteButton()}
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Tab panes={panes} />
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
