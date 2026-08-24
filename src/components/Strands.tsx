import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle, RenderTarget } from 'ogl';
import './Strands.css';

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  float minRes = min(uResolution.x, uResolution.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / minRes;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  float env = pow(max(cos(uv.x * PI * 1.0), 0.0), uTaper);

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

const GLASS_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uRefraction;
uniform float uDispersion;

out vec4 fragColor;

vec2 toUv(vec2 p) {
  float minRes = min(uResolution.x, uResolution.y);
  vec2 pixel = p * minRes + 0.5 * uResolution;
  return pixel / uResolution;
}

void main() {
  float minRes = min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / minRes;
  float d = length(p);
  float r = uRadius;

  float edge = fwidth(d) * 1.5;
  float mask = 1.0 - smoothstep(r - edge, r + edge, d);
  if (mask <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }

  // sphere height: 0 at the rim, 1 at the center
  float z = sqrt(max(r * r - d * d, 0.0)) / max(r, 0.001);
  float nd = d / max(r, 0.001); // 0 at the center, 1 at the rim

  // refraction is confined to a narrow band near the rim; the rest stays undistorted
  vec2 dir = d > 0.0 ? p / d : vec2(0.0);
  float lens = smoothstep(0.80, 1.0, nd) * pow(nd, 4.0);
  vec2 offset = -dir * lens * uRefraction * 0.15;
  vec2 disp = -dir * lens * uDispersion * 0.012;

  vec3 light;
  light.r = texture(uScene, toUv(p + offset - disp)).r;
  light.g = texture(uScene, toUv(p + offset)).g;
  light.b = texture(uScene, toUv(p + offset + disp)).b;

  // neutral fresnel rim
  float fres = pow(1.0 - z, 3.0);
  vec3 rim = vec3(1.0) * fres * 0.25;

  // specular highlight from the upper-left
  vec2 lightDir = normalize(vec2(-0.55, 0.6));
  float spec = pow(max(dot(p / max(r, 1e-4), lightDir), 0.0), 6.0);
  spec *= smoothstep(r, r * 0.55, d);

  vec3 emissive = light + rim + vec3(spec) * 0.45;
  float emissiveA = clamp(max(max(emissive.r, emissive.g), emissive.b), 0.0, 1.0);

  // almost clear glass body
  float bodyA = 0.06 + fres * 0.08;

  // composite emissive light over the clear body
  float outA = emissiveA + bodyA * (1.0 - emissiveA);
  vec3 outRGB = emissive;

  outRGB *= mask;
  outA *= mask;

  fragColor = vec4(outRGB, outA);
}
`;

const buildPalette = (colors?: string[]) => {
  const filled = colors && colors.length ? colors : ['#ffffff'];
  const padded: [number, number, number][] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const hex = filled[i] ?? filled[filled.length - 1];
    const c = new Color(hex);
    padded.push([c.r, c.g, c.b]);
  }
  return padded;
};

export interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  hueShift?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Strands({
  colors = ['#F97316', '#A855F7', '#c1d6d9'],
  count = 4,
  speed = 0.4,
  amplitude = 1.3,
  waviness = 1.5,
  thickness = 1,
  glow = 1.55,
  taper = 3.8,
  spread = 2.3,
  hueShift = 0.72,
  intensity = 0.5,
  saturation = 2,
  opacity = 1,
  scale = 2.5,
  glass = true,
  refraction = 0.6,
  dispersion = 4,
  glassSize = 1,
  className = '',
  style
}: StrandsProps) {
  const propsRef = useRef<any>({});
  propsRef.current = {
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    hueShift,
    intensity,
    saturation,
    opacity,
    scale,
    glass,
    refraction,
    dispersion,
    glassSize
  };

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer: Renderer | null = null;
    let gl: any = null;
    let animateId = 0;
    let resizeObserver: ResizeObserver | null = null;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        dpr
      });
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }

      const rect = ctn.getBoundingClientRect();
      const initialW = rect.width || ctn.clientWidth || 300;
      const initialH = rect.height || ctn.clientHeight || 300;
      const physW = Math.round(initialW * dpr);
      const physH = Math.round(initialH * dpr);

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [physW, physH] },
          uColors: { value: buildPalette(propsRef.current.colors) },
          uColorCount: { value: Math.min(propsRef.current.colors.length, MAX_COLORS) },
          uStrandCount: { value: Math.min(propsRef.current.count, MAX_STRANDS) },
          uSpeed: { value: speed },
          uAmplitude: { value: amplitude },
          uWaviness: { value: waviness },
          uThickness: { value: thickness },
          uGlow: { value: glow },
          uTaper: { value: taper },
          uSpread: { value: spread },
          uHueShift: { value: hueShift },
          uIntensity: { value: intensity },
          uOpacity: { value: opacity },
          uScale: { value: scale },
          uSaturation: { value: saturation }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      const renderTarget = new RenderTarget(gl, {
        width: physW,
        height: physH
      });

      const glassProgram = new Program(gl, {
        vertex: VERT,
        fragment: GLASS_FRAG,
        uniforms: {
          uScene: { value: renderTarget.texture },
          uResolution: { value: [physW, physH] },
          uRadius: { value: 0.50 * glassSize },
          uRefraction: { value: refraction },
          uDispersion: { value: dispersion }
        }
      });
      const glassMesh = new Mesh(gl, { geometry, program: glassProgram });

      ctn.appendChild(gl.canvas);

      function handleResize() {
        if (!ctn || !renderer || !gl) return;
        const r = ctn.getBoundingClientRect();
        const w = r.width || ctn.clientWidth || 300;
        const h = r.height || ctn.clientHeight || 300;
        const curDpr = Math.min(window.devicePixelRatio || 1, 2);
        
        renderer.dpr = curDpr;
        renderer.setSize(w, h);

        const currentPhysW = gl.drawingBufferWidth || Math.round(w * curDpr);
        const currentPhysH = gl.drawingBufferHeight || Math.round(h * curDpr);

        program.uniforms.uResolution.value = [currentPhysW, currentPhysH];
        renderTarget.setSize(currentPhysW, currentPhysH);
        glassProgram.uniforms.uResolution.value = [currentPhysW, currentPhysH];
      }

      window.addEventListener('resize', handleResize);
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(ctn);
      }
      handleResize();

      const update = (t: number) => {
        animateId = requestAnimationFrame(update);
        if (!ctn || !renderer || !gl) return;

        const w = ctn.clientWidth || 300;
        const h = ctn.clientHeight || 300;
        const curDpr = Math.min(window.devicePixelRatio || 1, 2);

        if (renderer.width !== w || renderer.height !== h) {
          renderer.dpr = curDpr;
          renderer.setSize(w, h);
          renderTarget.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        }

        const bufW = gl.drawingBufferWidth || Math.round(w * curDpr);
        const bufH = gl.drawingBufferHeight || Math.round(h * curDpr);

        program.uniforms.uResolution.value = [bufW, bufH];
        glassProgram.uniforms.uResolution.value = [bufW, bufH];

        const current = propsRef.current;
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uColors.value = buildPalette(current.colors);
        program.uniforms.uColorCount.value = Math.min(current.colors.length, MAX_COLORS);
        program.uniforms.uStrandCount.value = Math.min(Math.max(Math.round(current.count), 1), MAX_STRANDS);
        program.uniforms.uSpeed.value = current.speed;
        program.uniforms.uAmplitude.value = current.amplitude;
        program.uniforms.uWaviness.value = current.waviness;
        program.uniforms.uThickness.value = current.thickness;
        program.uniforms.uGlow.value = current.glow;
        program.uniforms.uTaper.value = current.taper;
        program.uniforms.uSpread.value = current.spread;
        program.uniforms.uHueShift.value = current.hueShift;
        program.uniforms.uIntensity.value = current.intensity;
        program.uniforms.uOpacity.value = current.opacity;
        program.uniforms.uScale.value = current.scale;
        program.uniforms.uSaturation.value = current.saturation;

        if (current.glass) {
          renderer.render({ scene: mesh, target: renderTarget });
          glassProgram.uniforms.uScene.value = renderTarget.texture;
          glassProgram.uniforms.uRefraction.value = current.refraction;
          glassProgram.uniforms.uDispersion.value = current.dispersion;
          glassProgram.uniforms.uRadius.value = 0.505 * current.glassSize;
          renderer.render({ scene: glassMesh });
        } else {
          renderer.render({ scene: mesh });
        }
      };
      animateId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animateId);
        window.removeEventListener('resize', handleResize);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        if (ctn && gl && gl.canvas && gl.canvas.parentNode === ctn) {
          ctn.removeChild(gl.canvas);
        }
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      };
    } catch (err) {
      console.error("Strands WebGL initialization error:", err);
    }
  }, [speed, amplitude, waviness, thickness, glow, taper, spread, hueShift, intensity, saturation, opacity, scale, glass, refraction, dispersion, glassSize]);

  return <div ref={ctnDom} className={`strands-container ${className}`} style={style} />;
}

export default Strands;
