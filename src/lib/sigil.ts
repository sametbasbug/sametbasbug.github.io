/**
 * Sigil — bir metinden (yazı başlığı) türetilen deterministik diyagram.
 * Aynı başlık her zaman aynı şekli verir.
 *
 * Beş arketip var: yörünge, spiral, takımyıldız, dalga ve kafes. Hepsi aynı
 * görsel dili paylaşıyor (ince çizgi, kor–tül gradyanı, merkezde ışık) ama
 * yan yana geldiklerinde birbirinden ayırt ediliyor.
 *
 * Hem sayfada (CSS değişkeni renkleriyle) hem OG görselinde (sabit renklerle)
 * kullanılabilsin diye saf bir fonksiyon.
 */

export type Archetype = "orbit" | "spiral" | "constellation" | "wave" | "lattice";

export const ARCHETYPES: Archetype[] = [
  "orbit",
  "spiral",
  "constellation",
  "wave",
  "lattice",
];

export interface SigilOptions {
  /** Detay yoğunluğunu çarpar; büyük yüzeylerde artırmak için. */
  detail?: number;
  ember?: string;
  veil?: string;
  /** Dış <svg> etiketi olmadan yalnızca içerik döndür. */
  inner?: boolean;
  class?: string;
  style?: string;
  /** Arketipi elle seç; verilmezse tohumdan belirlenir. */
  archetype?: Archetype;
  /** Çizgi kalınlığı çarpanı; büyük gösterimlerde 1.5–2 arası iyi. */
  weight?: number;
}

type Rnd = () => number;

const n = (value: number) => Number(value.toFixed(2));

