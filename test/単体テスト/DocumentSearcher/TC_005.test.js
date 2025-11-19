/**
 * TC_005: 検索結果なしテスト
 * テスト仕様書: docs/test-cases/TC_005.md
 */

const DocumentSearcher = require('../../../src/DocumentSearcher');

describe('TC_005: 検索結果なしテスト', () => {
  let searcher;

  beforeEach(() => {
    searcher = new DocumentSearcher();
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
