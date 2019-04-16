/* eslint-disable camelcase */
import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { OBJModel } from 'react-3d-viewer';
import { Link } from 'gatsby';

const capitalise = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const viewer = (url) => (
  <OBJModel
    width="334"
    height="200"
    enableKeys={false}
    enableRotate={false}
    enableZoom={false}
    // position={{x:0,y:-100,z:0}}
    src={url}
    onLoad={() => {
    // ...
}}
    onProgress={xhr => {
    // ...
}}
  />
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
      image: viewer(`http://localhost:1337${file.url}`),
      // image: <Image src={thumbnail ? `http://localhost:1337${thumbnail.url}` : 'http://localhost:1337/uploads/a9441233a4884ed6875186d7233b4ceb.jpg'} />,
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