/** Bir metni 32 bitlik bir sayıya indirger (FNV-1a). */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Tohumdan beslenen deterministik sayı üreteci (mulberry32). */
function generator(seed: number): Rnd {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sigilId(seed: string): string {
  return `s${hash(seed).toString(36)}`;
}

export function archetypeOf(seed: string): Archetype {
  // Hash'i bir kez daha karıştırıyoruz: ham FNV-1a'nın alt bitleri beşe
  // bölündüğünde dengesiz dağılıyor ve aynı arketip üst üste geliyordu.
  let h = hash(seed);
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return ARCHETYPES[(h >>> 0) % ARCHETYPES.length];
}

/* ------------------------------------------------------------------
   Arketipler — her biri 200×200 alanda, merkezi (100,100)
   ------------------------------------------------------------------ */

interface Ctx {
  rnd: Rnd;
  uid: string;
  ember: string;
  veil: string;
  detail: number;
  /** Çizgi kalınlığı çarpanı: büyük yüzeylerde çizgiler incelmesin diye. */
  weight: number;
}

/** İç içe eliptik yörüngeler, üzerlerinde gövdeler ve dışa doğru ışınlar. */
function orbit({ rnd, uid, ember, veil, detail, weight: w }: Ctx): string {
  const rings = Array.from({ length: 3 + Math.floor(rnd() * 3) }, (_, i) => ({
    r: 22 + i * (13 + rnd() * 12),
    rot: rnd() * 360,
    squash: 0.24 + rnd() * 0.62,
    dash: rnd() > 0.55 ? `${1 + rnd() * 3} ${2 + rnd() * 6}` : "none",
    op: 0.28 + rnd() * 0.5,
  }));

  const bodies = rings.map((ring) => {
    const t = rnd() * Math.PI * 2;
    return {
      x: 100 + Math.cos(t) * ring.r,
      y: 100 + Math.sin(t) * ring.r * ring.squash,
      rot: ring.rot,
      size: 1.6 + rnd() * 3.4,
    };
  });

  const rays = Array.from(
    { length: Math.round((5 + Math.floor(rnd() * 7)) * detail) },
    () => {
      const a = rnd() * Math.PI * 2;
      const start = 46 + rnd() * 18;
      const end = start + 10 + rnd() * 46;
      return {
        x1: 100 + Math.cos(a) * start,
        y1: 100 + Math.sin(a) * start,
        x2: 100 + Math.cos(a) * end,
        y2: 100 + Math.sin(a) * end,
        op: 0.1 + rnd() * 0.3,
      };
    },
  );

  return `
    ${rays
      .map(
        (r) =>
          `<line x1="${n(r.x1)}" y1="${n(r.y1)}" x2="${n(r.x2)}" y2="${n(r.y2)}" stroke="${veil}" stroke-width="${n(0.6 * w)}" stroke-opacity="${n(r.op)}"/>`,
      )
      .join("")}
    ${rings
      .map(
        (ring) =>
          `<ellipse cx="100" cy="100" rx="${n(ring.r)}" ry="${n(ring.r * ring.squash)}" fill="none" stroke="url(#${uid}-line)" stroke-width="${n(0.9 * w)}" stroke-opacity="${n(ring.op)}" stroke-dasharray="${ring.dash}" transform="rotate(${n(ring.rot)} 100 100)"/>`,
      )
      .join("")}
    ${bodies
      .map(
        (b) =>
          `<circle cx="${n(b.x)}" cy="${n(b.y)}" r="${n(b.size)}" fill="${ember}" transform="rotate(${n(b.rot)} 100 100)"/>`,
      )
      .join("")}`;
}

/** Merkezden açılan logaritmik spiral kolları. */
function spiral({ rnd, uid, ember, veil, detail, weight: w }: Ctx): string {
  const arms = 2 + Math.floor(rnd() * 3);
  const turns = 1.6 + rnd() * 1.4;
  const growth = 0.17 + rnd() * 0.1;
  const steps = Math.round(58 * detail);
  const offset = rnd() * Math.PI * 2;

  const paths: string[] = [];
  const dots: string[] = [];

  for (let arm = 0; arm < arms; arm++) {
    const base = offset + (arm / arms) * Math.PI * 2;
    let d = "";

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * Math.PI * 2;
      const r = 7 * Math.exp(growth * t);
      if (r > 96) break;
      const x = 100 + Math.cos(t + base) * r;
      const y = 100 + Math.sin(t + base) * r * 0.9;
      d += `${i === 0 ? "M" : "L"}${n(x)} ${n(y)}`;
    }

    paths.push(
      `<path d="${d}" fill="none" stroke="url(#${uid}-line)" stroke-width="${n(1.05 * w)}" stroke-opacity="${n(0.45 + rnd() * 0.42)}" stroke-linecap="round"/>`,
    );

    // Kolun ucuna yakın birer gövde
    const tEnd = turns * Math.PI * 2 * (0.62 + rnd() * 0.3);
    const rEnd = Math.min(92, 7 * Math.exp(growth * tEnd));
    dots.push(
      `<circle cx="${n(100 + Math.cos(tEnd + base) * rEnd)}" cy="${n(100 + Math.sin(tEnd + base) * rEnd * 0.9)}" r="${n(1.8 + rnd() * 2.6)}" fill="${ember}"/>`,
    );
  }

  // Spirali saran ince bir çember
  const halo = 62 + rnd() * 22;

  return `
    <circle cx="100" cy="100" r="${n(halo)}" fill="none" stroke="${veil}" stroke-width="${n(0.5 * w)}" stroke-opacity="0.3" stroke-dasharray="1 5"/>
    ${paths.join("")}
    ${dots.join("")}`;
}

