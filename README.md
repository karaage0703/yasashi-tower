# Yasashi Tower - やさしいタワーディフェンスゲーム

このリポジトリはPhaser.jsを使用した初心者向けのタワーディフェンスゲームです。
PC・スマホの両方でプレイ可能で、GitHub Pagesを利用してWebブラウザ上で動作します。

## 特徴

- HTML5/JavaScript/Phaser.jsを使用したブラウザゲーム
- シンプルな操作で遊べるタワーディフェンスゲーム
- PC・スマホの両方に対応したレスポンシブデザイン
- GitHub Pagesを使用した簡単なデプロイ

## プレイ方法

[https://karaage0703.github.io/yasashi-tower/](https://karaage0703.github.io/yasashi-tower/)にアクセス

1. タイトル画面の「ゲーム開始」ボタンをクリック
2. 画面上のマップ上にタワーを設置
3. 敵の進行を防ぎ、全てのウェーブをクリア

### ゲームのルール

- 敵がルートに沿って進み、ゴールに到達するとライフが減少
- タワーを戦略的に配置して敵を倒す
- ライフが0になるとゲームオーバー
- 全てのウェーブをクリアするとゲームクリア

## 開発

### プロジェクト構造

```
yasashi-tower/
├── index.html        # メインのHTMLファイル
├── assets/           # 画像・音声などのリソース
│   ├── images/       # 画像ファイル
│   └── sounds/       # 音声ファイル
├── src/              # JavaScriptソースコード
│   ├── game.js       # ゲームのメインクラス
│   ├── scenes/       # Phaserのシーン
│   ├── entities/     # ゲームエンティティ
│   └── managers/     # ゲーム管理クラス
└── styles/           # CSSファイル
```

### ローカルでの実行方法

1. リポジトリをクローン:

```bash
git clone https://github.com/karaage0703/yasashi-tower.git
cd yasashi-tower
```

2. HTTPサーバーを起動（例: Python 3の場合):

```bash
python -m http.server
```

3. ブラウザで「[http://localhost:8000](http://localhost:8000)」にアクセス

## Git運用ルール

### ブランチ戦略

- `main` ブランチ: 安定版（リリース用）
- `develop` ブランチ: 開発用（最新の開発状況を反映）
- `feature/xxx` ブランチ: 機能ごとの開発用

### コミットメッセージのルール

- `[Add]` 新機能の追加
- `[Fix]` バグ修正
- `[Update]` 仕様変更
- `[Refactor]` コード整理
