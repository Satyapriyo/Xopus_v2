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
        {
            name: "Alex Johnson",
            role: "CEO at TechCorp",
            content: "This AI payment system revolutionized how we handle micro-transactions. The X402 protocol is incredibly fast and secure!",
            rating: 5,
            delay: 0.1,
        },
        {
            name: "Emily Rodriguez",
            role: "Product Manager at InnovateAI",
            content: "We've processed over 10,000 AI queries through this platform. The reliability is outstanding and costs are very reasonable.",
            rating: 5,
            delay: 0.2,
        },
        {
            name: "Ryan O'Connor",
            role: "Head of AI at FutureCorpAI",
            content: "We switched from traditional payment processors to this platform and cut our transaction costs by 60%. Highly recommended!",
            rating: 5,
            delay: 0.3,
        },
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
                {/* <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                >
                    {featuredTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                transition: { type: "spring" as const, stiffness: 300, damping: 20 }
                            }}
                        >
                            <Card className="bg-white border border-gray-200 shadow-lg h-full">
                                <CardContent className="p-8 h-full flex flex-col justify-between">
                                    <div>
                                        <motion.div
                                            className="flex items-center mb-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: testimonial.delay + 0.3 }}
                                        >
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{
                                                        delay: testimonial.delay + 0.4 + (i * 0.1),
                                                        type: "spring",
                                                        stiffness: 200
                                                    }}
                                                >
                                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        <motion.p
                                            className="text-gray-900 mb-6 font-medium leading-relaxed text-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: testimonial.delay + 0.5 }}
                                        >
                                            "{testimonial.content}"
                                        </motion.p>
                                    </div>

                                    <motion.div
                                        className="flex items-center mt-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: testimonial.delay + 0.6 }}
                                    >
                                        <motion.div
                                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg"
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 5,
                                                transition: { type: "spring" as const, stiffness: 300 }
                                            }}
                                        >
                                            <span className="text-white font-semibold text-sm">
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-base">{testimonial.name}</p>
                                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div> */}
            </div>
        </section>
    )
}

export default TestimonialsSection
