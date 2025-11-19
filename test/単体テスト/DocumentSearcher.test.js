/**
 * DocumentSearcher クラス - 単体テスト
 * テスト仕様書: docs/test-specs.md
 */

const DocumentSearcher = require('../../src/DocumentSearcher');

describe('DocumentSearcher クラス', () => {
  let searcher;

  beforeEach(() => {
    searcher = new DocumentSearcher();
  });

  /**
   * TC_001: コンストラクタテスト
   * 事前条件: DocumentSearcherクラスが定義されている
   * 判定条件: インスタンスが正常に生成され、documents配列が空配列で初期化される
   */
  describe('TC_001: コンストラクタテスト', () => {
    test('インスタンスが正常に生成される', () => {
      expect(searcher).toBeInstanceOf(DocumentSearcher);
    });

    test('documents配列が空配列で初期化される', () => {
      expect(searcher.documents).toBeDefined();
      expect(Array.isArray(searcher.documents)).toBe(true);
      expect(searcher.documents).toEqual([]);
    });
  });

  /**
   * TC_002: ドキュメント追加テスト
   * 事前条件: DocumentSearcherインスタンスが生成済み
   * 判定条件: ドキュメントオブジェクトが配列に追加され、返り値がtrueである
   */
  describe('TC_002: ドキュメント追加テスト', () => {
    test('ドキュメントが正常に追加される', () => {
      const result = searcher.addDocument(
        '設計書.txt',
        '/docs/design.txt',
        '設計内容'
      );

      expect(result).toBe(true);
      expect(searcher.documents).toHaveLength(1);
    });

    test('追加されたドキュメントが正しい構造を持つ', () => {
      searcher.addDocument(
        '設計書.txt',
        '/docs/design.txt',
        '設計内容'
      );

      const doc = searcher.documents[0];
      expect(doc).toHaveProperty('title', '設計書.txt');
      expect(doc).toHaveProperty('path', '/docs/design.txt');
      expect(doc).toHaveProperty('content', '設計内容');
    });

    test('複数のドキュメントを追加できる', () => {
      searcher.addDocument('設計書.txt', '/docs/design.txt', '設計内容');
      searcher.addDocument('仕様書.txt', '/docs/spec.txt', '仕様内容');

      expect(searcher.documents).toHaveLength(2);
    });
  });

  /**
   * TC_003: 単一キーワード検索テスト
   * 事前条件: 3つのドキュメントが登録済み
   * 判定条件: キーワード"設計"で検索時、"設計書.txt"のみが返却される
   */
  describe('TC_003: 単一キーワード検索テスト', () => {
    beforeEach(() => {
      searcher.addDocument(
        '設計書.txt',
        '/documents/design.txt',
        'システム設計に関する文書です。'
      );
      searcher.addDocument(
        '仕様書.txt',
        '/documents/spec.txt',
        '機能仕様とシステム要件を記載。'
      );
      searcher.addDocument(
        '議事録.txt',
        '/documents/minutes.txt',
        '会議の内容と決定事項。'
      );
    });

    test('キーワード"設計"で検索時、"設計書.txt"のみが返却される', () => {
      const results = searcher.search('設計');

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('設計書.txt');
    });
  });

  /**
   * TC_004: 複数結果検索テスト
   * 事前条件: 内容に"システム"を含む複数ドキュメントが登録済み
   * 判定条件: 該当する全ドキュメントが配列で返却される
   */
  describe('TC_004: 複数結果検索テスト', () => {
    beforeEach(() => {
      searcher.addDocument(
        '設計書.txt',
        '/documents/design.txt',
        'システム設計に関する文書です。'
      );
      searcher.addDocument(
        '仕様書.txt',
        '/documents/spec.txt',
        '機能仕様とシステム要件を記載。'
      );
      searcher.addDocument(
        '議事録.txt',
        '/documents/minutes.txt',
        '会議の内容と決定事項。'
      );
    });

    test('キーワード"システム"で検索時、該当する2件が返却される', () => {
      const results = searcher.search('システム');

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(2);
    });

    test('全ての結果のcontentに"システム"が含まれる', () => {
      const results = searcher.search('システム');

      results.forEach(doc => {
        expect(doc.content).toContain('システム');
      });
    });
  });

  /**
   * TC_005: 検索結果なしテスト
   * 事前条件: ドキュメントが登録済み
   * 判定条件: 存在しないキーワードで検索時、空配列が返却される
   */
  describe('TC_005: 検索結果なしテスト', () => {
    beforeEach(() => {
      searcher.addDocument(
        '設計書.txt',
        '/documents/design.txt',
        'システム設計に関する文書です。'
      );
    });

    test('存在しないキーワードで検索時、空配列が返却される', () => {
      const results = searcher.search('存在しないキーワード');

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
      expect(results).toEqual([]);
    });
  });

  /**
   * TC_006: 空文字検索テスト
   * 事前条件: ドキュメントが登録済み
   * 判定条件: 空文字で検索時、全ドキュメントが返却される
   */
  describe('TC_006: 空文字検索テスト', () => {
    beforeEach(() => {
      searcher.addDocument(
        '設計書.txt',
        '/documents/design.txt',
        'システム設計に関する文書です。'
      );
      searcher.addDocument(
        '仕様書.txt',
        '/documents/spec.txt',
        '機能仕様とシステム要件を記載。'
      );
      searcher.addDocument(
        '議事録.txt',
        '/documents/minutes.txt',
        '会議の内容と決定事項。'
      );
    });

    test('空文字で検索時、全ドキュメントが返却される', () => {
      const results = searcher.search('');

      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(3);
      expect(results.length).toBe(searcher.documents.length);
    });
  });
});
