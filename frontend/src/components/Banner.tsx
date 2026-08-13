import React from "react";

export default function Banner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-stone-900 to-neutral-950 text-white shadow-xl my-6">
      {/* Background patterns/effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,56,92,0.15),transparent_50%)]" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        <div className="max-w-2xl text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-4">
            ★ Introducing Guest Favourites
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            The most loved homes on Airbnb
          </h2>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            Discover a collection of the 2 million most-loved homes on Airbnb, rated 4.9 stars on average, with high marks for reliability, cleanliness, and communication.
          </p>
        </div>
        
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 bg-white text-stone-950 hover:bg-stone-100 font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Explore now
          </button>
          <a
            href="https://www.airbnb.com/release"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
}
