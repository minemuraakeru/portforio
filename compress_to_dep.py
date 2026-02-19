#!/usr/bin/env python3
"""13.htmlで使われているsilkbiocraftの画像をdepに複製し、1MB超のものは品質を保ちつつ1MB以下に圧縮する"""
import os
import shutil
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillowが必要です: pip install Pillow")
    raise

SRC_DIR = Path(__file__).parent / "images" / "silkbiocraft"
DEP_DIR = Path(__file__).parent / "images" / "dep"
TARGET_BYTES = 1024 * 1024  # 1MB

# 13.htmlで参照されている画像（79行目にファイル 24.JPG もあり）
IMAGES = [
    "ファイル 1.jpg",
    "ファイル 2.jpeg",
    "ファイル 3.jpeg",
    "ファイル 4.jpeg",
    "ファイル 5.png",
    "ファイル 6.png",
    "ファイル 6_.png",
    "ファイル 7.png",
    "ファイル 8.png",
    "ファイル 9.png",
    "ファイル 10.jpeg",
    "ファイル 11.jpeg",
    "ファイル 12.png",
    "ファイル 13.png",
    "ファイル 14.png",
    "ファイル 15.png",
    "ファイル 16.png",
    "ファイル 17.png",
    "ファイル 18.png",
    "ファイル 19.png",
    "ファイル 20.png",
    "ファイル 21.png",
    "ファイル 22.png",
    "ファイル 23.png",
    "ファイル 24.JPG",
]


def compress_image(src_path: Path, dest_path: Path) -> None:
    """画像を品質を保ちつつ1MB以下に圧縮して保存（同じ拡張子・ファイル名を維持）"""
    img = Image.open(src_path)
    w, h = img.size
    ext = dest_path.suffix.lower()
    dest_path.parent.mkdir(parents=True, exist_ok=True)

    if ext in (".jpg", ".jpeg"):
        # JPEG: 品質を下げて1MB以下に
        rgb = img.convert("RGB")
        for quality in range(92, 50, -3):
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            rgb.save(dest_path, "JPEG", quality=quality, optimize=True)
            if dest_path.stat().st_size <= TARGET_BYTES:
                return
        # まだ大きい場合はリサイズ
        for scale in [0.9, 0.8, 0.7, 0.6, 0.5]:
            nw, nh = int(w * scale), int(h * scale)
            resized = img.resize((nw, nh), Image.Resampling.LANCZOS).convert("RGB")
            resized.save(dest_path, "JPEG", quality=88, optimize=True)
            if dest_path.stat().st_size <= TARGET_BYTES:
                return
        return

    # PNG: リサイズで1MB以下に（透過があれば維持）
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")
    scale = 1.0
    for _ in range(30):
        nw, nh = max(200, int(w * scale)), max(200, int(h * scale))
        resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
        resized.save(dest_path, "PNG", optimize=True)
        if dest_path.stat().st_size <= TARGET_BYTES:
            return
        scale *= 0.85
    # 極端に大きいPNGはJPEGで保存し .jpg で出力（dep内で拡張子が変わる）
    out_jpg = dest_path.with_suffix(".jpg")
    img_rgb = img.convert("RGB") if img.mode == "RGBA" else img
    img_rgb.save(out_jpg, "JPEG", quality=88, optimize=True)


def main():
    DEP_DIR.mkdir(parents=True, exist_ok=True)
    for name in IMAGES:
        src = SRC_DIR / name
        if not src.exists():
            print(f"スキップ（存在しません）: {name}")
            continue
        dest = DEP_DIR / name
        size_mb = src.stat().st_size / (1024 * 1024)
        if src.stat().st_size <= TARGET_BYTES:
            shutil.copy2(src, dest)
            print(f"コピー: {name} ({size_mb:.2f}MB)")
        else:
            compress_image(src, dest)
            out = dest.with_suffix(".jpg") if dest.suffix.lower() == ".png" and dest.with_suffix(".jpg").exists() else dest
            new_mb = out.stat().st_size / (1024 * 1024)
            print(f"圧縮: {name} {size_mb:.2f}MB -> {new_mb:.2f}MB ({out.name})")
    print("完了: images/dep に保存しました。")


if __name__ == "__main__":
    main()
