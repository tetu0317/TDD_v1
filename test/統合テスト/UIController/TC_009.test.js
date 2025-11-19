/**
 * TC_009: 検索結果表示テスト
 * テスト仕様書: docs/test-cases/TC_009.md
 * @jest-environment jsdom
 */

const UIController = require('../../../src/UIController');
const DocumentSearcher = require('../../../src/DocumentSearcher');
const FileReader = require('../../../src/FileReader');

describe('TC_009: 検索結果表示テスト', () => {
  let uiController;
  let searcher;
  let fileReader;

  const testResults = [
    {
      title: '設計書.txt',
      path: '/documents/design.txt',
      content: 'システム設計に関する文書です。'
    },
    {
      title: '仕様書.txt',
      path: '/documents/spec.txt',
      content: '機能仕様とシステム要件を記載。'
    }
  ];

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="search-form">
        <input id="search-input" type="text" />
        <button id="search-button">検索</button>
      </div>
      <div id="results-list"></div>
      <div id="document-display"></div>
    `;

    searcher = new DocumentSearcher();
    fileReader = new FileReader();
    uiController = new UIController(searcher, fileReader);
  });

  test('結果リストに2つのアイテムが表示される', () => {
    uiController.displaySearchResults(testResults);

    const resultsList = document.getElementById('results-list');
    const items = resultsList.querySelectorAll('.result-item');

    expect(items.length).toBe(2);
  });

  test('各アイテムにタイトルとパスが正しく表示される', () => {
    uiController.displaySearchResults(testResults);

    const items = document.querySelectorAll('.result-item');

    expect(items[0].textContent).toContain('設計書.txt');
    expect(items[0].textContent).toContain('/documents/design.txt');

    expect(items[1].textContent).toContain('仕様書.txt');
    expect(items[1].textContent).toContain('/documents/spec.txt');
  });

  test('検索結果が空の場合、結果リストが空になる', () => {
    uiController.displaySearchResults([]);

    const resultsList = document.getElementById('results-list');
    const items = resultsList.querySelectorAll('.result-item');

    expect(items.length).toBe(0);
  });
});
