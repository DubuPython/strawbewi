import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ── Zodiac Constellation Data for Dark Mode ── */
interface ConstellationStar {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

interface Constellation {
  name: string;
  symbol: string;
  stars: ConstellationStar[];
  lines: [number, number][];
}

const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Ursa Minor',
    symbol: '✨',
    stars: [
      { x: 0.15, y: 0.12, size: 2.5, alpha: 0.9 },
      { x: 0.18, y: 0.16, size: 1.8, alpha: 0.75 },
      { x: 0.22, y: 0.18, size: 1.6, alpha: 0.7 },
      { x: 0.25, y: 0.22, size: 2.0, alpha: 0.8 },
      { x: 0.23, y: 0.27, size: 1.7, alpha: 0.75 },
      { x: 0.28, y: 0.29, size: 1.9, alpha: 0.8 },
      { x: 0.30, y: 0.24, size: 1.8, alpha: 0.75 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    name: 'Cassiopeia',
    symbol: '👑',
    stars: [
      { x: 0.70, y: 0.10, size: 2.2, alpha: 0.9 },
      { x: 0.75, y: 0.15, size: 2.0, alpha: 0.85 },
      { x: 0.80, y: 0.12, size: 2.3, alpha: 0.9 },
      { x: 0.85, y: 0.18, size: 2.1, alpha: 0.85 },
      { x: 0.90, y: 0.13, size: 2.2, alpha: 0.9 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: 'Orion',
    symbol: '🏹',
    stars: [
      { x: 0.80, y: 0.26, size: 2.8, alpha: 0.95 },
      { x: 0.91, y: 0.28, size: 2.2, alpha: 0.85 },
      { x: 0.84, y: 0.34, size: 2.0, alpha: 0.9 },
      { x: 0.86, y: 0.35, size: 2.0, alpha: 0.9 },
      { x: 0.88, y: 0.36, size: 2.0, alpha: 0.9 },
      { x: 0.81, y: 0.44, size: 2.2, alpha: 0.85 },
      { x: 0.92, y: 0.42, size: 2.9, alpha: 1.0 },
    ],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
  },
];

/* ── Flower Definition ── */
interface Flower {
  index: number;
  x: number;
  groundX: number;
  groundY: number;
  baseY: number;
  size: number;
  type: 'peony' | 'carnation';
  depth: number; // 0 = back, 1 = mid, 2 = front
  baseHue: number;
  tilt: number;
  swaySpeed: number;
  swayPhase: number;
  swayAmp: number;
  stemBend: number;
  hasSideBud: boolean;
  sideBudSide: number;
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
  aspect: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function FlowerHero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const animRef = useRef<number>(0);
  const flowersRef = useRef<Flower[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarRef = useRef<ShootingStar>({
    x: 0,
    y: 0,
    length: 120,
    speed: 14,
    angle: Math.PI / 4,
    opacity: 0,
    active: false,
  });

  /* ── Generate Meadow Flowers with Natural Curves & Depths ── */
  const generateField = useCallback((width: number, height: number) => {
    const flowers: Flower[] = [];
    const count = Math.max(26, Math.floor(width / 28));

    for (let i = 0; i < count; i++) {
      const depthRatio = Math.random();
      const depth = depthRatio < 0.3 ? 0 : depthRatio < 0.72 ? 1 : 2;

      // Natural vertical stagger across the meadow
      const yMin = depth === 0 ? height * 0.44 : depth === 1 ? height * 0.54 : height * 0.66;
      const yMax = depth === 0 ? height * 0.62 : depth === 1 ? height * 0.75 : height * 0.85;
      const baseY = yMin + Math.random() * (yMax - yMin);

      // Flower head size according to depth
      const sizeScale = depth === 0 ? 0.72 : depth === 1 ? 1.0 : 1.38;
      const size = (28 + Math.random() * 18) * sizeScale;

      const type: 'peony' | 'carnation' = Math.random() > 0.48 ? 'peony' : 'carnation';

      // Colors:
      // Light: Romantic Pink fantasy palette (blush, soft rose, cream, coral, wine)
      // Dark: Cosmic Astrology palette (moonlit violet, ethereal indigo, silver lilac, starlight pink)
      let baseHue: number;
      if (isDark) {
        baseHue = type === 'peony' ? 275 + Math.random() * 28 : 255 + Math.random() * 35;
      } else {
        baseHue = type === 'peony' ? 336 + Math.random() * 22 : 348 + Math.random() * 18;
      }

      // Staggered horizontal distribution with organic spacing
      const spreadX = (i / count) * width + (Math.random() - 0.5) * 36;

      // Ground origin points vary across undulating meadow terrain
      const groundY = height * (0.86 + (depth * 0.05) + Math.sin(spreadX * 0.008) * 0.04);
      const groundX = spreadX + (Math.random() - 0.5) * 45;

      // Natural organic stem bend (gentle curve left or right, not rigid sticks!)
      const stemBend = (Math.sin(i * 1.6) * 32 + (Math.random() - 0.5) * 20);

      flowers.push({
        index: i,
        x: spreadX,
        groundX,
        groundY,
        baseY,
        size,
        type,
        depth,
        baseHue,
        tilt: (Math.random() - 0.5) * 0.45,
        swaySpeed: 1.1 + Math.random() * 0.7,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: (5 + Math.random() * 6) * (depth === 0 ? 0.65 : depth === 1 ? 1 : 1.35),
        stemBend,
        hasSideBud: Math.random() > 0.65,
        sideBudSide: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Sort by depth and baseY so background renders behind foreground
    flowers.sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.baseY - b.baseY;
    });

    flowersRef.current = flowers;
  }, [isDark]);

  /* ── Initialize Floating Petals & Stardust Particles ── */
  const initParticles = useCallback((width: number, height: number) => {
    const count = isDark ? 160 : 50;
    const ps: Particle[] = [];
    for (let i = 0; i < count; i++) {
      ps.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isDark ? Math.random() * 2.2 + 0.6 : Math.random() * 10 + 5,
        speedX: isDark ? 0 : (Math.random() - 0.5) * 0.8,
        speedY: isDark ? 0 : Math.random() * 0.6 + 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        hue: isDark ? 260 + Math.random() * 50 : 335 + Math.random() * 30,
        aspect: Math.random() * 0.4 + 0.3,
      });
    }
    particlesRef.current = ps;
  }, [isDark]);

  /* ── 1. REALISTIC, COMPLETE 360° CARNATION BLOOM RENDERER ── */
  const drawCarnationBloom = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    baseHue: number,
    tilt: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Green Calyx / Sepal Cup behind the bloom
    const calyxH = size * 0.4;
    const calyxW = size * 0.32;
    ctx.beginPath();
    ctx.moveTo(-calyxW * 0.45, size * 0.05);
    ctx.quadraticCurveTo(-calyxW * 0.55, calyxH * 0.8, 0, calyxH + 4);
    ctx.quadraticCurveTo(calyxW * 0.55, calyxH * 0.8, calyxW * 0.45, size * 0.05);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#142918' : '#336128';
    ctx.fill();

    // 6 CONCENTRIC TIERS OF DENSELY PACKED RUFFLED PETALS RADIATING IN ALL 360 DEGREES!
    const tiers = 6;
    for (let tier = tiers; tier >= 1; tier--) {
      // Tier radius scales from inner to outer
      const tierRadius = size * (0.28 + (tier / tiers) * 0.72);
      // Number of petals in tier
      const petalsInTier = 7 + tier * 2;
      const tierOffset = tier * 0.48; // Interlocking spiral offset
      const depthDarken = (tiers - tier) * 5;

      for (let p = 0; p < petalsInTier; p++) {
        // FULL 360-DEGREE ANGLE!
        const angle = (p / petalsInTier) * Math.PI * 2 + tierOffset + Math.sin(p * 3.5 + tier) * 0.14;
        const petalLen = tierRadius * (0.85 + Math.sin(p * 4.2) * 0.15);
        const petalWidth = (size * 0.32) * (0.55 + (tier / tiers) * 0.5);

        ctx.save();
        ctx.rotate(angle);

        // Crinkled, ruffled, serrated carnation petal
        ctx.beginPath();
        ctx.moveTo(0, 0);

        const leftCtrlX = -petalWidth * 0.55;
        const leftCtrlY = -petalLen * 0.5;
        const rightCtrlX = petalWidth * 0.55;
        const rightCtrlY = -petalLen * 0.5;

        // Left curve
        ctx.bezierCurveTo(leftCtrlX, leftControl(leftCtrlY), -petalWidth * 0.85, -petalLen * 0.82, -petalWidth * 0.65, -petalLen);

        // Distinct jagged carnation fringe edge (5 serrations)
        const serrations = 5;
        for (let s = 1; s <= serrations; s++) {
          const t = s / serrations;
          const sx = -petalWidth * 0.65 + t * (petalWidth * 1.3);
          const sy = -petalLen - ((s % 2 === 1) ? (3.5 * (tier / tiers) + 1.8) : -(1.5));
          ctx.lineTo(sx, sy);
        }

        // Right curve back to center
        ctx.bezierCurveTo(petalWidth * 0.85, -petalLen * 0.82, rightCtrlX, rightControl(rightCtrlY), 0, 0);
        ctx.closePath();

        // Shading Gradient: Rich vibrant magenta/rose at fold, softening to frosted porcelain tips
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
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(180, 40, 80, 0.16)';
        ctx.shadowBlur = 3;
        ctx.fill();

        // Fine translucent petal rib highlight
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(0, -petalLen * 0.55, (p % 2 === 0 ? 2 : -2), -petalLen * 0.88);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.42)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }
    }

    // Dense Center Rosette: Tightly crumpled heart petals (NO hole, NO missing edges!)
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

    function leftControl(val: number) { return val; }
    function rightControl(val: number) { return val; }
  };

  /* ── 2. REALISTIC, OPULENT PEONY BLOOM RENDERER ── */
  const drawPeonyBloom = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    baseHue: number,
    tilt: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Green sepal base
    ctx.beginPath();
    ctx.arc(0, size * 0.18, size * 0.24, 0, Math.PI);
    ctx.fillStyle = isDark ? '#142918' : '#336128';
    ctx.fill();

    // 1. Broad Outer Guard Petals (large cupped petals forming the voluminous base)
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
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(180, 50, 90, 0.22)';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();
    }

