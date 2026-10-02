import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function GalaxyScene() {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const emblem = new THREE.Group();
    const logoGeo = new THREE.PlaneGeometry(1, 1);
    const logoMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    emblem.add(logoMesh);
    let logoTex: THREE.Texture | null = null;
    new THREE.TextureLoader().load('/gopal-logo.png', (tx) => {
      tx.colorSpace = THREE.SRGBColorSpace;
      tx.anisotropy = 4;
      const img: any = tx.image;
      const ar = img && img.width && img.height ? img.width / img.height : 1;
      logoMesh.scale.set(1.5 * ar, 1.5, 1);
      logoMat.map = tx;
      logoMat.opacity = 1;
      logoMat.needsUpdate = true;
      logoTex = tx;
    });
    scene.add(emblem);

    const count = small ? 1800 : 4200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const inner = new THREE.Color(0xffd27a);
    const outer = new THREE.Color(0x9a6b2f);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * 6.5 + 0.9;
      const branch = ((i % 3) / 3) * Math.PI * 2;
      const ang = branch + r * 0.9;
      const rnd = () => (Math.random() - 0.5) * 0.55 * (r * 0.25 + 0.3);
      pos[i * 3] = Math.cos(ang) * r + rnd();
      pos[i * 3 + 1] = rnd() * 0.6;
      pos[i * 3 + 2] = Math.sin(ang) * r + rnd();
      tmp.copy(inner).lerp(outer, Math.min(1, r / 7));
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const galaxy = new THREE.Points(pGeo, pMat);
    const pivot = new THREE.Group();
    pivot.rotation.x = 1.15;
    pivot.add(galaxy);
    scene.add(pivot);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 1.2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.8;
    };
    mount.addEventListener('pointermove', move, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const frame = () => {
      const t = clock.getElapsedTime();
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      galaxy.rotation.y = t * 0.04;
      emblem.rotation.y = Math.sin(t * 0.5) * 0.6 + cur.x;
      emblem.rotation.x = cur.y * 0.6 + Math.sin(t * 0.4) * 0.08;
      emblem.position.y = Math.sin(t * 0.8) * 0.12;
      renderer.render(scene, camera);
    };
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
      mount.removeEventListener('pointermove', move);
      logoGeo.dispose();
      logoMat.dispose();
      if (logoTex) logoTex.dispose();
      pGeo.dispose();
      pMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" style={{ touchAction: 'pan-y' }} />;
}