/** Dağınık yıldızlar ve aralarındaki bağlantılar. */
function constellation({ rnd, uid, ember, veil, detail, weight: w }: Ctx): string {
  const count = Math.round((11 + Math.floor(rnd() * 7)) * detail);

  const stars = Array.from({ length: count }, () => {
    const a = rnd() * Math.PI * 2;
    // Merkeze doğru seyrelt: karekök dağılımı kenarları besler
    const r = 16 + Math.sqrt(rnd()) * 74;
    return {
      x: 100 + Math.cos(a) * r,
      y: 100 + Math.sin(a) * r * (0.72 + rnd() * 0.28),
      size: 0.9 + rnd() * 2.6,
      bright: rnd() > 0.68,
    };
  });

  // Her yıldızı en yakın komşusuna bağla — tekrar eden çizgileri ele
  const links = new Set<string>();
  const lines: string[] = [];

  stars.forEach((star, i) => {
    let best = -1;
    let bestDistance = Infinity;

    stars.forEach((other, j) => {
      if (i === j) return;
      const distance = (star.x - other.x) ** 2 + (star.y - other.y) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = j;
      }
    });

    if (best < 0) return;
    const key = i < best ? `${i}-${best}` : `${best}-${i}`;
    if (links.has(key)) return;
    links.add(key);

    lines.push(
      `<line x1="${n(star.x)}" y1="${n(star.y)}" x2="${n(stars[best].x)}" y2="${n(stars[best].y)}" stroke="url(#${uid}-line)" stroke-width="${n(0.6 * w)}" stroke-opacity="0.5"/>`,
    );
  });

  return `
    <circle cx="100" cy="100" r="${n(78 + rnd() * 14)}" fill="none" stroke="${veil}" stroke-width="${n(0.5 * w)}" stroke-opacity="0.22"/>
    ${lines.join("")}
    ${stars
      .map(
        (s) =>
          `<circle cx="${n(s.x)}" cy="${n(s.y)}" r="${n(s.size)}" fill="${s.bright ? ember : veil}" fill-opacity="${s.bright ? 1 : 0.75}"/>`,
      )
      .join("")}`;
}

/** Üst üste binen sinüs eğrileri — topografik bir kesit gibi. */
function wave({ rnd, uid, ember, veil, detail, weight: w }: Ctx): string {
  const count = Math.round((7 + Math.floor(rnd() * 6)) * detail);
  const frequency = 1.2 + rnd() * 2.2;
  const phaseStep = 0.25 + rnd() * 0.55;
  const tilt = (rnd() - 0.5) * 26;

  const lines = Array.from({ length: count }, (_, i) => {
    const y = 30 + (i / (count - 1)) * 140;
    // Genlik ortada en yüksek: merkeze doğru şişen bir bant
    const center = 1 - Math.abs(i / (count - 1) - 0.5) * 2;
    const amplitude = 3 + center * (9 + rnd() * 11);
    const phase = i * phaseStep + rnd() * 0.3;

    let d = "";
    for (let x = 12; x <= 188; x += 4) {
      const t = (x / 200) * Math.PI * 2 * frequency + phase;
      const yy = y + Math.sin(t) * amplitude;
      d += `${x === 12 ? "M" : "L"}${x} ${n(yy)}`;
    }

    return `<path d="${d}" fill="none" stroke="url(#${uid}-line)" stroke-width="${n((0.6 + center * 0.7) * w)}" stroke-opacity="${n(0.22 + center * 0.5)}" stroke-linecap="round"/>`;
  });

  const marks = Array.from({ length: 3 + Math.floor(rnd() * 3) }, () => {
    const i = Math.floor(rnd() * count);
    const y = 30 + (i / (count - 1)) * 140;
    const x = 30 + rnd() * 140;
    return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(1.4 + rnd() * 2.4)}" fill="${ember}"/>`;
  });

  return `
    <g transform="rotate(${n(tilt)} 100 100)">
      ${lines.join("")}
      ${marks.join("")}
    </g>
    <circle cx="100" cy="100" r="${n(84)}" fill="none" stroke="${veil}" stroke-width="${n(0.5 * w)}" stroke-opacity="0.2" stroke-dasharray="2 7"/>`;
}

