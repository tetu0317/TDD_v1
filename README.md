# ドキュメント管理ツール v1.0

TDD（テスト駆動開発）で実装したElectronベースのドキュメント検索・管理ツール

## プロジェクト概要

本プロジェクトは、TDD実施要領（CLAUDE.md）に従って開発された、文書検索機能を持つドキュメント管理ツールです。

### 主な機能

- ドキュメントの登録・管理
- キーワードによる全文検索
- ドキュメント内容の表示
- 日本語対応

## プロジェクト構成

```
TDD_v1/
├── src/                           # ソースコード
│   ├── DocumentSearcher.js        # ドキュメント検索クラス
│   ├── FileReader.js              # ファイル読み込みクラス
│   ├── UIController.js            # UI制御クラス
│   ├── index.html                 # メインUI
│   └── main.js                    # Electronエントリポイント
├── test/                          # テストコード（テストケース単位）
│   ├── 単体テスト/
│   │   ├── DocumentSearcher/
│   │   │   ├── TC_001.test.js    # コンストラクタテスト
│   │   │   ├── TC_002.test.js    # ドキュメント追加テスト
│   │   │   ├── TC_003.test.js    # 単一キーワード検索テスト
│   │   │   ├── TC_004.test.js    # 複数結果検索テスト
│   │   │   ├── TC_005.test.js    # 検索結果なしテスト
│   │   │   └── TC_006.test.js    # 空文字検索テスト
│   │   └── FileReader/
│   │       ├── TC_007.test.js    # ファイル読み込み成功テスト
│   │       └── TC_008.test.js    # ファイル読み込み失敗テスト
│   ├── 統合テスト/
│   │   └── UIController/
│   │       ├── TC_009.test.js    # 検索結果表示テスト
│   │       ├── TC_010.test.js    # ドキュメント表示テスト
│   │       └── TC_011.test.js    # 検索実行テスト
│   └── E2Eテスト/
│       └── TC_012.test.js        # 検索から表示までの一連操作
├── docs/                          # ドキュメント
│   ├── test-specs.md              # テスト仕様書（統合版）
│   └── test-cases/                # テストケース（個別）
│       ├── TC_001.md              # コンストラクタテスト
│       ├── TC_002.md              # ドキュメント追加テスト
│       ├── TC_003.md              # 単一キーワード検索テスト
│       ├── TC_004.md              # 複数結果検索テスト
│       ├── TC_005.md              # 検索結果なしテスト
│       ├── TC_006.md              # 空文字検索テスト
│       ├── TC_007.md              # ファイル読み込み成功テスト
│       ├── TC_008.md              # ファイル読み込み失敗テスト
│       ├── TC_009.md              # 検索結果表示テスト
│       ├── TC_010.md              # ドキュメント表示テスト
│       ├── TC_011.md              # 検索実行テスト
│       └── TC_012.md              # E2Eテスト
├── CLAUDE.md                      # TDD実施要領
├── package.json
└── jest.config.js
```

## セットアップ

### 必要な環境

- Node.js v16以上
- npm

### インストール

```bash
# 依存関係のインストール
npm install
```

**注意**: Electronのインストールに失敗する場合（エラーコード2551など）は、以下を実行：

```bash
# Electronをスキップしてインストール
set ELECTRON_SKIP_BINARY_DOWNLOAD=1
npm install
```

テスト実行には影響ありません。詳細は `ELECTRON_SETUP.md` を参照してください。

## テスト実行

```bash
# 全テスト実行
npm test

# カバレッジ付き実行
npm run test:coverage

# 単体テストのみ
npm run test:unit

# 統合テストのみ
npm run test:integration

# E2Eテストのみ
npm run test:e2e

# ウォッチモード
npm run test:watch
```

## アプリケーション起動

```bash
npm start
```

**前提条件**: Electronのインストールが必要です。

**Electronのインストールに失敗した場合**:
- テストのみ実行可能です（`npm test`）
- GUIアプリケーションは起動できません
- 詳細は `ELECTRON_SETUP.md` の「テストのみ実行」セクションを参照

## テスト結果

### テストケース

| 分類 | テストスイート | テストケース数 | 結果 |
|------|---------------|---------------|------|
| 単体テスト（DocumentSearcher） | 6スイート | 9件 | ✅ 全て成功 |
| 単体テスト（FileReader） | 2スイート | 5件 | ✅ 全て成功 |
| 統合テスト（UIController） | 3スイート | 9件 | ✅ 全て成功 |
| E2Eテスト | 1スイート | 4件 | ✅ 全て成功 |
| **合計** | **12スイート** | **28件** | **✅ 全て成功** |

