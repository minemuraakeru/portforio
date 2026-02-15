# ポートフォリオ Home 画像表示速度の改善方法

## すでに適用した対策（index.html）

- **`loading="lazy"`** … 最初の1枚以外の画像を遅延読み込み。画面外の画像はスクロールで近づいたときに読み込むため、初回表示が軽くなる。
- **`decoding="async"`** … 画像のデコードを非同期で行い、メインスレッドをブロックしない。
- **`width` / `height`** … 表示サイズのアスペクト（4:3）を指定してレイアウトシフト（CLS）を防止。
- **`<link rel="preload">`** … 最初に表示される画像（SILK bio-craft）を先読みして LCP を改善。

---

## さらに速くしたい場合の案

### 1. サムネイル用の小さい画像を用意する（効果大）

グリッドでは実寸の大きな画像は不要です。表示幅に合わせて縮小した画像を使うと転送量が減り、表示が速くなります。

- **目安**: 幅 800〜1200px 程度の JPEG または WebP（Retina 対応なら 1600px 程度）
- **例**: `images/silkbiocraft/thumb_ファイル1.png` のように `thumb_` 付きで保存し、一覧ではそのパスを参照する。
- ツール例: [Squoosh](https://squoosh.app/)、ImageMagick、Sharp（Node）などで一括リサイズ可能。

### 2. WebP / AVIF 形式にする（効果大）

同じ画質で PNG/JPEG よりファイルサイズを削減できます。

- **WebP**: ブラウザ対応が広い。`<picture>` でフォールバック可能。
- **AVIF**: さらに小さいが、古いブラウザでは非対応のため `<picture>` で JPEG/PNG を fallback に。

```html
<picture>
  <source srcset="images/silkbiocraft/ファイル1.webp" type="image/webp">
  <img src="images/silkbiocraft/ファイル 1.png" alt="..." loading="lazy" decoding="async" width="800" height="600">
</picture>
```

### 3. CDN / 画像最適化サービス（中〜大規模向け）

- **Cloudinary** … リサイズ・フォーマット変換・キャッシュを URL パラメータで指定可能（既に `cloudinary-project` がある場合は連携を検討）。
- **imgix / Cloudflare Images** … 同様にオンデマンドでリサイズ・最適化。

### 4. フォント・CSS の優先読み込み

- 重要な CSS は `<head>` の前方で読み込む（すでに `stylesheet.css` は前方にある）。
- 不要な同期スクリプトを減らし、`defer` を維持する。

### 5. 画像フォルダの軽量化（運用で効果大）

現在、一部フォルダが数十〜数百 MB あります（例: photos 約321MB、silkbiocraft 約89MB）。  
一覧で使う画像は「サムネ用」と「詳細用」を分け、一覧では必ずサムネ用の小さいファイルだけを参照すると効果が大きいです。

---

## チェックリスト

- [x] 最初の1枚以外に `loading="lazy"` を付与
- [x] 全画像に `decoding="async"` を付与
- [x] 最初の画像を `preload`
- [x] `width` / `height` で CLS 防止
- [ ] サムネイル用の縮小画像を用意して一覧で使用
- [ ] WebP/AVIF の導入（`<picture>` でフォールバック）
- [ ] 必要に応じて CDN や画像最適化サービスを検討
