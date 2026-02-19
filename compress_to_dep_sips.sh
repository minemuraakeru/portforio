#!/bin/bash
# 13.htmlのsilkbiocraft画像を silkbiocraft/comp に複製し、1MB超をsipsで圧縮
SRC="images/silkbiocraft"
COMP="images/silkbiocraft/comp"
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
ファイル 1.jpg
ファイル 2.jpeg
ファイル 3.jpeg
ファイル 4.jpeg
ファイル 5.png
ファイル 6.png
ファイル 6_.png
ファイル 7.png
ファイル 8.png
ファイル 9.png
ファイル 10.jpeg
ファイル 11.jpeg
ファイル 12.png
ファイル 13.png
ファイル 14.png
ファイル 15.png
ファイル 16.png
ファイル 17.png
ファイル 18.png
ファイル 19.png
ファイル 20.png
ファイル 21.png
ファイル 22.png
ファイル 23.png
ファイル 24.JPG
LIST

echo "完了: images/silkbiocraft/comp"
