import { TRYON_MAX_ASPECT, TRYON_MAX_PHOTO_BYTES, TRYON_MIN_ASPECT, TRYON_MIN_EDGE_PX } from "@/lib/tryon-config";

export type ImageSize = {
  width: number;
  height: number;
};

const DATA_URI =
  /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

export function validateModelImage(dataUri: string): string {
  if (dataUri.length > TRYON_MAX_PHOTO_BYTES * 2) {
    throw new Error("That photo is too large.");
  }

  const match = DATA_URI.exec(dataUri);
  if (!match || match[2].length % 4 !== 0) {
    throw new Error("Upload a JPEG, PNG, or WebP photo.");
  }

  const bytes = Buffer.from(match[2], "base64");
  if (bytes.byteLength < 32) {
    throw new Error("That photo could not be read.");
  }
  if (bytes.byteLength > TRYON_MAX_PHOTO_BYTES) {
    throw new Error("That photo is too large.");
  }

  const size = readImageSize(bytes, match[1] === "jpg" ? "jpeg" : match[1]);
  if (!size) {
    throw new Error("That photo could not be read.");
  }
  if (size.width < TRYON_MIN_EDGE_PX || size.height < TRYON_MIN_EDGE_PX) {
    throw new Error("That photo is too small.");
  }

  const ratio = size.width / size.height;
  if (ratio < TRYON_MIN_ASPECT || ratio > TRYON_MAX_ASPECT) {
    throw new Error("That photo is too wide or too tall.");
  }

  return dataUri;
}

export function readImageSize(bytes: Buffer, kind: string): ImageSize | null {
  if (kind === "png") return readPngSize(bytes);
  if (kind === "jpeg") return readJpegSize(bytes);
  if (kind === "webp") return readWebpSize(bytes);
  return null;
}

function readPngSize(bytes: Buffer): ImageSize | null {
  if (bytes.length < 24) return null;
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!bytes.subarray(0, 8).equals(png)) return null;
  if (bytes.subarray(12, 16).toString("ascii") !== "IHDR") return null;
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < 1 || height < 1) return null;
  return { width, height };
}

function readJpegSize(bytes: Buffer): ImageSize | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;

  while (offset + 3 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }

    const standalone =
      marker === 0x01 || marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7);
    if (standalone) {
      offset += 2;
      continue;
    }

    if (offset + 4 > bytes.length) return null;
    const segmentLength = bytes.readUInt16BE(offset + 2);
    if (segmentLength < 2 || offset + 2 + segmentLength > bytes.length) return null;

    const startOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (startOfFrame) {
      if (segmentLength < 7) return null;
      const height = bytes.readUInt16BE(offset + 5);
      const width = bytes.readUInt16BE(offset + 7);
      if (width < 1 || height < 1) return null;
      return { width, height };
    }

    offset += 2 + segmentLength;
  }

  return null;
}

function readWebpSize(bytes: Buffer): ImageSize | null {
  if (bytes.length < 30) return null;
  if (bytes.subarray(0, 4).toString("ascii") !== "RIFF") return null;
  if (bytes.subarray(8, 12).toString("ascii") !== "WEBP") return null;

  const chunk = bytes.subarray(12, 16).toString("ascii");
  if (chunk === "VP8X") {
    const width = 1 + bytes.readUIntLE(24, 3);
    const height = 1 + bytes.readUIntLE(27, 3);
    if (width < 1 || height < 1) return null;
    return { width, height };
  }

  if (chunk === "VP8 ") {
    const start = 20;
    if (bytes.length < start + 10) return null;
    if (bytes[start + 3] !== 0x9d || bytes[start + 4] !== 0x01 || bytes[start + 5] !== 0x2a) {
      return null;
    }
    const width = bytes.readUInt16LE(start + 6) & 0x3fff;
    const height = bytes.readUInt16LE(start + 8) & 0x3fff;
    if (width < 1 || height < 1) return null;
    return { width, height };
  }

  if (chunk === "VP8L") {
    const start = 20;
    if (bytes.length < start + 5 || bytes[start] !== 0x2f) return null;
    const bits = bytes.readUInt32LE(start + 1);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  }

  return null;
}
