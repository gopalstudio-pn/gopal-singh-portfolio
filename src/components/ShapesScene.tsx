import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default function ShapesScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const small = window.innerWidth < 768;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    const key = new THREE.DirectionalLight(0xfff0d8, 1.2);
    key.position.set(4, 6, 6);
    scene.add(key);

    let geo: THREE.BufferGeometry = new THREE.SphereGeometry(1.3, small ? 40 : 64, small ? 30 : 48);
    geo.deleteAttribute('uv');
    geo.deleteAttribute('normal');
    geo = mergeVertices(geo);
    geo.computeVertexNormals();
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const dir = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const l = Math.hypot(x, y, z) || 1;
      dir[i * 3] = x / l;
      dir[i * 3 + 1] = y / l;
      dir[i * 3 + 2] = z / l;
    }
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.16, clearcoat: 0.5, clearcoatRoughness: 0.15 });
    const blob = new THREE.Mesh(geo, goldMat);
    scene.add(blob);

    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xfff3da, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.3, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6 });
    const geos = [new THREE.IcosahedronGeometry(0.8, 0), new THREE.OctahedronGeometry(0.7, 0), new THREE.TorusKnotGeometry(0.5, 0.16, 96, 12)];
    const shapes = [
      { m: new THREE.Mesh(geos[0], glassMat), x: -0.6, y: 0.5 },
      { m: new THREE.Mesh(geos[1], glassMat), x: 0.55, y: -0.1 },
      { m: new THREE.Mesh(geos[2], glassMat), x: -0.4, y: -0.65 },
    ];
    shapes.forEach((s) => scene.add(s.m));

    const halfHBase = Math.tan((45 * Math.PI) / 360) * 9;
    let halfH = halfHBase;
    let halfW = halfHBase;
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      halfH = halfHBase;
      halfW = halfHBase * (w / h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let px = 0, py = 0, smx = 0, smy = 0;
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const clock = new THREE.Clock();
    const frame = () => {
      const t = clock.getElapsedTime();
      const r = mount.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      smx += (px - smx) * 0.05;
      smy += (py - smy) * 0.05;
      const amp = 0.1 + p * 0.22;
      for (let i = 0; i < pos.count; i++) {
        const nx = dir[i * 3], ny = dir[i * 3 + 1], nz = dir[i * 3 + 2];
        const f = Math.sin(nx * 2.2 + t * 0.8 + p * 4) * 0.5 + Math.sin(ny * 2.9 + t * 0.65 - p * 3) * 0.35 + Math.sin(nz * 3.4 + t * 1.05 + p * 5) * 0.25;
        const d = 1.3 * (1 + amp * f);
        pos.setXYZ(i, nx * d, ny * d, nz * d);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      blob.scale.setScalar(Math.min(1.1, Math.max(0.55, halfW * 0.4)));
      blob.position.set(Math.sin(p * Math.PI * 2) * halfW * 0.5 + smx * 0.3, (0.5 - p) * halfH * 1.4, 0);
      blob.rotation.y = t * 0.2;
      blob.rotation.x = t * 0.1;
      const ss = Math.min(1.2, Math.max(0.6, halfW * 0.35));
      shapes.forEach((s, i) => {
        s.m.position.set(s.x * halfW + smx * 0.4 * (i + 1), s.y * halfH + Math.sin(t * 0.6 + i) * 0.15 - smy * 0.3, 0);
        s.m.rotation.x = t * 0.25 + i;
        s.m.rotation.y = t * 0.3 + i * 2;
        s.m.scale.setScalar(ss);
      });
      renderer.render(scene, camera);
    };

    let raf = 0;
    let visible = true;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      frame();
    };
    if (reduced) frame();
    else raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      geos.forEach((g) => g.dispose());
      goldMat.dispose();
      glassMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