/** İç içe, dönerek küçülen çokgenler. */
function lattice({ rnd, uid, ember, veil, detail, weight: w }: Ctx): string {
  const sides = 3 + Math.floor(rnd() * 5);
  const count = Math.round((5 + Math.floor(rnd() * 4)) * detail);
  const twist = (rnd() - 0.5) * 30;
  const start = rnd() * 360;

  const polygon = (radius: number, rotation: number) =>
    Array.from({ length: sides }, (_, i) => {
      const a = ((i / sides) * Math.PI * 2) + (rotation * Math.PI) / 180;
      return `${n(100 + Math.cos(a) * radius)},${n(100 + Math.sin(a) * radius * 0.94)}`;
    }).join(" ");

  const shapes: string[] = [];
  const vertices: string[] = [];

  for (let i = 0; i < count; i++) {
    const k = i / (count - 1 || 1);
    const radius = 88 - k * 66;
    const rotation = start + k * twist * count * 0.5;

    shapes.push(
      `<polygon points="${polygon(radius, rotation)}" fill="none" stroke="url(#${uid}-line)" stroke-width="${n(0.8 * w)}" stroke-opacity="${n(0.2 + k * 0.55)}"/>`,
    );

    if (i % 2 === 0) {
      const a = ((rnd() * sides) | 0) / sides * Math.PI * 2 + (rotation * Math.PI) / 180;
      vertices.push(
        `<circle cx="${n(100 + Math.cos(a) * radius)}" cy="${n(100 + Math.sin(a) * radius * 0.94)}" r="${n(1.5 + rnd() * 2.2)}" fill="${ember}"/>`,
      );
    }
  }

  const spokes = Array.from({ length: sides }, (_, i) => {
    const a = ((i / sides) * Math.PI * 2) + (start * Math.PI) / 180;
    return `<line x1="100" y1="100" x2="${n(100 + Math.cos(a) * 88)}" y2="${n(100 + Math.sin(a) * 88 * 0.94)}" stroke="${veil}" stroke-width="${n(0.45 * w)}" stroke-opacity="0.24"/>`;
  });

  return `${spokes.join("")}${shapes.join("")}${vertices.join("")}`;
}

const RENDERERS: Record<Archetype, (ctx: Ctx) => string> = {
  orbit,
  spiral,
  constellation,
  wave,
  lattice,
};

/* ------------------------------------------------------------------
   Giriş noktası
   ------------------------------------------------------------------ */

export function sigil(seed: string, options: SigilOptions = {}): string {
  const {
    detail = 1,
    ember = "var(--c-ember)",
    veil = "var(--c-veil)",
    inner = false,
    class: className = "",
    style = "",
    archetype,
    weight = 1,
  } = options;

  const seedValue = hash(seed);
  const rnd = generator(seedValue);
  const uid = `s${seedValue.toString(36)}`;
  const kind = archetype ?? archetypeOf(seed);

  const baseAngle = rnd() * 360;
  const coreR = 7 + rnd() * 6;
  // Marka rengi tanınır kalsın diye ton kayması dar tutuluyor.
  const hueShift = Math.round(rnd() * 26 - 13);

  const figure = RENDERERS[kind]({ rnd, uid, ember, veil, detail, weight });

  const body = `
  <defs>
    <radialGradient id="${uid}-core" cx="50%" cy="50%">
      <stop offset="0%" stop-color="${ember}" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="${ember}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${veil}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${uid}-line" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ember}"/>
      <stop offset="100%" stop-color="${veil}"/>
    </linearGradient>
  </defs>
  <g transform="rotate(${n(baseAngle)} 100 100)" style="filter:hue-rotate(${hueShift}deg)">
    <circle cx="100" cy="100" r="${n(coreR * 4.2)}" fill="url(#${uid}-core)"/>
    ${figure}
    <circle cx="100" cy="100" r="${n(coreR)}" fill="${ember}"/>
    <circle cx="100" cy="100" r="${n(coreR + 5)}" fill="none" stroke="${ember}" stroke-width="${n(0.7 * weight)}" stroke-opacity="0.5"/>
  </g>`;

  if (inner) return body;

  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${
    className ? ` class="${className}"` : ""
  }${style ? ` style="${style}"` : ""}>${body}</svg>`;
}
