const modules = import.meta.glob<{ default: string }>(
  "../assets/brands/*.{png,jpg,jpeg,webp,svg}",
  { eager: true }
);

export interface Brand {
  name: string;
  logo: string;
}

const allBrands = Object.entries(modules).map(([path, mod]) => ({
  name: path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "brand",
  logo: mod.default,
  _path: path,
}));

const shuffleBrands = <T>(items: T[]) =>
  [...items].sort(() => Math.random() - 0.5);

const isHomepageBrand = (path: string) => /\/IMP\d+[_./]/.test(path);

// Homepage: the IMP1-IMP30 logos, randomized among themselves.
const impBrands = shuffleBrands(allBrands.filter(b => isHomepageBrand(b._path)));

// Brand network: IMP logos first, then every non-IMP logo.
const restBrands = shuffleBrands(allBrands.filter(b => !isHomepageBrand(b._path)));

export const homepageBrands: Brand[] = impBrands.map(({ name, logo }) => ({ name, logo }));

export const brands: Brand[] = [...impBrands, ...restBrands].map(({ name, logo }) => ({ name, logo }));
