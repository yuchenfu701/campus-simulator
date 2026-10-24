# AI 导览老师模型

校园默认加载 `assets/models/ai-teacher.glb`。当前角色是独立的成年亚洲女性老师，不再和学生共用 VRM，也不再使用上版的 Rocketbox 欧美商务人像。模型由 [Ara 3D Gen](https://github.com/olatunde85/3d-gen) 的 MakeHuman 数据生成，选择亚洲女性面部参数、深发色和深色职业装；在 Blender 中补了眼镜与教师工牌。角色约 1.7 米，约 4 万三角面，包含骨骼、贴图、`Idle` 和 `Wave` 两段动画。最终 GLB 约 6 MB。启动时播放自然站立动画，进入场景后在老师身边按 E 可咨询。

这仍是可免费再加工的过渡版，并不完全匹配最初的 [中国女教师参考图](../assets/ai-teacher-reference.png)：服装是条纹上衣与半裙，不是参考图里的深色西装裤装；面部细节也达不到高端扫描/商业角色的水准。请以 [实际预览图](ai-teacher-preview.png) 判断是否满足当前版本的要求。需要更高保真时，替换同一路径的合法可导出 GLB 即可，页面加载逻辑无需改动。

## 重新生成

1. 按 [Ara 3D Gen 的安装说明](https://github.com/olatunde85/3d-gen#quick-start)安装依赖和 MakeHuman 素材，使用 `tools/chinese-teacher-params.json` 导出原始 GLB。其命令行直接调用可避免 PowerShell 环境下 npm 参数转发差异：

   ```powershell
   & .\node_modules\.bin\tsx.cmd scripts/export-cli.ts --params 'D:\编程\test - clude版\tools\chinese-teacher-params.json' --formats glb --out out-teacher
   ```

2. 在本项目目录中用 Blender 添加眼镜和工牌，并只保留待机、挥手动画：

   ```powershell
   & 'D:\应用\blender.exe' -b -P 'tools\finish_chinese_teacher.py' -- '<Ara 输出的 Chinese_teacher_01.glb>' 'assets\models\ai-teacher.glb'
   ```

授权来源和使用范围见 [ai-teacher-LICENSE.md](../assets/models/ai-teacher-LICENSE.md)。Meshy 7、Tripo H3.1 当前免费档导出受限，而先前导出的 Tripo H2.5 教师面颈失真，因此没有放进项目。可进一步试看的较真实亚洲女性资源是 Sketchfab 的 [Alina Ip](https://sketchfab.com/3d-models/alina-ip-realistic-asian-woman-animated-600d4d4aa71c4181b2567a3605ce8c57)，页面标注可下载且为 CC BY；但其服装是便装，并未在项目中使用。
