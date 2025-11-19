/**
 * TC_006: 空文字検索テスト
 * テスト仕様書: docs/test-cases/TC_006.md
 */

const DocumentSearcher = require('../../../src/DocumentSearcher');

describe('TC_006: 空文字検索テスト', () => {
  let searcher;

  beforeEach(() => {
    searcher = new DocumentSearcher();
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
