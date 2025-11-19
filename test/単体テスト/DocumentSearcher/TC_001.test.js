/**
 * TC_001: コンストラクタテスト
 * テスト仕様書: docs/test-cases/TC_001.md
 */

const DocumentSearcher = require('../../../src/DocumentSearcher');

describe('TC_001: コンストラクタテスト', () => {
  test('インスタンスが正常に生成される', () => {
    const searcher = new DocumentSearcher();
    expect(searcher).toBeInstanceOf(DocumentSearcher);
  });

  test('documents配列が空配列で初期化される', () => {
    const searcher = new DocumentSearcher();
    expect(searcher.documents).toBeDefined();
    expect(Array.isArray(searcher.documents)).toBe(true);
    expect(searcher.documents).toEqual([]);
  });
});
