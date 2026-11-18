import * as THREE from 'three';

/**
 * Creates high-fidelity procedural PBR leather texture suite (optimized):
 * - normalMap: realistic micro-pebble grain + directional crease lines
 * - roughnessMap: subtle variation (smoother centers, rougher edges/grain valleys)
 * - colorMap: subtle color variation for organic look
 */
export function createLeatherTextures(baseHexColor = 0x955127) {
  const size = 512;

  // ---- Noise helpers ----
  const perm = new Uint8Array(512);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t) { return a + t * (b - a); }

  function valueNoise(x, y) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[xi] + yi] / 255;
    const ab = perm[perm[xi] + yi + 1] / 255;
    const ba = perm[perm[xi + 1] + yi] / 255;
    const bb = perm[perm[xi + 1] + yi + 1] / 255;
    return lerp(lerp(aa, ba, u), lerp(ab, bb, u), v);
  }

  // Fractal Brownian Motion
  function fbm(x, y, octaves, lacunarity, gain) {
    let val = 0, amp = 1, freq = 1, maxAmp = 0;
    for (let i = 0; i < octaves; i++) {
      val += valueNoise(x * freq, y * freq) * amp;
      maxAmp += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    return val / maxAmp;
  }

  // Grid-based Voronoi for performance (only checks 9 neighboring cells)
  const cellGridSize = 10;
  // Pre-generate jittered cell centers
  const cellJitter = new Float32Array(cellGridSize * cellGridSize * 2);
  for (let cy = 0; cy < cellGridSize; cy++) {
    for (let cx = 0; cx < cellGridSize; cx++) {
      const idx = (cy * cellGridSize + cx) * 2;
      cellJitter[idx] = 0.15 + Math.random() * 0.7;     // jitter x
      cellJitter[idx + 1] = 0.15 + Math.random() * 0.7; // jitter y
    }
  }

  function voronoi(px, py) {
    // Scale to grid
    const gx = px * cellGridSize;
    const gy = py * cellGridSize;
    const cellX = Math.floor(gx);
    const cellY = Math.floor(gy);

    let minDist1 = 1e6;
    let minDist2 = 1e6;

    // Only check 3x3 neighborhood
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const ncx = cellX + ox;
        const ncy = cellY + oy;
        // Wrap for tiling
        const wcx = ((ncx % cellGridSize) + cellGridSize) % cellGridSize;
        const wcy = ((ncy % cellGridSize) + cellGridSize) % cellGridSize;
        const jIdx = (wcy * cellGridSize + wcx) * 2;
        const cpx = ncx + cellJitter[jIdx];
        const cpy = ncy + cellJitter[jIdx + 1];
        const dx = gx - cpx;
        const dy = gy - cpy;
        const dist = dx * dx + dy * dy; // squared distance is fine for comparison
        if (dist < minDist1) {
          minDist2 = minDist1;
          minDist1 = dist;
        } else if (dist < minDist2) {
          minDist2 = dist;
        }
      }
    }

    minDist1 = Math.sqrt(minDist1);
    minDist2 = Math.sqrt(minDist2);
    return minDist2 - minDist1; // edge distance
  }

  // ---- Generate textures ----
  const heightMap = new Float32Array(size * size);

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext('2d');
  const normalImg = normalCtx.createImageData(size, size);

  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = size;
  roughnessCanvas.height = size;
  const roughCtx = roughnessCanvas.getContext('2d');
  const roughImg = roughCtx.createImageData(size, size);

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d');
  const colorImg = colorCtx.createImageData(size, size);

  // Extract base color RGB
  const baseColor = new THREE.Color(baseHexColor);
  const baseR = Math.floor(baseColor.r * 255);
  const baseG = Math.floor(baseColor.g * 255);
  const baseB = Math.floor(baseColor.b * 255);

  const invSize = 1 / size;

  for (let y = 0; y < size; y++) {
    const py = y * invSize;
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const px = x * invSize;

      // 1. Voronoi pebble grain
      const edge = voronoi(px * 3, py * 3);
      const pebbleHeight = Math.pow(Math.min(edge, 1), 0.6) * 0.7;

      // 2. Large-scale surface undulation
      const largeWave = fbm(px * 4, py * 4, 2, 2.1, 0.5) * 0.12;

      // 3. Fine micro-grain noise
      const fineNoise = (valueNoise(px * 45, py * 45) - 0.5) * 0.06;

      // 4. Subtle directional crease lines
      const crease = Math.sin(py * 120 + valueNoise(px * 6, py * 2) * 8) * 0.025;

      // Combined height
      const height = pebbleHeight + largeWave + fineNoise + crease;
      heightMap[idx] = height;

      // ---- Roughness map ----
      const isEdge = edge < 0.08;
      const baseRoughness = 0.52 + (isEdge ? 0.12 : 0) + fineNoise * 1.5;
      const roughVal = Math.min(255, Math.max(0, baseRoughness * 255));

      const rIdx = idx * 4;
      roughImg.data[rIdx] = roughVal;
      roughImg.data[rIdx + 1] = roughVal;
      roughImg.data[rIdx + 2] = roughVal;
      roughImg.data[rIdx + 3] = 255;

      // ---- Color variation map ----
      const colorVar = fbm(px * 6, py * 6, 2, 2.2, 0.45);
      const darken = 0.90 + colorVar * 0.20;
      const warm = (valueNoise(px * 10 + 5, py * 10 + 5) - 0.5) * 0.06;

      const cr = Math.min(255, Math.max(0, (baseR * darken + warm * 30) | 0));
      const cg = Math.min(255, Math.max(0, (baseG * darken - warm * 10) | 0));
      const cb = Math.min(255, Math.max(0, (baseB * darken - warm * 15) | 0));

      const cIdx = idx * 4;
      colorImg.data[cIdx] = cr;
      colorImg.data[cIdx + 1] = cg;
      colorImg.data[cIdx + 2] = cb;
      colorImg.data[cIdx + 3] = 255;
    }
  }

  // ---- Derive normal map from height map (Sobel) ----
  const normalStrength = 2.5;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const xm = ((x - 1) + size) % size;
      const xp = (x + 1) % size;
      const ym = ((y - 1) + size) % size;
      const yp = (y + 1) % size;

      const dX = (heightMap[y * size + xp] - heightMap[y * size + xm]) * normalStrength;
      const dY = (heightMap[yp * size + x] - heightMap[ym * size + x]) * normalStrength;

      let nx = -dX, ny = -dY, nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len; ny /= len; nz /= len;

      const nIdx = idx * 4;
      normalImg.data[nIdx] = ((nx * 0.5 + 0.5) * 255) | 0;
      normalImg.data[nIdx + 1] = ((ny * 0.5 + 0.5) * 255) | 0;
      normalImg.data[nIdx + 2] = ((nz * 0.5 + 0.5) * 255) | 0;
      normalImg.data[nIdx + 3] = 255;
    }
  }

  normalCtx.putImageData(normalImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  colorCtx.putImageData(colorImg, 0, 0);

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(3, 3);

  const roughnessMap = new THREE.CanvasTexture(roughnessCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(3, 3);

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(3, 3);

  return { normalMap, roughnessMap, colorMap };
}

/**
 * Creates studio floor shadow texture with soft contact occlusion
 */
export function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 512, 512);
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 220);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.3, 'rgba(10, 5, 2, 0.45)');
  grad.addColorStop(0.7, 'rgba(18, 13, 10, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(256, 256, 220, 130, 0, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}
