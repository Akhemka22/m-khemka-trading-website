import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Sparkles, Baby, Sun, Snowflake, Star, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import menswearImg from "@/assets/products-menswear.jpg";
import womenswearImg from "@/assets/products-womenswear.jpg";
import kidswearImg from "@/assets/products-kidswear.jpg";
import summerImg from "@/assets/products-summer.jpg";
import winterImg from "@/assets/products-winter.jpg";
import eidImg from "@/assets/products-eid.jpg";
import durgaPujaImg from "@/assets/products-durga-puja.jpg";
import diwaliImg from "@/assets/products-diwali.jpg";
import chhathPujaImg from "@/assets/products-chhath-puja.jpg";

// Auto-discover per-item images from folder tree
const productImageModules = import.meta.glob<{ default: string }>(
  "../assets/products/**/*.*",
  { eager: true }
);

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const getItemImages = (categoryId: string, itemName: string): string[] => {
  const prefix = `../assets/products/${categoryId}/${slugify(itemName)}/`;
  return Object.entries(productImageModules)
    .filter(([path]) => path.startsWith(prefix))
    .map(([, mod]) => mod.default);
};

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  {
    id: "mens-wear",
    title: "Men's Wear",
    icon: Shirt,
    description: "Premium formal and casual wear for the modern gentleman.",
    image: menswearImg,
    imageAlt: "Men's formal and casual wear collection",
    items: [
      "Formal Shirts", "Casual Shirts", "Trousers & Chinos", "Blazers & Suits",
      "T-Shirts & Polos", "Denim & Jeans", "Kurta & Ethnic Wear", "Innerwear & Loungewear",
    ],
  },
  {
    id: "womens-wear",
    title: "Women's Wear",
    icon: Sparkles,
    description: "Elegant and contemporary apparel for every occasion.",
    image: womenswearImg,
    imageAlt: "Women's ethnic and western wear collection",
    items: [
      "Sarees & Blouses", "Salwar Kameez", "Kurtis & Tunics", "Lehengas & Gowns",
      "Western Tops & Dresses", "Jeans & Palazzos", "Ethnic Dupattas & Stoles", "Innerwear & Loungewear",
    ],
  },
  {
    id: "kids-wear",
    title: "Kids Wear",
    icon: Baby,
    description: "Comfortable, colourful clothing for children of all ages.",
    image: kidswearImg,
    imageAlt: "Kids clothing collection",
    items: [
      "Boys' Shirts & T-Shirts", "Girls' Frocks & Dresses", "Kids' Ethnic Wear", "School Uniforms",
      "Infant & Toddler Sets", "Denim & Casual Bottoms", "Party Wear", "Nightwear & Sleepwear",
    ],
  },
];

const seasonalCategories = [
  {
    id: "summer-collection",
    title: "Summer Collection",
    icon: Sun,
    image: summerImg,
    imageAlt: "Summer clothing collection with light fabrics and vibrant prints",
    description: "Light, breathable fabrics and vibrant prints designed for comfort and style in warm weather.",
    items: ["Cotton Kurtas", "Linen Shirts", "Light Chinos", "Printed Sarees", "Floral Dresses", "Kids' Summer Sets"],
  },
  {
    id: "winter-collection",
    title: "Winter Collection",
    icon: Snowflake,
    image: winterImg,
    imageAlt: "Winter clothing collection with warm woolen and velvet garments",
    description: "Warm, layered essentials featuring rich textures and deep tones for the colder months.",
    items: ["Woollen Blazers", "Shawls & Stoles", "Sweaters & Cardigans", "Velvet Kurtas", "Quilted Jackets", "Kids' Winterwear"],
  },
];

const festiveCategories = [
  {
    id: "eid-collection",
    title: "Eid Collection",
    image: eidImg,
    imageAlt: "Elegant ethnic wear for Eid celebration",
    items: ["Sherwanis", "Embroidered Kurtas", "Pathani Suits", "Hijab & Abaya Sets"],
    imageLeft: true,
  },
  {
    id: "durga-puja-collection",
    title: "Durga Puja Collection",
    image: durgaPujaImg,
    imageAlt: "Traditional ethnic wear for Durga Puja",
    items: ["Designer Sarees", "Silk Kurtis", "Festive Lehengas", "Traditional Dhotis"],
    imageLeft: false,
  },
  {
    id: "diwali-collection",
    title: "Diwali Collection",
    image: diwaliImg,
    imageAlt: "Bright festive clothing for Diwali celebration",
    items: ["Brocade Kurtas", "Velvet Blazers", "Gold-thread Sarees", "Kids' Festive Sets"],
    imageLeft: true,
  },
  {
    id: "chhath-puja-collection",
    title: "Chhath Puja Collection",
    image: chhathPujaImg,
    imageAlt: "Traditional ethnic wear for Chhath Puja celebration",
    items: ["Traditional Sarees", "Cotton Kurtas", "Dhoti Sets", "Kids' Ethnic Sets"],
    imageLeft: false,
  },
];

