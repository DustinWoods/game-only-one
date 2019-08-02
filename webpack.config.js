const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  appConfig: {
    title: htmlTitle = '',
    distDirectory,
  }
} = require('./package.json');

const frontBase = {
  entry: {
    app: [path.resolve(__dirname, 'src/main.ts')],
  },
  output: {
    path: path.resolve(__dirname, distDirectory, 'public/'),
    publicPath: '/',
    filename: 'assets/js/bundle.js'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      title: htmlTitle,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/images',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/assets/css/'
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  }
};

const front = {
  ...frontBase,
  name: 'watch',
  mode: 'development',
  devtool: 'sourcemap',
}

const frontWatch = {
  ...frontBase,
  name: 'watch',
  mode: 'development',
  devtool: 'sourcemap',
  watch: true,
  plugins: [
    ...frontBase.plugins,
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['dist/public']
      },
    })
  ]
}

module.exports = (env) => {
  if(env && env.watch) {
    return [frontWatch];
  } else {
    return [front];
  }
}