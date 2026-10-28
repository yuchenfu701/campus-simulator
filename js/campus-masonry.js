/* Near-field masonry, rebuilt on both cold and cached map loads.
 * Shared textures and merged batches keep detail independent of draw-call count. */
(function () {
    'use strict';
    window.campusTrackMaterial = function(T, width, depth) {
        const cv=document.createElement('canvas'); cv.width=cv.height=128;
        const c=cv.getContext('2d'); c.fillStyle='#98604e'; c.fillRect(0,0,128,128);
        let n=23;
        for(let i=0;i<5000;i++) {
            n=(Math.imul(n,1664525)+1013904223)>>>0;
            const x=n%128,y=(n>>>8)%128;
            c.fillStyle=(n&1)?'rgba(255,235,215,.10)':'rgba(35,22,18,.12)'; c.fillRect(x,y,1,1);
        }
        const tx=new T.CanvasTexture(cv); tx.encoding=T.sRGBEncoding;
        tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set((width||160)/2,(depth||52)/2);tx.anisotropy=4;
        return new T.MeshStandardMaterial({map:tx,roughness:.98,metalness:0});
    };
    window.buildCampusMasonry = function (T, scene) {
        if (scene.getObjectByName('campus-masonry')) return;
        const group = new T.Group(); group.name = 'campus-masonry'; scene.add(group);
        let seed = 8191;
        function rand() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
        function texture(brick) {
            const cv = document.createElement('canvas'); cv.width = cv.height = 512;
            const c = cv.getContext('2d');
            c.fillStyle = brick ? '#85837b' : '#a5a59d'; c.fillRect(0, 0, 512, 512);
            if (brick) {
                for(let y=0;y<8;y++) for(let x=-1;x<4;x++) {
                    const v = Math.floor(104 + rand()*24);
                    c.fillStyle = 'rgb('+v+','+(v+3)+','+(v+1)+')';
                    c.fillRect(x*171+(y%2)*85+2,y*64+2,167,60);
                }
            }
            // Fine aggregate, not a directional brush pattern.
            for(let i=0;i<36000;i++) {
                c.fillStyle = rand()>.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.045)';
                c.fillRect(rand()*512,rand()*512,1+rand()*2,1+rand()*2);
            }
            const tx = new T.CanvasTexture(cv); tx.wrapS=tx.wrapT=T.RepeatWrapping;
            tx.encoding=T.sRGBEncoding; tx.anisotropy=4; return tx;
        }
        const mats = [
            new T.MeshStandardMaterial({map:texture(true),color:0xffffff,roughness:.92}),
            new T.MeshStandardMaterial({map:texture(false),color:0xe5e3d9,roughness:.86}),
            new T.MeshStandardMaterial({color:0x454d4b,roughness:.72,metalness:.08})
        ];
        const batches = [[],[],[]];
        function box(i,x,y,z,w,h,d) {
            const geo = new T.BoxGeometry(w,h,d), uv=geo.attributes.uv;
            // Box faces use metres, so a 140m wall cannot stretch one brick across its length.
            for(let k=0;k<uv.count;k++) {
                const face=Math.floor(k/4);
                const u=face<2?d:w, v=(face===2||face===3)?d:h;
                uv.setXY(k,uv.getX(k)*u/2,uv.getY(k)*v/2);
            }
            geo.translate(x,y,z); batches[i].push(geo);
        }
        function wallRun(x,z,length,alongX) {
            const coord=(a,y,offset,w,h,d,i)=>box(i,x+(alongX?a:offset),y,z+(alongX?offset:a),alongX?w:d,h,alongX?d:w);
            // Low stone plinth and recessed brick panels, on both sides of the boundary.
            for(const side of [-1,1]) {
                coord(0,.33,side*.27,length,.65,.12,1);
                coord(0,1.8,side*.24,length,2.3,.06,0);
                coord(0,2.92,side*.29,length,.12,.12,2);
            }
            const n=Math.ceil(length/6);
            for(let j=0;j<=n;j++) {
                const a=-length/2+j*length/n;
                coord(a,1.5,0,.40,3.0,.66,1);
                coord(a,3.13,0,.54,.17,.78,2);
            }
        }
        wallRun(0,-78,300,true);
        wallRun(-78.5,118,143,true); wallRun(78.5,118,143,true);
        wallRun(-150,20,196,false); wallRun(150,20,196,false);
        // Stone courses on the gate columns, with narrow recessed horizontal joints.
        for(const x of [-7.9,7.9]) {
            for(let y=.24;y<6;y+=.48) {
                box(1,x,y,118-.84,2.41,.46,.06);
                box(1,x,y,118+.84,2.41,.46,.06);
                box(1,x-1.21,y,118,.06,.46,1.68);
                box(1,x+1.21,y,118,.06,.46,1.68);
            }
            box(2,x,.16,118,2.55,.32,1.82);
            box(2,x,6.03,118,2.58,.18,1.84);
        }
        const sign=document.createElement('canvas');sign.width=1024;sign.height=128;
        const ctx=sign.getContext('2d');ctx.fillStyle='#253438';ctx.fillRect(0,0,1024,128);
        ctx.strokeStyle='#bca77c';ctx.lineWidth=3;ctx.strokeRect(9,9,1006,110);
        ctx.fillStyle='#eee4cc';ctx.font='bold 68px "Microsoft YaHei",sans-serif';
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('爱哲安民未来学校',512,64);
        const signTex=new T.CanvasTexture(sign);signTex.encoding=T.sRGBEncoding;
        const signMat=new T.MeshStandardMaterial({map:signTex,roughness:.8});
        for(const side of [-1,1]) {
            const plaque=new T.Mesh(new T.PlaneGeometry(11.6,.72),signMat);
            plaque.position.set(0,5.4,118+side*.53);plaque.rotation.y=side<0?Math.PI:0;
            plaque._noMerge=true;group.add(plaque);
        }
        batches.forEach(function(geos,i) {
            const merged=T.BufferGeometryUtils.mergeBufferGeometries(geos,false);
            geos.forEach(g=>g.dispose());
            const mesh=new T.Mesh(merged,mats[i]); mesh._noMerge=true;
            mesh.receiveShadow=true; mesh.castShadow=false; group.add(mesh);
        });
    };
})();
