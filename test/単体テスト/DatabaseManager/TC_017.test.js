/**
 * TC_017: フリーテキスト検索テスト
 *
 * 事前条件: ドキュメントが登録済み
 * 判定条件: title, file_path, descriptionのいずれかにキーワードを含むドキュメントが返却
 */

const path = require('path');
const fs = require('fs');
const DatabaseManager = require('../../../src/DatabaseManager');

describe('TC_017: フリーテキスト検索テスト', () => {
  const testDbPath = path.join(__dirname, 'test_tc017.db');
  let dbManager;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    dbManager = new DatabaseManager(testDbPath);
    dbManager.initialize();

    // テストデータ投入
    const testDocs = [
      { title: '発注仕様書_顧客A', filePath: '/server/docs/spec_a.docx', projectName: 'プロジェクトA', documentType: '発注仕様書', description: '顧客向け仕様書です' },
      { title: '設計書_内部', filePath: '/server/docs/design.docx', projectName: 'プロジェクトB', documentType: '設計書', description: 'システム設計資料' },
      { title: '見積書_顧客B', filePath: '/server/顧客B/estimate.xlsx', projectName: 'プロジェクトC', documentType: '見積書', description: '見積もり資料' }
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

  test('searchByKeyword("顧客")でdescriptionに"顧客"を含むドキュメントが返却', () => {
    const results = dbManager.searchByKeyword('顧客');
    expect(results.length).toBeGreaterThanOrEqual(1);

    // 少なくとも1件はdescriptionに"顧客"を含む
    const hasMatch = results.some(doc =>
      doc.description.includes('顧客') ||
      doc.title.includes('顧客') ||
      doc.file_path.includes('顧客')
    );
    expect(hasMatch).toBe(true);
  });

  test('searchByKeyword("仕様書")でtitleに"仕様書"を含むドキュメントが返却', () => {
    const results = dbManager.searchByKeyword('仕様書');
    expect(results.length).toBeGreaterThanOrEqual(1);

    const hasMatch = results.some(doc =>
      doc.title.includes('仕様書') ||
      doc.description.includes('仕様書')
    );
    expect(hasMatch).toBe(true);
  });

  test('searchByKeyword("設計")でtitleまたはdescriptionに"設計"を含むドキュメントが返却', () => {
    const results = dbManager.searchByKeyword('設計');
    expect(results.length).toBe(1); // 1件のドキュメントが "設計" を含む
    expect(results[0].title).toBe('設計書_内部');
  });

  test('存在しないキーワードで空配列が返却', () => {
    const results = dbManager.searchByKeyword('存在しないキーワードXYZ');
    expect(results).toEqual([]);
  });

  test('空文字で全ドキュメントが返却', () => {
    const results = dbManager.searchByKeyword('');
    expect(results.length).toBe(3);
  });
});
