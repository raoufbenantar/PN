import React from 'react';
import { Quote, User, Users, Map, Star } from 'lucide-react';

export default function StatsAndTestimonials() {
  const testimonials = [
    {
      text: "A life-changing experience. I never thought I would see my country from this perspective!",
      author: "Amine, 24 y/o",
      tag: "Young Adventurer",
      avatarBg: "bg-brand-orange",
      cardStyle: "bg-[#DCE7FF] text-brand-dark border-l-8 border-brand-orange shadow-brutalist-forest angled-card"
    },
    {
      text: "The organization is top-notch. You feel safe while experiencing a real adventure.",
      author: "Lina, Athlete",
      tag: "Athlete & Trekker",
      avatarBg: "bg-brand-forestDark",
      cardStyle: "bg-brand-forest text-brand-sand border-r-8 border-brand-orange shadow-brutalist-dark md:ml-auto md:-rotate-1 border-t border-b border-l border-brand-forestDark"
    }
  ];

  const stats = [
    {
      value: "410+",
      label: "Adventurers",
      icon: <Users className="w-8 h-8 text-brand-sand/80" />
    },
    {
      value: "24",
      label: "Regions Visited",
      icon: <Map className="w-8 h-8 text-brand-sand/80" />
    },
    {
      value: "100%",
      label: "Authenticity",
      icon: <Star className="w-8 h-8 text-brand-sand/80" />
    }
  ];

  return (
    <div className="relative">
      
      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-brand-sand/20 relative overflow-hidden">
        {/* Decorative Top Jagged Border */}
        <div className="absolute top-0 left-0 w-full rotate-180 z-10">
          <div className="zigzag-border w-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-20">
          <div className="text-center mb-20">
            <span className="bg-brand-sand text-brand-orangeDark font-space text-xs font-black tracking-widest px-3 py-1 rounded border border-brand-orangeDark/20 uppercase">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-orange font-syne uppercase tracking-tight mt-4">
              Our Adventurers
            </h2>
          </div>

          <div className="space-y-16 max-w-3xl mx-auto">
            {testimonials.map((test, index) => (
              <div 
                key={index}
                className={`p-8 md:p-12 rounded border-2 border-brand-dark relative transition-all duration-300 hover:scale-[1.01] ${test.cardStyle}`}
              >
                {/* Quote Icon overlay */}
                <Quote className="absolute top-4 right-4 w-12 h-12 opacity-15" />
                
                <p className="text-lg md:text-xl font-bold italic mb-8 relative z-10 leading-relaxed">
                  "{test.text}"
                </p>

                <div className="flex items-center space-x-4">
                  {/* Styled Avatar Placeholder */}
                  <div className={`w-12 h-12 rounded border-2 border-brand-dark flex items-center justify-center text-white font-bold font-space ${test.avatarBg} shadow-[2px_2px_0px_rgba(22,44,28,1)]`}>
                    <User className="w-5 h-5 text-brand-sand" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base tracking-tight font-syne">{test.author}</h4>
                    <span className="text-xs opacity-75 font-space font-bold">{test.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner Section */}
      <section className="bg-brand-orange py-16 px-6 border-y-4 border-brand-forestDark relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center p-6 bg-black/15 rounded border-2 border-white/20 shadow-brutalist-forest transform hover:-translate-y-1 transition-transform"
            >
              <div className="mb-4 p-3 bg-white/10 rounded-full border border-white/15">
                {stat.icon}
              </div>
              <div className="text-6xl font-black font-syne mb-2 tracking-tight text-brand-sand">
                {stat.value}
              </div>
              <div className="text-sm font-space font-extrabold uppercase tracking-widest text-white/90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
