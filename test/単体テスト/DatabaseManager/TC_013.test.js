/**
 * TC_013: データベース初期化テスト
 *
 * 事前条件: DBファイルが存在しない状態
 * 判定条件: documentsテーブルが正常に作成される
 */

const path = require('path');
const fs = require('fs');
const DatabaseManager = require('../../../src/DatabaseManager');

describe('TC_013: データベース初期化テスト', () => {
  const testDbPath = path.join(__dirname, 'test_tc013.db');
  let dbManager;

  beforeEach(() => {
    // テスト前にDBファイルを削除
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  afterEach(() => {
    // テスト後にDBを閉じてファイルを削除
    if (dbManager) {
      dbManager.close();
    }
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('DatabaseManagerインスタンスが正常に生成される', () => {
    dbManager = new DatabaseManager(testDbPath);
    expect(dbManager).toBeInstanceOf(DatabaseManager);
  });

  test('initialize()でdocumentsテーブルが作成される', () => {
    dbManager = new DatabaseManager(testDbPath);
    dbManager.initialize();

    // テーブルが存在することを確認
    const tableInfo = dbManager.getTableInfo('documents');
    expect(tableInfo).toBeDefined();
    expect(tableInfo.length).toBeGreaterThan(0);
  });

  test('テーブル構造が正しい（必須カラムが存在する）', () => {
    dbManager = new DatabaseManager(testDbPath);
    dbManager.initialize();

    const tableInfo = dbManager.getTableInfo('documents');
    const columnNames = tableInfo.map(col => col.name);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('title');
    expect(columnNames).toContain('file_path');
    expect(columnNames).toContain('project_name');
    expect(columnNames).toContain('document_type');
    expect(columnNames).toContain('description');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('updated_at');
  });

  test('DBファイルが作成される', () => {
    dbManager = new DatabaseManager(testDbPath);
    dbManager.initialize();

    expect(fs.existsSync(testDbPath)).toBe(true);
  });
});
