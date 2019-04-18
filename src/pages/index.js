import React, {Component} from 'react'
import {Image, Header} from 'semantic-ui-react'
import axios from 'axios'
import ProductList from '../components/ProductList'
import SEO from '../components/SEO'
import logo from '../images/logo.svg.png'
import Layout from '../components/Layout'

class StoreIndex extends Component {
  state = {
    meshes: [],
  }

  componentWillMount() {
    axios
      .get('https://voxelise-api.mattbuckley.org/meshes')
      .then(response => {
        this.setState({meshes: response.data})
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const {location} = this.props

    const siteTitle = 'Voxelise'
    const filterProductsWithoutImages = this.state.meshes.filter(
      m => m.thumbnail,
    )

    return (
      <Layout location={location}>
        <SEO title={siteTitle} />
        <Header
          as="h3"
          icon
          textAlign="center"
          style={{
            marginBottom: '2em',
          }}
        >
          <Header.Content
            style={{
              width: '60%',
              margin: '0 auto',
            }}
          >
            <Image
              style={{margin: '20 auto', width: '100%'}}
              src={logo}
              alt="logo"
            />
          </Header.Content>
        </Header>
        <ProductList products={this.state.meshes} />
      </Layout>
    )
  }
}

export default StoreIndex
