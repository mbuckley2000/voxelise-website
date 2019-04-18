import React, {Component} from 'react'
import axios from 'axios'
import {Header, Button, Grid, Modal, Tab, Message} from 'semantic-ui-react'

import SEO from '../components/SEO'
import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import {navigate} from 'gatsby'
import {OBJModel} from 'react-3d-viewer'

class Mesh extends Component {
  state = {
    mesh: {},
    user: {id: ''},
    jwt: '',
  }

  componentWillMount() {
    const jwt = localStorage.getItem('jwt')
    const user = JSON.parse(localStorage.getItem('user'))
    const meshID = getQueryString('id')

    this.setState({jwt, user})

    if (!jwt || !user) {
      // Not logged in
      navigate('login')
    }

    console.log(user)

    axios
      .get(`https://voxelise-api.mattbuckley.org/meshes/${meshID}`)
      .then(response => {
        this.setState({mesh: response.data})
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  isLoggedIn() {
    return this.state.user && this.state.jwt
  }

  isOurMesh() {
    return this.state.user._id === this.state.mesh.user._id
  }

  renderDeleteButton() {
    if (!this.isLoggedIn() || !this.isOurMesh()) {
      return null
    }

    return (
      <Modal
        trigger={<Button color="red">Delete</Button>}
        header="Delete"
        content={`Are you sure you want to delete ${this.state.mesh.name}?`}
        actions={['No', {key: 'yes', content: 'Yes', negative: true}]}
        onActionClick={() => this.deleteMesh()}
      />
    )
  }

  deleteMesh() {
    console.log('Delete mesh')
    axios
      .delete(
        `https://voxelise-api.mattbuckley.org/meshes/${this.state.mesh._id}`,
      )
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
      .then(() => {
        navigate('myaccount')
      })
  }

  render() {
    const {location} = this.props
    // const filterMeshes = this.state.meshes.filter(m => m.thumbnail);
    if (this.state.mesh.file) {
      const {name, file, volume} = this.state.mesh

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
              )
            }

            return (
              <OBJModel
                width="670"
                height="400"
                // position={{x:0,y:-100,z:0}}
                src={`https://voxelise-api.mattbuckley.org${volume.file.url}`}
                onLoad={() => {
                  // ...
                }}
                onProgress={xhr => {
                  // ...
                }}
              />
            )
          },
        },
      ]

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

          <Tab panes={panes} />
        </Layout>
      )
    }

    return null
  }
}

export default Mesh

const getQueryString = (field, url) => {
  const href = url || window.location.href
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i')
  const string = reg.exec(href)
  return string ? string[1] : null
}
