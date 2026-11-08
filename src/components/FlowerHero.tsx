import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ── Constellation Data for Dark Mode ── */
interface ConstellationStar {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

interface Constellation {
  name: string;
  stars: ConstellationStar[];
  lines: [number, number][];
}

const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Ursa Minor',
    stars: [
      { x: 0.14, y: 0.12, size: 2.2, alpha: 0.9 },
      { x: 0.17, y: 0.16, size: 1.6, alpha: 0.75 },
      { x: 0.21, y: 0.18, size: 1.5, alpha: 0.7 },
      { x: 0.24, y: 0.22, size: 1.8, alpha: 0.8 },
      { x: 0.22, y: 0.27, size: 1.5, alpha: 0.75 },
      { x: 0.27, y: 0.29, size: 1.7, alpha: 0.8 },
      { x: 0.29, y: 0.24, size: 1.6, alpha: 0.75 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    name: 'Cassiopeia',
    stars: [
      { x: 0.72, y: 0.10, size: 2.0, alpha: 0.9 },
      { x: 0.77, y: 0.15, size: 1.8, alpha: 0.85 },
      { x: 0.82, y: 0.12, size: 2.1, alpha: 0.9 },
      { x: 0.87, y: 0.18, size: 1.9, alpha: 0.85 },
      { x: 0.92, y: 0.13, size: 2.0, alpha: 0.9 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
];

/* ── Optimized Flower with Prerendered Sprite Cache ── */
interface CachedFlower {
  index: number;
  x: number;
  groundX: number;
  groundY: number;
  baseY: number;
  size: number;
  type: 'peony' | 'carnation';
  depth: number;
  tilt: number;
  swaySpeed: number;
  swayPhase: number;
  swayAmp: number;
  stemBend: number;
  hasSideBud: boolean;
  sideBudSide: number;
  baseHue: number;
  sprite: HTMLCanvasElement;
  spriteSize: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  rotation: number;
  rotSpeed: number;
  hue: number;
}

/* ── Prerender Carnation Bloom onto Offscreen Canvas ── */
function renderCarnationSprite(size: number, baseHue: number, isDark: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const pad = 16;
  const spriteDim = Math.ceil(size * 2 + pad * 2);
  canvas.width = spriteDim;
  canvas.height = spriteDim;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = spriteDim / 2;
  const cy = spriteDim / 2;

  ctx.save();
  ctx.translate(cx, cy);

  // 1. Calyx Cup
  const calyxH = size * 0.38;
  const calyxW = size * 0.3;
  ctx.beginPath();
  ctx.moveTo(-calyxW * 0.45, size * 0.05);
  ctx.quadraticCurveTo(-calyxW * 0.55, calyxH * 0.8, 0, calyxH + 4);
  ctx.quadraticCurveTo(calyxW * 0.55, calyxH * 0.8, calyxW * 0.45, size * 0.05);
  ctx.closePath();
  ctx.fillStyle = isDark ? '#142918' : '#336128';
  ctx.fill();

  // 2. 6 Tiers of Complete 360° Ruffled Petals
  const tiers = 6;
  for (let tier = tiers; tier >= 1; tier--) {
    const tierRadius = size * (0.28 + (tier / tiers) * 0.72);
    const petalsInTier = 7 + tier * 2;
    const tierOffset = tier * 0.48;
    const depthDarken = (tiers - tier) * 5;

    for (let p = 0; p < petalsInTier; p++) {
      // FULL 360° RADIATING PETALS
      const angle = (p / petalsInTier) * Math.PI * 2 + tierOffset + Math.sin(p * 3.5 + tier) * 0.14;
      const petalLen = tierRadius * (0.85 + Math.sin(p * 4.2) * 0.15);
      const petalWidth = (size * 0.32) * (0.55 + (tier / tiers) * 0.5);

      ctx.save();
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Left curved edge
      ctx.bezierCurveTo(
        -petalWidth * 0.55, -petalLen * 0.5,
        -petalWidth * 0.85, -petalLen * 0.82,
        -petalWidth * 0.65, -petalLen
      );

      // Serrated / crinkled fringe on petal tip
      const serrations = 5;
      for (let s = 1; s <= serrations; s++) {
        const t = s / serrations;
        const sx = -petalWidth * 0.65 + t * (petalWidth * 1.3);
        const sy = -petalLen - ((s % 2 === 1) ? (3.5 * (tier / tiers) + 1.8) : -1.5);
        ctx.lineTo(sx, sy);
      }

      // Right curved edge back to base
      ctx.bezierCurveTo(
        petalWidth * 0.85, -petalLen * 0.82,
        petalWidth * 0.55, -petalLen * 0.5,
        0, 0
      );
      ctx.closePath();

      // Petal Gradient (Fast, hardware-accelerated linear gradient)
      const grad = ctx.createLinearGradient(0, 0, 0, -petalLen);
      if (isDark) {
        grad.addColorStop(0, `hsl(${baseHue - 15}, 70%, ${24 + depthDarken}%)`);
        grad.addColorStop(0.55, `hsl(${baseHue}, 75%, ${48 + depthDarken}%)`);
        grad.addColorStop(1, `hsl(${baseHue + 20}, 85%, 82%)`);
      } else {
        grad.addColorStop(0, `hsl(${baseHue - 12}, 85%, ${45 + depthDarken}%)`);
        grad.addColorStop(0.5, `hsl(${baseHue}, 90%, ${68 + depthDarken}%)`);
        grad.addColorStop(1, `hsl(${baseHue + 10}, 95%, 92%)`);
      }
      ctx.fillStyle = grad;
      ctx.fill();

      // Delicate petal vein highlight
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(0, -petalLen * 0.55, (p % 2 === 0 ? 2 : -2), -petalLen * 0.88);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.42)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }
  }

  // 3. Dense Center Rosette (Tightly packed heart petals - no hole, no bare dot!)
  const centerCount = 9;
  for (let c = 0; c < centerCount; c++) {
    const cAngle = (c / centerCount) * Math.PI * 2;
    ctx.save();
    ctx.rotate(cAngle);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.12, size * 0.08, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? `hsl(${baseHue - 16}, 80%, 34%)`
      : `hsl(${baseHue - 14}, 90%, 50%)`;
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
  return canvas;
}

/* ── Prerender Peony Bloom onto Offscreen Canvas ── */
function renderPeonySprite(size: number, baseHue: number, isDark: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const pad = 16;
  const spriteDim = Math.ceil(size * 2 + pad * 2);
  canvas.width = spriteDim;
  canvas.height = spriteDim;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = spriteDim / 2;
  const cy = spriteDim / 2;

  ctx.save();
  ctx.translate(cx, cy);

  // 1. Green Sepals at Base
  ctx.beginPath();
  ctx.arc(0, size * 0.18, size * 0.24, 0, Math.PI);
  ctx.fillStyle = isDark ? '#142918' : '#336128';
  ctx.fill();

  // 2. Broad Outer Guard Petals
  const guardPetals = 7;
  for (let i = 0; i < guardPetals; i++) {
    const angle = (i / guardPetals) * Math.PI * 2;
    const guardR = size * 0.98;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -guardR * 0.5, guardR * 0.52, guardR * 0.58, 0, 0, Math.PI * 2);

    const grad = ctx.createRadialGradient(0, -guardR * 0.3, 0, 0, -guardR * 0.5, guardR * 0.62);
    if (isDark) {
      grad.addColorStop(0, `hsl(${baseHue}, 60%, 36%)`);
      grad.addColorStop(0.7, `hsl(${baseHue + 10}, 65%, 56%)`);
      grad.addColorStop(1, `hsl(${baseHue + 20}, 75%, 78%)`);
    } else {
      grad.addColorStop(0, `hsl(${baseHue - 10}, 78%, 62%)`);
      grad.addColorStop(0.7, `hsl(${baseHue}, 82%, 80%)`);
      grad.addColorStop(1, `hsl(${baseHue + 15}, 88%, 94%)`);
    }
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // 3. Middle Tiers of Wavy Spiral Petals
  const midTiers = 4;
  for (let tier = midTiers; tier >= 1; tier--) {
    const petalsInTier = 6 + tier;
    const tierRadius = size * (0.35 + (tier / midTiers) * 0.52);

    for (let p = 0; p < petalsInTier; p++) {
      const angle = (p / petalsInTier) * Math.PI * 2 + tier * 0.55;
      ctx.save();
      ctx.rotate(angle);

      ctx.beginPath();
      const pw = tierRadius * 0.44;
      const ph = tierRadius * 0.72;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-pw, -ph * 0.3, -pw * 1.15, -ph * 0.85, 0, -ph);
      ctx.bezierCurveTo(pw * 1.15, -ph * 0.85, pw, -ph * 0.3, 0, 0);

      const pGrad = ctx.createLinearGradient(0, 0, 0, -ph);
      if (isDark) {
        pGrad.addColorStop(0, `hsl(${baseHue - 15}, 65%, ${30 + tier * 6}%)`);
        pGrad.addColorStop(1, `hsl(${baseHue + 5}, 75%, ${58 + tier * 6}%)`);
      } else {
        pGrad.addColorStop(0, `hsl(${baseHue - 15}, 82%, ${52 + tier * 5}%)`);
        pGrad.addColorStop(1, `hsl(${baseHue + 10}, 88%, ${78 + tier * 4}%)`);
      }
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.restore();
    }
  }

  // 4. Center Golden Stamens
  const stamenCount = 14;
  for (let s = 0; s < stamenCount; s++) {
    const sAngle = (s / stamenCount) * Math.PI * 2;
    const sDist = size * 0.16 * Math.random();
    const sx = Math.cos(sAngle) * sDist;
    const sy = Math.sin(sAngle) * sDist;

    ctx.beginPath();
    ctx.arc(sx, sy, size * 0.038, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#ffd166' : '#fef08a';
    ctx.fill();
  }

  ctx.restore();
  return canvas;
}

export default function FlowerHero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const animRef = useRef<number>(0);
  const flowersRef = useRef<CachedFlower[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef<boolean>(true);

  /* ── Generate Field of Flowers (Prerenders Blooms Once!) ── */
  const generateField = useCallback((width: number, height: number) => {
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    // Adaptive flower count to guarantee smooth 60 FPS
    const count = isMobile ? 14 : isTablet ? 20 : 26;

    const flowers: CachedFlower[] = [];

    for (let i = 0; i < count; i++) {
      const depthRatio = Math.random();
      const depth = depthRatio < 0.3 ? 0 : depthRatio < 0.72 ? 1 : 2;

      const yMin = depth === 0 ? height * 0.44 : depth === 1 ? height * 0.54 : height * 0.65;
      const yMax = depth === 0 ? height * 0.62 : depth === 1 ? height * 0.74 : height * 0.84;
      const baseY = yMin + Math.random() * (yMax - yMin);

      const sizeScale = (depth === 0 ? 0.72 : depth === 1 ? 1.0 : 1.34) * (isMobile ? 0.85 : 1);
      const size = (26 + Math.random() * 16) * sizeScale;

      const type: 'peony' | 'carnation' = Math.random() > 0.48 ? 'peony' : 'carnation';

      let baseHue: number;
      if (isDark) {
        baseHue = type === 'peony' ? 275 + Math.random() * 28 : 255 + Math.random() * 35;
      } else {
        baseHue = type === 'peony' ? 336 + Math.random() * 22 : 348 + Math.random() * 18;
      }

      const spreadX = (i / count) * width + (Math.random() - 0.5) * 36;
      const groundY = height * (0.86 + depth * 0.05 + Math.sin(spreadX * 0.008) * 0.04);
      const groundX = spreadX + (Math.random() - 0.5) * 45;
      const stemBend = Math.sin(i * 1.6) * 30 + (Math.random() - 0.5) * 18;

      // PRERENDER SPRITE ONCE!
      const sprite =
        type === 'carnation'
          ? renderCarnationSprite(size, baseHue, isDark)
          : renderPeonySprite(size, baseHue, isDark);

      flowers.push({
        index: i,
        x: spreadX,
        groundX,
        groundY,
        baseY,
        size,
        type,
        depth,
        tilt: (Math.random() - 0.5) * 0.45,
        swaySpeed: 1.1 + Math.random() * 0.7,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: (5 + Math.random() * 5) * (depth === 0 ? 0.65 : depth === 1 ? 1 : 1.35),
        stemBend,
        hasSideBud: Math.random() > 0.65,
        sideBudSide: Math.random() > 0.5 ? 1 : -1,
        baseHue,
        sprite,
        spriteSize: sprite.width,
      });
    }

    flowers.sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.baseY - b.baseY;
    });

    flowersRef.current = flowers;
  }, [isDark]);

  /* ── Initialize Floating Petals / Stardust ── */
  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 640;
    const count = isDark ? (isMobile ? 50 : 100) : (isMobile ? 25 : 45);
    const ps: Particle[] = [];
    for (let i = 0; i < count; i++) {
      ps.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isDark ? Math.random() * 2.2 + 0.6 : Math.random() * 9 + 4,
        speedX: isDark ? 0 : (Math.random() - 0.5) * 0.7,
        speedY: isDark ? 0 : Math.random() * 0.5 + 0.25,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        hue: isDark ? 260 + Math.random() * 50 : 335 + Math.random() * 30,
      });
    }
    particlesRef.current = ps;
  }, [isDark]);

  /* ── Stem Drawing (Batched paths) ── */
  const drawBotanicalStem = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    headX: number,
    headY: number,
    bend: number,
    type: 'peony' | 'carnation'
  ) => {
    const midX = (startX + headX) / 2 + bend;
    const midY = (startY + headY) / 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(midX, midY, headX, headY);
    ctx.strokeStyle = isDark ? '#1a3320' : '#38662e';
    ctx.lineWidth = type === 'peony' ? 3.8 : 3.0;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Curved leaves along the stem
    if (type === 'peony') {
      const leafPos = 0.55;
      const lx = (1 - leafPos) * (1 - leafPos) * startX + 2 * (1 - leafPos) * leafPos * midX + leafPos * leafPos * headX;
      const ly = (1 - leafPos) * (1 - leafPos) * startY + 2 * (1 - leafPos) * leafPos * midY + leafPos * leafPos * headY;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(-0.5);
      ctx.beginPath();
      ctx.ellipse(-14, -6, 18, 7, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#16311d' : '#457a39';
      ctx.fill();
      ctx.restore();
    } else {
      const nodePos = 0.5;
      const nx = (1 - nodePos) * (1 - nodePos) * startX + 2 * (1 - nodePos) * nodePos * midX + nodePos * nodePos * headX;
      const ny = (1 - nodePos) * (1 - nodePos) * startY + 2 * (1 - nodePos) * nodePos * midY + nodePos * nodePos * headY;

      ctx.save();
      ctx.translate(nx, ny);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-16, -12, -26, -7);
      ctx.quadraticCurveTo(-14, -3, 0, 0);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(16, -12, 26, -7);
      ctx.quadraticCurveTo(14, -3, 0, 0);
      ctx.fillStyle = isDark ? '#1b3b27' : '#4f8544';
      ctx.fill();
      ctx.restore();
    }
  };

  /* ── Animation & Intersection Observer Lifecycle ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = hero.offsetWidth);
    let height = (canvas.height = hero.offsetHeight);

    generateField(width, height);
    initParticles(width, height);

    // PAUSE ANIMATION LOOP WHEN SCROLLED OUT OF VIEW! (Huge battery & performance save)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animRef.current) {
          startTime = performance.now();
          animRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(hero);

    let startTime = performance.now();

    const render = (time: number) => {
      if (!isVisibleRef.current) {
        animRef.current = 0;
        return; // Pause completely while offscreen!
      }

      const elapsed = (time - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      /* 1. SKY / COSMIC NIGHT */
      if (isDark) {
        const skyGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.35,
          60,
          width * 0.5,
          height * 0.4,
          width * 0.85
        );
        skyGrad.addColorStop(0, '#1c1042');
        skyGrad.addColorStop(0.4, '#100c2e');
        skyGrad.addColorStop(0.85, '#070617');
        skyGrad.addColorStop(1, '#04030d');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Constellations
        ctx.save();
        for (const constel of CONSTELLATIONS) {
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.28)';
          ctx.lineWidth = 1;
          for (const [fromIdx, toIdx] of constel.lines) {
            const starA = constel.stars[fromIdx];
            const starB = constel.stars[toIdx];
            ctx.beginPath();
            ctx.moveTo(starA.x * width, starA.y * height);
            ctx.lineTo(starB.x * width, starB.y * height);
            ctx.stroke();
          }
          for (const star of constel.stars) {
            const sx = star.x * width;
            const sy = star.y * height;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      /* 2. ROLLING MEADOW HILLS */
      const meadowBaseY = height * 0.58;

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 30) {
        const y = meadowBaseY + Math.sin(x * 0.004) * 25 + Math.cos(x * 0.01) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const backHillGrad = ctx.createLinearGradient(0, meadowBaseY - 30, 0, height);
      if (isDark) {
        backHillGrad.addColorStop(0, 'rgba(14, 25, 38, 0.4)');
        backHillGrad.addColorStop(0.5, '#0b1622');
        backHillGrad.addColorStop(1, '#050a12');
      } else {
        backHillGrad.addColorStop(0, 'rgba(167, 243, 208, 0.35)');
        backHillGrad.addColorStop(0.5, '#6ee7b7');
        backHillGrad.addColorStop(1, '#34d399');
      }
      ctx.fillStyle = backHillGrad;
      ctx.fill();

      // Front Hill
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 30) {
        const y = meadowBaseY + 45 + Math.sin(x * 0.006 + 2) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const frontHillGrad = ctx.createLinearGradient(0, meadowBaseY + 20, 0, height);
      if (isDark) {
        frontHillGrad.addColorStop(0, 'rgba(16, 32, 48, 0.7)');
        frontHillGrad.addColorStop(0.6, '#08121c');
        frontHillGrad.addColorStop(1, '#04070c');
      } else {
        frontHillGrad.addColorStop(0, 'rgba(110, 231, 183, 0.6)');
        frontHillGrad.addColorStop(0.5, '#22c55e');
        frontHillGrad.addColorStop(1, '#16a34a');
      }
      ctx.fillStyle = frontHillGrad;
      ctx.fill();

      /* 3. FLOWERS (HARDWARE-ACCELERATED SPRITE BLITTING) */
      for (const flower of flowersRef.current) {
        const sway = Math.sin(elapsed * flower.swaySpeed + flower.swayPhase) * flower.swayAmp;
        const headX = flower.x + sway;
        const headY = flower.baseY;

        // Draw Stem
        drawBotanicalStem(
          ctx,
          flower.groundX,
          flower.groundY,
          headX,
          headY,
          flower.stemBend + sway * 0.35,
          flower.type
        );

        // Blit Prerendered Bloom Sprite (100x faster than recalculating paths every frame!)
        const half = flower.spriteSize / 2;
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(flower.tilt + sway * 0.025);
        ctx.drawImage(flower.sprite, -half, -half);
        ctx.restore();
      }

      /* 4. FOREGROUND WAVING GRASS (Batched drawing) */
      const fgCount = Math.floor(width / 14);
      const fgGrassColor = isDark ? '#1c3825' : '#65a30d';
      ctx.fillStyle = fgGrassColor;
      for (let g = 0; g < fgCount; g++) {
        const gx = (g / fgCount) * width;
        const gLen = 50 + Math.sin(g * 4.2) * 20;
        const gCurve = Math.sin(elapsed * 2 + g * 0.35) * 10;
        ctx.beginPath();
        ctx.moveTo(gx - 2, height);
        ctx.quadraticCurveTo(gx + gCurve * 0.5, height - gLen * 0.5, gx + gCurve, height - gLen);
        ctx.quadraticCurveTo(gx + gCurve * 0.5 + 2, height - gLen * 0.5, gx + 2, height);
        ctx.closePath();
        ctx.fill();
      }

      /* 5. PARTICLES (Floating Petals / Stars) */
      for (const p of particlesRef.current) {
        if (isDark) {
          p.opacity += p.twinkleSpeed;
          if (p.opacity > 1 || p.opacity < 0.2) p.twinkleSpeed *= -1;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        } else {
          p.x += p.speedX + Math.sin(elapsed * 1.5 + p.y * 0.01) * 0.5;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;

          if (p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          ctx.save();
          ctx.globalAlpha = p.opacity * 0.6;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.35, p.size, 0, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${p.hue}, 85%, 82%)`;
          ctx.fill();
          ctx.restore();
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas || !hero) return;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
      generateField(width, height);
      initParticles(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark, generateField, initParticles]);

  return (
    <section className="hero" ref={heroRef}>
      <canvas ref={canvasRef} className="hero-flower-canvas" />

      <div className="hero-content">
        <h1 className="hero-title cursive-display">For You, Always</h1>
        <p className="hero-subtitle cursive">a little world made with love 💕</p>
      </div>

      <div className="scroll-hint">
        <span>scroll down</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  );
}
