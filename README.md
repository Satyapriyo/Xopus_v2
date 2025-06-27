# AI Agent Payment System - X402 Protocol

A revolutionary pay-per-query AI assistant built with Next.js, featuring the X402 open payment protocol and stunning Aceternity UI components. Users pay with cryptocurrency through smart contracts for each AI query in a beautiful, animated interface.

## ✨ Features

### 🎭 **Beautiful UI & Animations**
- � **Aceternity UI Integration**: Stunning components with smooth animations
- 🌟 **Infinite Moving Cards**: Continuously scrolling testimonials
- ✨ **Framer Motion**: Fluid, spring-based animations throughout
- 🎨 **Modern Design**: Glass morphism and gradient effects
- 📱 **Responsive**: Perfect on desktop, tablet, and mobile

### 💬 **AI Chat Experience**
- 🤖 **Smart Chat Interface**: Clean, modern chat with typing animations
- � **Markdown Support**: Rich text rendering for AI responses
- 💾 **Conversation History**: Persistent chat sessions with Supabase
- ⚡ **Real-time Updates**: Instant responses with smooth animations

### 🔗 **X402 Protocol Integration**
- 🔐 **Smart Contract Payments**: Direct integration with X402 payment contracts
- � **Credit System**: Automated pay-per-query model
- 🔒 **Blockchain Security**: Smart contract-powered payment verification
- � **Transparent Pricing**: Clear cost display ($0.10 per query)

### 🎯 **Enhanced User Experience**
- 🌈 **RainbowKit**: Beautiful wallet connection experience
- 📊 **Real-time Balances**: Live ETH and credit balance display
- 🎪 **Interactive Elements**: Hover effects and micro-interactions
- 🚀 **Performance Optimized**: Fast loading with smooth animations

## 🛠 Tech Stack

### **Frontend & UI**
- **Framework**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Aceternity UI Components
- **Animations**: Framer Motion, CSS Keyframes
- **Components**: Radix UI, Lucide React Icons

### **Blockchain & Payments**
- **Protocol**: X402 Payment Standard
- **Web3**: Viem, Wagmi, RainbowKit
- **Networks**: Base, Ethereum, Polygon support

### **Backend & Data**
- **Database**: Supabase with Row Level Security
- **AI**: OpenAI GPT-4 with streaming responses
- **Storage**: Conversation persistence and user management

## 🎨 Aceternity UI Components

This project now features premium Aceternity UI components:

### 🌟 **Spotlight Effect**
- Dynamic light effects on hero section
- Animated SVG with gradient filters
- Smooth opacity transitions

### ⚡ **TypewriterEffect**
- Character-by-character text animation
- Spring-based timing with stagger effects
- Customizable speed and cursor styling

### 🔄 **Infinite Moving Cards**
- Continuously scrolling testimonials
- Pause on hover functionality
- Customizable speed and direction
- Beautiful card designs with avatars

### 📝 **Text Generate Effect**
- Word-by-word text revelation
- Blur-to-clear animation effects
- Perfect for descriptions and content

### 🎭 **WobbleCard**
- Interactive 3D tilt effects
- Mouse-following animations
- Enhanced depth with noise textures

## 🚀 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# X402 Payment Contract Configuration
NEXT_PUBLIC_X402_CONTRACT_ADDRESS=your_deployed_contract_address_here
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App Configuration
QUERY_PRICE_USD=0.10
MIN_BALANCE_USD=1.00

# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 2. Install Dependencies

```bash
# Install all dependencies including Aceternity UI components
npm install

# Key packages installed:
# - framer-motion (latest)
# - @tabler/icons-react
# - tailwindcss with custom animations
```

### 3. X402 Smart Contract Setup

1. Deploy your X402PaymentHandler contract to Base network
2. Set the contract address in `NEXT_PUBLIC_X402_CONTRACT_ADDRESS`
3. Configure the payment amount in your contract ($0.10 equivalent in ETH)
4. Set the payment receiver address

### 4. Database Setup (Supabase)

1. Create a new Supabase project
2. Run the provided SQL schema for users and conversations
3. Enable Row Level Security (RLS)
4. Configure authentication policies

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your animated AI payment system!

## 🎯 New Animation Features

