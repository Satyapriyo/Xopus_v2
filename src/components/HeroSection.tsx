import { useState, useEffect } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
    isVisible: boolean
}

const HeroSection = ({ isVisible }: HeroSectionProps) => {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Get things done by awesome
                            <br />
                            <span className="text-blue-600">remote team</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            We're different. Flexible hours, no micromanagement, and work from anywhere.
                            Join our team that's changing the way agencies operate.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                                Get started now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-gray-300 hover:border-blue-400 text-gray-700 px-8 py-4 text-lg">
                                <Play className="w-5 h-5 mr-2" />
                                Learn more
                            </Button>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.3s' }}>
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-5xl mx-auto">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Play className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Dashboard</h3>
                                    <p className="text-gray-600">See how our platform works in real-time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
