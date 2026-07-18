from __future__ import annotations

import argparse
import http.server
import mimetypes
import socket
import socketserver
from pathlib import Path

mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("text/javascript", ".js")

ROOT = Path(__file__).resolve().parents[1] / "public"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def local_ip() -> str:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="PyTrain local development server")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    with socketserver.ThreadingTCPServer(("0.0.0.0", args.port), Handler) as server:
        server.daemon_threads = True
        print(f"PC:     http://localhost:{args.port}")
        print(f"LAN:    http://{local_ip()}:{args.port}")
        print("停止: Ctrl+C")
        print("注意: iPhoneのPWAオフライン機能はHTTPS公開後に確認してください。")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しました。")


if __name__ == "__main__":
    main()