### 🎭 **Landing Page Animations**
- **Hero Section**: TypewriterEffect for main heading, TextGenerateEffect for description
- **Spotlight Effects**: Dynamic lighting with animated SVG backgrounds
- **Button Animations**: Spring-based hover effects with arrow animations
- **Dashboard Preview**: Floating, rotating elements with glass morphism

### 🔄 **Testimonials Section**
- **Infinite Moving Cards**: Continuously scrolling testimonial carousel
- **Featured Grid**: 3-column responsive grid with staggered animations
- **Star Ratings**: Sequential star appearance with spring animations
- **Avatar Interactions**: Rotating and scaling hover effects

### 💬 **Chat Interface Enhancements**
- **Message Animations**: Smooth slide-in effects for new messages
- **Typing Indicators**: Bouncing dot animations while AI responds
- **Credit Balance**: Animated number updates and color transitions
- **Hover Effects**: Interactive button and card animations

### 2. X402 Smart Contract Setup

1. Deploy your X402PaymentHandler contract to Base network
2. Set the contract address in `NEXT_PUBLIC_X402_CONTRACT_ADDRESS`
3. Configure the payment amount in your contract
4. Set the payment receiver address

### 3. WalletConnect Setup

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Get your Project ID
4. Add it to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### 4. Supabase Setup

1. Create a new Supabase project
2. Click "Connect to Supabase" in the top right of Bolt
3. The database schema will be automatically created

### 5. OpenAI Setup

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your environment variables

### 6. Install Dependencies

```bash
npm install
```

### 7. Run Development Server

```bash
npm run dev
```

## ⚡ How It Works

### 🎭 **Enhanced User Journey**

1. **Landing Experience**: Users arrive to a stunning animated landing page
   - Typewriter effect reveals the main heading
   - Spotlight effects create dynamic lighting
   - Smooth scroll animations guide users through features

2. **Wallet Connection**: Beautiful RainbowKit integration
   - Animated wallet selection modal
   - Real-time balance display with smooth updates
   - Gradient-enhanced connection buttons

3. **AI Chat Interface**: Modern chat experience with animations
   - Smooth message appearance with slide effects
   - Typing animations while AI responds
   - Interactive hover effects on all elements

### 💳 **X402 Payment Flow**

1. **Payment Request**: Animated payment modal with clear pricing
2. **Smart Contract Call**: Direct payment to X402 contract
3. **Transaction Verification**: Real-time blockchain verification
4. **Credit Update**: Smooth number animations for balance changes
5. **Query Processing**: Animated AI responses with typewriter effects

### 🎨 **Animation System**

The project uses a sophisticated animation system:

```typescript
// Framer Motion variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

// Spring-based animations for natural movement
const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 15
}
```

## 🎯 Customization Guide

### 🎨 **Animation Customization**

**Modify Animation Speed:**
```typescript
// In components/ui/aceternity/infinite-moving-cards.tsx
speed="slow" // or "normal", "fast"
```

**Adjust Spotlight Effects:**
```typescript
// In components/HeroSection.tsx
<Spotlight
  className="-top-40 left-0 md:left-60 md:-top-20"
  fill="white" // Change color
/>
```

**Customize Typewriter Speed:**
```typescript
// In components/ui/aceternity/typewriter-effect.tsx
transition={{ duration: 0.3, delay: stagger(0.1) }}
```

### 🎭 **Component Customization**

**Infinite Moving Cards:**
```typescript
<InfiniteMovingCards
  items={testimonials}
  direction="right" // or "left"
  speed="slow"
  pauseOnHover={true}
/>
```

**Text Generation Effects:**
```typescript
<TextGenerateEffect 
  words="Your custom text here"
  className="custom-styling"
  duration={0.5}
/>
```

### Smart Contract Integration

The system integrates with your deployed X402PaymentHandler contract:

```solidity
// Your contract functions used:
- paymentAmount() - Gets the required payment amount
- paymentReceiver() - Gets the payment recipient address
- receive() - Handles incoming payments
```

### Payment Verification

1. Transaction hash is captured from wallet
2. Receipt is fetched from blockchain
3. Contract address and sender are verified
4. Payment amount is converted to USD credits
5. User account is updated with new credits

## X402 Protocol Benefits

- **Open Standard**: Interoperable payment protocol
- **No Intermediaries**: Direct smart contract payments
- **Transparent**: All transactions visible on blockchain
- **Secure**: Smart contract enforced payment rules
- **Instant**: Real-time payment verification

