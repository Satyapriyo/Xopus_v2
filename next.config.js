/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minifier for better performance
  swcMinify: true,
  
  // Optimize compilation and memory usage
  experimental: {
    // Enable app directory optimizations
    optimizePackageImports: ['lucide-react', '@rainbow-me/rainbowkit'],
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Optimize images and reduce memory usage
  images: {
    unoptimized: true,
  },
  
  // Webpack configuration for better performance and memory usage
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting for better loading
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
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