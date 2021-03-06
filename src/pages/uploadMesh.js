import React, { Component } from 'react';
import axios from 'axios';
import { Header, Form, Button, Message } from 'semantic-ui-react';

import Layout from '../components/Layout';
import { navigate } from 'gatsby';

class UploadMesh extends Component {
  state = {
    name: '',
    nameEdited: false,
    file: null,
    user: {},
    jwt: '',
    loading: false,
    apiError: '',
  }

  componentWillMount() {
    if (typeof localStorage !== 'undefined') {
      const jwt = localStorage.getItem('jwt');
      const user = JSON.parse(localStorage.getItem('user'));

      this.setState({ jwt, user });

      if (!jwt || !user) {
        // Not logged in
        navigate('login');
      }

      console.log(user);
    }
  }

  renderErrors() {
    if (!this.state.apiError) {
      return null;
    }

    return <Message error header="Error" content={this.state.apiError} />;
  }

  onFormSubmit() {
    this.setState({ loading: true, apiError: '' });

    // Check name
    if (!this.state.name) {
      this.setState({ loading: false, apiError: 'Please enter a name' });
      return;
    }

    // Check name
    if (this.state.name.length < 3) {
      this.setState({
        loading: false,
        apiError: 'Name must be at least 3 characters',
      });
      return;
    }

    // Check file selected
    if (!this.state.file) {
      this.setState({ loading: false, apiError: 'Please select a file' });
      return;
    }

    // Check it's a .obj
    if (this.state.file.name.toLowerCase().split('.').pop() !== 'obj') {
      this.setState({ loading: false, apiError: 'Must be a .obj file' });
      return;
    }

    // Check file size
    if (this.state.file.size > 1000000) {
      this.setState({ loading: false, apiError: 'File size exceeds 1MB' });
      return;
    }

    const formData = new FormData();
    formData.append('files', this.state.file);
    axios
      .post('https://voxelise-api.mattbuckley.org/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response);
        // Get id
        const fileID = response.data[0]._id;
        // Now create mesh object
        this.createMeshObject(fileID);
      })
      .catch(error => {
        console.log(error);
        console.log(error.response);
        this.setState({ apiError: 'Error uploading file', loading: false });
      });
  }

  createMeshObject(fileID) {
    const data = {
      file: fileID,
      user: this.state.user._id,
      name: this.state.name,
      processed: false,
    };

    axios
      .post(
        'https://voxelise-api.mattbuckley.org/meshes',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        data,
      )
      .then(response => {
        console.log(response);
        navigate('myaccount');
      })
      .catch(error => {
        console.log(error);
        this.setState({ apiError: error.response });
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  onNameFieldChange(event) {
    this.setState({ name: event.target.value, nameEdited: true });
  }

  onFileFieldChange(event) {
    this.setState({ file: event.target.files[0] });

    if (!this.state.nameEdited) {
      let name = '';
      if (event.target.files[0]) {
        name = capitalise(event.target.files[0].name.split('.')[0]);
      }

      this.setState({ name });
    }
  }

  render() {
    const { location } = this.props;
    return (
      <Layout location={location}>
        <Header as="h1">Upload Mesh</Header>
        {this.renderErrors()}
        <Form loading={this.state.loading}>
          <Form.Field>
            <label>Name</label>
            <input
              value={this.state.name}
              onChange={event => this.onNameFieldChange(event)}
              placeholder="Name"
            />
          </Form.Field>
          <Form.Field>
            <label>Mesh File (.obj 1MB Max)</label>
            <input
              onChange={event => this.onFileFieldChange(event)}
              type="file"
              accept=".obj"
              placeholder="Name"
            />
          </Form.Field>
          <Button onClick={() => this.onFormSubmit()} primary type="submit">
            Submit
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default UploadMesh;

const validate = values => {
  const errors = {};
  if (!values.file) {
    errors.file = 'Mesh file is required';
  }
  if (!values.name) {
    errors.name = 'Name is required';
  }
  return errors;
};

const getQueryString = (field, url) => {
  const href = url || window.location.href;
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i');
  const string = reg.exec(href);
  return string ? string[1] : null;
};


const capitalise = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
