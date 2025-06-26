import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
    icon: LucideIcon
    value: string
    label: string
    delay: number
    isVisible: boolean
}

const StatCard = ({ icon: Icon, value, label, delay, isVisible }: StatCardProps) => {
    return (
        <Card
            className={`group bg-white/90 backdrop-blur-sm border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-blue-600 group-hover:text-sky-600 transition-colors duration-300" />
                    </div>

                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent mb-2 group-hover:from-sky-600 group-hover:to-blue-700 transition-all duration-300">
                        {value}
                    </div>

                    <p className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                        {label}
                    </p>
                </div>

                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-300 via-sky-300 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ padding: '2px' }}>
                    <div className="h-full w-full rounded-lg bg-white"></div>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatCard
