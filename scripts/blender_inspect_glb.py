"""Inspect + preview a .glb. Usage:
  blender --background --python scripts/blender_inspect_glb.py -- \
      --glb public/models/peracto-symbol.glb \
      --silhouette /tmp/peracto-preview/glb_sil.png \
      --preview /tmp/peracto-preview/glb_lit.png
"""

import sys
import math
import argparse

import bpy


def parse_args() -> argparse.Namespace:
    argv = sys.argv
    argv = argv[argv.index("--") + 1 :] if "--" in argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--glb", required=True)
    p.add_argument("--silhouette", default="")
    p.add_argument("--preview", default="")
    p.add_argument("--export", default="", help="re-export the logo mesh alone to this .glb")
    return p.parse_args(argv)


def tri_count(obj) -> int:
    return sum((len(p.vertices) - 2) for p in obj.data.polygons)


def eevee(sc) -> None:
    ids = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
    sc.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in ids else "BLENDER_EEVEE"


def main() -> None:
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.glb)

    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    if not meshes:
        raise RuntimeError("no mesh in glb")

    print("[inspect] --- per-object ---")
    for o in meshes:
        d = o.dimensions
        print(
            f"[inspect]   name='{o.name}' tris={tri_count(o)} "
            f"verts={len(o.data.vertices)} dims=({d.x:.3f},{d.y:.3f},{d.z:.3f}) "
            f"loc=({o.location.x:.3f},{o.location.y:.3f},{o.location.z:.3f})"
        )

    # keep the real logo (most triangles), drop stray objects (e.g. default Cube)
    obj = max(meshes, key=tri_count)
    for o in meshes:
        if o is not obj:
            print(f"[inspect] removing stray object '{o.name}'")
            bpy.data.objects.remove(o, do_unlink=True)

    # report
    tris = tri_count(obj)
    d = obj.dimensions
    print(f"[inspect] mesh objects: {len(meshes)}")
    print(f"[inspect] tris: {tris}  verts: {len(obj.data.vertices)}")
    print(f"[inspect] dims (x,y,z): {d.x:.4f}, {d.y:.4f}, {d.z:.4f}")
    print(f"[inspect] location: {tuple(round(v,4) for v in obj.location)}")

    # normalize for framing: center + fit largest XY to span 2
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.location = (0.0, 0.0, 0.0)
    longest = max(d.x, d.y) or 1.0
    s = 2.0 / longest
    obj.scale = (s, s, s)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    if args.export:
        import os

        os.makedirs(os.path.dirname(args.export), exist_ok=True)
        bpy.ops.object.select_all(action="DESELECT")
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.export_scene.gltf(
            filepath=args.export,
            export_format="GLB",
            use_selection=True,
            export_apply=False,
            export_yup=True,
        )
        print(f"[inspect] exported clean: {args.export}")

    sc = bpy.context.scene
    eevee(sc)
    sc.render.resolution_x = 600
    sc.render.resolution_y = 600

    if args.silhouette:
        mat = bpy.data.materials.new("sil")
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
        bg.inputs["Color"].default_value = (1, 1, 1, 1)
        sc.world = world

        cam_data = bpy.data.cameras.new("c")
        cam_data.type = "ORTHO"
        cam_data.ortho_scale = 2.4
        cam = bpy.data.objects.new("c", cam_data)
        sc.collection.objects.link(cam)
        cam.location = (0, 0, 4)
        sc.camera = cam
        sc.render.film_transparent = False
        sc.render.filepath = args.silhouette
        bpy.ops.render.render(write_still=True)
        print(f"[inspect] silhouette: {args.silhouette}")

    if args.preview:
        for m in list(obj.data.materials):
            pass
        mat = bpy.data.materials.new("lit")
        mat.use_nodes = True
        b = mat.node_tree.nodes.get("Principled BSDF")
        b.inputs["Base Color"].default_value = (0.82, 0.82, 0.85, 1)
        b.inputs["Roughness"].default_value = 0.45
        obj.data.materials.clear()
        obj.data.materials.append(mat)

        world = bpy.data.worlds.new("w2")
        world.use_nodes = True
        world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.3
        sc.world = world

        for i, (rot, e) in enumerate([((45, 20, 0), 4.0), ((-30, -40, 0), 1.4)]):
            ld = bpy.data.lights.new(f"l{i}", type="SUN")
            ld.energy = e
            lo = bpy.data.objects.new(f"l{i}", ld)
            sc.collection.objects.link(lo)
            lo.rotation_euler = tuple(math.radians(x) for x in rot)

        sc.render.film_transparent = True

        target = bpy.data.objects.new("look", None)
        sc.collection.objects.link(target)
        target.location = (0, 0, 0)

        import os

        base, ext = os.path.splitext(args.preview)
        views = {
            "persp": (3.2, -3.2, 2.4),
            "front": (0.0, -4.0, 0.0),  # look +Y
            "top": (0.0, 0.0, 4.0),  # look -Z
            "side": (4.0, 0.0, 0.0),  # look -X
        }
        for name, loc in views.items():
            cam_data = bpy.data.cameras.new(f"c_{name}")
            cam = bpy.data.objects.new(f"c_{name}", cam_data)
            sc.collection.objects.link(cam)
            cam.location = loc
            con = cam.constraints.new(type="TRACK_TO")
            con.target = target
            con.track_axis = "TRACK_NEGATIVE_Z"
            con.up_axis = "UP_Y" if name != "top" else "UP_Y"
            sc.camera = cam
            path = f"{base}_{name}{ext}"
            sc.render.filepath = path
            bpy.ops.render.render(write_still=True)
            print(f"[inspect] preview {name}: {path}")


if __name__ == "__main__":
    main()
