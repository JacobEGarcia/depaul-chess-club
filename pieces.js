// DePaul Chess Club - procedural 3D chess pieces (three.js r128)
// Staunton-style lathe profiles, extruded-silhouette knight, lacquer materials.
// Palette: royal #005EB8, scarlet #DA291C, cream #F2EDE3
var DPC = { royal:0x005EB8, deep:0x002A55, scarlet:0xDA291C, cream:0xF2EDE3, ink:0x141210, gold:0xC8A24B };

function dpMat(color, rough, metal){
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: (rough==null?0.28:rough),
    metalness: (metal==null?0.12:metal),
    clearcoat: 0.6,
    clearcoatRoughness: 0.28
  });
}
function lathe(pts, material, seg){
  var v = pts.map(function(p){ return new THREE.Vector2(p[0], p[1]); });
  var geo = new THREE.LatheGeometry(v, seg||96);
  var m = new THREE.Mesh(geo, material);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function shadowize(g){
  g.traverse(function(o){ if (o.isMesh){ o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
// shared Staunton base: foot ring, taper, stem collar
function baseProfile(r){ return [[0.001,0],[r,0],[r*1.06,0.03],[r*1.06,0.09],[r*0.88,0.14],[r*0.70,0.19]]; }

function makePawn(material){
  var g = new THREE.Group();
  var p = baseProfile(0.40).concat([
    [0.26,0.24],[0.20,0.34],           // stem
    [0.27,0.40],[0.27,0.46],[0.19,0.50], // collar
    [0.15,0.60],[0.20,0.66],[0.20,0.71],[0.13,0.74],[0.001,0.74] // neck ring
  ]);
  g.add(lathe(p, material));
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.175, 48, 32), material);
  head.position.y = 0.90;
  g.add(head);
  return shadowize(g);
}
function makeRook(material){
  var g = new THREE.Group();
  var p = baseProfile(0.42).concat([
    [0.28,0.26],[0.25,0.55],            // tapered tower
    [0.30,0.62],[0.30,0.68],[0.25,0.72], // collar
    [0.33,0.80],[0.33,0.96],[0.26,0.96],[0.26,0.90],[0.001,0.90] // battlement ring + inner lip
  ]);
  g.add(lathe(p, material));
  for (var i=0;i<8;i++){
    var a = (i+0.5)/8*Math.PI*2;
    var c = new THREE.Mesh(new THREE.BoxGeometry(0.14,0.13,0.14), material);
    c.position.set(Math.cos(a)*0.265, 1.02, Math.sin(a)*0.265);
    c.rotation.y = -a;
    g.add(c);
  }
  return shadowize(g);
}
function makeBishop(material){
  var g = new THREE.Group();
  var p = baseProfile(0.40).concat([
    [0.25,0.25],[0.19,0.50],[0.16,0.68],
    [0.23,0.76],[0.23,0.82],[0.15,0.87],[0.001,0.87]
  ]);
  g.add(lathe(p, material));
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.165, 48, 32), material);
  head.position.y = 1.04; head.scale.y = 1.45;
  g.add(head);
  // miter slit: inset dark wedge
  var slit = new THREE.Mesh(new THREE.BoxGeometry(0.02,0.22,0.05),
    new THREE.MeshStandardMaterial({ color:0x0a0a0a, roughness:0.9 }));
  slit.position.set(0.10,1.12,0); slit.rotation.z = -0.5;
  g.add(slit);
  var tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), material);
  tip.position.y = 1.33;
  g.add(tip);
  return shadowize(g);
}
function makeQueen(material){
  var g = new THREE.Group();
  var p = baseProfile(0.44).concat([
    [0.28,0.28],[0.20,0.60],[0.16,0.92],[0.14,1.04],
    [0.25,1.12],[0.27,1.18],[0.20,1.21],[0.001,1.21]  // flared coronet seat
  ]);
  g.add(lathe(p, material));
  for (var i=0;i<8;i++){
    var a = i/8*Math.PI*2;
    var s = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 14), material);
    s.position.set(Math.cos(a)*0.215, 1.27, Math.sin(a)*0.215);
    g.add(s);
    var spike = new THREE.Mesh(new THREE.ConeGeometry(0.035,0.14,16), material);
    spike.position.set(Math.cos(a)*0.215, 1.22, Math.sin(a)*0.215);
    g.add(spike);
  }
  var ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 18), material);
  ball.position.y = 1.31;
  g.add(ball);
  return shadowize(g);
}
function makeKing(material){
  var g = new THREE.Group();
  var p = baseProfile(0.44).concat([
    [0.28,0.28],[0.20,0.62],[0.16,0.96],[0.14,1.10],
    [0.28,1.18],[0.28,1.26],[0.19,1.30],[0.001,1.30]  // crown band
  ]);
  g.add(lathe(p, material));
  var v = new THREE.Mesh(new THREE.BoxGeometry(0.075,0.24,0.075), material);
  v.position.y = 1.44;
  var h = new THREE.Mesh(new THREE.BoxGeometry(0.21,0.075,0.075), material);
  h.position.y = 1.45;
  g.add(v); g.add(h);
  return shadowize(g);
}
// Staunton knight: lathe base + extruded bezier silhouette head/neck, facing +X.
function makeKnight(material){
  var g = new THREE.Group();
  g.add(lathe(baseProfile(0.42).concat([[0.30,0.26],[0.26,0.34],[0.001,0.34]]), material));

  var s = new THREE.Shape();
  s.moveTo(-0.16, 0.26);
  s.bezierCurveTo(-0.19, 0.45, -0.15, 0.65, -0.10, 0.80); // back of neck
  s.lineTo(-0.13, 0.85); s.lineTo(-0.07, 0.89); s.lineTo(-0.10, 0.93); // mane bumps
  s.lineTo(-0.05, 1.08);   // ear tip
  s.lineTo( 0.01, 0.95);   // ear front base
  s.bezierCurveTo( 0.08, 0.90, 0.16, 0.82, 0.22, 0.72);  // forehead
  s.bezierCurveTo( 0.26, 0.66, 0.28, 0.62, 0.28, 0.58);  // nose bridge
  s.lineTo( 0.27, 0.50);   // muzzle front
  s.lineTo( 0.21, 0.48);   // muzzle bottom
  s.bezierCurveTo( 0.17, 0.47, 0.14, 0.46, 0.12, 0.44);  // mouth/chin
  s.bezierCurveTo( 0.07, 0.42, 0.03, 0.48, 0.00, 0.55);  // jaw back up to throat
  s.lineTo( 0.10, 0.26);   // chest
  s.lineTo(-0.16, 0.26);
  s.closePath();

  var geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.24, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.055,
    bevelSegments: 4, curveSegments: 16
  });
  geo.translate(0, 0, -0.12);
  var head = new THREE.Mesh(geo, material);
  g.add(head);

  // front ear
  var ear = new THREE.Mesh(new THREE.ConeGeometry(0.035,0.11,12), material);
  ear.position.set(-0.05,1.06,0.13); ear.rotation.z = -0.15;
  g.add(ear);
  // eyes
  var eyeM = new THREE.MeshStandardMaterial({ color:0x0a0a0a, roughness:0.35 });
  [-1,1].forEach(function(side){
    var e = new THREE.Mesh(new THREE.SphereGeometry(0.022,12,10), eyeM);
    e.position.set(0.10, 0.78, side*0.165);
    g.add(e);
  });
  // nostrils
  [-1,1].forEach(function(side){
    var n = new THREE.Mesh(new THREE.SphereGeometry(0.014,10,8), eyeM);
    n.position.set(0.26, 0.55, side*0.14);
    g.add(n);
  });
  return shadowize(g);
}
// Full set of 32 for one board; lightM/darkM are materials. Returns group.
function makeChessSet(lightM, darkM){
  var group = new THREE.Group();
  var makers = { p:makePawn, r:makeRook, n:makeKnight, b:makeBishop, q:makeQueen, k:makeKing };
  var back = ['r','n','b','q','k','b','n','r'];
  for (var side=0; side<2; side++){
    var m = side===0 ? lightM : darkM;
    var row = side===0 ? 0 : 7, prow = side===0 ? 1 : 6;
    for (var f=0; f<8; f++){
      var piece = makers[back[f]](m.clone());
      piece.position.set(f-3.5, 0, row-3.5);
      if (side===1) piece.rotation.y = Math.PI;
      group.add(piece);
      var pw = makePawn(m.clone());
      pw.position.set(f-3.5, 0, prow-3.5);
      group.add(pw);
    }
  }
  return group;
}
// Board: 8x8 beveled tiles on a two-tier rim with a scarlet inlay line
function makeBoard(size, lightColor, darkColor){
  var g = new THREE.Group();
  var s = size || 1.12;
  for (var r=0;r<8;r++) for (var f=0;f<8;f++){
    var dark = (r+f)%2===1;
    var t = new THREE.Mesh(new THREE.BoxGeometry(s-0.03,0.09,s-0.03), dpMat(dark?darkColor:lightColor, dark?0.22:0.45, dark?0.3:0.05));
    t.position.set((f-3.5)*s, -0.045, (r-3.5)*s);
    t.receiveShadow = true;
    g.add(t);
  }
  var rim = new THREE.Mesh(new THREE.BoxGeometry(s*8+0.55,0.14,s*8+0.55), dpMat(DPC.deep,0.35,0.25));
  rim.position.y = -0.13; rim.receiveShadow = true;
  g.add(rim);
  var inlay = new THREE.Mesh(new THREE.BoxGeometry(s*8+0.2,0.02,s*8+0.2), dpMat(DPC.scarlet,0.3,0.4));
  inlay.position.y = -0.055;
  g.add(inlay);
  return g;
}
