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
    const productInfo = get(this, 'props.data.allStrapiMesh')
    const data = productInfo.edges[0].node
    // const image = get(data, 'mainImageHref')
    const sizes = get(data, 'thumbnail.childImageSharp.sizes')
    const {id, name, file} = data

    if (!sizes) return null

    return (
      <Layout location={this.props.location}>
        {/* <SEO title={slug} /> */}
        {/* <ProductSummary {...product} /> */}
        {/* <ProductAttributes {...product} /> */}
        {name}
        <OBJModel
          width="400"
          height="400"
          // position={{x:0,y:-100,z:0}}
          src={file.publicURL}
          onLoad={() => {
            //...
          }}
          onProgress={xhr => {
            //...
          }}
        />
      </Layout>
    )
  }
}

export default ProductPageTemplate

export const pageQuery = graphql`
  query ProductsQuery($id: String!) {
    allStrapiMesh(filter: {id: {eq: $id}}) {
      edges {
        node {
          name
          id
          user {
            username
            id
          }
          thumbnail {
            childImageSharp {
              sizes(maxWidth: 400) {
                ...GatsbyImageSharpSizes
              }
            }
          }
          file {
            publicURL
          }
        }
      }
    }
  }
`
