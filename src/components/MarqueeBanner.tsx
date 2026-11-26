import { motion } from "framer-motion";

const brands = [
  "Balajee Enterprises", "Bad Boyz", "M.J. Ali Dresses", "DM Dresses",
  "M Kajol Dresses", "Miss Art Garments", "Madboyz", "My First Baby",
  "Karnika Industries Limited", "Jingle Bell", "Ozzu", "Unick Collection",
  "Saanvikaa", "Galaxy", "Merat Fashion", "Sweet Hearts",
  "K-69", "First Day", "BabyQ", "Perfect Girl",
  "Miss 'U'", "Ishana", "P Kids", "The Boyz",
  "Zeel", "Teensy Weensy", "My First Hero", "Banjaran",
  "My First Day", "Tirumani",
];

const MarqueeBanner = () => {
  const duplicated = [...brands, ...brands, ...brands];

  return (
    <section className="relative py-5 bg-secondary border-y border-gold/15 overflow-hidden">
      <div className="absolute inset-0 texture-diagonal opacity-50" />
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {duplicated.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="text-xs font-semibold tracking-[0.35em] uppercase text-muted-foreground/60 flex items-center gap-10"
          >
            {brand}
            <span className="w-1.5 h-1.5 rotate-45 bg-gold/40 inline-block" />
          </span>
        ))}
      </motion.div>
    </section>
  );
};

export default MarqueeBanner;
