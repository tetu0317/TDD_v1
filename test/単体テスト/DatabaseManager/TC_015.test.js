/**
 * TC_015: プロジェクト名による検索テスト
 *
 * 事前条件: 複数プロジェクトのドキュメントが登録済み
 * 判定条件: 指定プロジェクト名に一致するドキュメントのみ返却
 */

const path = require('path');
const fs = require('fs');
const DatabaseManager = require('../../../src/DatabaseManager');

describe('TC_015: プロジェクト名による検索テスト', () => {
  const testDbPath = path.join(__dirname, 'test_tc015.db');
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

  test('searchByProjectName("プロジェクトA")で2件返却', () => {
    const results = dbManager.searchByProjectName('プロジェクトA');
    expect(results.length).toBe(2);
  });

  test('全結果のprojectNameが"プロジェクトA"', () => {
    const results = dbManager.searchByProjectName('プロジェクトA');
    results.forEach(doc => {
      expect(doc.project_name).toBe('プロジェクトA');
    });
  });

  test('存在しないプロジェクト名で空配列が返却', () => {
    const results = dbManager.searchByProjectName('存在しないプロジェクト');
    expect(results).toEqual([]);
  });
});
