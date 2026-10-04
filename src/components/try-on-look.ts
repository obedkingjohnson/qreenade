export type BodyType = "slim" | "balanced" | "curvy" | "athletic";
export type FaceType = "soft" | "narrow" | "broad" | "long";
export type MakeupType = "bare" | "blush" | "bronze" | "berry";
export type AccessoryType = "none" | "hoops" | "studs" | "necklace" | "glasses";
export type HairStyle = "bob" | "cropped" | "tied" | "long";

export type TryOnLook = {
  body: BodyType;
  height: number;
  skin: string;
  hair: HairStyle;
  hairColor: string;
  face: FaceType;
  makeup: MakeupType;
  accessory: AccessoryType;
};

export const defaultLook: TryOnLook = {
  body: "balanced",
  height: 168,
  skin: "#c68642",
  hair: "bob",
  hairColor: "#2a211c",
  face: "soft",
  makeup: "bare",
  accessory: "none",
};

export const hairStyles: { id: HairStyle; label: string; src: string }[] = [
  { id: "bob", label: "Bob", src: "/models/figure-bob.glb" },
  { id: "cropped", label: "Cropped", src: "/models/figure-cropped.glb" },
  { id: "tied", label: "Tied", src: "/models/figure-tied.glb" },
  { id: "long", label: "Long", src: "/models/figure-long.glb" },
];

export const skinTones = [
  { id: "porcelain", label: "Porcelain", color: "#f3d6c6" },
  { id: "sand", label: "Sand", color: "#e0b08a" },
  { id: "honey", label: "Honey", color: "#c68642" },
  { id: "amber", label: "Amber", color: "#8d5524" },
  { id: "bronze", label: "Bronze", color: "#6b3e26" },
  { id: "deep", label: "Deep", color: "#3d2314" },
];

export const hairColors = [
  { id: "black", label: "Black", color: "#1a1614" },
  { id: "brown", label: "Brown", color: "#4a3428" },
  { id: "auburn", label: "Auburn", color: "#7a3b2e" },
  { id: "blonde", label: "Blonde", color: "#c6a15b" },
  { id: "silver", label: "Silver", color: "#c8c6c2" },
];

export const bodies: { id: BodyType; label: string }[] = [
  { id: "slim", label: "Slim" },
  { id: "balanced", label: "Balanced" },
  { id: "curvy", label: "Curvy" },
  { id: "athletic", label: "Athletic" },
];

export const faces: { id: FaceType; label: string }[] = [
  { id: "soft", label: "Soft" },
  { id: "narrow", label: "Narrow" },
  { id: "broad", label: "Broad" },
  { id: "long", label: "Long" },
];

export const makeups: { id: MakeupType; label: string }[] = [
  { id: "bare", label: "Bare" },
  { id: "blush", label: "Blush" },
  { id: "bronze", label: "Bronze" },
  { id: "berry", label: "Berry" },
];

export const accessories: { id: AccessoryType; label: string }[] = [
  { id: "none", label: "None" },
  { id: "hoops", label: "Hoops" },
  { id: "studs", label: "Studs" },
  { id: "necklace", label: "Necklace" },
  { id: "glasses", label: "Glasses" },
];

export const tryOnSteps = [
  { id: "body", label: "Body" },
  { id: "height", label: "Height" },
  { id: "skin", label: "Skin" },
  { id: "hair", label: "Hair" },
  { id: "face", label: "Face" },
  { id: "makeup", label: "Makeup" },
  { id: "extras", label: "Extras" },
] as const;
