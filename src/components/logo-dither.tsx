import {
  Camera,
  GLTFLoader,
  Mesh,
  Program,
  RenderTarget,
  Renderer,
  Transform,
  Triangle,
  Vec3,
} from "ogl";
import { useTheme } from "@/lib/use-theme";
import { useEffect, useRef, type ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Pass 1 — render the extruded logo to an offscreen texture as a
 * grayscale luminance field (simple two-light lambert, two-sided).
 * ------------------------------------------------------------------ */
const logoVertex = /* glsl */ `#version 300 es
  in vec3 position;
  in vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  out vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const logoFragment = /* glsl */ `#version 300 es
  precision highp float;
  in vec3 vNormal;
  uniform float uAmbient;   // base fill so the whole mark stays visible
  uniform float uDiffuse;   // key/fill light intensity
  uniform float uExposure;  // overall brightness multiplier
  out vec4 fragColor;
  void main() {
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;                 // two-sided: light back faces too
    vec3 L1 = normalize(vec3(0.45, 0.65, 0.80));
    vec3 L2 = normalize(vec3(-0.55, -0.25, 0.35));
    float diff = max(dot(N, L1), 0.0) + max(dot(N, L2), 0.0) * 0.4;
    float lum = (uAmbient + diff * uDiffuse) * uExposure;
    fragColor = vec4(vec3(clamp(lum, 0.0, 1.0)), 1.0);
  }
`;

/* ------------------------------------------------------------------ *
 * Pass 2 — the existing Bayer + glyph dither, reading luminance from
 * the logo texture instead of the procedural wave field.
 * ------------------------------------------------------------------ */
const postVertex = /* glsl */ `#version 300 es
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const postFragment = /* glsl */ `#version 300 es
  precision highp float;

  uniform vec2  iResolution;
  uniform float uTheme;
  uniform float uVariant;
  uniform sampler2D uScene;

  out vec4 fragColor;

  const float kBayer[16] = float[16](
     0.0,  8.0,  2.0, 10.0,
    12.0,  4.0, 14.0,  6.0,
     3.0, 11.0,  1.0,  9.0,
    15.0,  7.0, 13.0,  5.0
  );

  float box(vec2 p, vec2 c, vec2 h) {
    vec2 q = abs(p - c) - h;
    return (1.0 - step(0.0, q.x)) * (1.0 - step(0.0, q.y));
  }

  float synthesizeCharacter(vec2 uv, float lum) {
    vec2 p = uv * 2.0 - 1.0;
    int tier = int(clamp(lum * 5.0, 0.0, 4.0));

    if (tier == 0) return 0.0;
    if (tier == 1) return 1.0 - step(0.2, length(p));
    if (tier == 2) return box(p, vec2(0.0), vec2(0.6, 0.2));
    if (tier == 3) {
      return max(box(p, vec2(0.0), vec2(0.6, 0.2)),
                 box(p, vec2(0.0), vec2(0.2, 0.6)));
    }
    float bounds = box(p, vec2(0.0), vec2(0.8));
    float bars = max(
      max(box(p, vec2(0.0,  0.3), vec2(1.0, 0.15)),
          box(p, vec2(0.0, -0.3), vec2(1.0, 0.15))),
      max(box(p, vec2( 0.3, 0.0), vec2(0.15, 1.0)),
          box(p, vec2(-0.3, 0.0), vec2(0.15, 1.0)))
    );
    return bars * bounds;
  }

  float computeBayer(vec2 cell) {
    ivec2 q = ivec2(mod(cell, 4.0));
    return kBayer[q.x + q.y * 4] / 16.0;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;

    float gridResolution = mix(10.0, 14.0, uVariant);
    vec2 cellIndex = floor(fragCoord / gridResolution);
    vec2 localUV   = fract(fragCoord / gridResolution);

    vec2 sampleUV = (cellIndex * gridResolution + gridResolution * 0.5) / iResolution;
    float baseLuminance = texture(uScene, sampleUV).r;

    float adjustedLuminance = clamp(
      baseLuminance + (computeBayer(cellIndex) - 0.5) * 0.5,
      0.0, 1.0
    );

    float mask = synthesizeCharacter(localUV, adjustedLuminance);

    vec3 bg = mix(vec3(1.0), vec3(0.039), uTheme);
    vec3 fg = mix(vec3(0.0), vec3(0.98),  uTheme);
    fragColor = vec4(mix(bg, fg, mask), 1.0);
  }
`;

export type LogoDitherVariant = "hero" | "cta";

function isWebGL2Supported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export function LogoDither({
  variant = "hero",
  modelSrc = "/models/peracto-symbol.glb",
  spinSpeed = 0.5,
  depthScale = 0.4,
  axisTilt = 30,
  axisDir = 90,
  ambient = 0.15,
  light = 0.6,
  brightness = 1.0,
}: {
  variant?: LogoDitherVariant;
  modelSrc?: string;
  spinSpeed?: number;
  /** Multiplies the extrusion depth at render time (keeps the .glb unchanged). */
  depthScale?: number;
  /** Spin axis tilt away from the camera/view axis, in degrees (0 = spins in-plane facing you, 90 = turntable that goes edge-on). */
  axisTilt?: number;
  /** Direction the spin axis leans, in degrees (0 = tumbles top/bottom, 90 = left/right turntable). */
  axisDir?: number;
  /** Lighting: base fill, key/fill intensity, overall brightness. */
  ambient?: number;
  light?: number;
  brightness?: number;
} = {}): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  const themeTargetRef = useRef(0);
  const variantRef = useRef(variant === "cta" ? 1 : 0);

  // live-tunable values read inside the render loop, so changing them does NOT
  // tear down the WebGL context / reload the model.
  const spinSpeedRef = useRef(spinSpeed);
  const axisTiltRef = useRef(axisTilt);
  const axisDirRef = useRef(axisDir);
  const depthScaleRef = useRef(depthScale);
  const ambientRef = useRef(ambient);
  const lightRef = useRef(light);
  const brightnessRef = useRef(brightness);

  useEffect(() => {
    variantRef.current = variant === "cta" ? 1 : 0;
  }, [variant]);

  useEffect(() => {
    themeTargetRef.current = resolvedTheme === "dark" ? 1 : 0;
  }, [resolvedTheme]);

  useEffect(() => {
    spinSpeedRef.current = spinSpeed;
  }, [spinSpeed]);
  useEffect(() => {
    axisTiltRef.current = axisTilt;
  }, [axisTilt]);
  useEffect(() => {
    axisDirRef.current = axisDir;
  }, [axisDir]);
  useEffect(() => {
    depthScaleRef.current = depthScale;
  }, [depthScale]);
  useEffect(() => {
    ambientRef.current = ambient;
  }, [ambient]);
  useEffect(() => {
    lightRef.current = light;
  }, [light]);
  useEffect(() => {
    brightnessRef.current = brightness;
  }, [brightness]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!isWebGL2Supported()) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2),
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    container.appendChild(gl.canvas);
    gl.canvas.style.display = "block";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    // scene -> spinner (rotates about a user-defined axis) -> orient (face->Z) -> mesh
    const DEG = Math.PI / 180;
    const scene = new Transform();
    const spinner = new Transform();
    spinner.setParent(scene);
    const orient = new Transform();
    orient.setParent(spinner);
    let spinAngle = 0.8; // start at a pleasant 3/4 pose (matters for reduced-motion)

    const camera = new Camera(gl, { fov: 30, near: 0.1, far: 100 });
    camera.position.set(0, 0, 3.0);
    camera.lookAt([0, 0, 0]);

    const logoProgram = new Program(gl, {
      vertex: logoVertex,
      fragment: logoFragment,
      cullFace: false,
      uniforms: {
        uAmbient: { value: ambientRef.current },
        uDiffuse: { value: lightRef.current },
        uExposure: { value: brightnessRef.current },
      },
    });

    let renderTarget = new RenderTarget(gl, { width: 2, height: 2 });

    const postProgram = new Program(gl, {
      vertex: postVertex,
      fragment: postFragment,
      uniforms: {
        iResolution: { value: [1, 1] },
        uTheme: { value: themeTargetRef.current },
        uVariant: { value: variantRef.current },
        uScene: { value: renderTarget.texture },
      },
    });
    const postMesh = new Mesh(gl, { geometry: new Triangle(gl), program: postProgram });

    const resize = (): void => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      const w = Math.max(2, gl.drawingBufferWidth);
      const h = Math.max(2, gl.drawingBufferHeight);
      camera.perspective({ aspect: w / h });
      renderTarget = new RenderTarget(gl, { width: w, height: h });
      postProgram.uniforms.uScene.value = renderTarget.texture;
      postProgram.uniforms.iResolution.value = [w, h];
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let frameId = 0;
    let disposed = false;
    const reduceMotion = prefersReducedMotion();
    let last = performance.now();

    GLTFLoader.load(gl, modelSrc)
      .then((gltf) => {
        if (disposed) return;

        // pick the logo primitive (most vertices) and skip the stray cube
        for (const root of gltf.scene ?? []) root.updateMatrixWorld?.(true);
        const primitives = (gltf.meshes ?? []).flatMap((m) => m.primitives ?? []);
        if (primitives.length === 0) return;
        const vcount = (p: (typeof primitives)[number]): number =>
          (p.geometry.attributes.position?.count as number | undefined) ?? 0;
        let logo = primitives[0];
        for (const p of primitives) if (vcount(p) > vcount(logo)) logo = p;

        // the glb carries a (possibly non-uniform) node scale; bake it in, else
        // the mesh comes out squished when rebuilt from geometry alone.
        logo.updateMatrixWorld?.(true);
        const wScale = new Vec3(1, 1, 1);
        (logo.worldMatrix as unknown as { getScaling: (v: Vec3) => void }).getScaling(wScale);

        const geometry = logo.geometry;
        geometry.computeBoundingBox();
        const { min, max } = geometry.bounds;
        const wScaleArr = [Math.abs(wScale.x), Math.abs(wScale.y), Math.abs(wScale.z)];
        const extents = [
          (max.x - min.x) * wScaleArr[0],
          (max.y - min.y) * wScaleArr[1],
          (max.z - min.z) * wScaleArr[2],
        ];
        const f = 1.2 / (Math.max(...extents) || 1); // fit largest world extent ~1.2

        // smallest *world* extent = extrusion depth
        const depthAxis = extents.indexOf(Math.min(...extents));
        const baseSc = [wScale.x * f, wScale.y * f, wScale.z * f];
        const center = [(min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2];

        const mesh = new Mesh(gl, { geometry, program: logoProgram });
        const applyDepth = (): void => {
          const ds = depthScaleRef.current;
          const s0 = baseSc[0] * (depthAxis === 0 ? ds : 1);
          const s1 = baseSc[1] * (depthAxis === 1 ? ds : 1);
          const s2 = baseSc[2] * (depthAxis === 2 ? ds : 1);
          mesh.scale.set(s0, s1, s2);
          mesh.position.set(-center[0] * s0, -center[1] * s1, -center[2] * s2);
        };
        applyDepth();
        mesh.setParent(orient);

        // rotate the depth axis onto Z so the face points at the camera
        if (depthAxis === 1) orient.rotation.x = Math.PI / 2;
        else if (depthAxis === 0) orient.rotation.y = Math.PI / 2;

        resize();

        const render = (): void => {
          const now = performance.now();
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;

          if (!reduceMotion) {
            spinAngle = (spinAngle + spinSpeedRef.current * dt) % (Math.PI * 2);
          }
          // spin around an arbitrary axis (tilt from view axis + lean direction)
          const t = axisTiltRef.current * DEG;
          const d = axisDirRef.current * DEG;
          const ax = Math.sin(t) * Math.cos(d);
          const ay = Math.sin(t) * Math.sin(d);
          const az = Math.cos(t);
          const h = spinAngle * 0.5;
          const sh = Math.sin(h);
          spinner.quaternion.set(ax * sh, ay * sh, az * sh, Math.cos(h));
          applyDepth();

          logoProgram.uniforms.uAmbient.value = ambientRef.current;
          logoProgram.uniforms.uDiffuse.value = lightRef.current;
          logoProgram.uniforms.uExposure.value = brightnessRef.current;

          const themeNow = postProgram.uniforms.uTheme.value as number;
          postProgram.uniforms.uTheme.value =
            themeNow + (themeTargetRef.current - themeNow) * 0.12;
          postProgram.uniforms.uVariant.value = variantRef.current;

          renderer.render({ scene, camera, target: renderTarget });
          renderer.render({ scene: postMesh });

          frameId = requestAnimationFrame(render);
        };
        render();
      })
      .catch(() => {
        /* model failed to load — leave the panel blank */
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Only re-init on model change; spin/tilt/depth are read live via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelSrc]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
