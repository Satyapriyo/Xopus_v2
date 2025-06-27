import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { InfiniteMovingCards } from '@/components/ui/aceternity/infinite-moving-cards'

interface TestimonialsSectionProps {
    isVisible: boolean
}

const TestimonialsSection = ({ isVisible }: TestimonialsSectionProps) => {
    // Data for Infinite Moving Cards
    const movingTestimonials = [
        {
            quote: "This AI payment system revolutionized how we handle micro-transactions. The X402 protocol is incredibly fast and secure!",
            name: "Alex Johnson",
            title: "CEO at TechCorp",
        },
        {
            quote: "Simply the best blockchain payment solution I've used. The integration was seamless and the support team is amazing.",
            name: "Sarah Williams",
            title: "Lead Developer at Creative Co",
        },
        {
            quote: "The transparency and security of smart contract payments gives us complete confidence in every transaction.",
            name: "Marcus Chen",
            title: "CTO at DataFlow Inc",
        },
        {
            quote: "We've processed over 10,000 AI queries through this platform. The reliability is outstanding and costs are very reasonable.",
            name: "Emily Rodriguez",
            title: "Product Manager at InnovateAI",
        },
        {
            quote: "The X402 protocol implementation is flawless. Perfect integration with our existing systems.",
            name: "David Kim",
            title: "Founder of BlockchainStartup",
        },
        {
            quote: "Finally, a payment system that understands developers. The documentation and API are top-notch.",
            name: "Jessica Thompson",
            title: "Engineering Manager at CloudTech",
        },
        {
            quote: "We switched from traditional payment processors to this platform and cut our transaction costs by 60%. Highly recommended!",
            name: "Ryan O'Connor",
            title: "Head of AI at FutureCorpAI",
        },
        {
            quote: "The real-time payment confirmation is game-changing for our AI applications. No more waiting for blockchain confirmations.",
            name: "Priya Patel",
            title: "Technical Lead at ML Solutions",
        },
    ]

    // Static featured testimonials for grid layout
    const featuredTestimonials = [
      
    ]

    // Animation variants for container
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

    // Animation variants for individual cards
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
                duration: 0.6
            }
        }
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Animated Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h2
                        className="text-4xl font-bold text-gray-900 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Trusted by developers and businesses worldwide
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Join thousands of teams already using our AI payment platform to build better products faster with secure, transparent blockchain payments.
                    </motion.p>
                </motion.div>

                {/* Infinite Moving Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mb-20"
                >
                    <InfiniteMovingCards
                        items={movingTestimonials}
                        direction="right"
                        speed="slow"
                    />
                </motion.div>

                {/* Featured Testimonials Grid */}
            
            </div>
        </section>
    )
}

export default TestimonialsSection;
