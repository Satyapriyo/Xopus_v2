/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC minifier to avoid worker issues
  swcMinify: false,
  
  // Optimize compilation and memory usage
  experimental: {
    // Enable app directory optimizations
    optimizePackageImports: ['lucide-react', '@rainbow-me/rainbowkit'],
    // Disable turbo mode temporarily to avoid worker issues
    // turbo: {
    //   rules: {
    //     '*.svg': {
    //       loaders: ['@svgr/webpack'],
    //       as: '*.js',
    //     },
    //   },
    // },
  },
  
  // Optimize images and reduce memory usage
  images: {
    unoptimized: true,
  },
  
  // Webpack configuration for better performance and memory usage
  webpack: (config, { dev, isServer }) => {
    // Fix Terser issues with web workers
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: config.optimization.minimizer.map(minimizer => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.exclude = /HeartbeatWorker/
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              parse: {
                ecma: 2020,
              },
              compress: {
                ecma: 2020,
                drop_console: true,
                drop_debugger: true,
              },
              mangle: {
                safari10: true,
              },
              format: {
                ecma: 2020,
                safari10: true,
              },
            }
          }
          return minimizer
        }),
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
            },
          },
        },
      }
    }

    // Handle web workers
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/',
        },
      },
    })

    // Exclude worker files from regular processing
    config.module.rules.push({
      test: /HeartbeatWorker\.(js|ts)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/workers/[hash][ext][query]',
      },
    })

    // Reduce memory usage by limiting parallel processing
    config.parallelism = 1
    config.cache = {
      type: 'memory',
      maxGenerations: 1,
    }

    // Fallback for Node.js modules in browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }
    
    // Ignore pino-pretty in browser builds to reduce bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
    }

    // Optimize module resolution
    config.resolve.symlinks = false
    
    // WalletConnect specific configuration to prevent SSR issues
    config.externals = config.externals || []
    if (isServer) {
      config.externals.push({
        'idb-keyval': 'commonjs idb-keyval',
        '@walletconnect/keyvaluestorage': 'commonjs @walletconnect/keyvaluestorage',
      })
    }
    
    return config
  },
  
  // Optimize output for better performance
  output: 'standalone',
  
  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize development server
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Environment variables configuration
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig