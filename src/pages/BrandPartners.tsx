import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { brands } from "@/data/brands";

const BrandPartners = () => (
  <div className="min-h-screen">
    <Navbar />
    <PageHero
      subtitle="Our Network"
      title="Brand Partners"
      description="We are proud to partner with India's most prestigious garment brands."
    />

    <section className="py-10 md:py-14 bg-background texture-paper">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(0.04 * i, 0.6) }}
              className="aspect-square min-h-0 overflow-hidden bg-card border border-border rounded-xl p-5 sm:p-7 md:p-8 flex items-center justify-center hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                loading={i < 12 ? "eager" : "lazy"}
                decoding="async"
                width={600}
                height={600}
                className="h-[76%] w-[86%] min-h-0 min-w-0 object-contain transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default BrandPartners;
