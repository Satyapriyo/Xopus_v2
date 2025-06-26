import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FAQSectionProps {
    isVisible: boolean
}

const FAQSection = ({ isVisible }: FAQSectionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const faqs = [
        {
            question: "Can I use Micro for free already?",
            answer: "Yes! We offer a free tier that includes basic features to get you started. You can upgrade anytime as your needs grow.",
            delay: 0.1
        },
        {
            question: "Does it work on WordPress?",
            answer: "Absolutely! Our platform integrates seamlessly with WordPress and other popular content management systems.",
            delay: 0.2
        },
        {
            question: "Do you have support?",
            answer: "Yes, we provide 24/7 customer support via email, chat, and phone for all our paid plans.",
            delay: 0.3
        },
        {
            question: "Will you provide support?",
            answer: "We offer comprehensive support including documentation, tutorials, and direct assistance from our team.",
            delay: 0.4
        }
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
            <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">
                            Can I use Micro for free already?
                        </h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Yes! We offer a generous free tier that includes all the essential features you need to get started.
                            You can create projects, collaborate with your team, and access basic analytics without any cost.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-6">
                            Does it work with WordPress?
                        </h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Absolutely! Our platform is designed to work seamlessly with WordPress and other popular content management systems.
                            Easy integration in just a few clicks.
                        </p>
                    </div>
                </div>

                <div className="mt-16 space-y-4">
                    {faqs.map((faq, index) => (
                        <Card
                            key={index}
                            className={`bg-slate-800 border-slate-700 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${faq.delay}s` }}
                        >
                            <CardContent className="p-0">
                                <button
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700 transition-colors"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <span className="font-semibold text-white">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQSection
