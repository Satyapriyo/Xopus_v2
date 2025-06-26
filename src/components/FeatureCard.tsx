import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
    gradient: string
    delay: number
    isVisible: boolean
}

const FeatureCard = ({ icon: Icon, title, description, gradient, delay, isVisible }: FeatureCardProps) => {
    return (
        <Card
            className={`group bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            <CardContent className="p-8 text-center relative overflow-hidden">
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                        {title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {description}
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </CardContent>
        </Card>
    )
}

export default FeatureCard
