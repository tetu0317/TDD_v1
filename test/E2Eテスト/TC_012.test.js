/**
 * TC_012: 検索から表示までの一連操作（E2Eテスト）
 * テスト仕様書: docs/test-cases/TC_012.md
 * @jest-environment jsdom
 */

const DocumentSearcher = require('../../src/DocumentSearcher');
const FileReader = require('../../src/FileReader');
const UIController = require('../../src/UIController');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('TC_012: 検索から表示までの一連操作', () => {
  let searcher;
  let fileReader;
  let uiController;
  let tempDir;
  let testFiles;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <div id="search-form">
          <input id="search-input" type="text" placeholder="検索キーワードを入力" />
          <button id="search-button">検索</button>
        </div>
        <div id="results-list"></div>
        <div id="document-display"></div>
      </div>
    `;

    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc012-'));
    testFiles = [
      {
        filename: '設計書.txt',
        content: 'システム設計に関する文書です。'
      },
      {
        filename: '仕様書.txt',
        content: '機能仕様とシステム要件を記載。'
      },
      {
        filename: '議事録.txt',
        content: '会議の内容と決定事項。'
      }
    ];

    testFiles.forEach(file => {
      const filePath = path.join(tempDir, file.filename);
      fs.writeFileSync(filePath, file.content, 'utf8');
    });

    searcher = new DocumentSearcher();
    fileReader = new FileReader();
    uiController = new UIController(searcher, fileReader);
  });

  afterEach(() => {
    testFiles.forEach(file => {
      const filePath = path.join(tempDir, file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  test('ドキュメント登録から検索・表示までの完全なシナリオ', () => {
    // 1. サンプルドキュメント3件を登録
    testFiles.forEach(file => {
      const filePath = path.join(tempDir, file.filename);
      searcher.addDocument(file.filename, filePath, file.content);
    });

    expect(searcher.documents.length).toBe(3);

    // 2. 検索欄に"システム"と入力
    const searchInput = document.getElementById('search-input');
    searchInput.value = 'システム';

    // 3. 検索実行
    uiController.handleSearch();

    // 4. 検索結果に2件表示されることを確認
    const resultsList = document.getElementById('results-list');
    const items = resultsList.querySelectorAll('.result-item');

    expect(items.length).toBe(2);

    // 5. 1件目のパスリンクをクリック
    const firstItemLink = items[0].querySelector('.document-link');
    expect(firstItemLink).toBeTruthy();

    const firstDocPath = path.join(tempDir, '設計書.txt');

    // 6. ドキュメント内容が表示エリアに表示されることを確認
    uiController.displayDocument(firstDocPath);

    const displayArea = document.getElementById('document-display');
    expect(displayArea.textContent).toContain('システム設計に関する文書です。');
  });

  test('異なる検索キーワードで段階的に検索する', () => {
    testFiles.forEach(file => {
      const filePath = path.join(tempDir, file.filename);
      searcher.addDocument(file.filename, filePath, file.content);
    });

    const searchInput = document.getElementById('search-input');

    // 最初の検索: "システム"
    searchInput.value = 'システム';
    uiController.handleSearch();

    let items = document.querySelectorAll('.result-item');
    expect(items.length).toBe(2);

    // 2回目の検索: "会議"
    searchInput.value = '会議';
    uiController.handleSearch();

    items = document.querySelectorAll('.result-item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('議事録.txt');

    // 3回目の検索: 空文字（全件表示）
    searchInput.value = '';
    uiController.handleSearch();

    items = document.querySelectorAll('.result-item');
    expect(items.length).toBe(3);
  });

  test('ドキュメントを順次表示する', () => {
    testFiles.forEach(file => {
      const filePath = path.join(tempDir, file.filename);
      searcher.addDocument(file.filename, filePath, file.content);
    });

    const displayArea = document.getElementById('document-display');

    // 1つ目のドキュメントを表示
    uiController.displayDocument(path.join(tempDir, '設計書.txt'));
    expect(displayArea.textContent).toContain('システム設計に関する文書です。');

    // 2つ目のドキュメントを表示
    uiController.displayDocument(path.join(tempDir, '仕様書.txt'));
    expect(displayArea.textContent).toContain('機能仕様とシステム要件を記載。');

    // 3つ目のドキュメントを表示
    uiController.displayDocument(path.join(tempDir, '議事録.txt'));
    expect(displayArea.textContent).toContain('会議の内容と決定事項。');
  });

  test('存在しないドキュメントへのアクセス時のエラーハンドリング', () => {
    testFiles.forEach(file => {
      const filePath = path.join(tempDir, file.filename);
      searcher.addDocument(file.filename, filePath, file.content);
    });

    // 検索実行
    const searchInput = document.getElementById('search-input');
    searchInput.value = 'システム';
    uiController.handleSearch();

    // 存在しないファイルパスでドキュメント表示を試みる
    const nonExistentPath = path.join(tempDir, 'non-existent.txt');
    uiController.displayDocument(nonExistentPath);

    const displayArea = document.getElementById('document-display');
    expect(displayArea.textContent).toContain('エラー');
  });
});
