import React, {Component} from 'react'
import axios from 'axios'
import {Header, Form, Button, Message} from 'semantic-ui-react'

import Layout from '../components/Layout'
import {navigate} from 'gatsby'

class UploadMesh extends Component {
  state = {
    name: '',
    file: null,
    user: {},
    jwt: '',
    loading: false,
    apiError: '',
  }

  componentWillMount() {
    const jwt = localStorage.getItem('jwt')
    const user = JSON.parse(localStorage.getItem('user'))

    this.setState({jwt, user})

    if (!jwt || !user) {
      // Not logged in
      navigate('login')
    }

    console.log(user)
  }

  renderErrors() {
    if (!this.state.apiError) {
      return null
    }

    return <Message error header="Error" content={this.state.apiError} />
  }

  onFormSubmit() {
    this.setState({loading: true, apiError: ''})
    const formData = new FormData()
    formData.append('files', this.state.file)
    axios
      .post('https://voxelise-api.mattbuckley.org/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response)
        // Get id
        const fileID = response.data[0]._id
        // Now create mesh object
        this.createMeshObject(fileID)
      })
      .catch(error => {
        console.log(error)
        console.log(error.response)
        this.setState({apiError: 'Error uploading file', loading: false})
      })
  }

  createMeshObject(fileID) {
    const data = {
      file: fileID,
      user: this.state.user._id,
      name: this.state.name,
    }

    console.log(data)

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
        console.log(response)
        navigate('myaccount')
      })
      .catch(error => {
        console.log(error)
        this.setState({apiError: error.response})
      })
      .then(() => {
        this.setState({loading: false})
      })
  }

  render() {
    const {location} = this.props
    return (
      <Layout location={location}>
        <Header as="h1">Upload Mesh</Header>
        <Form loading={this.state.loading}>
          {this.renderErrors()}
          <Form.Field>
            <label>Name</label>
            <input
              value={this.state.name}
              onChange={event => this.setState({name: event.target.value})}
              placeholder="Name"
            />
          </Form.Field>
          <Form.Field>
            <label>Mesh File</label>
            <input
              onChange={event => this.setState({file: event.target.files[0]})}
              type="file"
              placeholder="Name"
            />
          </Form.Field>
          <Button onClick={() => this.onFormSubmit()} primary type="submit">
            Submit
          </Button>
        </Form>
      </Layout>
    )
  }
}

export default UploadMesh

const validate = values => {
  const errors = {}
  if (!values.file) {
    errors.file = 'Mesh file is required'
  }
  if (!values.name) {
    errors.name = 'Name is required'
  }
  return errors
}

const getQueryString = (field, url) => {
  const href = url || window.location.href
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i')
  const string = reg.exec(href)
  return string ? string[1] : null
}
