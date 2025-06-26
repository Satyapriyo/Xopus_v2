import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface TestimonialsSectionProps {
    isVisible: boolean
}

const TestimonialsSection = ({ isVisible }: TestimonialsSectionProps) => {
    const testimonials = [
        {
            name: "Alex Johnson",
            role: "CEO at TechCorp",
            content: "This AI payment system revolutionized how we handle micro-transactions. The X402 protocol is incredibly fast and secure!",
            rating: 5,
            delay: 0.1,
            featured: true // Large card
        },
        {
            name: "Sarah Williams",
            role: "Lead Developer at Creative Co",
            content: "Simply the best blockchain payment solution I've used. The integration was seamless.",
            rating: 5,
            delay: 0.2,
            featured: false
        },
        {
            name: "Marcus Chen",
            role: "CTO at DataFlow Inc",
            content: "The transparency and security of smart contract payments gives us complete confidence.",
            rating: 5,
            delay: 0.3,
            featured: false
        },
        {
            name: "Emily Rodriguez",
            role: "Product Manager at InnovateAI",
            content: "We've processed over 10,000 AI queries through this platform. The reliability is outstanding and costs are very reasonable.",
            rating: 5,
            delay: 0.4,
            featured: true // Large card
        },
        {
            name: "David Kim",
            role: "Founder of BlockchainStartup",
            content: "The X402 protocol implementation is flawless. Perfect integration.",
            rating: 5,
            delay: 0.5,
            featured: false
        },
        {
            name: "Jessica Thompson",
            role: "Engineering Manager at CloudTech",
            content: "Finally, a payment system that understands developers.",
            rating: 5,
            delay: 0.6,
            featured: false
        },
        {
            name: "Ryan O'Connor",
            role: "Head of AI at FutureCorpAI",
            content: "We switched from traditional payment processors to this platform and cut our transaction costs by 60%. Highly recommended!",
            rating: 5,
            delay: 0.7,
            featured: true // Large card
        },
        {
            name: "Priya Patel",
            role: "Technical Lead at ML Solutions",
            content: "The real-time payment confirmation is game-changing.",
            rating: 5,
            delay: 0.8,
            featured: false
        }
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

    // Hover animation for cards
    const cardHover = {
        scale: 1.05,
        y: -5,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 20
        }
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
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

                {/* Animated Bento Grid Layout */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-7xl mx-auto auto-rows-fr"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={cardHover}
                            className={`${testimonial.featured
                                ? 'md:col-span-3 lg:col-span-4 md:row-span-2' // Large cards
                                : 'md:col-span-2 lg:col-span-2' // Small cards
                                }`}
                        >
                            <Card className="bg-white border border-gray-200 shadow-lg h-full">
                                <CardContent className={`${testimonial.featured ? 'p-8' : 'p-6'} h-full flex flex-col justify-between`}>
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
                                                    <Star className={`${testimonial.featured ? 'w-5 h-5' : 'w-4 h-4'} text-yellow-400 fill-current`} />
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        <motion.p
                                            className={`text-gray-900 mb-6 font-medium leading-relaxed ${testimonial.featured ? 'text-lg' : 'text-sm'}`}
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
                                            className={`${testimonial.featured ? 'w-12 h-12' : 'w-8 h-8'} bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg`}
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 5,
                                                transition: { type: "spring" as const, stiffness: 300 }
                                            }}
                                        >
                                            <span className={`text-white font-semibold ${testimonial.featured ? 'text-sm' : 'text-xs'}`}>
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </motion.div>
                                        <div>
                                            <p className={`font-semibold text-gray-900 ${testimonial.featured ? 'text-base' : 'text-sm'}`}>{testimonial.name}</p>
                                            <p className={`text-gray-600 ${testimonial.featured ? 'text-sm' : 'text-xs'}`}>{testimonial.role}</p>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default TestimonialsSection
