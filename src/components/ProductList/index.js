/* eslint-disable camelcase */
import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import Img from 'gatsby-image';
import { Link } from 'gatsby';

const capitalise = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const mapProductsToItems = products =>
  products.map(({
    name, id, thumbnail, user,
  }) =>
    // const price = meta.display_price.with_tax.formatted || null
    ({
      as: Link,
      to: `/mesh?id=${id}`,
      childKey: id,
      image: <Image src={`http://localhost:1337${thumbnail.url}`} />,
      header: capitalise(name),
      meta: (
        <Card.Meta style={{ color: 'dimgray' }}>
          {capitalise(user.username)}
        </Card.Meta>
      ),
    }));

export default ({ products }) => (
  <Card.Group items={mapProductsToItems(products)} itemsPerRow={2} stackable />
);
