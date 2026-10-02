import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type Book = { title: string; cover: string };

export default function BookShelfScene({ books, onPick }: { books: Book[]; onPick: (title: string) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    (scene as any).environmentIntensity = 0.55;
    const key = new THREE.DirectionalLight(0xffe2b8, 1.6);
    key.position.set(3, 5, 7);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0x8a7a66, 0.6));

    const BW = 0.95, BH = 1.35, BD = 0.28;
    const shelf = new THREE.Group();
    scene.add(shelf);
    const sideMat = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.75 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 0.6, metalness: 0.05 });
    const bookGeo = new THREE.BoxGeometry(BW, BH, BD);
    const plankGeo = new THREE.BoxGeometry(1, 0.16, 1.1);
    const textures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();

    const items = books.map((b) => {
      const front = new THREE.MeshStandardMaterial({ color: 0x6b5a45, roughness: 0.55 });
      loader.load(b.cover, (tx) => {
        tx.colorSpace = THREE.SRGBColorSpace;
        tx.anisotropy = 4;
        front.map = tx;
        front.color.set(0xffffff);
        front.needsUpdate = true;
        textures.push(tx);
      });
      const mesh = new THREE.Mesh(bookGeo, [sideMat, sideMat, sideMat, sideMat, front, sideMat]);
      shelf.add(mesh);
      return { mesh, front, title: b.title };
    });
    const planks: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const p = new THREE.Mesh(plankGeo, woodMat);
      shelf.add(p);
      planks.push(p);
    }

    const base = items.map(() => new THREE.Vector3());
    const layout = (aspect: number) => {
      const wide = aspect > 1.6;
      const n = items.length;
      const cols = wide ? n : Math.ceil(n / 2);
      const rows = wide ? 1 : 2;
      const pitch = 1.12;
      const rowH = 1.95;
      items.forEach((_, i) => {
        const r = wide ? 0 : Math.floor(i / cols);
        const c = wide ? i : i % cols;
        base[i].set((c - (cols - 1) / 2) * pitch, ((rows - 1) / 2) * rowH - r * rowH, 0);
      });
      planks.forEach((p, i) => {
        p.visible = i < rows;
        p.scale.x = cols * pitch + 0.3;
        p.position.set(0, ((rows - 1) / 2) * rowH - i * rowH - BH / 2 - 0.08, 0);
      });
      const totalW = cols * pitch + 0.6;
      const totalH = rows * rowH + 0.5;
      const th = Math.tan((camera.fov * Math.PI) / 360);
      const dist = Math.max(totalH / 2 / th, totalW / 2 / (th * aspect)) + 0.6;
      camera.position.set(0, 0.25, dist);
      camera.lookAt(0, 0, 0);
    };

    let first = true;
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      layout(w / h);
      if (first) {
        items.forEach((it, i) => it.mesh.position.copy(base[i]));
        first = false;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let sel = -1;
    let hover = -1;
    let px = 0;
    let py = 0;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = (cx: number, cy: number) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const h = ray.intersectObjects(items.map((i) => i.mesh), false)[0];
      return h ? items.findIndex((i) => i.mesh === h.object) : -1;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = renderer.domElement.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hover = hit(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hover >= 0 ? 'pointer' : 'default';
    };
    const onLeave = () => {
      hover = -1;
      px = 0;
      py = 0;
    };
    const onClick = (e: MouseEvent) => {
      const i = hit(e.clientX, e.clientY);
      if (i < 0) {
        sel = -1;
        return;
      }
      if (sel === i) {
        pickRef.current(items[i].title);
        sel = -1;
      } else sel = i;
    };
    mount.style.touchAction = 'pan-y';
    mount.addEventListener('pointermove', onMove, { passive: true });
    mount.addEventListener('pointerleave', onLeave);
    mount.addEventListener('click', onClick);

    const k = reduced ? 1 : 0.14;
    const frame = (t: number) => {
      items.forEach((it, i) => {
        const b = base[i];
        const isSel = i === sel;
        const isHov = i === hover && sel < 0;
        const tz = isSel ? 2.2 : isHov ? 0.45 : 0;
        const ty = isSel ? 0.1 : isHov ? 0.08 : 0;
        const ts = isSel ? 1.3 : isHov ? 1.04 : 1;
        const rY = isSel ? Math.sin(t * 0.0012) * 0.35 : isHov ? px * 0.25 : 0;
        const m = it.mesh;
        m.position.x += (b.x - m.position.x) * k;
        m.position.y += (b.y + ty - m.position.y) * k;
        m.position.z += (b.z + tz - m.position.z) * k;
        m.scale.setScalar(m.scale.x + (ts - m.scale.x) * k);
        m.rotation.y += (rY - m.rotation.y) * k;
      });
      shelf.rotation.y += (px * 0.12 - shelf.rotation.y) * 0.05;
      shelf.rotation.x += (-py * 0.05 - shelf.rotation.x) * 0.05;
      renderer.render(scene, camera);
    };

    let raf = 0;
    let visible = true;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      frame(t);
    };
    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mount.removeEventListener('pointermove', onMove);
      mount.removeEventListener('pointerleave', onLeave);
      mount.removeEventListener('click', onClick);
      bookGeo.dispose();
      plankGeo.dispose();
      sideMat.dispose();
      woodMat.dispose();
      items.forEach((i) => i.front.dispose());
      textures.forEach((t) => t.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [books]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
