/**
 * TC_022: UIからのドキュメント登録・検索フロー
 *
 * 事前条件: データベースが空の状態
 * 判定条件: 登録 → 検索 → 結果表示の一連のフローが正常動作
 */

const path = require('path');
const fs = require('fs');
const DatabaseManager = require('../../../src/DatabaseManager');
const LockManager = require('../../../src/LockManager');
const Logger = require('../../../src/Logger');

describe('TC_022: ドキュメント登録・検索フロー統合テスト', () => {
  const testDir = path.join(__dirname, 'test_tc022');
  const testDbPath = path.join(testDir, 'test.db');
  const testLockPath = path.join(testDir, 'test.lock');
  const testLogPath = path.join(testDir, 'test.log');

  let dbManager;
  let lockManager;
  let logger;

  beforeEach(() => {
    // テストディレクトリ作成
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // 既存ファイルをクリーンアップ
    [testDbPath, testLockPath, testLogPath].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // インスタンス作成・初期化
    dbManager = new DatabaseManager(testDbPath);
    lockManager = new LockManager(testLockPath);
    logger = new Logger(testLogPath);

    dbManager.initialize();
  });

  afterEach(() => {
    // クリーンアップ
    if (dbManager) {
      dbManager.close();
    }
    lockManager.releaseLock();

    // テストファイル削除
    [testDbPath, testLockPath, testLogPath].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  describe('シナリオ1: 基本的な登録・検索フロー', () => {
    test('ドキュメントを登録し、プロジェクト名で検索できる', () => {
      // 1. ロック取得
      const lockResult = lockManager.acquireLock();
      expect(lockResult).toBe(true);

      // 2. ドキュメント登録
      const doc = {
        title: '発注仕様書_プロジェクトA',
        filePath: '\\\\fileserver\\docs\\spec.docx',
        projectName: 'プロジェクトA',
        documentType: '発注仕様書',
        description: '顧客向け仕様書'
      };
      const id = dbManager.addDocument(doc);
      expect(id).toBeGreaterThan(0);

      // 3. ロック解放
      lockManager.releaseLock();

      // 4. プロジェクト名で検索
      const results = dbManager.search({ projectName: 'プロジェクトA' });
      expect(results.length).toBe(1);
      expect(results[0].file_path).toBe(doc.filePath);

      // 5. ログ確認
      logger.info('テスト完了');
      const logContent = logger.getLogContent();
      expect(logContent).toContain('テスト完了');
    });

    test('複数ドキュメントを登録し、文書種類で絞り込める', () => {
      // 複数ドキュメント登録
      const docs = [
        { title: '発注仕様書_A', filePath: '/path/a', projectName: 'PJ-A', documentType: '発注仕様書', description: '説明A' },
        { title: '設計書_A', filePath: '/path/b', projectName: 'PJ-A', documentType: '設計書', description: '説明B' },
        { title: '発注仕様書_B', filePath: '/path/c', projectName: 'PJ-B', documentType: '発注仕様書', description: '説明C' }
      ];

      docs.forEach(doc => dbManager.addDocument(doc));

      // 文書種類で検索
      const results = dbManager.search({ documentType: '発注仕様書' });
      expect(results.length).toBe(2);
      results.forEach(r => {
        expect(r.document_type).toBe('発注仕様書');
      });
    });
  });

  describe('シナリオ2: 複合検索', () => {
    beforeEach(() => {
      // テストデータ投入
      const docs = [
        { title: '発注仕様書_顧客A', filePath: '/server/pj-a/spec1.docx', projectName: 'プロジェクトA', documentType: '発注仕様書', description: '顧客A向け仕様書' },
        { title: '発注仕様書_顧客B', filePath: '/server/pj-a/spec2.docx', projectName: 'プロジェクトA', documentType: '発注仕様書', description: '顧客B向け仕様書' },
        { title: '設計書_内部', filePath: '/server/pj-a/design.docx', projectName: 'プロジェクトA', documentType: '設計書', description: '内部設計資料' },
        { title: '発注仕様書_顧客C', filePath: '/server/pj-b/spec.docx', projectName: 'プロジェクトB', documentType: '発注仕様書', description: '顧客C向け仕様書' }
      ];
      docs.forEach(doc => dbManager.addDocument(doc));
    });

    test('プロジェクト名と文書種類で絞り込み', () => {
      const results = dbManager.search({
        projectName: 'プロジェクトA',
        documentType: '発注仕様書'
      });
      expect(results.length).toBe(2);
    });

    test('プロジェクト名とキーワードで絞り込み', () => {
      const results = dbManager.search({
        projectName: 'プロジェクトA',
        keyword: '顧客A'
      });
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('発注仕様書_顧客A');
    });

    test('全条件で絞り込み', () => {
      const results = dbManager.search({
        projectName: 'プロジェクトA',
        documentType: '発注仕様書',
        keyword: '顧客B'
      });
      expect(results.length).toBe(1);
      expect(results[0].file_path).toBe('/server/pj-a/spec2.docx');
    });
  });

  describe('シナリオ3: 排他制御', () => {
    test('ロック中は他の操作がブロックされる', () => {
      // 最初のロック取得
      const lock1 = lockManager.acquireLock();
      expect(lock1).toBe(true);

      // 2回目のロック取得は失敗
      const lock2 = lockManager.acquireLock();
      expect(lock2).toBe(false);

      // ロック解放後は取得可能
      lockManager.releaseLock();
      const lock3 = lockManager.acquireLock();
      expect(lock3).toBe(true);
    });
  });

  describe('シナリオ4: ロギング', () => {
    test('各操作がログに記録される', () => {
      logger.info('ドキュメント登録開始');

      const doc = {
        title: 'テスト文書',
        filePath: '/test/path',
        projectName: 'テストPJ',
        documentType: '仕様書',
        description: 'テスト用'
      };
      const id = dbManager.addDocument(doc);
      logger.info(`ドキュメント登録完了: ID=${id}`);

      const results = dbManager.search({ projectName: 'テストPJ' });
      logger.info(`検索完了: ${results.length}件`);

      const logContent = logger.getLogContent();
      expect(logContent).toContain('ドキュメント登録開始');
      expect(logContent).toContain('ドキュメント登録完了');
      expect(logContent).toContain('検索完了');
    });

    test('エラー時のログ記録', () => {
      logger.error('テストエラー発生');
      logger.warn('テスト警告');

      const logContent = logger.getLogContent();
      expect(logContent).toContain('[ERROR]');
      expect(logContent).toContain('[WARN]');
    });
  });

  describe('シナリオ5: エッジケース', () => {
    test('空の検索条件で全件取得', () => {
      const docs = [
        { title: '文書1', filePath: '/path/1', projectName: 'PJ1', documentType: '種類1', description: '説明1' },
        { title: '文書2', filePath: '/path/2', projectName: 'PJ2', documentType: '種類2', description: '説明2' }
      ];
      docs.forEach(doc => dbManager.addDocument(doc));

      const results = dbManager.search({});
      expect(results.length).toBe(2);
    });

    test('該当なしの検索で空配列', () => {
      dbManager.addDocument({
        title: '文書',
        filePath: '/path',
        projectName: 'PJ',
        documentType: '種類',
        description: '説明'
      });

      const results = dbManager.search({ projectName: '存在しないPJ' });
      expect(results).toEqual([]);
    });

    test('日本語のプロジェクト名・文書種類が正しく保存・検索される', () => {
      const doc = {
        title: '発注仕様書_山田太郎様向け',
        filePath: '\\\\ファイルサーバー\\共有\\仕様書\\発注仕様書.docx',
        projectName: 'プロジェクト甲',
        documentType: '発注仕様書',
        description: '山田太郎様向けの発注仕様書です。納期は12月末。'
      };

      const id = dbManager.addDocument(doc);
      const saved = dbManager.getDocumentById(id);

      expect(saved.title).toBe(doc.title);
      expect(saved.file_path).toBe(doc.filePath);
      expect(saved.project_name).toBe(doc.projectName);
      expect(saved.document_type).toBe(doc.documentType);
      expect(saved.description).toBe(doc.description);

      // 検索も正常動作
      const results = dbManager.search({ keyword: '山田太郎' });
      expect(results.length).toBe(1);
    });
  });
});
