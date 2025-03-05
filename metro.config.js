// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const fs = require('fs');
const { mergeConfig } = require('metro-config');
const { getDefaultConfig } = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

const map = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const customConfig = {
  resolver: {
    extraNodeModules: {
      'linkedom': path.resolve(__dirname, './react-native-linkedom.js'),
      'cross-fetch': path.resolve(__dirname, './react-native-cross-fetch.js'),
    },
    resolveRequest: (context, moduleName, platform) => {
      // Handle linkedom imports
      if (
        moduleName === 'linkedom' ||
        (moduleName.includes('@extractus/article-extractor/src/utils') &&
          moduleName.includes('linkedom'))
      ) {
        return {
          filePath: path.resolve(__dirname, './react-native-linkedom.js'),
          type: 'sourceFile',
        };
      }

      // Handle cross-fetch imports
      if (
        moduleName === 'cross-fetch' ||
        (moduleName.includes('@extractus/article-extractor/src/utils') &&
          moduleName.includes('cross-fetch'))
      ) {
        return {
          filePath: path.resolve(__dirname, './react-native-cross-fetch.js'),
          type: 'sourceFile',
        };
      }

      // Fall back to the standard resolution for everything else
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  server: {
    port: 8081,
    enhanceMiddleware: (metroMiddleware, metroServer) => {
      return (request, res, next) => {
        const filePath = path.join(
          __dirname,
          'android/app/src/main',
          request._parsedUrl.path || '',
        );
        const ext = path.parse(filePath).ext;
        if (fs.existsSync(filePath)) {
          try {
            const data = fs.readFileSync(filePath);
            res.setHeader('Content-type', map[ext] || 'text/plain');
            res.end(data);
          } catch (err) {
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          }
        } else {
          return metroMiddleware(request, res, next);
        }
      };
    },
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