    // 2. Middle Tiers of Ruffled Wavy Spiral Petals
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

    // 3. Center Golden Stamens & Tender Heart Petals
    const stamenCount = 16;
    for (let s = 0; s < stamenCount; s++) {
      const sAngle = (s / stamenCount) * Math.PI * 2;
      const sDist = size * 0.16 * Math.random();
      const sx = Math.cos(sAngle) * sDist;
      const sy = Math.sin(sAngle) * sDist;

      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.038, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#ffd166' : '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 4;
      ctx.fill();
    }

    ctx.restore();
  };

  /* ── 3. NATURAL CURVED STEM WITH BRANCHING BUDS & LEAVES ── */
  const drawBotanicalStem = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    headX: number,
    headY: number,
    bend: number,
    type: 'peony' | 'carnation',
    hasSideBud: boolean,
    sideBudSide: number,
    baseHue: number
  ) => {
    ctx.save();

    // Smooth organic S-curve or gentle arc (not a ruler line!)
    const midX = (startX + headX) / 2 + bend;
    const midY = (startY + headY) / 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(midX, midY, headX, headY);

    ctx.strokeStyle = isDark ? '#1a3320' : '#38662e';
    ctx.lineWidth = type === 'peony' ? 4.2 : 3.2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Foliage & Side Buds along the stem
    if (type === 'peony') {
      // Peony broad 3-lobed leaves
      const leafPos1 = 0.58;
      const lx1 = (1 - leafPos1) * (1 - leafPos1) * startX + 2 * (1 - leafPos1) * leafPos1 * midX + leafPos1 * leafPos1 * headX;
      const ly1 = (1 - leafPos1) * (1 - leafPos1) * startY + 2 * (1 - leafPos1) * leafPos1 * midY + leafPos1 * leafPos1 * headY;

      ctx.save();
      ctx.translate(lx1, ly1);
      ctx.rotate(-0.5);
      ctx.beginPath();
      ctx.ellipse(-16, -6, 20, 8, -0.2, 0, Math.PI * 2);
      ctx.ellipse(-26, -15, 16, 7, -0.6, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#16311d' : '#457a39';
      ctx.fill();
      ctx.restore();

      const leafPos2 = 0.38;
      const lx2 = (1 - leafPos2) * (1 - leafPos2) * startX + 2 * (1 - leafPos2) * leafPos2 * midX + leafPos2 * leafPos2 * headX;
      const ly2 = (1 - leafPos2) * (1 - leafPos2) * startY + 2 * (1 - leafPos2) * leafPos2 * midY + leafPos2 * leafPos2 * headY;

      ctx.save();
      ctx.translate(lx2, ly2);
      ctx.rotate(0.5);
      ctx.beginPath();
      ctx.ellipse(16, -6, 20, 8, 0.2, 0, Math.PI * 2);
      ctx.ellipse(26, -15, 16, 7, 0.6, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#16311d' : '#457a39';
      ctx.fill();
      ctx.restore();
    } else {
      // Carnation slender linear leaves clasping stem at botanical nodes
      const nodes = [0.4, 0.65];
      for (const n of nodes) {
        const nx = (1 - n) * (1 - n) * startX + 2 * (1 - n) * n * midX + n * n * headX;
        const ny = (1 - n) * (1 - n) * startY + 2 * (1 - n) * n * midY + n * n * headY;

        // Swollen node joint
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#1e4027' : '#4a8240';
        ctx.fill();

        // Opposite pair of graceful curved leaves
        ctx.save();
        ctx.translate(nx, ny);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-18, -14, -32, -8);
        ctx.quadraticCurveTo(-16, -4, 0, 0);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(18, -14, 32, -8);
        ctx.quadraticCurveTo(16, -4, 0, 0);
        ctx.fillStyle = isDark ? '#1b3b27' : '#4f8544';
        ctx.fill();
        ctx.restore();
      }
    }

    // Branching side flower bud (adds realistic floral charm)
    if (hasSideBud) {
      const budPos = 0.52;
      const bx = (1 - budPos) * (1 - budPos) * startX + 2 * (1 - budPos) * budPos * midX + budPos * budPos * headX;
      const by = (1 - budPos) * (1 - budPos) * startY + 2 * (1 - budPos) * budPos * midY + budPos * budPos * headY;
      const budTargetX = bx + sideBudSide * 26;
      const budTargetY = by - 22;

      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + sideBudSide * 10, by - 12, budTargetX, budTargetY);
      ctx.strokeStyle = isDark ? '#1a3320' : '#38662e';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Little green and pink budding calyx
      ctx.beginPath();
      ctx.ellipse(budTargetX, budTargetY, 5, 8, sideBudSide * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#1a3322' : '#3d6e32';
      ctx.fill();

      // Peeking pink petals in bud
      ctx.beginPath();
      ctx.arc(budTargetX + sideBudSide * 2, budTargetY - 4, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `hsl(${baseHue}, 75%, 65%)` : `hsl(${baseHue}, 85%, 72%)`;
      ctx.fill();
    }

    ctx.restore();
  };

  /* ── 4. GRASS BLADES FOR MEADOW ── */
  const drawGrassBlade = (
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    height: number,
    curve: number,
    color: string
  ) => {
    ctx.beginPath();
    ctx.moveTo(x - 2.5, baseY);
    ctx.quadraticCurveTo(x + curve * 0.5, baseY - height * 0.5, x + curve, baseY - height);
    ctx.quadraticCurveTo(x + curve * 0.5 + 2.5, baseY - height * 0.5, x + 2.5, baseY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  /* ── Main Canvas Render Loop ── */
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

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001; // seconds

      ctx.clearRect(0, 0, width, height);

      /* ────────────────────────────────────────────────────────
         1. SKY & ASTRONOMY BACKGROUND (Dark Mode)
         ──────────────────────────────────────────────────────── */
      if (isDark) {
        // Deep cosmic space gradient
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

        // Constellation lines & stars
        ctx.save();
        for (const constel of CONSTELLATIONS) {
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.28)';
          ctx.lineWidth = 1;

          // Lines
          for (const [fromIdx, toIdx] of constel.lines) {
            const starA = constel.stars[fromIdx];
            const starB = constel.stars[toIdx];
            ctx.beginPath();
            ctx.moveTo(starA.x * width, starA.y * height);
            ctx.lineTo(starB.x * width, starB.y * height);
            ctx.stroke();
          }

          // Stars
          for (const star of constel.stars) {
            const sx = star.x * width;
            const sy = star.y * height;
            const pulse = 1 + Math.sin(elapsed * 2 + sx) * 0.25;

            ctx.beginPath();
            ctx.arc(sx, sy, star.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 8;
            ctx.fill();
          }
        }
        ctx.restore();

        // Shooting Star
        const ss = shootingStarRef.current;
        if (!ss.active && Math.random() < 0.008) {
          ss.active = true;
          ss.x = Math.random() * width * 0.7;
          ss.y = Math.random() * height * 0.3;
          ss.opacity = 1;
        }
        if (ss.active) {
          ctx.save();
          ctx.beginPath();
          const tailX = ss.x - Math.cos(ss.angle) * ss.length;
          const tailY = ss.y - Math.sin(ss.angle) * ss.length;
          const ssGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
          ssGrad.addColorStop(0, 'rgba(255,255,255,0)');
          ssGrad.addColorStop(1, `rgba(255,255,255,${ss.opacity})`);
          ctx.strokeStyle = ssGrad;
          ctx.lineWidth = 2;
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(ss.x, ss.y);
          ctx.stroke();
          ctx.restore();

          ss.x += Math.cos(ss.angle) * ss.speed;
          ss.y += Math.sin(ss.angle) * ss.speed;
          ss.opacity -= 0.02;
          if (ss.opacity <= 0) ss.active = false;
        }
      }

      /* ────────────────────────────────────────────────────────
         2. ROLLING MEADOW HILLS (Soft continuous gradients, NO harsh bar)
         ──────────────────────────────────────────────────────── */
      const meadowBaseY = height * 0.58;

      // Back Hill
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 20) {
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

      // Front Rolling Hill
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 20) {
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

      /* ────────────────────────────────────────────────────────
         3. BACKGROUND GRASS BLADES
         ──────────────────────────────────────────────────────── */
      const bgBladeCount = Math.floor(width / 7);
      const bgGrassColor = isDark ? '#14251a' : '#4d7c0f';
      for (let g = 0; g < bgBladeCount; g++) {
        const gx = (g / bgBladeCount) * width;
        const gLen = 45 + Math.sin(g * 3.2) * 18;
        const gCurve = Math.sin(elapsed * 1.5 + g * 0.4) * 9 + (g % 2 === 0 ? 6 : -6);
        drawGrassBlade(ctx, gx, height * 0.88, gLen, gCurve, bgGrassColor);
      }

      /* ────────────────────────────────────────────────────────
         4. FLOWERS (CURVED STEMS + COMPLETE 360° BLOOMS)
         ──────────────────────────────────────────────────────── */
      for (const flower of flowersRef.current) {
        // Natural wind sway calculation
        const sway = Math.sin(elapsed * flower.swaySpeed + flower.swayPhase) * flower.swayAmp;
        const headX = flower.x + sway;
        const headY = flower.baseY;

        // Draw natural curved botanical stem
        drawBotanicalStem(
          ctx,
          flower.groundX,
          flower.groundY,
          headX,
          headY,
          flower.stemBend + sway * 0.35,
          flower.type,
          flower.hasSideBud,
          flower.sideBudSide,
          flower.baseHue
        );

        // Draw full, lush bloom
        if (flower.type === 'carnation') {
          drawCarnationBloom(ctx, headX, headY, flower.size, flower.baseHue, flower.tilt + sway * 0.02);
        } else {
          drawPeonyBloom(ctx, headX, headY, flower.size, flower.baseHue, flower.tilt + sway * 0.02);
        }
      }

      /* ────────────────────────────────────────────────────────
         5. FOREGROUND GRASS BLADES (Overlapping blooms for depth)
         ──────────────────────────────────────────────────────── */
      const fgBladeCount = Math.floor(width / 5);
      const fgGrassColor = isDark ? '#1c3825' : '#65a30d';
      for (let g = 0; g < fgBladeCount; g++) {
        const gx = (g / fgBladeCount) * width;
        const gLen = 65 + Math.sin(g * 4.8) * 25;
        const gCurve = Math.sin(elapsed * 2 + g * 0.3) * 12 + (g % 3 === 0 ? 8 : -8);
        drawGrassBlade(ctx, gx, height, gLen, gCurve, fgGrassColor);
      }

      /* ────────────────────────────────────────────────────────
         6. FLOATING PETALS / STARDUST PARTICLES
         ──────────────────────────────────────────────────────── */
      for (const p of particlesRef.current) {
        p.opacity += p.twinkleSpeed;
        if (p.opacity > 1 || p.opacity < 0.2) p.twinkleSpeed *= -1;

        if (isDark) {
          // Starlight dots with soft atmospheric glow
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = `hsl(${p.hue}, 80%, 75%)`;
          ctx.shadowBlur = p.size * 4;
          ctx.fill();
          ctx.restore();
        } else {
          // Falling, tumbling soft petals
          p.x += p.speedX + Math.sin(elapsed * 1.5 + p.y * 0.01) * 0.6;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          ctx.save();
          ctx.globalAlpha = p.opacity * 0.65;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * p.aspect, p.size, 0, 0, Math.PI * 2);

          const petalGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          petalGrad.addColorStop(0, `hsla(${p.hue}, 90%, 95%, 0.8)`);
          petalGrad.addColorStop(0.8, `hsla(${p.hue}, 85%, 78%, 0.6)`);
          petalGrad.addColorStop(1, `hsla(${p.hue - 15}, 80%, 65%, 0.2)`);
          ctx.fillStyle = petalGrad;
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
