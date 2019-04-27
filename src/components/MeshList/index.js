/* eslint-disable camelcase */
import React from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'gatsby';

import MeshViewer from '../MeshViewer';

const capitalise = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const viewer = url => (
  <MeshViewer url={url} />
);

const mapProductsToItems = products =>
  products.map(({
    name, id, thumbnail, user, file,
  }) =>
    // const price = meta.display_price.with_tax.formatted || null
    ({
      as: Link,
      to: `/mesh?id=${id}`,
      childKey: id,
      image: viewer(`https://voxelise-api.mattbuckley.org${file.url}`),
      // image: <Image src={thumbnail ? `http://localhost:1337${thumbnail.url}` : 'https://voxelise-api.mattbuckley.org/uploads/a9441233a4884ed6875186d7233b4ceb.jpg'} />,
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
