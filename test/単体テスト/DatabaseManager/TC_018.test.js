/**
 * TC_018: 複合検索テスト（タグ＋フリーテキスト）
 *
 * 事前条件: 複数ドキュメントが登録済み
 * 判定条件: タグとキーワードの両方の条件を満たすドキュメントのみ返却
 */

const path = require('path');
const fs = require('fs');
const DatabaseManager = require('../../../src/DatabaseManager');

describe('TC_018: 複合検索テスト（タグ＋フリーテキスト）', () => {
  const testDbPath = path.join(__dirname, 'test_tc018.db');
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
      { title: '発注仕様書_顧客B', filePath: '/server/docs/spec_b.docx', projectName: 'プロジェクトA', documentType: '発注仕様書', description: '内部向け仕様書です' },
      { title: '設計書_顧客A', filePath: '/server/docs/design_a.docx', projectName: 'プロジェクトA', documentType: '設計書', description: '顧客向け設計書です' },
      { title: '発注仕様書_顧客C', filePath: '/server/docs/spec_c.docx', projectName: 'プロジェクトB', documentType: '発注仕様書', description: '顧客向け仕様書です' }
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

  test('プロジェクト名のみで検索', () => {
    const results = dbManager.search({ projectName: 'プロジェクトA' });
    expect(results.length).toBe(3);
  });

  test('文書種類のみで検索', () => {
    const results = dbManager.search({ documentType: '発注仕様書' });
    expect(results.length).toBe(3);
  });

  test('キーワードのみで検索', () => {
    const results = dbManager.search({ keyword: '顧客' });
    expect(results.length).toBe(4); // 全4件がtitle or descriptionに"顧客"を含む
  });

  test('プロジェクト名 + 文書種類で検索', () => {
    const results = dbManager.search({
      projectName: 'プロジェクトA',
      documentType: '発注仕様書'
    });
    expect(results.length).toBe(2);
    results.forEach(doc => {
      expect(doc.project_name).toBe('プロジェクトA');
      expect(doc.document_type).toBe('発注仕様書');
    });
  });

  test('プロジェクト名 + キーワードで検索', () => {
    const results = dbManager.search({
      projectName: 'プロジェクトA',
      keyword: '顧客向け'
    });
    expect(results.length).toBe(2);
    results.forEach(doc => {
      expect(doc.project_name).toBe('プロジェクトA');
      const hasKeyword = doc.title.includes('顧客向け') ||
                         doc.description.includes('顧客向け') ||
                         doc.file_path.includes('顧客向け');
      expect(hasKeyword).toBe(true);
    });
  });

  test('全条件（プロジェクト名 + 文書種類 + キーワード）で検索', () => {
    const results = dbManager.search({
      projectName: 'プロジェクトA',
      documentType: '発注仕様書',
      keyword: '顧客向け'
    });
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('発注仕様書_顧客A');
  });

  test('条件を満たすドキュメントがない場合は空配列', () => {
    const results = dbManager.search({
      projectName: 'プロジェクトA',
      documentType: '発注仕様書',
      keyword: '存在しないキーワード'
    });
    expect(results).toEqual([]);
  });

  test('空のオプションで全件取得', () => {
    const results = dbManager.search({});
    expect(results.length).toBe(4);
  });
});
