#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
爱哲安民未来学校校园模拟器 - HTTP服务器
使用Python内置的http.server模块启动本地Web服务器
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# 服务器配置
PORT = 8080
HOST = 'localhost'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器"""
    
    def end_headers(self):
        # 添加CORS头，允许跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # 设置缓存控制
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        """自定义日志输出"""
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    """主函数"""
    # 切换到脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # 创建服务器
    handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer((HOST, PORT), handler) as httpd:
            server_url = f"http://{HOST}:{PORT}"
            
            print("=" * 50)
            print("  爱哲安民未来学校校园模拟器 - 网站服务器")
            print("=" * 50)
            print()
            print(f"✓ 服务器已启动")
            print(f"✓ 访问地址: {server_url}")
            print(f"✓ 网站首页: {server_url}/site.html")
            print(f"✓ 登录页面: {server_url}/login.html")
            print()
            print("按 Ctrl+C 停止服务器")
            print("=" * 50)
            print()
            
            # 自动打开浏览器
            try:
                webbrowser.open(server_url + '/site.html')
                print("✓ 已自动打开浏览器")
            except Exception as e:
                print(f"⚠ 无法自动打开浏览器: {e}")
                print(f"   请手动访问: {server_url}/site.html")
            
            print()
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print()
        print("=" * 50)
        print("  服务器已停止")
        print("=" * 50)
        sys.exit(0)
    except OSError as e:
        if e.errno == 98 or e.errno == 48:  # Address already in use
            print(f"❌ 错误: 端口 {PORT} 已被占用")
            print(f"   请关闭占用该端口的程序，或修改脚本中的PORT值")
        else:
            print(f"❌ 错误: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()




