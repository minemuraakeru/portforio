# 改善プロンプト: 縦並び写真の間・下の白い線が消えないとき

## 目的
サブページ（2.html 等）で縦に並んだ写真の「間」または「直下」に表示される白い線・帯を完全に消す。

## 実行手順

### 1. 問題のスコープを固定する
- 対象: `project-container` > `project-images` > `ul.vertical-image-list` > `li` > `img`
- 現象: 写真と写真の間に細い白線、または写真ブロックの下に白い領域が出る

### 2. HTML の実体を確認する
- 該当ページの HTML を開き、`ul` の子が `li` のみか、余計な要素・コメント・空白テキストノードがないか確認する。
- 複数写真のページ（例: 2.html）で `li` の数と `img` の数が一致しているか確認する。

### 3. 効いている CSS をすべて列挙する
- `stylesheet.css` と `sub-stylesheet.css` のうち、以下に該当するセレクタをすべて検索する:
  - `img`, `li`, `ul`, `.vertical-image-list`, `.project-images`, `.project-container`, `main`, `body`
- メディアクエリ内のルールも含める。
- 詳細度の高いルール（例: `.project-images .vertical-image-list img`）が、意図しない `border` / `background` / `margin` / `padding` / `box-shadow` / `outline` を持っていないか確認する。

### 4. 白線の原因候補を潰す
以下を **一つのブロック** で、詳細度を十分高くして上書きする（サブページ専用でよいなら `body` にクラスを付与して `body.subpage .project-images ...` などで囲む）:

- `li`: `margin: 0; padding: 0; border: 0; outline: 0; background: transparent; box-shadow: none;`
- `img`: 上記に加え `vertical-align: top; line-height: 0; font-size: 0; display: block;`
- `ul.vertical-image-list`: `gap: 0; margin: 0; padding: 0; border: 0; background: transparent;`
- 疑わしい親（`.project-images` など）: `background: transparent; border: 0;`

### 5. 写真間の「隙間」を完全になくす
- `li` の `margin` / `padding` を 0 にし、`ul` に `gap: 0` を指定する（flex の gap が白く見える場合があるため）。
- 画像だけの隙間なら、`img` を `display: block` にし、`vertical-align` と `line-height` を 0 にする。

### 6. 確認
- 複数写真のサブページ（2.html 等）をブラウザで開き、写真の間と写真ブロックの下に白い線・帯が残っていないか確認する。

---

## 実行済み（今回の適用内容）
- **sub-stylesheet.css の末尾**に、詳細度の高いセレクタ `main .project-container .project-images .vertical-image-list` およびその `li` / `img` 用のブロックを追加。
- 以下のプロパティを `!important` で強制: `margin`, `padding`, `border`, `outline`, `background`, `box-shadow`, `gap`（ul のみ）, `display`, `vertical-align`, `line-height`, `font-size`（img のみ）。
- これで他ルールやメディアクエリより優先され、写真間の白線が出ないようにした。
