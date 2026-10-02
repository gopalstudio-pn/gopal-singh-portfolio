import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlobeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const small = window.innerWidth < 768;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);
    camera.lookAt(0, 0, 0);
    const tilt = new THREE.Group();
    tilt.rotation.x = 0.33;
    scene.add(tilt);
    const spin = new THREE.Group();
    tilt.add(spin);
    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[] = [];

    const coreGeo = new THREE.SphereGeometry(0.985, 48, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x0a0805 });
    spin.add(new THREE.Mesh(coreGeo, coreMat));
    geos.push(coreGeo);
    mats.push(coreMat);

    const N = small ? 900 : 1500;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = i * Math.PI * (3 - Math.sqrt(5));
      arr[i * 3] = Math.cos(th) * rad;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(th) * rad;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.024, transparent: true, opacity: 0.9, sizeAttenuation: true });
    spin.add(new THREE.Points(dotGeo, dotMat));
    geos.push(dotGeo);
    mats.push(dotMat);

    const lineMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.16 });
    mats.push(lineMat);
    const mkRing = (fn: (a: number) => number[]) => {
      const pts = new Float32Array(129 * 3);
      for (let i = 0; i <= 128; i++) {
        const v = fn((i / 128) * Math.PI * 2);
        pts[i * 3] = v[0];
        pts[i * 3 + 1] = v[1];
        pts[i * 3 + 2] = v[2];
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      geos.push(g);
      return new THREE.LineLoop(g, lineMat);
    };
    [-60, -30, 0, 30, 60].forEach((lat) => {
      const rd = (lat * Math.PI) / 180;
      spin.add(mkRing((a) => [Math.cos(a) * Math.cos(rd) * 1.002, Math.sin(rd) * 1.002, Math.sin(a) * Math.cos(rd) * 1.002]));
    });
    for (let k = 0; k < 6; k++) {
      const m = mkRing((a) => [Math.cos(a) * 1.002, Math.sin(a) * 1.002, 0]);
      m.rotation.y = (k * Math.PI) / 6;
      spin.add(m);
    }

    const atmoGeo = new THREE.SphereGeometry(1.1, 48, 32);
    const atmoMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.07, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false });
    tilt.add(new THREE.Mesh(atmoGeo, atmoMat));
    geos.push(atmoGeo);
    mats.push(atmoMat);

    const lat = 26.7;
    const lon = 86.4;
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    const pin = new THREE.Vector3(-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
    const facing = Math.atan2(pin.x, pin.z);

    const dotPinGeo = new THREE.SphereGeometry(0.03, 16, 12);
    const dotPinMat = new THREE.MeshBasicMaterial({ color: 0xffe9a8 });
    const pinMesh = new THREE.Mesh(dotPinGeo, dotPinMat);
    pinMesh.position.copy(pin).multiplyScalar(1.01);
    spin.add(pinMesh);
    const ringGeo = new THREE.RingGeometry(0.045, 0.058, 40);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pin).multiplyScalar(1.006);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pin.clone().normalize());
    spin.add(ring);
    geos.push(dotPinGeo, ringGeo);
    mats.push(dotPinMat, ringMat);

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

    let px = 0, smx = 0;
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
    };
    mount.addEventListener('pointermove', onMove, { passive: true });
    mount.style.touchAction = 'pan-y';

    const clock = new THREE.Clock();
    const frame = () => {
      const t = clock.getElapsedTime();
      smx += (px - smx) * 0.05;
      spin.rotation.y = -facing + Math.sin(t * 0.35) * 0.55 + smx * 0.3;
      const fr = (t * 0.8) % 1;
      ring.scale.setScalar(1 + fr * 2.2);
      ringMat.opacity = 1 - fr;
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
      mount.removeEventListener('pointermove', onMove);
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
