"""Headless Blender pipeline: Peracto symbol SVG -> low-poly extruded .glb (+ preview PNG).

Usage:
  blender --background --python scripts/blender_extrude_logo.py -- \
      --svg public/peracto-icon.svg \
      --out public/models/peracto-symbol.glb \
      --preview /tmp/peracto-preview/extruded.png \
      --depth 0.35 --bevel 0.015 --target-tris 2000

Notes:
- Extrudes the closed SVG paths (interior negative space preserved via even/odd fill).
- Normalizes the mesh to span ~[-1, 1] on its largest axis, centered at origin.
- Decimates to roughly --target-tris so the runtime stays light.
"""

import sys
import argparse

import bpy
import addon_utils


def parse_args() -> argparse.Namespace:
    argv = sys.argv
    argv = argv[argv.index("--") + 1 :] if "--" in argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--svg", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--preview", default="")
    p.add_argument("--silhouette", default="", help="render a flat black-on-white silhouette")
    p.add_argument("--depth", type=float, default=0.35, help="total extrude thickness")
    p.add_argument(
        "--bevel",
        type=float,
        default=0.0,
        help="curve bevel depth; >0 offsets the OUTLINE outward (fattens strokes, "
        "distorts the mark). Keep 0 for a clean Z-only extrusion.",
    )
    p.add_argument("--resolution-u", type=int, default=6, help="curve sampling before mesh")
    p.add_argument("--target-tris", type=int, default=2000)
    return p.parse_args(argv)


def reset_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_svg(path: str):
    addon_utils.enable("io_curve_svg", default_set=True, persistent=True)
    before = set(bpy.data.objects)
    bpy.ops.import_curve.svg(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    curves = [o for o in new if o.type == "CURVE"]
    if not curves:
        raise RuntimeError("No curves imported from SVG")
    return curves


def join_curves(curves):
    bpy.ops.object.select_all(action="DESELECT")
    for c in curves:
        c.select_set(True)
    bpy.context.view_layer.objects.active = curves[0]
    if len(curves) > 1:
        bpy.ops.object.join()
    return bpy.context.view_layer.objects.active


def normalize_curve_xy(obj, span: float = 2.0) -> None:
    """Center and scale the still-flat curve in XY *before* extruding, so depth
    and bevel values are proportionate to a span-`span` logo."""
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.location = (0.0, 0.0, 0.0)
    dims = obj.dimensions
    longest = max(dims.x, dims.y) or 1.0
    s = span / longest
    obj.scale = (s, s, s)
    # 2D curves reject location/rotation apply; baking scale only is enough since
    # geometry is already centered via origin_set + location reset.
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)


def extrude_curve(obj, depth: float, bevel: float, resolution_u: int) -> None:
    cu = obj.data
    cu.dimensions = "2D"
    cu.fill_mode = "BOTH"
    cu.resolution_u = resolution_u
    cu.extrude = depth / 2.0  # Blender extrudes symmetrically
    cu.bevel_depth = bevel
    cu.bevel_resolution = 1 if bevel > 0 else 0


def to_mesh(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    return bpy.context.view_layer.objects.active


def recenter(obj) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.location = (0.0, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def cleanup_mesh(obj) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=0.0005)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.shade_smooth()
    if obj.data.polygons:
        for p in obj.data.polygons:
            p.use_smooth = True


def tri_count(obj) -> int:
    me = obj.data
    return sum((len(p.vertices) - 2) for p in me.polygons)


def decimate(obj, target_tris: int) -> None:
    current = tri_count(obj)
    if current <= target_tris:
        return
    ratio = max(0.02, min(1.0, target_tris / float(current)))
    m = obj.modifiers.new("decimate", type="DECIMATE")
    m.decimate_type = "COLLAPSE"
    m.ratio = ratio
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=m.name)


def export_glb(obj, out_path: str) -> None:
    import os

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )


