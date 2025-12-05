/**
 * TC_016: 文書種類による検索テスト
 *
 * 事前条件: 複数種類のドキュメントが登録済み
 * 判定条件: 指定文書種類に一致するドキュメントのみ返却
 */

const path = require('path');
const fs = require('fs');
const DatabaseManager = require('../../../src/DatabaseManager');

describe('TC_016: 文書種類による検索テスト', () => {
  const testDbPath = path.join(__dirname, 'test_tc016.db');
  let dbManager;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    dbManager = new DatabaseManager(testDbPath);
    dbManager.initialize();

    // テストデータ投入
    const testDocs = [
      { title: '仕様書A', filePath: '/path/a', projectName: 'プロジェクトA', documentType: '発注仕様書', description: '説明A' },
      { title: '仕様書B', filePath: '/path/b', projectName: 'プロジェクトB', documentType: '発注仕様書', description: '説明B' },
      { title: '設計書A', filePath: '/path/c', projectName: 'プロジェクトA', documentType: '設計書', description: '説明C' }
    ];
    testDocs.forEach(doc => dbManager.addDocument(doc));
  });

  afterEach(() => {
    if (dbManager) {
      dbManager.close();
    }
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('searchByDocumentType("発注仕様書")で2件返却', () => {
    const results = dbManager.searchByDocumentType('発注仕様書');
    expect(results.length).toBe(2);
  });

  test('全結果のdocumentTypeが"発注仕様書"', () => {
    const results = dbManager.searchByDocumentType('発注仕様書');
    results.forEach(doc => {
      expect(doc.document_type).toBe('発注仕様書');
    });
  });

  test('searchByDocumentType("設計書")で1件返却', () => {
    const results = dbManager.searchByDocumentType('設計書');
    expect(results.length).toBe(1);
    expect(results[0].document_type).toBe('設計書');
  });

  test('存在しない文書種類で空配列が返却', () => {
    const results = dbManager.searchByDocumentType('存在しない種類');
    expect(results).toEqual([]);
  });
});
