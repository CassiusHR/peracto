# Research: 3D spinning Peracto logo with the existing dither effect

Branch: `feat/3d-logo-dither`

## Goal

Replace / augment the hero's right-side WebGL panel with an **extruded 3D model of the
Peracto symbol, spinning**, rendered with the **same "dithering" look** as the current
`src/components/dither-shader.tsx`. Must stay **lightweight and performant** (low
triangle/poly count, small bundle).

---

## 1. What the current effect actually is

`dither-shader.tsx` is **not a 3D scene**. It is a single full-screen triangle drawn with
the tiny `ogl` WebGL2 library, running one fragment shader that:

1. Splits the screen into `gridResolution` px cells (10 px hero / 14 px cta).
2. Computes a **procedural luminance** field per cell from summed animated sines
   (`baseLuminance`), warped by a mouse-shear term.
3. Applies an **ordered Bayer 4×4 dither** offset to that luminance (`computeBayer`).
4. Quantizes luminance into **5 tiers** and draws a different ASCII-like **glyph per cell**
   via `synthesizeCharacter` (dot → bar → plus → hash).
5. Themes fg/bg (light/dark), with an optional transparent "tone" mode.

**Key insight:** the "dither effect" is a *screen-space post step driven by a luminance
field*. To put it on a 3D logo we only need to **change where the luminance comes from**
(procedural waves → rendered 3D logo) and keep the Bayer + glyph stage byte-for-byte. This
guarantees the look matches exactly.

## 2. Hard dependency / current blocker

There is **no Peracto logo asset in the repo**. The current logo (`header.tsx`) is a
placeholder "Frame" wordmark + plain square. We need the **Peracto symbol** as either:

- a clean **SVG** of the symbol (strongly preferred — best for both extrude and SDF), or
- an existing 3D model (`.glb`/`.obj`), or
- a high-contrast **raster** (we can vectorize with `potrace`, already installed, but quality
  is worse than a real SVG).

## 3. Toolchain confirmed available

- `ogl` `1.0.11` already a dependency → has `RenderTarget` (render-to-texture) and
  `GLTFLoader`. Bundle cost of the 3D path is ~0 extra deps.
- **Blender 4.2.2 LTS** on CLI, with the `io_curve_svg` addon enabled → a **headless
  SVG→extrude→low-poly→.glb** pipeline is fully scriptable (`blender --background --python`).
- `potrace` installed (raster→SVG fallback). `msdfgen` not installed but available via npm if
  we go the SDF route.

---

## 4. Approaches considered

### Option A — Real geometry (ogl) + render-to-texture + reuse the dither  ✅ recommended

1. **Bake the mesh in Blender** (as the user suggested): import the symbol SVG → convert to
   mesh → Extrude/Solidify for depth → optional Bevel → **Decimate to low-poly** → export
   `.glb` (optionally Draco). One-time, produces a tiny baked asset with full control over
   depth/bevel and triangle budget (target ~500–3k tris).
2. **Runtime (ogl):** load the `.glb` with `GLTFLoader`, render it with simple lighting
   (lambert or matcap) into a **small `RenderTarget`** (the dither downsamples to ~10 px
   cells, so the luminance source can render at low res → very cheap), spin via per-frame
   rotation.
3. **Post pass:** the existing fragment shader, with `baseLuminance` replaced by a sample of
   the render-target's luminance. Bayer + glyph + theming logic is reused unchanged.

**Pros:** true extruded 3D with real depth/bevel/lighting; predictable; lightest *new* deps
(none — ogl already present); uses Blender exactly as suggested; exact dither match.
**Cons:** adds an FBO + loader (modest code); ships a small binary asset; needs the SVG.

### Option B — Pure-shader SDF raymarch (no geometry, no model load)

Bake a (multi-channel) **distance field** of the symbol once, then in the fragment shader
raymarch an **extruded prism** (2D SDF extruded along Z), rotate by time, derive normals from
the SDF gradient for lighting, and feed luminance into the **same** Bayer + glyph stage — all
in **one** full-screen ogl Program (architecturally identical to today).

**Pros:** lightest possible — no geometry, no loaders, one draw call, no binary mesh;
resolution-independent silhouette; dither integrates natively in the same pass.
**Cons:** bevels / complex depth are harder; side-face lighting is approximate; requires
baking an SDF/MSDF texture; trickier shader math.

### Option C — three.js (SVGLoader + ExtrudeGeometry + EffectComposer)

Easiest authoring of extrude+bevel and a post dither pass, but adds **~150 KB+ gzip** vs
ogl's ~10 KB and contradicts the project's deliberate ogl choice and the "lightweight"
requirement. **Not recommended.**

## 5. Performance ranking

1. **B (SDF raymarch)** — no new deps, single draw call, cheapest bundle.
2. **A1 (ogl + baked low-poly glb)** — very light; few-hundred–few-k tris into a small FBO.
3. **C (three.js)** — heaviest; not recommended.

## 6. Recommendation

**Primary: Option A (Blender-baked low-poly `.glb` + ogl render-to-texture + reuse the
existing Bayer/glyph dither as a post pass).** Best balance of *true extruded 3D fidelity*
(real depth, bevel, lighting), *performance* (low-poly + low-res luminance FBO, no new deps),
and it uses Blender exactly as the user intended. The dither is preserved verbatim by feeding
the model's luminance into the current shader.

**Strong alternative: Option B (SDF raymarch)** if we want the absolute lightest, single-shader,
no-binary-asset path and accept approximate side lighting.

## 6b. Option A validated (built)

The Blender pipeline is implemented and proven end-to-end:

- Script: `scripts/blender_extrude_logo.py` (headless, reproducible).
- Command:
  ```bash
  /Applications/Blender.app/Contents/MacOS/Blender --background \
    --python scripts/blender_extrude_logo.py -- \
    --svg public/peracto-icon.svg --out public/models/peracto-symbol.glb \
    --depth 0.25 --bevel 0 --resolution-u 10 --target-tris 1800
  ```
- Output: `public/models/peracto-symbol.glb` — **1,472 tris, 736 verts, 57 KB (23 KB gzip)**,
  normalized to span ~[-1,1] centered at origin, smooth-shaded.
- **Pure Z extrusion, no outward bevel.** A curve `bevel_depth` offsets the *outline outward*
  (a stroke), which fattens the thin ribbons and shrinks the negative space → the mark stops
  looking like the logo. Use `--bevel 0` so the exact 2D silhouette is preserved and only the
  Z thickness is added.
- Gotchas solved: (1) extrude must be set **after** normalizing the flat curve to a span-2
  size (else depth is in tiny SVG units and produces a featureless slab); (2) 2D curves reject
  location/rotation apply — bake scale only; (3) the symbol's interior negative space is
  preserved by the two nested cyclic splines (outer 28-pt + inner 18-pt).
- Face-on render confirms the mark + holes are correct; the model is ready for the runtime.

## 7. Next steps (once an approach is chosen)

1. Obtain the **Peracto symbol SVG** (the blocker).
2. **A:** write a headless Blender script (`scripts/`) SVG→low-poly `.glb`; add an ogl
   render-target + GLTFLoader path to a new `logo-3d-dither.tsx`; swap the luminance source.
   **B:** bake an SDF texture; extend the existing shader with a raymarched extruded prism.
3. Wire it into the hero (`index.astro`) behind the same container; keep theme + reduced-motion
   handling; validate `astro check` + build + bundle size.
