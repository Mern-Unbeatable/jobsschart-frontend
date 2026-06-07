const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  // Use a single active env file for all modes
  const envPath = path.resolve(__dirname, '.env.development');
  const rawEnv = fs.existsSync(envPath)
    ? dotenv.parse(fs.readFileSync(envPath))
    : {};

  // Stringify all environment variables for DefinePlugin 
  const envKeys = {
    'process.env': JSON.stringify({
      NODE_ENV: argv.mode || 'development',
      ...rawEnv,
    }),
  };

  const devPort = rawEnv.REACT_APP_DEV_PORT
    ? rawEnv.REACT_APP_DEV_PORT === 'auto'
      ? 'auto'
      : parseInt(rawEnv.REACT_APP_DEV_PORT, 10)
    : 5173;
  const allowedHost =
    rawEnv.REACT_APP_ALLOWED_HOST || 'jbosschart.maktechgroup.tech';

  return {
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      // Separate chunk filenames for better long-term caching
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      chunkFilename: isProd
        ? 'js/[name].[contenthash:8].chunk.js'
        : 'js/[name].chunk.js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // Cache Babel transforms between builds
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // Images smaller than 8KB will be inlined as base64
            },
          },
          generator: {
            filename: 'images/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        // Minify HTML in production
        minify: isProd
          ? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          }
          : false,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            globOptions: {
              ignore: ['**/index.html'], // Don't copy index.html, HtmlWebpackPlugin handles it
            },
          },
        ],
      }),
    ],
    optimization: {
      // Split vendor (node_modules) into its own long-lived cached chunk
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // React + ReactDOM in their own chunk (changes rarely)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'vendor-react',
            chunks: 'all',
            priority: 20,
          },
          // Redux + RTK in their own chunk
          redux: {
            test: /[\\/]node_modules[\\/](@reduxjs|react-redux)[\\/]/,
            name: 'vendor-redux',
            chunks: 'all',
            priority: 10,
          },
          // Everything else from node_modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 1,
          },
        },
      },
      // Keep the webpack runtime in its own tiny chunk
      runtimeChunk: 'single',
    },
    // In webpack.config.js, update the proxy configuration:
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      historyApiFallback: true,
      host: '0.0.0.0',
      allowedHosts: 'all',
        // allowedHosts: [allowedHost],
      port: devPort,
      hot: true,
      open: true,
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': `https://${allowedHost}`,
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      },
      // Fix the proxy configuration
      proxy: {
        '/api': {
          target: 'http://localhost:5000', // Your backend server
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '/api/v1', // Optional: rewrite path if needed
          },
          onError: (err, req, res) => {
            console.error('Proxy error:', err);
          },
        },
      },
    },
    // Source maps: fast in dev, hidden in prod (no source leakage)
    devtool: isProd ? 'hidden-source-map' : 'eval-cheap-module-source-map',
  };
};
