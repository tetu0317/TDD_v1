/**
 * TC_014: ドキュメント登録テスト
 *
 * 事前条件: データベースが初期化済み
 * 判定条件: ドキュメントがDBに保存され、IDが返却される
 */

const path = require('path');
const fs = require('fs');
const DatabaseManager = require('../../../src/DatabaseManager');

describe('TC_014: ドキュメント登録テスト', () => {
  const testDbPath = path.join(__dirname, 'test_tc014.db');
  let dbManager;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    dbManager = new DatabaseManager(testDbPath);
    dbManager.initialize();
  });

  afterEach(() => {
    if (dbManager) {
      dbManager.close();
    }
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('addDocument()の返り値が数値（ID）', () => {
    const doc = {
      title: '発注仕様書_プロジェクトA.docx',
      filePath: '\\\\fileserver\\docs\\project_a\\spec.docx',
      projectName: 'プロジェクトA',
      documentType: '発注仕様書',
      description: '顧客向け発注仕様書'
    };

    const id = dbManager.addDocument(doc);
    expect(typeof id).toBe('number');
    expect(id).toBeGreaterThan(0);
  });

  test('DBに1件追加される', () => {
    const doc = {
      title: '発注仕様書_プロジェクトA.docx',
      filePath: '\\\\fileserver\\docs\\project_a\\spec.docx',
      projectName: 'プロジェクトA',
      documentType: '発注仕様書',
      description: '顧客向け発注仕様書'
    };

    dbManager.addDocument(doc);
    const count = dbManager.getDocumentCount();
    expect(count).toBe(1);
  });

  test('各フィールドが正しく保存される', () => {
    const doc = {
      title: '発注仕様書_プロジェクトA.docx',
      filePath: '\\\\fileserver\\docs\\project_a\\spec.docx',
      projectName: 'プロジェクトA',
      documentType: '発注仕様書',
      description: '顧客向け発注仕様書'
    };

    const id = dbManager.addDocument(doc);
    const savedDoc = dbManager.getDocumentById(id);

    expect(savedDoc.title).toBe(doc.title);
    expect(savedDoc.file_path).toBe(doc.filePath);
    expect(savedDoc.project_name).toBe(doc.projectName);
    expect(savedDoc.document_type).toBe(doc.documentType);
    expect(savedDoc.description).toBe(doc.description);
  });

  test('複数ドキュメントを登録できる', () => {
    const docs = [
      { title: '仕様書1', filePath: '/path/1', projectName: 'PJ1', documentType: '仕様書', description: '説明1' },
      { title: '仕様書2', filePath: '/path/2', projectName: 'PJ2', documentType: '仕様書', description: '説明2' },
      { title: '仕様書3', filePath: '/path/3', projectName: 'PJ1', documentType: '設計書', description: '説明3' }
    ];

    docs.forEach(doc => dbManager.addDocument(doc));
    const count = dbManager.getDocumentCount();
    expect(count).toBe(3);
  });
});