def render_preview(obj, png_path: str) -> None:
    import os
    import math

    os.makedirs(os.path.dirname(png_path), exist_ok=True)


    # neutral preview material so lighting/shape reads (SVG fill is pure black)
    mat = bpy.data.materials.new("preview")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.82, 0.82, 0.85, 1.0)
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = 0.45
    obj.data.materials.clear()
    obj.data.materials.append(mat)

    cam_data = bpy.data.cameras.new("cam")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = 3.0
    cam = bpy.data.objects.new("cam", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    # logo face lies in XY (facing +Z); view from +Z with a slight offset so the
    # extrusion depth reads, and track-to the origin.
    cam_data.ortho_scale = 3.0
    cam.location = (0.001, 0.0, 4.0)  # face-on (down -Z)
    bpy.context.scene.camera = cam

    target = bpy.data.objects.new("look_at", None)
    bpy.context.scene.collection.objects.link(target)
    target.location = (0.0, 0.0, 0.0)
    con = cam.constraints.new(type="TRACK_TO")
    con.target = target
    con.track_axis = "TRACK_NEGATIVE_Z"
    con.up_axis = "UP_Y"

    sun_data = bpy.data.lights.new("sun", type="SUN")
    sun_data.energy = 4.0
    sun = bpy.data.objects.new("sun", sun_data)
    bpy.context.scene.collection.objects.link(sun)
    sun.rotation_euler = (math.radians(45), math.radians(20), 0.0)

    fill_data = bpy.data.lights.new("fill", type="SUN")
    fill_data.energy = 1.4
    fill = bpy.data.objects.new("fill", fill_data)
    bpy.context.scene.collection.objects.link(fill)
    fill.rotation_euler = (math.radians(-30), math.radians(-40), 0.0)

    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [
        e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items
    ] else "BLENDER_EEVEE"
    sc.render.film_transparent = True
    sc.render.resolution_x = 600
    sc.render.resolution_y = 600
    sc.render.filepath = png_path
    bpy.ops.render.render(write_still=True)


def render_silhouette(obj, png_path: str) -> None:
    """Flat black mesh on white background, face-on ortho — to verify which
    negative spaces (holes) the mesh actually preserves vs the source SVG."""
    import os

    os.makedirs(os.path.dirname(png_path), exist_ok=True)

    mat = bpy.data.materials.new("silhouette")
    mat.use_nodes = True
    nt = mat.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    emit = nt.nodes.new("ShaderNodeEmission")
    emit.inputs["Color"].default_value = (0.0, 0.0, 0.0, 1.0)
    nt.links.new(emit.outputs["Emission"], out.inputs["Surface"])
    obj.data.materials.clear()
    obj.data.materials.append(mat)

    world = bpy.data.worlds.new("white")
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)
        bg.inputs["Strength"].default_value = 1.0
    bpy.context.scene.world = world

    cam_data = bpy.data.cameras.new("scam")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = 2.4
    cam = bpy.data.objects.new("scam", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    cam.location = (0.0, 0.0, 4.0)
    bpy.context.scene.camera = cam

    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [
        e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items
    ] else "BLENDER_EEVEE"
    sc.render.film_transparent = False
    sc.render.resolution_x = 600
    sc.render.resolution_y = 600
    sc.render.filepath = png_path
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = parse_args()
    reset_scene()
    curves = import_svg(args.svg)
    print(f"[peracto] imported curve objects: {len(curves)}")
    obj = join_curves(curves)
    print(f"[peracto] splines after join: {len(obj.data.splines)}")
    for i, sp in enumerate(obj.data.splines):
        n = len(sp.bezier_points) if sp.type == "BEZIER" else len(sp.points)
        print(f"[peracto]   spline {i}: type={sp.type} pts={n} cyclic={sp.use_cyclic_u}")
    normalize_curve_xy(obj)
    extrude_curve(obj, args.depth, args.bevel, args.resolution_u)
    obj = to_mesh(obj)
    cleanup_mesh(obj)
    recenter(obj)
    before = tri_count(obj)
    decimate(obj, args.target_tris)
    after = tri_count(obj)
    export_glb(obj, args.out)
    print(f"[peracto] tris before decimate: {before}")
    print(f"[peracto] tris after  decimate: {after}")
    print(f"[peracto] verts: {len(obj.data.vertices)}")
    print(f"[peracto] exported: {args.out}")
    if args.preview:
        render_preview(obj, args.preview)
        print(f"[peracto] preview: {args.preview}")
    if args.silhouette:
        render_silhouette(obj, args.silhouette)
        print(f"[peracto] silhouette: {args.silhouette}")


if __name__ == "__main__":
    main()
