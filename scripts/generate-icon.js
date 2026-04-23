/**
 * 生成爱哲安民未来学校图标
 * 设计：紫蓝渐变背景 + 白色卡片 + 学士帽 + 金色流苏
 */
const { createCanvas } = require('canvas');
const _pngToIcoMod = require('png-to-ico');
const pngToIco = _pngToIcoMod.default || _pngToIcoMod.imagesToIco || _pngToIcoMod;
const fs = require('fs');
const path = require('path');

// ─── 工具：手动绘制圆角矩形（兼容所有 canvas 版本）─────────────────────────
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,     y + h, x,     y + h - r,  r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x,     y,     x + r, y,           r);
    ctx.closePath();
}

async function generateIcon() {
    const S = 256;
    const canvas = createCanvas(S, S);
    const ctx = canvas.getContext('2d');

    // ── 1. 渐变背景（圆角正方形）─────────────────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, S, S);
    bg.addColorStop(0,   '#667eea');   // 蓝紫
    bg.addColorStop(0.5, '#764ba2');   // 紫
    bg.addColorStop(1,   '#f093fb');   // 粉紫
    roundRect(ctx, 0, 0, S, S, 40);
    ctx.fillStyle = bg;
    ctx.fill();

    // ── 2. 白色内卡 ──────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
    roundRect(ctx, 18, 18, S - 36, S - 36, 22);
    ctx.fill();

    // ── 3. 学士帽 ────────────────────────────────────────────────────────────
    const cx   = S / 2;
    const topY = 72;   // 帽顶菱形中心 Y
    const cap  = '#5B35A0';   // 深紫
    const gold = '#F5C842';   // 金色

    // 帽顶菱形（旋转 45° 的正方形）
    ctx.save();
    ctx.translate(cx, topY);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = cap;
    ctx.fillRect(-30, -30, 60, 60);
    ctx.restore();

    // 帽檐（宽扁圆角矩形）
    ctx.fillStyle = cap;
    roundRect(ctx, cx - 70, topY + 22, 140, 20, 6);
    ctx.fill();

    // 帽身（矩形，帽檐正下方）
    ctx.fillStyle = cap;
    ctx.fillRect(cx - 28, topY + 42, 56, 44);

    // 帽顶高光（白色小三角增加立体感）
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.moveTo(cx,        topY - 28);
    ctx.lineTo(cx - 18,   topY);
    ctx.lineTo(cx + 18,   topY);
    ctx.closePath();
    ctx.fill();

    // 流苏线（右侧垂下）
    ctx.strokeStyle = gold;
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 62, topY + 32);
    ctx.lineTo(cx + 62, topY + 78);
    ctx.stroke();

    // 流苏球
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(cx + 62, topY + 86, 9, 0, Math.PI * 2);
    ctx.fill();

    // 流苏横线装饰
    ctx.strokeStyle = gold;
    ctx.lineWidth = 3;
    [topY + 72, topY + 79, topY + 86].forEach(lineY => {
        ctx.beginPath();
        ctx.moveTo(cx + 55, lineY);
        ctx.lineTo(cx + 69, lineY);
        ctx.stroke();
    });

    // ── 4. 底部文字 "爱哲" ───────────────────────────────────────────────────
    ctx.fillStyle   = cap;
    ctx.font        = 'bold 28px "Microsoft YaHei", "SimHei", Arial';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('爱哲', cx, 210);

    // ── 5. 保存文件 ───────────────────────────────────────────────────────────
    const buildDir = path.join(__dirname, '..', 'build');
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

    const pngPath = path.join(buildDir, 'icon.png');
    fs.writeFileSync(pngPath, canvas.toBuffer('image/png'));
    console.log('✅ PNG 已生成:', pngPath);

    // 生成多尺寸 ICO（16/32/48/64/128/256）
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = await Promise.all(sizes.map(size => {
        const c = createCanvas(size, size);
        const c2 = c.getContext('2d');
        c2.drawImage(canvas, 0, 0, size, size);
        return c.toBuffer('image/png');
    }));

    const icoBuffer = await pngToIco(pngBuffers);
    const icoPath   = path.join(buildDir, 'icon.ico');
    fs.writeFileSync(icoPath, icoBuffer);
    console.log('✅ ICO 已生成:', icoPath);

    // === PWA 图标（放在 images/ 供 manifest.json 引用）===
    const imagesDir = path.join(__dirname, '..', 'images');
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    for (const [sz, name] of [[192, 'icon-192.png'], [512, 'icon-512.png']]) {
        const c = createCanvas(sz, sz);
        c.getContext('2d').drawImage(canvas, 0, 0, sz, sz);
        fs.writeFileSync(path.join(imagesDir, name), c.toBuffer('image/png'));
        console.log(`✅ PWA图标 ${sz}×${sz} 已生成: images/${name}`);
    }

    console.log('🎉 全部图标生成完成！可以重新打包了：npm run build:win');
}

generateIcon().catch(err => {
    console.error('❌ 图标生成失败:', err.message);
    process.exit(1);
});
