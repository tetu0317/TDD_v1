# Electronアプリケーション実行手順

## 概要
本プロジェクトは、TDD（テスト駆動開発）で実装されたドキュメント管理ツールです。
Electronを使用したデスクトップアプリケーションとして動作します。

## 動作環境

- **Node.js**: v16以上推奨
- **npm**: v7以上推奨
- **OS**: Windows 10/11, macOS 10.13以降, Ubuntu 18.04以降

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd TDD_v1
```

### 2. 依存関係のインストール

```bash
npm install
```

このコマンドで以下がインストールされます：
- Electron v27.0.0
- Jest v29.7.0（テストフレームワーク）
- jsdom（DOM環境シミュレーション）

### 3. アプリケーションの起動

```bash
npm start
```

ウィンドウサイズ: 1200x800px
タイトル: ドキュメント管理ツール v1.0

## 初回起動時の自動処理

アプリケーション起動時に以下が自動実行されます：

1. **サンプルディレクトリの作成**
   - Windows: `C:\Users\<ユーザー名>\document-manager-samples\`
   - macOS/Linux: `~/document-manager-samples/`

2. **サンプルファイルの生成**
   - `設計書.txt` - システム設計に関する文書
   - `仕様書.txt` - 機能仕様とシステム要件
   - `議事録.txt` - 会議の内容と決定事項

3. **ドキュメントの自動登録**
   - 上記3ファイルがアプリケーションに自動登録されます

## 使用方法

### 検索機能

1. **全ドキュメント表示**
   ```
   検索ボックスを空のまま「検索」ボタンをクリック
   または Enterキーを押す
   ```
   → 登録されている全ドキュメントが表示されます

2. **キーワード検索**
   ```
   検索ボックスに「システム」と入力して検索
   ```
   → タイトル、パス、内容に「システム」を含むドキュメントが表示

3. **絞り込み検索**
   ```
   「設計」で検索 → 設計書.txtのみ表示
   「会議」で検索 → 議事録.txtのみ表示
   ```

### ドキュメント表示

- 検索結果のリンクをクリック
- 右側のパネルにドキュメント内容が表示されます
- ファイルが存在しない場合はエラーメッセージが表示

### ショートカットキー

- **Enter**: 検索実行
- **Tab**: フォーカス移動

## テストの実行

### 全テスト実行

```bash
npm test
```

### カバレッジ付きテスト

```bash
npm run test:coverage
```

カバレッジ目標:
- 全体: 80%以上
- DocumentSearcher: 100%

### テスト種別ごとの実行

```bash
# 単体テストのみ
npm run test:unit

# 統合テストのみ
npm run test:integration

# E2Eテストのみ
npm run test:e2e
```

### ウォッチモード（開発時）

```bash
npm run test:watch
```

ファイル変更を検知して自動的にテストが再実行されます。

## プロジェクト構造

```
TDD_v1/
├── src/                        # ソースコード
│   ├── main.js                # Electronメインプロセス
│   ├── index.html             # UIレンダラー
│   ├── DocumentSearcher.js    # ドキュメント検索クラス
│   ├── FileReader.js          # ファイル読み込みクラス
│   └── UIController.js        # UI制御クラス
├── test/                       # テストコード
│   ├── 単体テスト/
│   │   ├── DocumentSearcher/
│   │   └── FileReader/
│   ├── 統合テスト/
│   │   └── UIController/
│   └── E2Eテスト/
├── docs/                       # ドキュメント
│   └── test-cases/            # テストケース仕様書（TC_001〜TC_012）
├── package.json
└── jest.config.js
```

## トラブルシューティング

### Electronのインストールに失敗する

**症状**: `npm install`時にElectronのダウンロードエラー

**対処法**:
```bash
# キャッシュをクリア
npm cache clean --force

# 再インストール
npm install
```

### テストが失敗する

**症状**: `ReferenceError: document is not defined`

**対処法**: jest.config.jsのtestEnvironmentが'jsdom'になっているか確認
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  // ...
};
```

### サンプルファイルが表示されない

**症状**: 起動しても検索結果が空

**対処法**:
1. 開発者ツールを開く（main.jsの31行目のコメントを外す）
2. コンソールでエラーを確認
3. `~/document-manager-samples/`フォルダの存在を確認

## 開発モード

開発時は、開発者ツールを有効化することを推奨します：

**src/main.js の31行目**:
```javascript
// コメントを外す
mainWindow.webContents.openDevTools();
```

これにより、ChromeのDevToolsが自動的に開き、以下が可能になります：
- コンソールログの確認
- DOM構造の検査
- ネットワークリクエストの監視
- JavaScriptのデバッグ

## セキュリティに関する注意

本アプリケーションは**学習・開発用**です。

現在の設定:
- `nodeIntegration: true` - レンダラープロセスでNode.js APIを使用可能
- `contextIsolation: false` - コンテキスト分離を無効化

**本番環境では**以下の対策を推奨:
1. `contextIsolation: true` に変更
2. Preloadスクリプトを使用
3. IPCを介した安全な通信

## ライセンス

MIT License

## サポート

質問・問題報告は、プロジェクトのIssueトラッカーをご利用ください。