## Customization

### Payment Amount
Update the payment amount in your smart contract:
```solidity
function setPaymentAmount(uint256 _newAmount) external onlyOwner {
    paymentAmount = _newAmount;
}
```

### Supported Networks
Update the chain configuration in `src/lib/wagmi-config.ts`:
```typescript
chains: [base, baseSepolia, ethereum, polygon]
```

### AI Model
Change the OpenAI model in `src/lib/openai.ts`:
```typescript
model: "gpt-4" // or "gpt-3.5-turbo"
```

## Smart Contract Events

The system listens for these events from your contract:

- `PaymentReceived(address indexed sender, uint256 amount)`
- `PaymentForwarded(address indexed receiver, uint256 amount)`

## Security Features

- Smart contract payment verification
- Wallet signature verification
- Row Level Security (RLS) on database
- Input sanitization
- Rate limiting on API endpoints

## 🚀 Deployment

### 📦 **Build Process**

```bash
# Build with animations and optimizations
npm run build

# The build includes:
# - Optimized Framer Motion bundles
# - CSS animations and keyframes
# - Aceternity UI components
# - Web3 wallet integrations
```

### 🌐 **Platform Deployment**

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with all environment variables
vercel --prod
```

**Environment Variables for Production:**
- All `.env.local` variables
- Set `NODE_ENV=production`
- Configure CORS for your domain

### 🎭 **Performance Optimization**

The animated components are optimized for production:
- Framer Motion tree-shaking
- CSS animations use GPU acceleration
- Infinite scroll uses efficient DOM manipulation
- Responsive images and lazy loading

## 🔧 Advanced Features

### 🎪 **Custom Animation Hooks**

```typescript
// Custom hook for intersection-based animations
const useAnimateOnScroll = () => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    })
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  
  return [ref, isVisible]
}
```

### 🎨 **Theme Customization**

```typescript
// Custom color schemes in tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'crypto': {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      animation: {
        'infinite-scroll': 'scroll var(--animation-duration, 40s) linear infinite',
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
      }
    }
  }
}
```

## 🐛 Troubleshooting

### 🎭 **Animation Issues**

**Animations not working:**
1. Check Framer Motion installation: `npm list framer-motion`
2. Verify CSS animations are loaded in `globals.css`
3. Ensure `initial` and `animate` props are set correctly

**Performance issues:**
1. Use `will-change: transform` for heavy animations
2. Implement `AnimatePresence` for exit animations
3. Consider `layoutId` for shared element transitions

**Infinite scroll not smooth:**
1. Check CSS keyframes in `globals.css`
2. Verify `--animation-duration` CSS variable
3. Ensure sufficient items for seamless loop

### 🔗 **Web3 Integration Issues**

**Wallet connection fails:**
1. Verify WalletConnect Project ID
2. Check network configuration
3. Ensure contract address is correct for the network

**Payment verification issues:**
1. Check contract ABI matches deployment
2. Verify sufficient gas limits
3. Monitor transaction status in wallet

## 📚 Resources & Documentation

### 🎭 **Animation Libraries**
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Aceternity UI Components](https://ui.aceternity.com/)
- [CSS Animation Performance](https://web.dev/animations/)

### 🔗 **Web3 Resources**
- [X402 Protocol Specification](https://github.com/x402-protocol/spec)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Guides](https://www.rainbowkit.com/)

### 🎨 **Design Resources**
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Radix UI Components](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork & Clone**: Fork the repo and clone your fork
2. **Install**: Run `npm install` to install all dependencies
3. **Develop**: Create a new branch for your feature
4. **Test**: Ensure animations work smoothly across devices
5. **Submit**: Create a pull request with detailed description

### 🎯 **Contribution Areas**
- New Aceternity UI components
- Animation performance improvements
- Additional Web3 integrations
- Mobile experience enhancements
- Accessibility improvements

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Aceternity UI** for beautiful animated components
- **Framer Motion** for smooth animation library
- **X402 Protocol** for open payment standards
- **Supabase** for backend infrastructure
- **Base Network** for fast, low-cost transactions

---

**Built with ❤️ using Next.js, Aceternity UI, and the X402 Protocol**

*Experience the future of AI payments with beautiful animations and blockchain security.*