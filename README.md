# AI Agent Payment System - X402 Protocol

A pay-per-query AI assistant built with Next.js and the X402 open payment protocol. Users pay with cryptocurrency through your deployed smart contract for each AI query they make.

## Features

- 💬 **AI Chat Interface**: Clean, modern chat interface for AI interactions
- 🔗 **X402 Protocol**: Secure payments using the X402 open payment standard
- 🔐 **Smart Contract Integration**: Direct integration with your deployed payment contract
- 📊 **Credit System**: Pay-per-query model with automatic credit management
- 🔒 **Blockchain Security**: Smart contract-powered payment verification
- 📱 **Responsive**: Works on desktop and mobile devices
- 🌈 **RainbowKit**: Beautiful wallet connection experience

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: X402 Protocol, Viem, Wagmi, RainbowKit
- **Database**: Supabase
- **AI**: OpenAI GPT-4
- **Payments**: ETH via X402 smart contract

## Setup Instructions

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

## How It Works

### X402 Payment Flow

1. **Wallet Connection**: Users connect their wallet using RainbowKit
2. **Payment Request**: When user wants to ask a question, they initiate payment
3. **Smart Contract Call**: Payment is sent directly to your X402 contract
4. **Payment Verification**: Transaction is verified on-chain
5. **Credits Added**: USD equivalent is added to user's credit balance
6. **Query Processing**: AI processes the query and deducts credits

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

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set environment variables in your deployment platform

4. Ensure your smart contract is deployed and configured

## Troubleshooting

### Common Issues

1. **Contract not found**: Verify contract address and network
2. **Payment fails**: Check wallet has sufficient ETH for gas + payment
3. **Wrong network**: Ensure wallet is connected to correct chain
4. **Transaction timeout**: Increase gas limit or wait for network congestion to clear

### Debug Mode

Enable debug logging by adding to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## X402 Protocol Resources

- [X402 Specification](https://github.com/x402-protocol/spec)
- [Smart Contract Examples](https://github.com/x402-protocol/contracts)
- [Protocol Documentation](https://docs.x402.org)