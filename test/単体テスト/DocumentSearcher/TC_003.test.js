/**
 * TC_003: 単一キーワード検索テスト
 * テスト仕様書: docs/test-cases/TC_003.md
 */

const DocumentSearcher = require('../../../src/DocumentSearcher');

describe('TC_003: 単一キーワード検索テスト', () => {
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

  test('キーワード"設計"で検索時、"設計書.txt"のみが返却される', () => {
    const results = searcher.search('設計');

    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('設計書.txt');
  });
});
