/**
 * UIController クラス - 統合テスト
 * テスト仕様書: docs/test-specs.md
 */

/**
 * @jest-environment jsdom
 */

const UIController = require('../../src/UIController');
const DocumentSearcher = require('../../src/DocumentSearcher');
const FileReader = require('../../src/FileReader');

describe('UIController クラス', () => {
  let uiController;
  let searcher;
  let fileReader;

  beforeEach(() => {
    // DOM環境を準備
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

  /**
   * TC_009: 検索結果表示テスト
   * 事前条件: DOM要素が準備済み、検索結果2件
   * 判定条件: 結果リストに2つのアイテムが表示され、タイトルとパスが正しく表示される
   */
  describe('TC_009: 検索結果表示テスト', () => {
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

  /**
   * TC_010: ドキュメント表示テスト
   * 事前条件: パスリンクがクリック可能状態
   * 判定条件: クリック時に該当ドキュメントの内容が表示エリアに表示される
   */
  describe('TC_010: ドキュメント表示テスト', () => {
    test('ドキュメント内容が表示エリアに表示される', () => {
      const testContent = 'これはテストドキュメントの内容です。';

      // FileReaderをモック
      fileReader.readFile = jest.fn().mockReturnValue(testContent);

      uiController.displayDocument('/documents/test.txt');

      const displayArea = document.getElementById('document-display');
      expect(displayArea.textContent).toContain(testContent);
    });

    test('FileReaderが正しいパスで呼ばれる', () => {
      const testPath = '/documents/design.txt';
      fileReader.readFile = jest.fn().mockReturnValue('test content');

      uiController.displayDocument(testPath);

      expect(fileReader.readFile).toHaveBeenCalledWith(testPath);
    });

    test('ファイル読み込みエラー時にエラーメッセージが表示される', () => {
      fileReader.readFile = jest.fn().mockImplementation(() => {
        throw new Error('File not found');
      });

      uiController.displayDocument('/non/existent/path.txt');

      const displayArea = document.getElementById('document-display');
      expect(displayArea.textContent).toContain('エラー');
    });
  });

  /**
   * TC_011: 検索実行テスト
   * 事前条件: 検索フォームに"テスト"と入力済み
   * 判定条件: 検索ボタンクリック時、"テスト"を含むドキュメントが結果表示される
   */
  describe('TC_011: 検索実行テスト', () => {
    beforeEach(() => {
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

      // イベントリスナーを設定
      searchButton.addEventListener('click', () => {
        uiController.handleSearch();
      });

      // クリックイベントを発火
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
});
