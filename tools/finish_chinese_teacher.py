"""Add teacher accessories to an Ara 3D Gen rigged GLB and export it.

Run in Blender: blender -b -P tools/finish_chinese_teacher.py -- input.glb output.glb
The input is generated with tools/chinese-teacher-params.json at https://github.com/olatunde85/3d-gen.
"""
import bpy
import math
import sys
from mathutils import Matrix

args = sys.argv[sys.argv.index("--") + 1:]
source, output = args[:2]
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=source)
armature = next(obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE")

def colored_material(name, color):
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.inputs["Base Color"].default_value = color
    shader.inputs["Roughness"].default_value = 0.48
    output_node = nodes.new("ShaderNodeOutputMaterial")
    material.node_tree.links.new(shader.outputs["BSDF"], output_node.inputs["Surface"])
    return material


frame_mat = colored_material("眼镜框 · 深石墨", (0.045, 0.060, 0.073, 1))
badge_mat = colored_material("工牌 · 米白", (0.90, 0.92, 0.90, 1))


def attach_to_bone(obj, bone_name):
    world = obj.matrix_world.copy()
    obj.parent = armature
    obj.parent_type = "BONE"
    obj.parent_bone = bone_name
    obj.matrix_world = world


def curved_tube(name, points, thickness, material, bone):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 2
    curve.bevel_depth = thickness
    curve.bevel_resolution = 2
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, coordinates in zip(spline.points, points):
        point.co = (*coordinates, 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.materials.append(material)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    attach_to_bone(obj, bone)
    return obj


# Slim oval spectacles. Negative Y is the front of the exported MakeHuman figure.
for side in (-1, 1):
    cx = side * 0.043
    rim = []
    for i in range(33):
        angle = i * math.tau / 32
        rim.append((cx + 0.039 * math.cos(angle), -0.171, 1.571 + 0.029 * math.sin(angle)))
    curved_tube("老师眼镜镜框", rim, 0.0026, frame_mat, "Head")
    curved_tube("老师眼镜镜腿", [
        (side * 0.082, -0.171, 1.573),
        (side * 0.115, -0.092, 1.568),
        (side * 0.129, -0.012, 1.553),
    ], 0.0023, frame_mat, "Head")
curved_tube("老师眼镜鼻梁", [(-0.004, -0.171, 1.58), (0.004, -0.171, 1.58)], 0.0025, frame_mat, "Head")

# A small staff ID gives the NPC a readable school role without covering the clothes.
curved_tube("工牌挂绳左", [(-0.045, -0.128, 1.352), (-0.047, -0.168, 1.318), (-0.017, -0.201, 1.166)], 0.0028, frame_mat, "Spine2")
curved_tube("工牌挂绳右", [(0.045, -0.128, 1.352), (0.047, -0.168, 1.318), (0.017, -0.201, 1.166)], 0.0028, frame_mat, "Spine2")
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.208, 1.127))
badge = bpy.context.object
badge.name = "教师工牌"
badge.dimensions = (0.066, 0.005, 0.087)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
badge.data.materials.append(badge_mat)
bevel = badge.modifiers.new("柔和边角", "BEVEL")
bevel.width = 0.004
bevel.segments = 2
bpy.context.view_layer.objects.active = badge
bpy.ops.object.modifier_apply(modifier=bevel.name)
attach_to_bone(badge, "Spine2")

# The campus only needs a calm idle and a greeting. Removing the other 61 actions
# keeps download and animation parsing small, and excludes unused mocap clips.
if armature.animation_data:
    for track in list(armature.animation_data.nla_tracks):
        armature.animation_data.nla_tracks.remove(track)
    armature.animation_data.action = bpy.data.actions.get("Idle")
for action in list(bpy.data.actions):
    if action.name not in {"Idle", "Wave"}:
        bpy.data.actions.remove(action, do_unlink=True)
bpy.context.scene.frame_set(0)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=output, export_format="GLB", use_selection=True,
                          export_animations=True, export_animation_mode="ACTIONS")
print("Exported Chinese teacher:", output)
