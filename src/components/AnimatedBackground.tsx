const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient mesh background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-sky-50/40"></div>

            {/* Floating geometric shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-100 to-sky-200 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-sky-100 to-blue-200 rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl opacity-35 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-40 w-16 h-16 bg-gradient-to-r from-cyan-100 to-blue-200 rounded-full blur-xl opacity-40 animate-pulse" style={{ animationDelay: '3s' }}></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Animated gradient orbs */}
            <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-blue-200 to-sky-300 rounded-full blur-3xl opacity-20 animate-floating"></div>
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-gradient-to-r from-sky-200 to-blue-300 rounded-full blur-3xl opacity-15 animate-floating-delayed"></div>
        </div>
    )
}

export default AnimatedBackground
