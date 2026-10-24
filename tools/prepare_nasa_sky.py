"""Prepare small display textures from NASA SVS source maps.

Source maps: https://svs.gsfc.nasa.gov/4851/ and https://svs.gsfc.nasa.gov/4720/
Run with Blender in background, passing the EXR path after ``--``.
"""
import bpy
import sys
from pathlib import Path

source = sys.argv[sys.argv.index('--') + 1]
image = bpy.data.images.load(source, check_existing=False)
image.scale(2048, 1024)
scene = bpy.context.scene
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'Medium High Contrast'
scene.view_settings.exposure = 1.4
scene.view_settings.gamma = 1.0
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 90
image.save_render(str(Path.cwd() / 'assets/models/milkyway-nasa-2k.jpg'), scene=scene)
