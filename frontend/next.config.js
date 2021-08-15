module.exports = {
  reactStrictMode: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
    
}

// const path = require('path')

// module.exports = {
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//   },
// }


// const withCSS = require('@zeit/next-css')
// const withLess = require('@zeit/next-less')
// const withSass = require('@zeit/next-sass')

// if (typeof require !== 'undefined') {
//   require.extensions['.less'] = () => {}
// }

// module.exports = withCSS(
//   withLess(
//     withSass({
//       lessLoaderOptions: {
//         javascriptEnabled: true,
//       },
//       webpack: config => {
//         config.module.rules.push(
//           {
//             test: /\.css$/i,
//             use: ['style-loader', 'css-loader'],
//           }
//         );
//         return config;
//       }
//     })
//   )
// )
