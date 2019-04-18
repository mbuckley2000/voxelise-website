/* eslint-disable */
import React from 'react'
import {graphql} from 'gatsby'
import SEO from '../components/SEO'
import get from 'lodash/get'
import ProductSummary from '../components/ProductSummary'
import ProductAttributes from '../components/ProductAttributes'
import Layout from '../components/Layout'
import {OBJModel} from 'react-3d-viewer'

class ProductPageTemplate extends React.PureComponent {
  render() {
    return <Layout location={this.props.location} />
  }
}

export default ProductPageTemplate
