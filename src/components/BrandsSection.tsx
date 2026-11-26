import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { homepageBrands } from "@/data/brands";

const BrandsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="brands"
      className="py-12 md:py-18 bg-background texture-linen"
      ref={ref}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-3">
            Our Network
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            Trusted by Leading Brands
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            We partner with India's most prestigious garment brands, distributing quality apparel across the nation.
          </p>
        </motion.div>

        {/* Logo Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {homepageBrands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: Math.min(0.05 * i, 0.8) }}
              className="aspect-square min-h-0 overflow-hidden bg-card border border-border rounded-xl flex items-center justify-center p-5 sm:p-7 md:p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-primary/10"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                loading="lazy"
                decoding="async"
                width={600}
                height={600}
                className="h-[76%] w-[86%] min-h-0 min-w-0 object-contain transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            to="/brand-partners"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-brand text-primary-foreground rounded-sm text-sm font-semibold tracking-[0.2em] uppercase hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/15 group"
          >
            View All Partners
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default BrandsSection;
