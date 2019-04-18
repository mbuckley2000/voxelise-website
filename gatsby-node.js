const Promise = require('bluebird');
const path = require('path');

exports.createPages = ({ graphql, actions }) => {};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    node: { fs: 'empty' },
  });

  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-3d-viewer/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
