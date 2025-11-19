/**
 * TC_010: ドキュメント表示テスト
 * テスト仕様書: docs/test-cases/TC_010.md
 * @jest-environment jsdom
 */

const UIController = require('../../../src/UIController');
const DocumentSearcher = require('../../../src/DocumentSearcher');
const FileReader = require('../../../src/FileReader');

describe('TC_010: ドキュメント表示テスト', () => {
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
  });

  test('ドキュメント内容が表示エリアに表示される', () => {
    const testContent = 'これはテストドキュメントの内容です。';

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