### テストケース詳細

| テストID | テスト名 | 分類 | ファイル |
|----------|---------|------|----------|
| TC_001 | コンストラクタテスト | 単体テスト | [test/単体テスト/DocumentSearcher/TC_001.test.js](test/単体テスト/DocumentSearcher/TC_001.test.js) |
| TC_002 | ドキュメント追加テスト | 単体テスト | [test/単体テスト/DocumentSearcher/TC_002.test.js](test/単体テスト/DocumentSearcher/TC_002.test.js) |
| TC_003 | 単一キーワード検索テスト | 単体テスト | [test/単体テスト/DocumentSearcher/TC_003.test.js](test/単体テスト/DocumentSearcher/TC_003.test.js) |
| TC_004 | 複数結果検索テスト | 単体テスト | [test/単体テスト/DocumentSearcher/TC_004.test.js](test/単体テスト/DocumentSearcher/TC_004.test.js) |
| TC_005 | 検索結果なしテスト | 単体テスト | [test/単体テスト/DocumentSearcher/TC_005.test.js](test/単体テスト/DocumentSearcher/TC_005.test.js) |
| TC_006 | 空文字検索テスト | 単体テスト | [test/単体テスト/DocumentSearcher/TC_006.test.js](test/単体テスト/DocumentSearcher/TC_006.test.js) |
| TC_007 | ファイル読み込み成功テスト | 単体テスト | [test/単体テスト/FileReader/TC_007.test.js](test/単体テスト/FileReader/TC_007.test.js) |
| TC_008 | ファイル読み込み失敗テスト | 単体テスト | [test/単体テスト/FileReader/TC_008.test.js](test/単体テスト/FileReader/TC_008.test.js) |
| TC_009 | 検索結果表示テスト | 統合テスト | [test/統合テスト/UIController/TC_009.test.js](test/統合テスト/UIController/TC_009.test.js) |
| TC_010 | ドキュメント表示テスト | 統合テスト | [test/統合テスト/UIController/TC_010.test.js](test/統合テスト/UIController/TC_010.test.js) |
| TC_011 | 検索実行テスト | 統合テスト | [test/統合テスト/UIController/TC_011.test.js](test/統合テスト/UIController/TC_011.test.js) |
| TC_012 | 検索から表示までの一連操作 | E2Eテスト | [test/E2Eテスト/TC_012.test.js](test/E2Eテスト/TC_012.test.js) |

### カバレッジ

| 指標 | 目標 | 達成値 | 結果 |
|------|------|--------|------|
| Statements | 80% | 93.75% | ✅ |
| Branches | 75% | 81.81% | ✅ |
| Functions | 80% | 90.9% | ✅ |
| Lines | 80% | 93.75% | ✅ |

#### クラス別カバレッジ

| クラス | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| DocumentSearcher | 100% | 100% | 100% | 100% |
| FileReader | 87.5% | 50% | 100% | 87.5% |
| UIController | 93.54% | 75% | 83.33% | 93.54% |

## TDD開発プロセス

本プロジェクトは、以下のTDDサイクルに従って開発されました：

### 1. Red（失敗するテストを書く）
- テスト仕様書の作成
- 全28テストケースの実装

### 2. Green（テストを通す最小限の実装）
- DocumentSearcher.js
- FileReader.js
- UIController.js
- index.html
- main.js

### 3. Refactor（リファクタリング）
- コードの品質向上
- カバレッジの確認と調整

## 開発ガイドライン

詳細なTDD実施要領については、[CLAUDE.md](./CLAUDE.md)を参照してください。

### チェックリスト

#### テスト作成前
- [x] 要求仕様は明確か
- [x] インターフェースは定義されているか
- [x] テストケースは網羅的か

#### 実装前
- [x] テストコードは作成済みか
- [x] テストは失敗するか
- [x] 判定条件は適切か

#### 実装後
- [x] 全テストが成功するか
- [x] コードは最小限か
- [x] リファクタリングの余地はないか

## 今後の拡張予定

- [ ] docxファイル対応
- [ ] テスト結果のxlsxファイル出力
- [ ] 複数ファイル形式の混在対応
- [ ] パフォーマンステスト（1000件以上）
- [ ] セキュリティテスト

## ライセンス

MIT

## 作成日

2025-11-19
