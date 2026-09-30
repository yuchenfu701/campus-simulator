# AI 导览老师：独立模型制作与导入

目前项目不再拿学生 VRM 充当老师。场景默认读取 `assets/models/ai-teacher.glb`；在真正的教师模型导入前，只保留可交谈的定位标识。不要把二维参考图伪装成三维人物。

## 推荐制作路线

1. 用 `assets/ai-teacher-reference.png` 作为形象参考，在 [Meshy 的角色生成器](https://www.meshy.ai/3d-tools/ai-character-generator)选择 **Image to 3D**。角色应是成年教师，深蓝西装、浅色衬衫、灰色长裤、眼镜与工作牌，完整四肢，正面 A-pose。检查面部、双手、衣服背面和鞋子，发现畸形就重新生成，不要直接投入游戏。
2. 在 Meshy 的 [Auto Rigging](https://help.meshy.ai/en/articles/16231707-how-to-create-3d-animation-with-auto-rigging)中绑定骨骼，加入自然的站立或交谈循环动画，导出**包含贴图和动画的 GLB**。建议人物高度约 1.7 米，面向 glTF 的 +Z，贴图压至 2K 以内，三角面数最好不超过约 50,000。
3. 将导出的文件命名为 `ai-teacher.glb` 放到 `assets/models/`，刷新 3D 校园页面。页面会自动归一到 1.72 米，播放第一个名字包含 idle、stand 或 talk 的动作；没有这些名字时播放第一个动作。若放在其他位置，可在页面主脚本前设置 `window.CAMPUS_AI_TEACHER_MODEL_URL`。
4. 进入校园，走到老师附近，检查正反面、眼睛、手指、衣领、地面接触、阴影和动作循环，再按 E 验证对话。模型与在线 AI 服务是两回事；Supabase 服务暂停时人物仍可出现，但在线回复不可用。

## 现成模型路线

[Sketchfab 的 Animated Female Teacher for Narration](https://sketchfab.com/3d-models/animated-female-teacher-for-narration-2b24fd414b9a4fbb9ffb5ffdd4e6a4e5)是一款明确标注可下载、带骨骼和动作的教师模型，许可为 CC BY 4.0。下载需要 Sketchfab 账户。下载后在 Blender 中确认贴图和动作，再导出 GLB 放到上述位置；在项目说明或游戏素材鸣谢中署名作者 **LasquetiSpice** 并附原始链接。下载前亲自预览形象是否符合项目写实风格。

如果需要更精细且方便逐项编辑的形象，可用 [VRoid Studio](https://vroid.com/en/studio)制作独立教师，但它的默认风格偏二次元；不要再次从学生模型直接复制。第三方预设和衣物的授权须单独检查。

`assets/ai-teacher-reference.png` 是二维建模参考，并不是可在游戏中转身、行走的模型。
