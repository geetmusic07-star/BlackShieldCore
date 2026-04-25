// Stefan Gustavson 3D simplex noise (Ashima Arts, public-domain).
// Used as the displacement source for the AI-CORE.
const snoise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export const coreVertex = /* glsl */ `
uniform float uTime;
uniform float uDistortion;
uniform float uPointer;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;

${snoise}

float fbm(vec3 p) {
  float n = snoise(p);
  n += 0.5 * snoise(p * 2.07);
  n += 0.25 * snoise(p * 4.13);
  return n / 1.75;
}

void main() {
  vec3 p = position;
  // Two-octave moving FBM — slow base, fast detail
  float baseN = fbm(p * 1.2 + vec3(uTime * 0.18, 0.0, 0.0));
  float detailN = snoise(p * 4.0 + vec3(uTime * 0.6));
  float n = baseN + detailN * 0.18;

  // Pointer-driven response: surface "leans" toward cursor
  float pointerLift = uPointer * (0.5 + 0.5 * baseN) * 0.05;
  p += normal * (n * uDistortion + pointerLift);

  vNoise = n;
  vec4 worldPos = modelMatrix * vec4(p, 1.0);
  vec4 viewPos = viewMatrix * worldPos;
  vViewDir = normalize(-viewPos.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewPos;
}
`;

export const coreFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColorDeep;
uniform vec3 uColorMid;
uniform vec3 uColorRim;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;

void main() {
  vec3 N = normalize(vNormal);
  float fres = pow(1.0 - max(dot(N, vViewDir), 0.0), 2.4);

  // Surface color from noise band
  float band = smoothstep(-0.7, 0.7, vNoise);
  vec3 base = mix(uColorDeep, uColorMid, band);

  // Slow rim pulse — feels like the core "breathes"
  float pulse = 0.55 + 0.45 * sin(uTime * 0.5);
  vec3 rim = uColorRim * fres * (0.7 + 0.3 * pulse);

  // Darken bottom slightly for grounded feeling
  float vertDim = smoothstep(-1.0, 0.6, N.y);

  vec3 color = base * (0.45 + 0.55 * vertDim) + rim;
  gl_FragColor = vec4(color, 1.0);
}
`;

// Particle signal field — twinkling on a sphere shell, radial drift toward core.
export const signalsVertex = /* glsl */ `
uniform float uTime;
attribute float aSize;
attribute float aPhase;
varying float vTwinkle;

void main() {
  vec3 p = position;
  // Slow radial pulse + per-particle phase for twinkle
  float twinkle = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * 0.9 + aPhase * 6.2831));
  vTwinkle = twinkle;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // Size attenuation
  gl_PointSize = aSize * (260.0 / -mv.z) * (0.5 + 0.5 * twinkle);
}
`;

export const signalsFragment = /* glsl */ `
uniform vec3 uColor;
varying float vTwinkle;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = smoothstep(0.5, 0.0, d);
  float halo = smoothstep(0.5, 0.15, d) * 0.4;
  float a = (core + halo) * vTwinkle;
  if (a < 0.02) discard;
  gl_FragColor = vec4(uColor, a);
}
`;
