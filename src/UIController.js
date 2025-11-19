/**
 * UIController クラス
 * UI操作とドキュメント表示を制御
 */

class UIController {
  /**
   * コンストラクタ
   * @param {DocumentSearcher} searcher - ドキュメント検索インスタンス
   * @param {FileReader} fileReader - ファイル読み込みインスタンス
   */
  constructor(searcher, fileReader) {
    this.searcher = searcher;
    this.fileReader = fileReader;
  }

  /**
   * 検索結果を表示
   * @param {Array} results - 検索結果のドキュメント配列
   */
  displaySearchResults(results) {
    const resultsList = document.getElementById('results-list');

    // 既存の結果をクリア
    resultsList.innerHTML = '';

    // 各検索結果をリスト表示
    results.forEach(doc => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';

      const titleElement = document.createElement('div');
      titleElement.className = 'document-title';
      titleElement.textContent = doc.title;

      const pathElement = document.createElement('a');
      pathElement.className = 'document-link';
      pathElement.textContent = doc.path;
      pathElement.href = '#';
      pathElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.displayDocument(doc.path);
      });

      resultItem.appendChild(titleElement);
      resultItem.appendChild(pathElement);
      resultsList.appendChild(resultItem);
    });
  }

  /**
   * ドキュメントの内容を表示
   * @param {string} path - ドキュメントのファイルパス
   */
  displayDocument(path) {
    const displayArea = document.getElementById('document-display');

    try {
      const content = this.fileReader.readFile(path);
      displayArea.textContent = content;
    } catch (error) {
      displayArea.textContent = `エラー: ファイルを読み込めませんでした。\n${error.message}`;
    }
  }

  /**
   * 検索を実行
   */
  handleSearch() {
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput.value;

    const results = this.searcher.search(keyword);
    this.displaySearchResults(results);
  }
}

// Node.js環境用のexport
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIController;
}
