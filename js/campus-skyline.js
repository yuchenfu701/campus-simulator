/* Architectural backdrop. Shared geometry/material batches keep every detail out of
   the merged-map cache and make complexity independent of the number of windows. */
(function () {
    'use strict';
    window.buildCampusSkyline = function (THREE, scene) {
        let seed = 82719;
        const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
        const unit = new THREE.BoxGeometry(1, 1, 1);
        const batches = {};
        const materials = {
            wall: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            trim: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            metal: new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 18 }),
            glass: new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x667a88, shininess: 65 }),
            light: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })
        };
        const q = new THREE.Quaternion(), matrix = new THREE.Matrix4();
        function box(type, x, y, z, w, h, d, color) {
            if (!batches[type]) batches[type] = [];
            matrix.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(w, h, d));
            batches[type].push([matrix.clone(), new THREE.Color(color)]);
        }
        const palettes = [
            [0x9b9386, 0x655e54], [0x899194, 0x525f65],
            [0xaaa79c, 0x747568], [0x8a796c, 0x5f5148]
        ];
        for (let k = 0; k < 22; k++) {
            const row = Math.floor(k / 11), col = k % 11;
            const x = -145 + col * 28 + random() * 4;
            const z = 213 + row * 30 + random() * 9;
            const style = k % 3;
            const w = 12 + random() * 7, d = 10 + random() * 5;
            const floors = 4 + Math.floor(random() * (row ? 9 : 6));
            const floorH = 3.05, h = floors * floorH + 3.2;
            const palette = palettes[k % palettes.length];
            box('wall', x, h / 2, z, w, h, d, palette[0]);
            // Dark street-level plinth, shallow roof parapets and rooftop services.
            box('trim', x, 1.35, z, w + 0.18, 2.7, d + 0.18, palette[1]);
            box('trim', x, h + 0.12, z, w + 0.45, 0.24, d + 0.45, 0x5d6260);
            box('wall', x + w * 0.18, h + 1.1, z + d * 0.14, w * 0.32, 2, d * 0.36, palette[1]);
            box('metal', x - w * 0.25, h + 0.65, z - d * 0.18, 1.8, 1.05, 2.5, 0x727c7c);
            for (const side of [-1, 1]) {
                box('trim', x, h + 0.38, z + side * d / 2, w + 0.2, 0.65, 0.18, palette[1]);
                box('trim', x + side * w / 2, h + 0.38, z, 0.18, 0.65, d, palette[1]);
            }
            // Four facades use local u/depth coordinates, so side walls also have detail.
            for (let face = 0; face < 4; face++) {
                const front = face < 2, sign = face % 2 === 0 ? -1 : 1;
                const width = front ? w : d, depth = front ? d : w;
                function facade(type, u, y, out, bw, bh, bd, color) {
                    box(type, front ? x + u : x + sign * (depth / 2 + out), y,
                        front ? z + sign * (depth / 2 + out) : z + u,
                        front ? bw : bd, bh, front ? bd : bw, color);
                }
                const columns = Math.max(3, Math.floor(width / 2.8));
                const bay = (width - 1.4) / columns;
                for (let level = 0; level < floors; level++) {
                    const y = 4.2 + level * floorH;
                    facade('trim', 0, y - 1.22, 0.07, width + 0.12, 0.17, 0.22, palette[1]);
                    for (let c = 0; c < columns; c++) {
                        const u = -width / 2 + 0.7 + bay * (c + 0.5);
                        const ww = bay * (style === 1 ? 0.86 : 0.64), wh = style === 1 ? 2.1 : 1.65;
                        // Recess, glazing, lintel, sill, and a center mullion.
                        facade('trim', u, y, 0.025, ww + 0.18, wh + 0.18, 0.09, 0x353e40);
                        const shade = [0x344852, 0x435a65, 0x576b70, 0x263b46][Math.floor(random() * 4)];
                        facade('glass', u, y, 0.08, ww, wh, 0.05, shade);
                        facade('metal', u, y, 0.13, 0.055, wh, 0.06, 0x84908e);
                        facade('trim', u, y - wh / 2 - 0.06, 0.19, ww + 0.24, 0.12, 0.38, 0xa4a59b);
                        if (random() < 0.18) facade('light', u, y, 0.112, ww - 0.1, wh - 0.1, 0.02, random() > 0.5 ? 0xd2b887 : 0xc4c6a3);
                        if (style === 2 && front && c % 2 === 0) {
                            // Cantilever balconies with solid shadow recesses and railings.
                            facade('trim', u, y - 1.05, 0.48, bay * 0.94, 0.18, 1.05, palette[1]);
                            facade('metal', u, y - 0.42, 0.96, bay * 0.92, 0.06, 0.06, 0x4b5456);
                            for (let bar = -1; bar <= 1; bar++) facade('metal', u + bar * bay * 0.36, y - 0.72, 0.96, 0.05, 0.65, 0.05, 0x4b5456);
                        }
                    }
                }
                // Vertical corner piers break up the broad flat elevations.
                for (const u of [-width / 2 + 0.18, width / 2 - 0.18]) {
                    facade('trim', u, h / 2, 0.12, 0.32, h, 0.3, palette[1]);
                }
            }
        }
        Object.keys(batches).forEach(type => {
            const entries = batches[type];
            const mesh = new THREE.InstancedMesh(unit, materials[type], entries.length);
            entries.forEach((entry, i) => { mesh.setMatrixAt(i, entry[0]); mesh.setColorAt(i, entry[1]); });
            mesh.instanceMatrix.needsUpdate = true;
            mesh.instanceColor.needsUpdate = true;
            mesh._noMerge = true;
            mesh.name = 'CampusSkyline-' + type;
            // r134 does not calculate aggregate instance bounds; buildings surround the camera.
            mesh.frustumCulled = false;
            scene.add(mesh);
        });
        return { nightMaterial: materials.light, drawCalls: Object.keys(batches).length };
    };
})();
