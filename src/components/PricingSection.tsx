import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PricingSectionProps {
    isVisible: boolean
}

const PricingSection = ({ isVisible }: PricingSectionProps) => {
    const plans = [
       
        {
            name: "BUSINESS",
            price: "$49",
            period: "per month",
            description: "All the basic features to boost your freelance career",
            features: [
                "Full Access",
                "Enhanced Security",
                "Source Files",
                "1 Domain",
                "Enhanced Security"
            ],
            buttonText: "Get started with Business",
            isPopular: true,
            delay: 0.2
        },
        
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Pricing & Plans</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Choose the perfect plan for your business needs. All plans include our core features with different limits and capabilities.
                    </p>
                </div>

                <div className="grid md:grid-cols-1 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`bg-white mx-auto text-gray-900 border-0 shadow-xl relative transition-all duration-1000 ${plan.isPopular ? 'scale-105 ring-2 ring-blue-500' : ''} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${plan.delay}s` }}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <CardContent className="p-8 text-center">
                                <h3 className="text-sm font-bold text-gray-500 mb-4 tracking-wider">
                                    {plan.name}
                                </h3>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-500 ml-2">{plan.period}</span>
                                </div>

                                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                                    {plan.description}
                                </p>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-sm">
                                            <Check className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full py-3 ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                >
                                    {plan.buttonText}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PricingSection
