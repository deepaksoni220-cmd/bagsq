import * as THREE from 'three';
import { createLeatherTextures, createShadowTexture } from './textureGenerator.js';

/**
 * Builds a 3D luxury satchel bag matching the exact reference photo:
 * - Trapezoidal structured body with rounded bottom corners
 * - Signature chamfered angular flap with perimeter edge piping & stitching
 * - Prominent center shield-shaped leather anchor badge
 * - Working roller buckle with prong & tapered belt tongue
 * - Front exterior document slip pocket with clean seamlines
 * - Arched tubular carry handle with riveted leather tab mounts
 * - Side leather tabs with solid brass D-rings, swivel clasps, and shoulder strap
 * - Full PBR warm cognac leather materials
 */
export function buildLuxuryBag(initialColorHex = 0x955127) {
  const bagGroup = new THREE.Group();
  bagGroup.name = "AureviaLuxurySatchel";

  const { normalMap, roughnessMap, colorMap } = createLeatherTextures(initialColorHex);

  // ==========================================
  // REALISTIC PBR LEATHER MATERIAL
  // ==========================================
  const leatherMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    color: 0xffffff,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughnessMap: roughnessMap,
    roughness: 0.52,
    metalness: 0.0,
    sheen: 0.4,
    sheenColor: new THREE.Color(0xd49b6a),
    sheenRoughness: 0.55,
    clearcoat: 0.14,
    clearcoatRoughness: 0.4,
    specularIntensity: 0.35,
    specularColor: new THREE.Color(0xdca868),
  });

  // Solid cast brass hardware (roller buckle, D-rings, rivets, clasps)
  const goldBrassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdfb758,
    roughness: 0.22,
    metalness: 0.94,
    clearcoat: 0.35,
    clearcoatRoughness: 0.18,
    specularColor: new THREE.Color(0xfff0c8),
  });

  // Edge burnishing / piping material
  const edgePaintMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6e3814,
    roughness: 0.38,
    metalness: 0.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
  });

  // Thread stitching material (light cream-tan thread)
  const stitchMaterial = new THREE.MeshStandardMaterial({
    color: 0xecd9b8,
    roughness: 0.7,
    metalness: 0.0,
  });

  // Microfiber velvet suede lining inside
  const velvetLiningMaterial = new THREE.MeshStandardMaterial({
    color: 0x241812,
    roughness: 0.9,
    metalness: 0.0,
  });

  // ==========================================
  // 1. MAIN SATCHEL BODY (Slightly tapered silhouette)
  // ==========================================
  const bodyTopW = 3.5;
  const bodyBottomW = 3.75;
  const bodyH = 2.45;
  const bodyD = 1.35;

  const bodyShape = new THREE.Shape();
  const rad = 0.22;
  // Bottom-left rounded corner
  bodyShape.moveTo(-bodyBottomW / 2 + rad, -bodyH / 2);
  bodyShape.lineTo(bodyBottomW / 2 - rad, -bodyH / 2);
  bodyShape.quadraticCurveTo(bodyBottomW / 2, -bodyH / 2, bodyBottomW / 2, -bodyH / 2 + rad);
  // Right side tapering upward
  bodyShape.lineTo(bodyTopW / 2, bodyH / 2 - rad);
  bodyShape.quadraticCurveTo(bodyTopW / 2, bodyH / 2, bodyTopW / 2 - rad, bodyH / 2);
  // Top straight edge
  bodyShape.lineTo(-bodyTopW / 2 + rad, bodyH / 2);
  bodyShape.quadraticCurveTo(-bodyTopW / 2, bodyH / 2, -bodyTopW / 2, bodyH / 2 - rad);
  // Left side tapering downward
  bodyShape.lineTo(-bodyBottomW / 2, -bodyH / 2 + rad);
  bodyShape.quadraticCurveTo(-bodyBottomW / 2, -bodyH / 2, -bodyBottomW / 2 + rad, -bodyH / 2);

  const bodyExtrudeSettings = {
    depth: bodyD,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  };
  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
  bodyGeo.center();
  const bodyMesh = new THREE.Mesh(bodyGeo, leatherMaterial);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bagGroup.add(bodyMesh);

  // Interior cavity (revealed when flap opens)
  const interiorGeo = new THREE.BoxGeometry(bodyTopW * 0.88, bodyH * 0.75, bodyD * 0.75);
  const interiorMesh = new THREE.Mesh(interiorGeo, velvetLiningMaterial);
  interiorMesh.position.set(0, 0.15, 0);
  bagGroup.add(interiorMesh);

  // ==========================================
  // 2. FRONT SLIP POCKET (As shown in reference)
  // ==========================================
  const pocketW = 2.85;
  const pocketH = 1.45;
  const pocketD = 0.12;
  const pocketRad = 0.12;

  const pocketShape = new THREE.Shape();
  pocketShape.moveTo(-pocketW / 2 + pocketRad, -pocketH / 2);
  pocketShape.lineTo(pocketW / 2 - pocketRad, -pocketH / 2);
  pocketShape.quadraticCurveTo(pocketW / 2, -pocketH / 2, pocketW / 2, -pocketH / 2 + pocketRad);
  pocketShape.lineTo(pocketW / 2, pocketH / 2);
  pocketShape.lineTo(-pocketW / 2, pocketH / 2);
  pocketShape.lineTo(-pocketW / 2, -pocketH / 2 + pocketRad);
  pocketShape.quadraticCurveTo(-pocketW / 2, -pocketH / 2, -pocketW / 2 + pocketRad, -pocketH / 2);

  const pocketGeo = new THREE.ExtrudeGeometry(pocketShape, {
    depth: pocketD,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  pocketGeo.center();
  const pocketMesh = new THREE.Mesh(pocketGeo, leatherMaterial);
  pocketMesh.position.set(0, -0.32, bodyD / 2 + 0.06);
  pocketMesh.castShadow = true;
  bagGroup.add(pocketMesh);

  // Pocket edge perimeter stitching line (contrasting thread)
  addContourStitching(pocketMesh, pocketW * 0.94, pocketH * 0.92, 0.07, stitchMaterial);

  // ==========================================
  // 3. ARTICULATED TOP FLAP (With reference angular chamfered corners)
  // ==========================================
  const flapHinge = new THREE.Group();
  flapHinge.name = "FlapHinge";
  flapHinge.position.set(0, bodyH / 2 - 0.02, -bodyD * 0.05);

  const flapW = bodyTopW * 1.02;
  const flapH = 1.85;

  // Top cover curve
  const topCoverGeo = new THREE.BoxGeometry(flapW, 0.06, bodyD * 0.88);
  const topCoverMesh = new THREE.Mesh(topCoverGeo, leatherMaterial);
  topCoverMesh.position.set(0, 0.03, bodyD * 0.36);
  topCoverMesh.castShadow = true;
  flapHinge.add(topCoverMesh);

  // Front hanging flap panel with ANGULAR CUT CORNERS (exactly like photo)
  const frontFlapGroup = new THREE.Group();
  frontFlapGroup.position.set(0, 0.03, bodyD * 0.74);

  const flapShape = new THREE.Shape();
  const chamfer = 0.38; // 45-degree angled corner cutouts
  flapShape.moveTo(-flapW / 2, 0);
  flapShape.lineTo(flapW / 2, 0);
  flapShape.lineTo(flapW / 2, -flapH * 0.65);
  // Bottom-right chamfer cut
  flapShape.lineTo(flapW / 2 - chamfer, -flapH);
  // Bottom edge
  flapShape.lineTo(-flapW / 2 + chamfer, -flapH);
  // Bottom-left chamfer cut
  flapShape.lineTo(-flapW / 2, -flapH * 0.65);
  flapShape.closePath();

  const flapGeo = new THREE.ExtrudeGeometry(flapShape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  const flapMesh = new THREE.Mesh(flapGeo, leatherMaterial);
  flapMesh.position.set(0, 0, 0);
  flapMesh.castShadow = true;
  frontFlapGroup.add(flapMesh);

  // Flap edge contour stitching line (matches reference border)
  const flapStitchShape = flapShape.clone();
  const flapStitchGeo = new THREE.BufferGeometry().setFromPoints(flapStitchShape.getPoints(30));
  const flapStitchLine = new THREE.Line(
    flapStitchGeo,
    new THREE.LineBasicMaterial({ color: 0xecd9b8, linewidth: 2 })
  );
  flapStitchLine.position.set(0, 0, 0.08);
  frontFlapGroup.add(flapStitchLine);

  // ==========================================
  // 4. CENTER SHIELD BADGE & WORKING BUCKLE (From reference)
  // ==========================================
  // Shield-shaped leather anchor badge mounted on the flap center
  const shieldShape = new THREE.Shape();
  const sw = 0.32;
  const sh = 0.42;
  shieldShape.moveTo(-sw, sh * 0.4);
  shieldShape.lineTo(-sw, sh);
  shieldShape.lineTo(sw, sh);
  shieldShape.lineTo(sw, sh * 0.4);
  shieldShape.lineTo(0, -sh * 0.6); // pointed shield bottom
  shieldShape.closePath();

  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  const shieldMesh = new THREE.Mesh(shieldGeo, leatherMaterial);
  shieldMesh.position.set(0, -flapH * 0.72, 0.08);
  frontFlapGroup.add(shieldMesh);

  // Center vertical belt strap passing through buckle
  const strapGeo = new THREE.BoxGeometry(0.24, 0.95, 0.04);
  const strapMesh = new THREE.Mesh(strapGeo, leatherMaterial);
  strapMesh.position.set(0, -flapH * 0.88, 0.1);
  frontFlapGroup.add(strapMesh);

  // Solid brass roller buckle (gold rectangular frame with rounded corners)
  const buckleOuterW = 0.44;
  const buckleOuterH = 0.52;
  const buckleFrameShape = new THREE.Shape();
  buckleFrameShape.moveTo(-buckleOuterW / 2, -buckleOuterH / 2);
  buckleFrameShape.lineTo(buckleOuterW / 2, -buckleOuterH / 2);
  buckleFrameShape.lineTo(buckleOuterW / 2, buckleOuterH / 2);
  buckleFrameShape.lineTo(-buckleOuterW / 2, buckleOuterH / 2);
  buckleFrameShape.closePath();

  const buckleHole = new THREE.Path();
  const bhw = buckleOuterW * 0.62 / 2;
  const bhh = buckleOuterH * 0.62 / 2;
  buckleHole.moveTo(-bhw, -bhh);
  buckleHole.lineTo(bhw, -bhh);
  buckleHole.lineTo(bhw, bhh);
  buckleHole.lineTo(-bhw, bhh);
  buckleHole.closePath();
  buckleFrameShape.holes.push(buckleHole);

  const buckleGeo = new THREE.ExtrudeGeometry(buckleFrameShape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.018,
  });
  buckleGeo.center();
  const buckleMesh = new THREE.Mesh(buckleGeo, goldBrassMaterial);
  buckleMesh.position.set(0, -flapH * 0.85, 0.13);
  frontFlapGroup.add(buckleMesh);

  // Buckle center prong pin
  const prongGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.42, 10);
  const prongMesh = new THREE.Mesh(prongGeo, goldBrassMaterial);
  prongMesh.position.set(0, -flapH * 0.85, 0.145);
  prongMesh.rotation.z = Math.PI / 16;
  frontFlapGroup.add(prongMesh);

  // Strap keeper leather loop right below buckle
  const keeperGeo = new THREE.BoxGeometry(0.32, 0.07, 0.06);
  const keeperMesh = new THREE.Mesh(keeperGeo, leatherMaterial);
  keeperMesh.position.set(0, -flapH * 1.15, 0.1);
  frontFlapGroup.add(keeperMesh);

  flapHinge.add(frontFlapGroup);
  bagGroup.add(flapHinge);

  // ==========================================
  // 5. ARCHED TOP CARRY HANDLE (Exactly matching reference)
  // ==========================================
  const handleGroup = new THREE.Group();
  handleGroup.position.set(0, 0.03, bodyD * 0.36);

  // Smooth architectural arch curve
  const handleCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-0.95, 0, 0),
    new THREE.Vector3(-0.7, 0.72, 0),
    new THREE.Vector3(0.7, 0.72, 0),
    new THREE.Vector3(0.95, 0, 0)
  );
  const handleGeo = new THREE.TubeGeometry(handleCurve, 36, 0.09, 14, false);
  const handleMesh = new THREE.Mesh(handleGeo, leatherMaterial);
  handleMesh.castShadow = true;
  handleGroup.add(handleMesh);

  // Handle anchor mounts on flap
  for (const xPos of [-0.95, 0.95]) {
    // Leather anchor tabs
    const tabGeo = new THREE.BoxGeometry(0.22, 0.12, 0.18);
    const tabMesh = new THREE.Mesh(tabGeo, leatherMaterial);
    tabMesh.position.set(xPos, 0, 0);
    handleGroup.add(tabMesh);

    // Brass anchor rivets
    const rivetGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const rivetMesh = new THREE.Mesh(rivetGeo, goldBrassMaterial);
    rivetMesh.position.set(xPos, 0, 0.09);
    handleGroup.add(rivetMesh);
  }

  flapHinge.add(handleGroup);

  // ==========================================
  // 6. SIDE STRAP MOUNTS & LEATHER SHOULDER STRAP
  // ==========================================
  for (const side of [-1, 1]) {
    const sideMount = new THREE.Group();
    sideMount.position.set(side * (bodyTopW / 2 + 0.03), bodyH * 0.15, 0);

    // Leather anchor tab with rounded end
    const sideTabGeo = new THREE.BoxGeometry(0.06, 0.45, 0.26);
    const sideTabMesh = new THREE.Mesh(sideTabGeo, leatherMaterial);
    sideMount.add(sideTabMesh);

    // Solid brass rivet
    const rivetGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16);
    rivetGeo.rotateZ(Math.PI / 2);
    const rivetMesh = new THREE.Mesh(rivetGeo, goldBrassMaterial);
    rivetMesh.position.set(side * 0.03, -0.1, 0);
    sideMount.add(rivetMesh);

    // Solid brass D-ring
    const dRingGeo = new THREE.TorusGeometry(0.13, 0.032, 12, 24);
    const dRingMesh = new THREE.Mesh(dRingGeo, goldBrassMaterial);
    dRingMesh.position.set(side * 0.04, 0.14, 0);
    sideMount.add(dRingMesh);

    // Swivel trigger clasp attached to D-ring
    const claspGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.18, 12);
    const claspMesh = new THREE.Mesh(claspGeo, goldBrassMaterial);
    claspMesh.position.set(side * 0.05, 0.05, 0);
    sideMount.add(claspMesh);

    bagGroup.add(sideMount);
  }

  // Realistic natural shoulder strap looping behind
  const strapCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-bodyTopW / 2 - 0.06, bodyH * 0.15, 0),
    new THREE.Vector3(-bodyTopW * 0.5, -0.5, -bodyD * 0.85),
    new THREE.Vector3(bodyTopW * 0.5, -0.5, -bodyD * 0.85),
    new THREE.Vector3(bodyTopW / 2 + 0.06, bodyH * 0.15, 0)
  );
  const strapTubeGeo = new THREE.TubeGeometry(strapCurve, 36, 0.065, 8, false);
  const strapTubeMesh = new THREE.Mesh(strapTubeGeo, leatherMaterial);
  strapTubeMesh.castShadow = true;
  bagGroup.add(strapTubeMesh);

  // ==========================================
  // 7. BOTTOM BRASS PROTECTIVE FEET
  // ==========================================
  const footPositions = [
    [-bodyBottomW * 0.38, -bodyH / 2 - 0.04, -bodyD * 0.3],
    [bodyBottomW * 0.38, -bodyH / 2 - 0.04, -bodyD * 0.3],
    [-bodyBottomW * 0.38, -bodyH / 2 - 0.04, bodyD * 0.3],
    [bodyBottomW * 0.38, -bodyH / 2 - 0.04, bodyD * 0.3],
  ];

  for (const pos of footPositions) {
    const footGeo = new THREE.ConeGeometry(0.08, 0.08, 16);
    footGeo.rotateX(Math.PI);
    const footMesh = new THREE.Mesh(footGeo, goldBrassMaterial);
    footMesh.position.set(...pos);
    bagGroup.add(footMesh);
  }

  // ==========================================
  // 8. STUDIO FLOOR CONTACT SHADOW
  // ==========================================
  const shadowGeo = new THREE.PlaneGeometry(5.4, 3.4);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createShadowTexture(),
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, -bodyH / 2 - 0.06, 0);
  bagGroup.add(shadowMesh);

  // ==========================================
  // 9. ANIMATION CONTROLS
  // ==========================================
  let flapProgress = 0;
  const setFlapOpenProgress = (progress) => {
    flapProgress = Math.max(0, Math.min(1, progress));
    flapHinge.rotation.x = -flapProgress * 1.85;
  };

  const setColor = (hexValue) => {
    const newTextures = createLeatherTextures(hexValue);
    leatherMaterial.map = newTextures.colorMap;
    leatherMaterial.normalMap = newTextures.normalMap;
    leatherMaterial.roughnessMap = newTextures.roughnessMap;
    leatherMaterial.needsUpdate = true;
  };

  return {
    group: bagGroup,
    setColor,
    setFlapOpenProgress,
    getFlapProgress: () => flapProgress,
    flapHinge,
    materials: { leatherMaterial, goldBrassMaterial }
  };
}

// Helper: adds decorative stitch line contour
function addContourStitching(mesh, width, height, zOffset, material) {
  const stitchLineGeo = new THREE.PlaneGeometry(width, height);
  const edges = new THREE.EdgesGeometry(stitchLineGeo);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xecd9b8, linewidth: 1.5 })
  );
  line.position.set(0, 0, zOffset);
  mesh.add(line);
}
