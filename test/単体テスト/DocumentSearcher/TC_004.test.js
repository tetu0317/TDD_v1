/**
 * TC_004: 複数結果検索テスト
 * テスト仕様書: docs/test-cases/TC_004.md
 */

const DocumentSearcher = require('../../../src/DocumentSearcher');

describe('TC_004: 複数結果検索テスト', () => {
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
