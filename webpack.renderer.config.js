const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
  use: [{ loader: 'url-loader?limit=100000' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
