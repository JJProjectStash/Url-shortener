const Hero = () => (
  <div className="text-center space-y-6 animate-fade-in-up py-8">
    <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
      <span className="inline-block animate-fade-in-up">Shorten</span>{" "}
      <span className="inline-block animate-fade-in-up animation-delay-100">
        Your
      </span>{" "}
      <span className="inline-block animate-fade-in-up animation-delay-200">
        URLs
      </span>
      <br />
      <span className="gradient-text animate-gradient inline-block animate-fade-in-up animation-delay-300 text-7xl md:text-8xl">
        Instantly
      </span>
    </h2>
    <div className="flex justify-center animate-fade-in-up animation-delay-400">
      <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-gradient" />
    </div>
    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500 font-medium">
      FastLinks is a URL shortener demonstrating{" "}
      <span className="text-blue-600 dark:text-blue-400 font-semibold">
        Hash Maps (O(1) lookups)
      </span>{" "}
      and{" "}
      <span className="text-purple-600 dark:text-purple-400 font-semibold">
        Queue-based rate limiting
      </span>
      .
      <br />
      Built with modern web technologies.
    </p>
  </div>
);

export default Hero;
