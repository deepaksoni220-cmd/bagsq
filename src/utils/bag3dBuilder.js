import * as THREE from 'three';
import { createLeatherTextures, createShadowTexture } from './textureGenerator.js';

/**
 * Builds a 3D luxury leather bag with realistic PBR synthetic leather materials
 * with articulated kinematic rigging (hinge flap opening & interior reveal)
 */
export function buildLuxuryBag(initialColorHex = 0x955127) {
  const bagGroup = new THREE.Group();
  bagGroup.name = "LuxuryBag";

  const { normalMap, roughnessMap, colorMap } = createLeatherTextures(initialColorHex);

  // ==========================================
  // REALISTIC PBR LEATHER MATERIAL (MeshPhysicalMaterial)
  // ==========================================
  const leatherMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    color: 0xffffff,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.65, 0.65),
    roughnessMap: roughnessMap,
    roughness: 0.58,
    metalness: 0.0,
    sheen: 0.35,
    sheenColor: new THREE.Color(0xc89060),
    sheenRoughness: 0.6,
    clearcoat: 0.12,
    clearcoatRoughness: 0.45,
    specularIntensity: 0.3,
    specularColor: new THREE.Color(0xd4a060),
  });

  // Interior leather (reuses same maps with different color tint)
  const interiorLeatherMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x7a3d1a,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.3, 0.3),
    roughness: 0.72,
    metalness: 0.0,
    sheen: 0.15,
    sheenColor: new THREE.Color(0x8a5530),
    sheenRoughness: 0.75,
  });

  // Solid cast brass hardware with realistic PBR
  const goldBrassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd4a84a,
    roughness: 0.2,
    metalness: 0.95,
    clearcoat: 0.3,
    clearcoatRoughness: 0.15,
    specularColor: new THREE.Color(0xffe8b0),
  });

  // Interior microfiber suede velvet lining
  const velvetLiningMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x221711,
    roughness: 0.92,
    metalness: 0.0,
    sheen: 0.6,
    sheenColor: new THREE.Color(0x4a3528),
    sheenRoughness: 0.4,
  });

  // Edge paint / piping material (slightly glossier than main leather)
  const edgePaintMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6b3a18,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
  });

  // ==========================================
  // 1. MAIN BAG BODY & INTERIOR CAVITY
  // ==========================================
  const bodyWidth = 3.6;
  const bodyHeight = 2.4;
  const bodyDepth = 1.35;
  const bodyRadius = 0.2;

  const bodyGeo = createRoundedBoxGeometry(bodyWidth, bodyHeight, bodyDepth, bodyRadius, 5);
  const bodyMesh = new THREE.Mesh(bodyGeo, leatherMaterial);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bagGroup.add(bodyMesh);

  // Edge piping along body seams (thin torus segments)
  addEdgePiping(bagGroup, bodyWidth, bodyHeight, bodyDepth, edgePaintMaterial);

  // Interior compartment cavity (revealed when flap opens)
  const interiorGroup = new THREE.Group();
  interiorGroup.position.set(0, bodyHeight * 0.35, 0);

  const liningGeo = new THREE.BoxGeometry(bodyWidth * 0.88, 0.4, bodyDepth * 0.75);
  const liningMesh = new THREE.Mesh(liningGeo, velvetLiningMaterial);
  liningMesh.position.set(0, -0.15, 0);
  interiorGroup.add(liningMesh);

  // Interior padded divider (laptop partition)
  const dividerGeo = new THREE.BoxGeometry(bodyWidth * 0.84, 0.5, 0.08);
  const dividerMesh = new THREE.Mesh(dividerGeo, velvetLiningMaterial);
  dividerMesh.position.set(0, 0, -bodyDepth * 0.12);
  interiorGroup.add(dividerMesh);

  // Interior leather atelier patch
  const patchGeo = new THREE.BoxGeometry(0.8, 0.28, 0.02);
  const patchMesh = new THREE.Mesh(patchGeo, interiorLeatherMaterial);
  patchMesh.position.set(0, 0.1, bodyDepth * 0.25);
  interiorGroup.add(patchMesh);

  bagGroup.add(interiorGroup);

  // Side gusset folds with leather creasing
  for (const side of [-1, 1]) {
    const gussetGeo = new THREE.CylinderGeometry(0.035, 0.035, bodyHeight * 0.85, 8);
    const gussetMesh = new THREE.Mesh(gussetGeo, leatherMaterial);
    gussetMesh.position.set(side * (bodyWidth / 2 - 0.02), 0, 0);
    bagGroup.add(gussetMesh);
  }

  // ==========================================
  // 2. RIGGED ARTICULATED FLAP (HINGE ROTATION ON X)
  // ==========================================
  const flapHinge = new THREE.Group();
  flapHinge.name = "FlapHingeJoint";
  flapHinge.position.set(0, bodyHeight / 2 - 0.02, -bodyDepth * 0.05);

  const flapWidth = bodyWidth * 0.96;
  const flapHeight = bodyHeight * 0.68;

  // Top fold curve section
  const topCoverGeo = createRoundedBoxGeometry(flapWidth, 0.08, bodyDepth * 0.85, 0.06, 3);
  const topCoverMesh = new THREE.Mesh(topCoverGeo, leatherMaterial);
  topCoverMesh.position.set(0, 0.04, bodyDepth * 0.35);
  topCoverMesh.castShadow = true;
  flapHinge.add(topCoverMesh);

  // Front hanging flap panel
  const frontFlapGroup = new THREE.Group();
  frontFlapGroup.position.set(0, 0.04, bodyDepth * 0.72);

  const flapGeo = createRoundedBoxGeometry(flapWidth, flapHeight, 0.08, 0.1, 4);
  const flapMesh = new THREE.Mesh(flapGeo, leatherMaterial);
  flapMesh.position.set(0, -flapHeight / 2, 0);
  flapMesh.castShadow = true;
  frontFlapGroup.add(flapMesh);

  // Flap edge piping
  addFlapEdgePiping(frontFlapGroup, flapWidth, flapHeight, edgePaintMaterial);

  // Stitching lines on flap (decorative parallel stitch rows)
  addStitchingLine(frontFlapGroup, flapWidth * 0.92, 0, -flapHeight * 0.08, 0.055, leatherMaterial);
  addStitchingLine(frontFlapGroup, flapWidth * 0.92, 0, -flapHeight * 0.92, 0.055, leatherMaterial);

  // Flap shaped bottom tongue / curved contour
  const tongueShape = new THREE.Shape();
  tongueShape.moveTo(-0.42, 0);
  tongueShape.lineTo(0.42, 0);
  tongueShape.lineTo(0.36, -0.38);
  tongueShape.quadraticCurveTo(0, -0.56, -0.36, -0.38);
  tongueShape.closePath();

  const tongueExtrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
  const tongueGeo = new THREE.ExtrudeGeometry(tongueShape, tongueExtrudeSettings);
  tongueGeo.center();
  const tongueMesh = new THREE.Mesh(tongueGeo, leatherMaterial);
  tongueMesh.position.set(0, -flapHeight * 0.98, 0.03);
  frontFlapGroup.add(tongueMesh);

  // Flap center vertical closure strap
  const flapStrapGeo = createRoundedBoxGeometry(0.28, 0.9, 0.05, 0.02, 3);
  const flapStrapMesh = new THREE.Mesh(flapStrapGeo, leatherMaterial);
  flapStrapMesh.position.set(0, -flapHeight * 0.75, 0.04);
  frontFlapGroup.add(flapStrapMesh);

  // Solid brass buckle mounted on flap
  const buckleOuterWidth = 0.46;
  const buckleOuterHeight = 0.54;
  const buckleThickness = 0.055;
  const buckleShape = new THREE.Shape();
  buckleShape.moveTo(-buckleOuterWidth / 2, -buckleOuterHeight / 2);
  buckleShape.lineTo(buckleOuterWidth / 2, -buckleOuterHeight / 2);
  buckleShape.lineTo(buckleOuterWidth / 2, buckleOuterHeight / 2);
  buckleShape.lineTo(-buckleOuterWidth / 2, buckleOuterHeight / 2);
  buckleShape.closePath();

  const holePath = new THREE.Path();
  const hw = buckleOuterWidth * 0.65 / 2;
  const hh = buckleOuterHeight * 0.65 / 2;
  holePath.moveTo(-hw, -hh);
  holePath.lineTo(hw, -hh);
  holePath.lineTo(hw, hh);
  holePath.lineTo(-hw, hh);
  holePath.closePath();
  buckleShape.holes.push(holePath);

  const buckleGeo = new THREE.ExtrudeGeometry(buckleShape, {
    depth: buckleThickness,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  buckleGeo.center();
  const buckleMesh = new THREE.Mesh(buckleGeo, goldBrassMaterial);
  buckleMesh.position.set(0, -flapHeight * 0.75, 0.08);
  frontFlapGroup.add(buckleMesh);

  // Buckle prong
  const prongGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.44, 12);
  const prongMesh = new THREE.Mesh(prongGeo, goldBrassMaterial);
  prongMesh.position.set(0, -flapHeight * 0.75, 0.095);
  prongMesh.rotation.z = Math.PI / 18;
  frontFlapGroup.add(prongMesh);

  // Leather strap keeper loop
  const keeperGeo = createRoundedBoxGeometry(0.35, 0.08, 0.08, 0.02, 3);
  const keeperMesh = new THREE.Mesh(keeperGeo, leatherMaterial);
  keeperMesh.position.set(0, -flapHeight * 1.15, 0.04);
  frontFlapGroup.add(keeperMesh);

  flapHinge.add(frontFlapGroup);
  bagGroup.add(flapHinge);

  // ==========================================
  // 3. FRONT EXTERIOR SLIP POCKET
  // ==========================================
  const pocketWidth = bodyWidth * 0.78;
  const pocketHeight = bodyHeight * 0.45;
  const pocketGeo = createRoundedBoxGeometry(pocketWidth, pocketHeight, 0.12, 0.08, 4);
  const pocketMesh = new THREE.Mesh(pocketGeo, leatherMaterial);
  pocketMesh.position.set(0, -bodyHeight * 0.18, bodyDepth / 2 + 0.05);
  pocketMesh.castShadow = true;
  bagGroup.add(pocketMesh);

  // Pocket stitching
  addStitchingLine(bagGroup, pocketWidth * 0.95, 0, -bodyHeight * 0.18 + pocketHeight * 0.46, bodyDepth / 2 + 0.12, leatherMaterial);

  // Lower strap keeper on bag body
  const bodyKeeperGeo = createRoundedBoxGeometry(0.35, 0.09, 0.08, 0.02, 3);
  const bodyKeeperMesh = new THREE.Mesh(bodyKeeperGeo, leatherMaterial);
  bodyKeeperMesh.position.set(0, -bodyHeight * 0.28, bodyDepth / 2 + 0.12);
  bagGroup.add(bodyKeeperMesh);

  // ==========================================
  // 4. TOP ARTISANAL HANDLE (Mounted to flap hinge so it articulates with the flap)
  // ==========================================
  const handleGroup = new THREE.Group();
  handleGroup.position.set(0, 0.04, bodyDepth * 0.35);

  const handleCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-0.85, 0, 0),
    new THREE.Vector3(-0.65, 0.65, 0),
    new THREE.Vector3(0.65, 0.65, 0),
    new THREE.Vector3(0.85, 0, 0)
  );
  const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.1, 12, false);
  const handleMesh = new THREE.Mesh(handleGeo, leatherMaterial);
  handleMesh.castShadow = true;
  handleGroup.add(handleMesh);

  // Handle wrap stitching detail (simplified)
  for (let t = 0.2; t <= 0.8; t += 0.15) {
    const pt = handleCurve.getPoint(t);
    const tangent = handleCurve.getTangent(t);
    const stitchGeo = new THREE.TorusGeometry(0.115, 0.008, 4, 12);
    const stitchMesh = new THREE.Mesh(stitchGeo, edgePaintMaterial);
    stitchMesh.position.copy(pt);
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(up, tangent.normalize());
    stitchMesh.quaternion.copy(quat);
    handleGroup.add(stitchMesh);
  }

  // Handle mounts
  for (const xPos of [-0.85, 0.85]) {
    const mountGeo = new THREE.BoxGeometry(0.24, 0.12, 0.18);
    const mountMesh = new THREE.Mesh(mountGeo, leatherMaterial);
    mountMesh.position.set(xPos, 0, 0);
    handleGroup.add(mountMesh);

    const brassRingGeo = new THREE.TorusGeometry(0.12, 0.03, 12, 24);
    const brassRing = new THREE.Mesh(brassRingGeo, goldBrassMaterial);
    brassRing.rotation.y = Math.PI / 2;
    brassRing.position.set(xPos, 0.06, 0);
    handleGroup.add(brassRing);

    const rivetGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const rivet = new THREE.Mesh(rivetGeo, goldBrassMaterial);
    rivet.position.set(xPos, 0, 0.09);
    handleGroup.add(rivet);
  }

  flapHinge.add(handleGroup);

  // ==========================================
  // 5. SIDE STRAP MOUNTS & NATURAL SHOULDER STRAP
  // ==========================================
  for (const side of [-1, 1]) {
    const sideMountGroup = new THREE.Group();
    sideMountGroup.position.set(side * (bodyWidth / 2 + 0.02), bodyHeight * 0.14, 0);

    const tabGeo = createRoundedBoxGeometry(0.06, 0.44, 0.28, 0.02, 3);
    const tabMesh = new THREE.Mesh(tabGeo, leatherMaterial);
    sideMountGroup.add(tabMesh);

    const rivetGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16);
    rivetGeo.rotateZ(Math.PI / 2);
    const rivetMesh = new THREE.Mesh(rivetGeo, goldBrassMaterial);
    rivetMesh.position.set(side * 0.03, -0.1, 0);
    sideMountGroup.add(rivetMesh);

    const dRingGeo = new THREE.TorusGeometry(0.14, 0.035, 12, 24);
    const dRing = new THREE.Mesh(dRingGeo, goldBrassMaterial);
    dRing.position.set(side * 0.04, 0.14, 0);
    sideMountGroup.add(dRing);

    const claspGroup = new THREE.Group();
    claspGroup.position.set(side * 0.04, 0.14, 0);

    const claspRingGeo = new THREE.TorusGeometry(0.075, 0.022, 12, 16);
    const claspRing = new THREE.Mesh(claspRingGeo, goldBrassMaterial);
    claspGroup.add(claspRing);

    const claspBodyGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 12);
    const claspBody = new THREE.Mesh(claspBodyGeo, goldBrassMaterial);
    claspBody.position.set(0, -0.09, 0);
    claspGroup.add(claspBody);

    sideMountGroup.add(claspGroup);
    bagGroup.add(sideMountGroup);
  }

  // Realistic shoulder strap looping naturally behind
  const rearStrapCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-bodyWidth / 2 - 0.06, bodyHeight * 0.14, -0.05),
    new THREE.Vector3(-bodyWidth * 0.4, -0.4, -bodyDepth * 0.9),
    new THREE.Vector3(bodyWidth * 0.4, -0.4, -bodyDepth * 0.9),
    new THREE.Vector3(bodyWidth / 2 + 0.06, bodyHeight * 0.14, -0.05)
  );
  const rearStrapGeo = new THREE.TubeGeometry(rearStrapCurve, 36, 0.065, 8, false);
  const rearStrapMesh = new THREE.Mesh(rearStrapGeo, leatherMaterial);
  rearStrapMesh.castShadow = true;
  bagGroup.add(rearStrapMesh);

  // ==========================================
  // 6. BOTTOM BRASS FEET
  // ==========================================
  const footPositions = [
    [-bodyWidth * 0.38, -bodyHeight / 2 - 0.04, -bodyDepth * 0.3],
    [bodyWidth * 0.38, -bodyHeight / 2 - 0.04, -bodyDepth * 0.3],
    [-bodyWidth * 0.38, -bodyHeight / 2 - 0.04, bodyDepth * 0.3],
    [bodyWidth * 0.38, -bodyHeight / 2 - 0.04, bodyDepth * 0.3],
  ];

  for (const pos of footPositions) {
    const footGeo = new THREE.ConeGeometry(0.08, 0.08, 16);
    footGeo.rotateX(Math.PI);
    const footMesh = new THREE.Mesh(footGeo, goldBrassMaterial);
    footMesh.position.set(...pos);
    bagGroup.add(footMesh);
  }

  // ==========================================
  // 7. FLOOR CONTACT SHADOW
  // ==========================================
  const shadowGeo = new THREE.PlaneGeometry(5.2, 3.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createShadowTexture(),
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, -bodyHeight / 2 - 0.07, 0);
  bagGroup.add(shadowMesh);

  // ==========================================
  // 8. RIG ANIMATION CONTROLS
  // ==========================================
  let flapProgress = 0;
  const setFlapOpenProgress = (progress) => {
    flapProgress = Math.max(0, Math.min(1, progress));
    flapHinge.rotation.x = -flapProgress * 1.9;
  };

  const setColor = (hexValue) => {
    const newTextures = createLeatherTextures(hexValue);
    leatherMaterial.map = newTextures.colorMap;
    leatherMaterial.normalMap = newTextures.normalMap;
    leatherMaterial.roughnessMap = newTextures.roughnessMap;
    leatherMaterial.needsUpdate = true;
    patchMesh.material.map = newTextures.colorMap;
    patchMesh.material.needsUpdate = true;
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

// ==========================================
// HELPER: Edge piping lines along bag seams
// ==========================================
function addEdgePiping(parent, bodyWidth, bodyHeight, bodyDepth, material) {
  const pipingRadius = 0.018;

  // Bottom front edge
  const frontBottomGeo = new THREE.CylinderGeometry(pipingRadius, pipingRadius, bodyWidth * 0.9, 8);
  frontBottomGeo.rotateZ(Math.PI / 2);
  const frontBottom = new THREE.Mesh(frontBottomGeo, material);
  frontBottom.position.set(0, -bodyHeight / 2 + 0.08, bodyDepth / 2 - 0.02);
  parent.add(frontBottom);

  // Bottom side edges
  for (const side of [-1, 1]) {
    const sideGeo = new THREE.CylinderGeometry(pipingRadius, pipingRadius, bodyDepth * 0.8, 8);
    sideGeo.rotateX(Math.PI / 2);
    const sidePipe = new THREE.Mesh(sideGeo, material);
    sidePipe.position.set(side * (bodyWidth / 2 - 0.08), -bodyHeight / 2 + 0.08, 0);
    parent.add(sidePipe);
  }
}

// ==========================================
// HELPER: Flap edge piping
// ==========================================
function addFlapEdgePiping(parent, flapWidth, flapHeight, material) {
  const r = 0.014;

  // Left & right edges of flap
  for (const side of [-1, 1]) {
    const edgeGeo = new THREE.CylinderGeometry(r, r, flapHeight * 0.9, 8);
    const edge = new THREE.Mesh(edgeGeo, material);
    edge.position.set(side * (flapWidth / 2 - 0.03), -flapHeight / 2, 0.04);
    parent.add(edge);
  }
}

// ==========================================
// HELPER: Stitching detail line
// ==========================================
function addStitchingLine(parent, width, x, y, z, material) {
  // Single thin cylinder as a stitch seam line
  const lineGeo = new THREE.CylinderGeometry(0.012, 0.012, width * 0.9, 6);
  lineGeo.rotateZ(Math.PI / 2);
  const line = new THREE.Mesh(lineGeo, material);
  line.position.set(x, y, z);
  parent.add(line);
}

/**
 * Helper to create soft beveled box geometries for organic leather look
 */
function createRoundedBoxGeometry(width, height, depth, radius, smoothness) {
  const shape = new THREE.Shape();
  const eps = 0.00001;
  const tr = radius - eps;
  const w = width / 2;
  const h = height / 2;

  shape.absarc(-w + radius, -h + radius, tr, Math.PI, 1.5 * Math.PI);
  shape.absarc(w - radius, -h + radius, tr, 1.5 * Math.PI, 2 * Math.PI);
  shape.absarc(w - radius, h - radius, tr, 0, 0.5 * Math.PI);
  shape.absarc(-w + radius, h - radius, tr, 0.5 * Math.PI, Math.PI);

  const extrudeSettings = {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelSegments: smoothness,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}
