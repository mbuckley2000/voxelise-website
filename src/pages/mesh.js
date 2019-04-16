import React, { Component } from 'react';
import axios from 'axios';
import { Header, Button, Grid, Message } from 'semantic-ui-react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import { navigate } from 'gatsby';
import { OBJModel } from 'react-3d-viewer';

class Mesh extends Component {
  state = {
    mesh: {},
    user: { id: '' },
    jwt: '',
  }

  componentWillMount() {
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
      .get(`http://localhost:1337/meshes/${meshID}`)
      .then(response => {
        this.setState({ mesh: response.data });
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { location } = this.props;
    // const filterMeshes = this.state.meshes.filter(m => m.thumbnail);
    if (this.state.mesh.file) {
      const { name, file } = this.state.mesh;
      return (
        <Layout location={location}>
          {/* <SEO title={slug} /> */}
          {/* <ProductSummary {...product} /> */}
          {/* <ProductAttributes {...product} /> */}
          <Header as="h1">{name}</Header>
          <OBJModel
            width="400"
            height="400"
            // position={{x:0,y:-100,z:0}}
            src={`http://localhost:1337${file.url}`}
            onLoad={() => {
              // ...
            }}
            onProgress={xhr => {
              // ...
            }}
          />
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
