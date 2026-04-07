# Country Quiz

Country Quiz は、国名や各国の第一級行政区分を覚えるための React + Vite 製クイズアプリです。素早く反復できるクイズ画面と、一覧で確認できる学習用テーブル画面を備えています。

Tauri の設定も含まれているため、同じフロントエンドをデスクトップアプリとしてパッケージしたり、Android ビルドの土台として利用したりできます。

## 主な機能

- 国、アメリカの州、カナダの州、メキシコの州、フランスの地域圏、ドイツの州に対応
- 国モードはアジア、ヨーロッパ、アフリカ、北アメリカ、南アメリカ、オセアニアごとに出題可能
- 国名、現地語名、首都、旗、トップレベルドメインなど、出題形式と選択肢形式を切り替え可能
- 問題数と制限時間を含むプリセットルールとカスタム設定
- 1問でも間違えると終了する一発勝負モード
- 各モードのデータを表形式で確認できる学習ページ
- `react-i18next` による日本語 UI

## 技術スタック

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- URL クエリ状態管理のための `nuqs`
- フォーマットと lint のための Biome
- デスクトップ/モバイル向けパッケージングのための Tauri 2

## 対応モード

### 国

- 全世界
- アジア
- ヨーロッパ
- アフリカ
- 北アメリカ
- 南アメリカ
- オセアニア

### 行政区分

- アメリカの州
- カナダの州
- メキシコの州
- フランスの地域圏
- ドイツの州

## ディレクトリ構成

```text
src/
  components/     ランチャーとクイズ本体の UI
  data/           クイズ用データセットとモード定義
  i18n/           翻訳設定
  pages/          Home、Game、Study の各ページ
src-tauri/        Tauri の設定と Rust エントリポイント
gen/              データ生成用の元データとスクリプト
```

## 必要環境

- Bun
- Node.js
- デスクトップアプリをビルドする場合は Rust toolchain と Tauri の前提ツール
- データ再生成を行う場合は Python 3 と `pandas`

Nix を使う場合は、Rust、Java、Python などを含む開発シェルが [`flake.nix`](./flake.nix) に用意されています。

## 開発

依存関係のインストール:

```bash
bun install
```

Web アプリの開発サーバー起動:

```bash
bun run dev
```

Web アプリのビルド:

```bash
bun run build
```

本番ビルドのプレビュー:

```bash
bun run preview
```

## Tauri

Tauri アプリを開発モードで起動:

```bash
bun run tauri dev
```

Tauri アプリをビルド:

```bash
bun run tauri build
```

Tauri の設定は [`src-tauri/tauri.conf.json`](./src-tauri/tauri.conf.json) にあります。

## データ生成

クイズで使う生成済みデータは `public/data/` にあります。変換元のデータは `gen/data/` にあり、WDQS のクエリは `gen/wdqs/`、変換処理は `gen/scripts/` にあります。

Wikidata Query Service から JSON を取得するには次を実行します。

```bash
bun run gen:wdqs
```

特定のモードだけ更新する場合は次を実行します。

```bash
python gen/scripts/fetch_wdqs.py us-states
```

`gen/data/` を元に `public/data/` を再生成するには次を実行します。

```bash
python gen/scripts/process_all.py
```

生成後、各ファイルには Biome のフォーマットが自動で適用されます。

## Lint とフォーマット

```bash
bun run format
bun run lint
bun run check
```

注意: このプロジェクトでは `lint` と `check` に `--write` が付いているため、実行時にファイルが書き換わる可能性があります。

## ルーティングとデプロイ時の注意

[`vite.config.ts`](./vite.config.ts) で Vite の `base` は `/country-quiz` に設定されています。別のサブパスやドメイン直下に配置する場合は、この値を調整してください。

## ローカライズ

現在の UI 文言は [`src/i18n/ja.json`](./src/i18n/ja.json) にあり、アプリは日本語を既定言語として初期化します。

## ライセンス

MIT。詳細は [`LICENSE`](./LICENSE) を参照してください。
