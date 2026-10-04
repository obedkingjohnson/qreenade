"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { CategorySlug } from "@/lib/catalog";
import { hairStyles, type AccessoryType, type MakeupType, type TryOnLook } from "@/components/try-on-look";
import * as THREE from "three";

const clothes = new Set([
  "Shirt",
  "LightJacket",
  "Pants",
  "Shoes",
  "Socks",
  "Jacket",
  "Dress",
]);

const bodyScale = {
  slim: { hips: 0.86, torso: 0.9, abdomen: 0.88, legs: 0.94 },
  balanced: { hips: 1, torso: 1, abdomen: 1, legs: 1 },
  curvy: { hips: 1.18, torso: 1.05, abdomen: 1.12, legs: 1.06 },
  athletic: { hips: 0.96, torso: 1.12, abdomen: 1.02, legs: 1 },
};

const faceScale = {
  soft: [1, 1, 1],
  narrow: [0.9, 1.05, 0.94],
  broad: [1.12, 0.97, 1.05],
  long: [0.94, 1.12, 0.96],
} as const;

const makeupWash = {
  bare: "#000000",
  blush: "#c47d86",
  bronze: "#a86a3a",
  berry: "#7a3048",
};

const garmentFit: Record<
  CategorySlug,
  { x: number; y: number; z: number; w: number; h: number }
> = {
  dresses: { x: 0, y: -0.02, z: 0.09, w: 0.38, h: 0.62 },
  skirts: { x: 0, y: -0.18, z: 0.09, w: 0.36, h: 0.38 },
  tops: { x: 0, y: 0.08, z: 0.09, w: 0.34, h: 0.3 },
  sets: { x: 0, y: -0.02, z: 0.09, w: 0.38, h: 0.6 },
  bags: { x: 0.16, y: -0.02, z: 0.08, w: 0.2, h: 0.26 },
  hats: { x: 0, y: 0.42, z: 0.1, w: 0.28, h: 0.22 },
};

for (const style of hairStyles) {
  useGLTF.preload(style.src);
}

function useCutout(url: string) {
  const [cut, setCut] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (!alive) return;
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const saturation = max === 0 ? 0 : (max - min) / max;
        const light = (red + green + blue) / 3;
        if (saturation < 0.14 && light > 168) {
          pixels[index + 3] = 0;
          continue;
        }
        const pixel = index / 4;
        const x = pixel % canvas.width;
        const y = Math.floor(pixel / canvas.width);
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
      context.putImageData(frame, 0, 0);
      const width = Math.max(1, maxX - minX);
      const height = Math.max(1, maxY - minY);
      const cropped = document.createElement("canvas");
      cropped.width = width;
      cropped.height = height;
      cropped.getContext("2d")?.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
      const texture = new THREE.CanvasTexture(cropped);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      setCut(texture);
    };
    image.src = url;
    return () => {
      alive = false;
    };
  }, [url]);

  return cut;
}

function boneSpan(model: THREE.Object3D) {
  model.updateMatrixWorld(true);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  model.traverse((object) => {
    const bone = object as THREE.Bone;
    if (!bone.isBone) return;
    const elements = bone.matrixWorld.elements;
    minX = Math.min(minX, elements[12]);
    maxX = Math.max(maxX, elements[12]);
    minY = Math.min(minY, elements[13]);
    maxY = Math.max(maxY, elements[13]);
    minZ = Math.min(minZ, elements[14]);
    maxZ = Math.max(maxZ, elements[14]);
  });
  return { minX, maxX, minY, maxY, minZ, maxZ, height: Math.max(maxY - minY, 0.2) };
}

function paint(model: THREE.Object3D, skin: string, hairColor: string, makeup: MakeupType) {
  model.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of list) {
      const surface = material as THREE.MeshStandardMaterial;
      if (clothes.has(surface.name)) {
        surface.map = null;
        surface.color.set(surface.name === "Shoes" || surface.name === "Socks" ? "#2a2a2a" : skin);
        surface.transparent = false;
        surface.opacity = 1;
        surface.depthWrite = true;
        surface.roughness = 0.7;
        surface.metalness = 0;
      }
      if (surface.name === "Skin") {
        surface.map = null;
        surface.color.set(skin);
        surface.roughness = 0.58;
        surface.metalness = 0;
        surface.emissive.set(makeupWash[makeup]);
        surface.emissiveIntensity = makeup === "bare" ? 0 : 0.28;
      }
      if (surface.name === "Hair" || surface.name === "HairBase" || surface.name === "Eyebrows") {
        surface.map = null;
        surface.color.set(hairColor);
        surface.roughness = 0.42;
      }
      surface.needsUpdate = true;
    }
  });
}

function markExtra(object: THREE.Object3D) {
  object.userData.extra = true;
  object.traverse((child) => {
    child.userData.extra = true;
  });
}

function clearExtras(bone: THREE.Object3D) {
  for (const child of [...bone.children]) {
    if (child.userData.extra) bone.remove(child);
  }
}

