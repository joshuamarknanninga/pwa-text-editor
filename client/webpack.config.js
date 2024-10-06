// client/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  // Define the entry point of your application
  entry: path.resolve(__dirname, 'src/index.js'),

  // Define the output directory and filename
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Ensures proper routing for SPA
    clean: true, // Cleans the output directory before emit
  },

  // Set the mode to 'production' or 'development'
  mode: 'production',

  // Define module rules for different file types
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpiles ES6+ to ES5
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Injects CSS into the DOM
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Handles image files
      },
    ],
  },

  // Define plugins used in the build process
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'), // Path to your HTML template
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
          src: path.resolve(__dirname, 'public/assets/icon.png'), // Path to your icon
          sizes: [96, 128, 192, 256, 384, 512], // Multiple sizes for different devices
          destination: path.join('assets', 'icons'), // Destination folder within 'dist'
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

  // Define development server configurations
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    open: true, // Automatically opens the browser
    historyApiFallback: true, // For SPA routing
  },

  // Resolve file extensions
  resolve: {
    extensions: ['.js'],
  },
};
