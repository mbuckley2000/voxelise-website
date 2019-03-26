/* eslint-disable camelcase */
import React from 'react'
import {Card, Image} from 'semantic-ui-react'
import Img from 'gatsby-image'
import {Link} from 'gatsby'

const capitalise = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const mapProductsToItems = products =>
  products.map(({node: {name, id, thumbnail, user}}) => {
    // const price = meta.display_price.with_tax.formatted || null
    return {
      as: Link,
      to: `/product/${id}/`,
      childKey: id,
      image: (
        <Image>
          <Img
            sizes={thumbnail.childImageSharp.sizes}
            alt={capitalise(name)}
            style={{
              background: '#fafafa',
            }}
          />
        </Image>
      ),
      header: capitalise(name),
      meta: (
        <Card.Meta style={{color: 'dimgray'}}>
          {capitalise(user.username)}
        </Card.Meta>
      ),
    }
  })

export default ({products}) => (
  <Card.Group items={mapProductsToItems(products)} itemsPerRow={2} stackable />
)