const navGroups = [
  { label: "Men's Wear",   icon: Shirt,    id: "mens-wear" },
  { label: "Women's Wear", icon: Sparkles, id: "womens-wear" },
  { label: "Kids Wear",    icon: Baby,     id: "kids-wear" },
  {
    label: "Seasonal", icon: Sun,
    sub: [
      { label: "Summer Collection", id: "summer-collection" },
      { label: "Winter Collection", id: "winter-collection" },
    ],
  },
  {
    label: "Festive", icon: Star,
    sub: [
      { label: "Eid Collection",         id: "eid-collection" },
      { label: "Durga Puja Collection",  id: "durga-puja-collection" },
      { label: "Diwali Collection",      id: "diwali-collection" },
      { label: "Chhath Puja Collection", id: "chhath-puja-collection" },
    ],
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface LightboxState {
  open: boolean;
  images: string[];
  label: string;
  idx: number;
  dir: number;
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

const ProductLightbox = ({
  state, onClose, onPrev, onNext, onJump,
}: {
  state: LightboxState;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}) => {
  useEffect(() => {
    if (!state.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onPrev();
      if (e.key === "ArrowRight")  onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.open, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {state.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-card rounded-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/70">
                {state.label}
              </span>
              <div className="flex items-center gap-4">
                {state.images.length > 1 && (
                  <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    {state.idx + 1} / {state.images.length}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="text-foreground/50 hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative overflow-hidden aspect-[16/10] bg-muted">
              <AnimatePresence custom={state.dir} mode="wait">
                <motion.img
                  key={state.idx}
                  src={state.images[state.idx]}
                  alt={state.label}
                  custom={state.dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </AnimatePresence>

              {state.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors z-10"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Dot indicators */}
            {state.images.length > 1 && state.images.length <= 8 && (
              <div className="flex justify-center gap-2 py-3">
                {state.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); onJump(i); }}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      i === state.idx ? "bg-accent" : "bg-border hover:bg-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <p className="mt-4 text-white/35 text-[10px] tracking-[0.25em] uppercase select-none">
            Press Esc or click outside to close · ← → to navigate
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Item Card ───────────────────────────────────────────────────────────────

const ItemCard = ({ item, onClick }: { item: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-5 py-4 text-sm tracking-wide rounded-md border border-border bg-card text-foreground/80 shadow-sm hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
  >
    {item}
  </button>
);

// ─── ProductNav ──────────────────────────────────────────────────────────────

const ProductNav = () => {
  const [open, setOpen] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    setOpen(null);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  useEffect(() => {
    const handler = () => setOpen(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {navGroups.map((item) => (
            <div key={item.label} className="relative" onClick={(e) => e.stopPropagation()}>
              {"sub" in item ? (
                <>
                  <button
                    onClick={() => setOpen(open === item.label ? null : item.label)}
                    className={`flex items-center gap-2 px-5 py-3 border rounded-sm text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 ${
                      open === item.label
                        ? "bg-gradient-brand text-primary-foreground border-transparent shadow-lg"
                        : "bg-card border-border text-foreground/70 hover:border-accent/40 hover:text-primary hover:shadow-sm"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open === item.label ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {open === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[210px] bg-card border border-border rounded-sm shadow-xl py-2 z-50"
                      >
                        {item.sub.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => scrollTo(sub.id)}
                            className="w-full text-left px-5 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-muted/50 transition-colors tracking-wide"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center gap-2 px-5 py-3 border border-border bg-card rounded-sm text-xs font-semibold tracking-[0.15em] uppercase text-foreground/70 hover:border-accent/40 hover:text-primary hover:shadow-sm transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs tracking-[0.2em] uppercase text-muted-foreground/80">
          Click on any item card to view samples
        </p>
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Products = () => {
  const location = useLocation();

  const [lightbox, setLightbox] = useState<LightboxState>({
    open: false, images: [], label: "", idx: 0, dir: 1,
  });

  const openLightbox = useCallback((categoryId: string, itemName: string, fallbackSrc: string) => {
    const imgs = getItemImages(categoryId, itemName);
    setLightbox({
      open: true,
      images: imgs.length > 0 ? imgs : [fallbackSrc],
      label: itemName,
      idx: 0,
      dir: 1,
    });
  }, []);

  const closeLightbox = useCallback(() =>
    setLightbox((s) => ({ ...s, open: false })), []);

  const prevImage = useCallback(() =>
    setLightbox((s) => ({
      ...s,
      dir: -1,
      idx: (s.idx - 1 + s.images.length) % s.images.length,
    })), []);

  const nextImage = useCallback(() =>
    setLightbox((s) => ({
      ...s,
      dir: 1,
      idx: (s.idx + 1) % s.images.length,
    })), []);

  const jumpToImage = useCallback((i: number) =>
    setLightbox((s) => ({ ...s, dir: i > s.idx ? 1 : -1, idx: i })), []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        document.getElementById(location.hash.substring(1))
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        subtitle="Our Catalogue"
        title="Products"
        description="A comprehensive range of branded garments across every category and season."
      />

      <ProductNav />

      {/* Main categories */}
      {categories.map((cat, ci) => (
        <section
          key={cat.title}
          id={cat.id}
          className={`py-12 md:py-18 ${ci % 2 === 0 ? "bg-background texture-linen" : "bg-secondary/30 texture-diagonal"}`}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-10 ${ci % 2 !== 0 ? "md:[direction:rtl]" : ""}`}
              >
                <div className="overflow-hidden rounded-md border border-border shadow-sm md:[direction:ltr]">
                  <img src={cat.image} alt={cat.imageAlt} loading="lazy" decoding="async" width={800} height={512}
                    className="w-full object-cover aspect-[16/10] hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="md:[direction:ltr]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-md bg-gradient-brand flex items-center justify-center">
                      <cat.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{cat.title}</h2>
                  </div>
                  <div className="w-12 h-px bg-accent mb-4" />
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{cat.description}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {cat.items.map((item, i) => (
                  <ItemCard
                    key={i}
                    item={item}
                    onClick={() => openLightbox(cat.id, item, cat.image)}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Seasonal Collections */}
      <section className="py-12 md:py-18 bg-secondary/30 texture-diagonal">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-gradient-brand flex items-center justify-center">
                  <Sun className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Seasonal Collections</h2>
              </div>
              <div className="w-12 h-px bg-accent mx-auto mb-4" />
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                Season-specific ranges crafted for comfort, style, and weather-appropriate dressing throughout the year.
              </p>
            </motion.div>

            <div className="space-y-16">
              {seasonalCategories.map((sc, si) => (
                <div id={sc.id} key={sc.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: 0.1 * si }}
                    className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-8 ${si % 2 !== 0 ? "md:[direction:rtl]" : ""}`}
                  >
                    <div className="overflow-hidden rounded-md border border-border shadow-sm md:[direction:ltr]">
                      <img src={sc.image} alt={sc.imageAlt} loading="lazy" decoding="async" width={1024} height={640}
                        className="w-full object-cover aspect-[16/10] hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="md:[direction:ltr]">
                      <div className="flex items-center gap-3 mb-3">
                        <sc.icon className="w-5 h-5 text-accent" />
                        <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">{sc.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{sc.description}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * si + 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {sc.items.map((item, i) => (
                      <ItemCard
                        key={i}
                        item={item}
                        onClick={() => openLightbox(sc.id, item, sc.image)}
                      />
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Festive Collections */}
      <section className="py-12 md:py-18 bg-background texture-linen">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-gradient-brand flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Festive Collections</h2>
              </div>
              <div className="w-12 h-px bg-accent mx-auto mb-4" />
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                Celebrate every occasion with our curated festive ranges, elegant, vibrant, and crafted for the spirit of each festival.
              </p>
            </motion.div>

            <div className="space-y-16">
              {festiveCategories.map((fc, fi) => (
                <div id={fc.id} key={fc.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: 0.1 * fi }}
                    className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-8 ${!fc.imageLeft ? "md:[direction:rtl]" : ""}`}
                  >
                    <div className="overflow-hidden rounded-md border border-border shadow-sm md:[direction:ltr]">
                      <img src={fc.image} alt={fc.imageAlt} loading="lazy" decoding="async" width={1024} height={640}
                        className="w-full object-cover aspect-[16/10] hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="md:[direction:ltr]">
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3 flex items-center gap-3">
                        <span className="w-8 h-px bg-accent flex-shrink-0" />
                        {fc.title}
                      </h3>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * fi + 0.15 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {fc.items.map((item, i) => (
                      <ItemCard
                        key={i}
                        item={item}
                        onClick={() => openLightbox(fc.id, item, fc.image)}
                      />
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ProductLightbox
        state={lightbox}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
        onJump={jumpToImage}
      />
    </div>
  );
};

export default Products;
