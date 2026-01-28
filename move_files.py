# -*- coding: utf-8 -*-
import shutil
import os

# 切换到项目根目录
os.chdir(r'D:\编程\test')

# 移动部署相关文档到 07-部署指南
deploy_files = [
    'Railway部署步骤.md',
    'MongoDB Atlas下一步操作.md',
    'MongoDB Atlas免费套餐说明.md',
    'MongoDB配置步骤.md',
    '快速部署指南.md'
]

# 移动启动相关文档到 08-启动指南
startup_files = [
    '如何开始游戏.md',
    '如何启动后端服务器.md',
    '快速启动指南.md',
    '启动说明.txt'
]

# 移动文件
for file in deploy_files:
    if os.path.exists(file):
        try:
            shutil.move(file, 'docs/07-部署指南/')
            print(f'OK: {file}')
        except Exception as e:
            print(f'ERROR: {file} - {e}')

for file in startup_files:
    if os.path.exists(file):
        try:
            shutil.move(file, 'docs/08-启动指南/')
            print(f'OK: {file}')
        except Exception as e:
            print(f'ERROR: {file} - {e}')

print('\n文件移动完成！')

