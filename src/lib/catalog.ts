export type CategorySlug = "dresses" | "skirts" | "tops" | "sets" | "bags" | "hats";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: CategorySlug;
  image: string;
  gallery?: string[];
  aspect: "tall" | "portrait" | "square";
  summary: string;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  image: string;
};

const studio =
  "Made to order in the Lagos studio. Allow up to 14 working days.";

export const products: Product[] = [
  {
    slug: "the-cuba-skirt",
    name: "The CUBA Skirt",
    price: 150000,
    category: "skirts",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034522421.jpg",
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-ria-dress",
    name: "The Ria Dress",
    price: 195000,
    category: "dresses",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/672060129/5830209281.jpg",
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "lace-up-tank",
    name: "Lace-up Tank",
    price: 45000,
    category: "tops",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022072231.jpg",
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-ifan-skirt",
    name: "The IFAN Skirt",
    price: 105000,
    category: "skirts",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/693550185/5830248971.jpg",
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-taco-bag",
    name: "The TACO Bag",
    price: 95000,
    category: "bags",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/739959650/5830223817.jpg",
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-party-dress",
    name: "The Party Dress",
    price: 180000,
    category: "dresses",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/764561243/5830248911.jpg",
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-tulle-skirt",
    name: "The Tulle Skirt",
    price: 97000,
    category: "skirts",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5830248935.jpg",
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-uko-bag",
    name: "The Uko Bag",
    price: 75000,
    category: "bags",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5093925764.jpg",
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-tulle-dress",
    name: "The Tulle Dress",
    price: 150000,
    category: "dresses",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798780243/5624955629.jpg",
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-mie-set",
    name: "The MIE Set",
    price: 150000,
    category: "sets",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765193267/5830277753.jpg",
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "adjustable-bucket-hat",
    name: "Adjustable Bucket Hat",
    price: 45000,
    category: "hats",
    image:
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/690432194/5830248484.jpg",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/690432194/5830248484.jpg",
      "/campaign/adjustable-bucket-hat.jpg",
      "/products/bucket-hat-worn.jpg",
      "/products/bucket-hat-red.jpg",
    ],
    aspect: "square",
    summary:
      "Chunky bucket hat made from T-shirt yarn or paracord, with a rope to adjust the size. It runs big. " +
      studio,
  },
];

export const categories: Category[] = [
  {
    slug: "dresses",
    name: "Dresses",
    image: products[1].image,
  },
  {
    slug: "skirts",
    name: "Skirts",
    image: products[0].image,
  },
  {
    slug: "tops",
    name: "Tops",
    image: products[2].image,
  },
  {
    slug: "sets",
    name: "Sets",
    image: products[9].image,
  },
  {
    slug: "bags",
    name: "Bags",
    image: products[4].image,
  },
  {
    slug: "hats",
    name: "Hats",
    image: products[10].image,
  },
];

export const campaign = {
  hero: "https://d2gt4h1eeousrn.cloudfront.net/103018036/cover-9SQbdR/JVpny34-2000x2000.jpg",
  story:
    "https://d2gt4h1eeousrn.cloudfront.net/103018036/call-to-action-rTo28z/QZAYFaw-2000x2000.jpg",
  stills: [
    {
      src: "https://d2gt4h1eeousrn.cloudfront.net/103018036/call-to-action-mVxPou/esPEibu-2000x2000.jpg",
      alt: "Qreenade campaign still",
      caption: "Knots and stitches",
    },
    {
      src: "https://d2gt4h1eeousrn.cloudfront.net/103018036/cover-VK2C5V/f0kPbuS-2000x2000.jpg",
      alt: "Qreenade lookbook still",
      caption: "The studio",
    },
    {
      src: "https://d2gt4h1eeousrn.cloudfront.net/103018036/cover-spocB8/cDiQc0S-2000x2000.jpg",
      alt: "Qreenade collection still",
      caption: "The edit",
    },
  ],
};

export const heroSlides = [
  {
    slug: "the-ria-dress",
    src: campaign.story,
    alt: "The Ria Dress, worn in a timber room",
    title: "The Ria Dress",
    href: "/product/the-ria-dress",
    cta: "Shop The Ria Dress",
  },
  {
    slug: "the-uko-bag",
    src: campaign.stills[0].src,
    alt: "The Uko Bag on a stone plinth",
    title: "The Uko Bag",
    href: "/product/the-uko-bag",
    cta: "Shop The Uko Bag",
  },
  {
    slug: "adjustable-bucket-hat",
    src: "/campaign/adjustable-bucket-hat.jpg",
    alt: "Adjustable Bucket Hat, a blue crochet hat",
    title: "Adjustable Bucket Hat",
    href: "/product/adjustable-bucket-hat",
    cta: "Shop Adjustable Bucket Hat",
  },
];

export const testimonials = [
  {
    quote: "Hiya, just got the bags love them.",
    name: "Funke",
  },
  {
    quote:
      "Just got my bag I really love it Thank you all the best with the business",
    name: "Laide",
  },
  {
    quote: "Got them, they are lovely. Enjoying my bags",
    name: "@Quacktails.ng",
  },
  {
    quote: "I get too many compliments on these bags!",
    name: "Chioma",
  },
];

export const UK_FREE_DELIVERY = 300000;

export const apparelSizes = ["XS", "S", "M", "L", "XL"] as const;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function productsIn(category?: string) {
  if (!category) return products;
  return products.filter((product) => product.category === category);
}

export function sizesFor(category: CategorySlug) {
  return category === "bags" || category === "hats"
    ? (["One size"] as const)
    : apparelSizes;
}

export function searchProducts(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return products.filter((product) => {
    const category = categories.find((item) => item.slug === product.category);
    return (
      product.name.toLowerCase().includes(needle) ||
      category?.name.toLowerCase().includes(needle)
    );
  });
}
