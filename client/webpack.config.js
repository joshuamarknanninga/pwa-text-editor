// client/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'), // Absolute path to src/index.js
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Ensures proper routing for SPA
    clean: true, // Cleans the output directory before emit
  },
  mode: 'production', // Use 'development' for development builds
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Ensure babel-loader is installed
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Add React preset
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Ensure these loaders are installed
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Handles image files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'), // Absolute path to index.html
      title: 'PWA Text Editor',
    }),
    new WebpackPwaManifest({
      name: 'PWA Text Editor',
      short_name: 'TextEditor',
      description: 'A Progressive Web App Text Editor',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      start_url: './',
      publicPath: './',
      fingerprints: false, // Prevents adding a hash to manifest.json
      inject: true, // Injects the manifest link into index.html
      icons: [
        {
          src: path.resolve(__dirname, 'public/assets/icon.png'), // Absolute path to icon.png
          sizes: [96, 128, 192, 256, 384, 512], // Multiple sizes
          destination: path.join('assets', 'icons'),
        },
      ],
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 10,
            },
          },
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
          },
        },
      ],
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    open: true,
    historyApiFallback: true, // For SPA routing
  },
  resolve: {
    extensions: ['.js'], // Resolves these extensions
  },
};
