/**
 * TC_002: ドキュメント追加テスト
 * テスト仕様書: docs/test-cases/TC_002.md
 */

const DocumentSearcher = require('../../../src/DocumentSearcher');

describe('TC_002: ドキュメント追加テスト', () => {
  let searcher;

  beforeEach(() => {
    searcher = new DocumentSearcher();
  });

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
