import React from "react";

import { HERO_CONTENT, HERO_FEATURES } from "@/data/hero";

export function HeroSection() {
  const { title, description } = HERO_CONTENT;

  return (
    <section className="relative flex min-h-[720px] items-center justify-center overflow-hidden py-8">
      <div className="from-muted-foreground/95 via-muted-foreground/90 to-primary/20 absolute inset-0 bg-gradient-to-br" />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(/hero.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold text-balance md:text-7xl">
          {title.main}
          <br />
          <span>
            está en
            <span className="text-primary">{title.highlight} </span>
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-pretty text-gray-300">
          {description.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < description.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm text-gray-300">
          {HERO_FEATURES.map((feature) => (
            <div key={feature.id} className="flex items-center gap-2">
              <span className={feature.iconColor}>{feature.icon}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
