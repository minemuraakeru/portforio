#!/bin/bash
# 9.htmlのkoyart画像を koyart/comp に複製し、1MB超をsipsで圧縮
SRC="images/koyart"
COMP="images/koyart/comp"
TARGET=1048576  # 1MB

mkdir -p "$COMP"

copy_or_compress() {
  local name="$1"
  local src="$SRC/$name"
  local dest="$COMP/$name"
  [ ! -f "$src" ] && echo "スキップ: $name" && return
  local size=$(stat -f%z "$src" 2>/dev/null)
  if [ "$size" -le "$TARGET" ]; then
    cp "$src" "$dest"
    echo "コピー: $name ($(echo "scale=2;$size/1048576" | bc)MB)"
    return
  fi
  local tmp="$COMP/.tmp_$$_$name"
  cp "$src" "$tmp"
  for dim in 4000 3500 3000 2600 2200 1800 1500 1200 1000 800 600 500; do
    sips -Z "$dim" "$tmp" 2>/dev/null
    size=$(stat -f%z "$tmp" 2>/dev/null)
    [ "$size" -le "$TARGET" ] && break
  done
  mv "$tmp" "$dest"
  echo "圧縮: $name -> $(echo "scale=2;$(stat -f%z "$dest")/1048576" | bc)MB"
}

while IFS= read -r name; do
  [ -z "$name" ] && continue
  copy_or_compress "$name"
done << 'LIST'
1.jpg
IMG_1705.JPG
IMG_1707.JPG
IMG_1708.JPG
IMG_3570.jpg
IMG_7326.JPG
IMG_8963.jpg
LIST

echo "完了: images/koyart/comp"
