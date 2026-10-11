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
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034522416.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034522416.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034744026.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6053764458.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6282364216.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034522422.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034522448.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034522404.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853578415/6034522410.png",
    ],
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-ria-dress",
    name: "The Ria Dress",
    price: 195000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/672060129/5830209276.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/672060129/5830209276.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/672060129/5830182162.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/672060129/5830219752.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5019615496.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4384615349",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4384615344",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "lace-up-tank",
    name: "Lace-up Tank",
    price: 45000,
    category: "tops",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022072226.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022072226.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022074140.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022074146.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022072220.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022073228.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/853150090/6022073234.png",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-ifan-skirt",
    name: "The IFAN skirt",
    price: 105000,
    category: "skirts",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/693550185/5830248966.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/693550185/5830248966.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/693550185/5830248972.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4525284105.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4525281494.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5019620019.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4525283912.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4525284100.png",
    ],
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-taco-bag",
    name: "The TACO Bag",
    price: 95000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/739959650/5830223812.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/739959650/5830223812.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4848526774.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/739959650/5702193766.png",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-party-dress",
    name: "The Party Dress (Plain)",
    price: 180000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/764561243/5830248906.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/764561243/5830248906.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5023043022.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/764561243/5830277892.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5023058375.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5023043017.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5023041459.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-tulle-skirt",
    name: "The Tulle Skirt",
    price: 97000,
    category: "skirts",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5830248930.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5830248930.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5830277754.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5654498256.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5654494198.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5598108940.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5654498318.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/817629204/5654499004.png",
    ],
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-uko-bag",
    name: "The Uko Bag",
    price: 75000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5093925760.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5093925760.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5093841208.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5093925765.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-tulle-dress",
    name: "The Tulle Dress",
    price: 150000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798780243/5624955624.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798780243/5624955624.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5405900809.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798780243/5577892824.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5405900874.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5405901122.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5405901130.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5405899935.png",
    ],
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-mie-set",
    name: "The MIE Set",
    price: 150000,
    category: "sets",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765193267/5830248498.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765193267/5830248498.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765193267/5830248492.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765193267/5830277786.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5030722989.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765193267/5657434120.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5030796118.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5030796009.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5030723958.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "adjustable-bucket-hat",
    name: "Adjustable Bucket Hat",
    price: 45000,
    category: "hats",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/690432194/5830248484.jpg",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/690432194/5830248484.jpg",
      "/campaign/adjustable-bucket-hat.jpg",
      "/products/bucket-hat-worn.jpg",
      "/products/bucket-hat-red.jpg",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/690432194/5830248482.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4501500140.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/690432194/5830248470.png",
    ],
    aspect: "square",
    summary:
      "Chunky bucket hat made from T-shirt yarn or paracord, with a rope to adjust the size. It runs big. " +
      studio,
  },
  {
    slug: "the-noyi-mini-bag",
    name: "The Noyi Mini Bag",
    price: 45000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/651171510/5830251744.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/651171510/5830251744.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/651171510/5830286358.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286452944",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316247726",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-cloud-purse-1",
    name: "The cloud Purse 1",
    price: 25000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4301093032",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4301093032",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "tia-mini-bag",
    name: "Tia Mini Bag",
    price: 35000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286952982",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286952982",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286955403",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286961780",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316261796",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-checkered-bag",
    name: "The Checkered Bag",
    price: 40000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286970783",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286970783",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286970798",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316252658",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-man-purse",
    name: "The Man Purse",
    price: 35000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286966607",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286966607",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286960951",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4286960946",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316265763",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "illusion-mesh-macrame-dress",
    name: "Illusion Mesh Macramé Dress",
    price: 145000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/4843844320.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/4843844320.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/4316142307",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/4316132480",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/4316050467",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/4773158460.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/4773158204.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655302964/5019622699.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-net-bag",
    name: "The Net Bag",
    price: 35000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316247596",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316247596",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316243405",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316247661",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316247676",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317312580",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4316168493",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-striped-party-dress",
    name: "The Striped Party Dress",
    price: 180000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4843836599.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4843836599.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4660125589.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4757208430.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4317156846",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4737052230.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4757224053.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4317161837",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4773166645.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/4773166213.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510008/5019627049.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "tia-midi-bag",
    name: "Tia Midi Bag",
    price: 45000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510009/5830251656.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655510009/5830251656.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317187235",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317156966",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317169861",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317178760",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-yakhi-bag",
    name: "The Yakhi Bag",
    price: 35000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317197720",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317197720",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317211255",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317204145",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317197730",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "tia-maxi-bag",
    name: "Tia Maxi Bag",
    price: 50000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317190950",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317190950",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4403679065",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317190965",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317193180",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317193185",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317190955",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-mesh-dress",
    name: "The Mesh Dress",
    price: 95000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317262899",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317262899",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317266055",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4326070979",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4326082327",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "cloud-purse-2",
    name: "Cloud Purse 2",
    price: 25000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317285530",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317285530",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317274954",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "japanese-knot-bag",
    name: "Japanese Knot Bag",
    price: 30000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317298190",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317298190",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317298205",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-mesh-set",
    name: "The Mesh Set",
    price: 95000,
    category: "sets",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655531755/5830277820.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655531755/5830277820.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/655531755/5830248994.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5076034835.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4326079343",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4326070234",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5019623199.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-noyi-midi-bag",
    name: "The Noyi Midi Bag",
    price: 55000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317286595",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317286595",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317274994",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317312824",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317285615",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-noyi-baguette",
    name: "The Noyi Baguette",
    price: 35000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317306905",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317306905",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317312754",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317312804",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-noyi-maxi",
    name: "The Noyi Maxi",
    price: 70000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317301629",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317301629",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317279995",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317289614",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317298780",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4317298000",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "tia-mini-t-shirt-yarn",
    name: "Tia Mini (T-shirt Yarn)",
    price: 45000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4409302406",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4409302406",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4409302411",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    slug: "the-ifan-short-set",
    name: "The Ifan Short Set",
    price: 135000,
    category: "sets",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483079955.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483079955.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483087379.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483085985.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5019620419.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483087384.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483085990.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-ifan-skirt-set",
    name: "The Ifan Skirt Set",
    price: 135000,
    category: "sets",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483068425.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483068425.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483087304.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483079750.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483103934.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4483070884.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5019622629.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-ribbon-bag",
    name: "The Ribbon Bag",
    price: 45000,
    category: "bags",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684287987.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684287987.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684287992.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684287997.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684288442.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684309002.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684288447.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684288452.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4684309007.png",
    ],
    aspect: "square",
    summary: studio,
  },
  {
    // Live category is Shorts, which is not one of the six storefront categories. Skirts is the closest lower-body group.
    slug: "the-ifan-shorts",
    name: "The IFAN Shorts",
    price: 105000,
    category: "skirts",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4821696520.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4821696520.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4821696525.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5019617059.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4821696540.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/4821695222.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-maki-dress",
    name: "The MAKI Dress",
    price: 250000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5830277798.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5830277798.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5830182102.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5830209264.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5101114986.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5139496815.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5030796123.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765185375/5030769622.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-zem-dress",
    name: "The Zem Dress",
    price: 145000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032212280.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032212280.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765357513/5830313290.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032212345.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032208069.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032208064.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032210790.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032210785.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/5032210835.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-side-fringed-skirt",
    name: "The Side-Fringed Skirt",
    price: 105000,
    category: "skirts",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5782774342.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5782774342.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5039528438.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5039574117.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5782774336.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5039528443.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5039528448.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/765738334/5039498416.png",
    ],
    aspect: "tall",
    summary: studio,
  },
  {
    slug: "the-sway-dress",
    name: "The Sway Dress",
    price: 165000,
    category: "dresses",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798797517/5405806845.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798797517/5405806845.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798797517/5405806509.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798797517/5405856920.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798797517/5405861295.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/798797517/5405856940.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-flare-top",
    name: "The Flare Top",
    price: 65000,
    category: "tops",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/799434233/5416387933.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/799434233/5416387933.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/799434233/5416389103.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/799434233/5416387887.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/799434233/5416390765.png",
    ],
    aspect: "portrait",
    summary: studio,
  },
  {
    slug: "the-cuba-set",
    name: "The CUBA set",
    price: 205000,
    category: "sets",
    image: "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/854291139/6053708948.png",
    gallery: [
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/854291139/6053708948.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/854291139/6053709184.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/854291139/6053764446.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/854291139/6053764374.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/854291139/6053764464.png",
      "https://d2j6dbq0eux0bg.cloudfront.net/images/103018036/products/854291139/6053764470.png",
    ],
    aspect: "portrait",
    summary: studio,
  },

];

function imageOf(slug: string) {
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    throw new Error(`Missing product image for ${slug}`);
  }
  return product.image;
}

export const categories: Category[] = [
  {
    slug: "dresses",
    name: "Dresses",
    image: imageOf("the-ria-dress"),
  },
  {
    slug: "skirts",
    name: "Skirts",
    image: imageOf("the-cuba-skirt"),
  },
  {
    slug: "tops",
    name: "Tops",
    image: imageOf("lace-up-tank"),
  },
  {
    slug: "sets",
    name: "Sets",
    image: imageOf("the-mie-set"),
  },
  {
    slug: "bags",
    name: "Bags",
    image: imageOf("the-taco-bag"),
  },
  {
    slug: "hats",
    name: "Hats",
    image: imageOf("adjustable-bucket-hat"),
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

// Free UK delivery threshold in naira. Compare bag totals to this figure, then convert only for display.
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