function addAccessory(head: THREE.Object3D, neck: THREE.Object3D | undefined, accessory: AccessoryType, unit: number) {
  clearExtras(head);
  if (neck) clearExtras(neck);
  const metal = new THREE.MeshStandardMaterial({ color: "#d9d4cc", metalness: 0.86, roughness: 0.22 });
  const dark = new THREE.MeshStandardMaterial({ color: "#161616", metalness: 0.15, roughness: 0.35 });
  if (accessory === "hoops" || accessory === "studs") {
    const geometry =
      accessory === "hoops"
        ? new THREE.TorusGeometry(unit * 0.016, unit * 0.0025, 8, 18)
        : new THREE.SphereGeometry(unit * 0.007, 12, 12);
    for (const side of [-1, 1]) {
      const mesh = new THREE.Mesh(geometry, metal);
      mesh.position.set(side * unit * 0.042, unit * 0.012, unit * 0.028);
      markExtra(mesh);
      head.add(mesh);
    }
  }
  if (accessory === "glasses") {
    const group = new THREE.Group();
    const ring = new THREE.TorusGeometry(unit * 0.018, unit * 0.0018, 8, 18);
    for (const side of [-1, 1]) {
      const mesh = new THREE.Mesh(ring, dark);
      mesh.position.set(side * unit * 0.022, unit * 0.028, unit * 0.045);
      group.add(mesh);
    }
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(unit * 0.018, unit * 0.002, unit * 0.002), dark);
    bridge.position.set(0, unit * 0.028, unit * 0.045);
    group.add(bridge);
    markExtra(group);
    head.add(group);
  }
  if (accessory === "necklace" && neck) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(unit * 0.055, unit * 0.0035, 8, 24), metal);
    mesh.rotation.x = Math.PI / 2.3;
    mesh.position.set(0, -unit * 0.03, unit * 0.02);
    markExtra(mesh);
    neck.add(mesh);
  }
}

function Person({
  look,
  texture,
  category,
}: {
  look: TryOnLook;
  texture: THREE.Texture;
  category: CategorySlug;
}) {
  const source = hairStyles.find((style) => style.id === look.hair)?.src ?? hairStyles[0].src;
  const gltf = useGLTF(source);
  const model = useMemo(() => {
    const next = clone(gltf.scene);
    next.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((material) => material.clone())
        : mesh.material.clone();
      mesh.castShadow = true;
    });
    return next;
  }, [gltf.scene]);
  const unit = useRef(1.6);
  const garment = useRef<THREE.Mesh | null>(null);
  const framed = useRef(false);
  const { skin, hairColor, makeup, accessory, body, face } = look;
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls);

  useLayoutEffect(() => {
    paint(model, skin, hairColor, makeup);
  }, [model, skin, hairColor, makeup]);

  useLayoutEffect(() => {
    model.position.set(0, 0, 0);
    const before = boneSpan(model);
    model.position.set(-(before.minX + before.maxX) / 2, -before.minY, -(before.minZ + before.maxZ) / 2);
    unit.current = boneSpan(model).height;
    framed.current = false;
    const head = model.getObjectByName("Head");
    const neck = model.getObjectByName("Neck");
    if (head) addAccessory(head, neck, accessory, unit.current);
  }, [model, accessory, texture, category]);

  useFrame(() => {
    if (!framed.current && controls) {
      framed.current = true;
      const span = boneSpan(model);
      const top = span.maxY + span.height * 0.22;
      const mid = (span.minY + top) / 2;
      camera.position.set(0, mid, (top - span.minY) * 3.4);
      const orbit = controls as { target?: THREE.Vector3; update?: () => void } | null;
      if (orbit?.target) {
        orbit.target.set(0, mid, 0);
        orbit.update?.();
      }
    }
    const shape = bodyScale[body];
    const headShape = faceScale[face];
    model.traverse((object) => {
      const bone = object as THREE.Bone;
      if (!bone.isBone) return;
      if (bone.name === "Hips") bone.scale.set(shape.hips, 1, shape.hips);
      if (bone.name === "Abdomen") bone.scale.set(shape.abdomen, 1, shape.abdomen);
      if (bone.name === "Torso") bone.scale.set(shape.torso, 1, shape.torso);
      if (bone.name.startsWith("UpperLeg")) bone.scale.set(shape.legs, 1, shape.legs);
      if (bone.name === "Head") bone.scale.set(headShape[0], headShape[1], headShape[2]);
    });
    const torso = model.getObjectByName("Torso");
    const piece = garment.current;
    if (!torso || !piece) return;
    const fit = garmentFit[category];
    torso.getWorldPosition(_point);
    _direction.copy(camera.position).sub(_point).normalize();
    piece.position.copy(_point).addScaledVector(_direction, unit.current * Math.abs(fit.z));
    piece.position.y += fit.y * unit.current;
    piece.position.x += fit.x * unit.current;
    piece.scale.set(fit.w * unit.current, fit.h * unit.current, 1);
    piece.lookAt(camera.position);
  });

  return (
    <>
      <group scale={look.height / 168}>
        <primitive object={model} />
      </group>
      <mesh ref={garment} renderOrder={2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

const _point = new THREE.Vector3();
const _direction = new THREE.Vector3();

function Stage({
  image,
  category,
  look,
}: {
  image: string;
  category: CategorySlug;
  look: TryOnLook;
}) {
  const texture = useCutout(image);
  if (!texture) return null;

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.5} />
      <Person look={look} texture={texture} category={category} />
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={4} blur={2.2} far={2} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1.2}
        maxDistance={6}
        minPolarAngle={0.7}
        maxPolarAngle={1.6}
        enableDamping
      />
    </>
  );
}

export default function TryOnScene({
  image,
  category,
  look,
}: {
  image: string;
  category: CategorySlug;
  look: TryOnLook;
}) {
  return (
    <Canvas camera={{ position: [0, 1.05, 2.6], fov: 32 }} dpr={[1, 1.5]} style={{ cursor: "grab" }}>
      <color attach="background" args={["#141414"]} />
      <Suspense fallback={null}>
        <Stage image={image} category={category} look={look} />
      </Suspense>
    </Canvas>
  );
}
