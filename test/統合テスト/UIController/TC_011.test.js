/**
 * TC_011: 検索実行テスト
 * テスト仕様書: docs/test-cases/TC_011.md
 * @jest-environment jsdom
 */

const UIController = require('../../../src/UIController');
const DocumentSearcher = require('../../../src/DocumentSearcher');
const FileReader = require('../../../src/FileReader');

describe('TC_011: 検索実行テスト', () => {
  let uiController;
  let searcher;
  let fileReader;

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

    // テストデータを準備
    searcher.addDocument(
      'テスト設計書.txt',
      '/documents/test-design.txt',
      'テスト設計の内容です。'
    );
    searcher.addDocument(
      '仕様書.txt',
      '/documents/spec.txt',
      '仕様の内容です。'
    );
  });

  test('検索フォームに入力した値で検索が実行される', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.value = 'テスト';

    uiController.handleSearch();

    const resultsList = document.getElementById('results-list');
    const items = resultsList.querySelectorAll('.result-item');

    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('テスト設計書.txt');
  });

  test('検索ボタンクリックで検索が実行される', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchInput.value = 'テスト';

    searchButton.addEventListener('click', () => {
      uiController.handleSearch();
    });

    searchButton.click();

    const resultsList = document.getElementById('results-list');
    const items = resultsList.querySelectorAll('.result-item');

    expect(items.length).toBe(1);
  });

  test('空文字で検索すると全ドキュメントが表示される', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';

    uiController.handleSearch();

    const resultsList = document.getElementById('results-list');
    const items = resultsList.querySelectorAll('.result-item');

    expect(items.length).toBe(2);
  });
});
