import { Code, Clock, Palette } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FeaturesSectionProps {
    isVisible: boolean
}

const FeaturesSection = ({ isVisible }: FeaturesSectionProps) => {
    const features = [
        {
            icon: Code,
            title: "X402 Protocol",
            description: "Secure, instant payments using the X402 open payment standard. No intermediaries, just direct blockchain transactions.",
            delay: 0.1
        },
        {
            icon: Clock,
            title: "Secure Smart Contract",
            description: "Your deployed smart contract ensures secure, verifiable payments with full transparency on the blockchain.",
            delay: 0.2
        },
        {
            icon: Palette,
            title: "Pay Per Query",
            description: " Fair pricing model - only pay for what you use. Each query is processed after payment confirmation.",
            delay: 0.3
        }
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className={`border-0 shadow-none transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${feature.delay}s` }}
                        >
                            <CardContent className="p-8 text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                                    <feature.icon className="w-6 h-6 text-blue-600" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
