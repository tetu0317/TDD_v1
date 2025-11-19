# テスト仕様書 インデックス

## テストケース一覧

本プロジェクトのテストケースは、以下の12個のテストケースに分割されています。
各テストケースの詳細は、個別のファイルを参照してください。

### 単体テスト - DocumentSearcher クラス

| テストID | テスト名 | 仕様書 | テストコード | 優先度 |
|----------|---------|--------|-------------|--------|
| TC_001 | コンストラクタテスト | [TC_001.md](test-cases/TC_001.md) | [TC_001.test.js](../test/単体テスト/DocumentSearcher/TC_001.test.js) | 高 |
| TC_002 | ドキュメント追加テスト | [TC_002.md](test-cases/TC_002.md) | [TC_002.test.js](../test/単体テスト/DocumentSearcher/TC_002.test.js) | 高 |
| TC_003 | 単一キーワード検索テスト | [TC_003.md](test-cases/TC_003.md) | [TC_003.test.js](../test/単体テスト/DocumentSearcher/TC_003.test.js) | 高 |
| TC_004 | 複数結果検索テスト | [TC_004.md](test-cases/TC_004.md) | [TC_004.test.js](../test/単体テスト/DocumentSearcher/TC_004.test.js) | 高 |
| TC_005 | 検索結果なしテスト | [TC_005.md](test-cases/TC_005.md) | [TC_005.test.js](../test/単体テスト/DocumentSearcher/TC_005.test.js) | 中 |
| TC_006 | 空文字検索テスト | [TC_006.md](test-cases/TC_006.md) | [TC_006.test.js](../test/単体テスト/DocumentSearcher/TC_006.test.js) | 中 |

### 単体テスト - FileReader クラス

| テストID | テスト名 | 仕様書 | テストコード | 優先度 |
|----------|---------|--------|-------------|--------|
| TC_007 | ファイル読み込み成功テスト | [TC_007.md](test-cases/TC_007.md) | [TC_007.test.js](../test/単体テスト/FileReader/TC_007.test.js) | 高 |
| TC_008 | ファイル読み込み失敗テスト | [TC_008.md](test-cases/TC_008.md) | [TC_008.test.js](../test/単体テスト/FileReader/TC_008.test.js) | 高 |

### 統合テスト - UIController クラス

| テストID | テスト名 | 仕様書 | テストコード | 優先度 |
|----------|---------|--------|-------------|--------|
| TC_009 | 検索結果表示テスト | [TC_009.md](test-cases/TC_009.md) | [TC_009.test.js](../test/統合テスト/UIController/TC_009.test.js) | 高 |
| TC_010 | ドキュメント表示テスト | [TC_010.md](test-cases/TC_010.md) | [TC_010.test.js](../test/統合テスト/UIController/TC_010.test.js) | 高 |
| TC_011 | 検索実行テスト | [TC_011.md](test-cases/TC_011.md) | [TC_011.test.js](../test/統合テスト/UIController/TC_011.test.js) | 高 |

### E2Eテスト

| テストID | テスト名 | 仕様書 | テストコード | 優先度 |
|----------|---------|--------|-------------|--------|
| TC_012 | 検索から表示までの一連操作 | [TC_012.md](test-cases/TC_012.md) | [TC_012.test.js](../test/E2Eテスト/TC_012.test.js) | 高 |

## テスト実行コマンド

### 特定のテストケースのみ実行

```bash
# TC_001のみ実行
npm test -- TC_001

# DocumentSearcherの全テスト実行
npm test -- DocumentSearcher

# 単体テストのみ実行
npm test -- test/単体テスト

# 統合テストのみ実行
npm test -- test/統合テスト

# E2Eテストのみ実行
npm test -- test/E2Eテスト
```

### 全テスト実行

```bash
# 全テスト実行
npm test

# カバレッジ付き実行
npm run test:coverage
```

## テストケース命名規則

- **TC_XXX**: テストケースID（001～012）
- **テストケースファイル**: `docs/test-cases/TC_XXX.md`
- **テストコードファイル**: `test/[分類]/[クラス名]/TC_XXX.test.js`

## テスト実施手順

1. **テスト仕様書の確認**: `docs/test-cases/TC_XXX.md`を参照
2. **テストコードの実装**: Red-Green-Refactorサイクルに従う
3. **テストの実行**: `npm test -- TC_XXX`で個別実行
4. **カバレッジの確認**: `npm run test:coverage`で確認

## 関連ドキュメント

- [TDD実施要領](../CLAUDE.md)
- [README](../README.md)
- [統合テスト仕様書](test-specs.md)（旧版）

---

**更新日**: 2025-11-19
