/**
 * DocumentSearcher クラス
 * ドキュメントの管理と検索機能を提供
 */

class DocumentSearcher {
  /**
   * コンストラクタ
   * documents配列を空配列で初期化
   */
  constructor() {
    this.documents = [];
  }

  /**
   * ドキュメントを追加
   * @param {string} title - ドキュメントのタイトル
   * @param {string} path - ドキュメントのファイルパス
   * @param {string} content - ドキュメントの内容
   * @returns {boolean} - 追加成功時true
   */
  addDocument(title, path, content) {
    const document = {
      title,
      path,
      content
    };
    this.documents.push(document);
    return true;
  }

  /**
   * キーワードでドキュメントを検索
   * @param {string} keyword - 検索キーワード
   * @returns {Array} - 検索結果のドキュメント配列
   */
  search(keyword) {
    // 空文字の場合は全ドキュメントを返す
    if (keyword === '') {
      return this.documents;
    }

    // キーワードを含むドキュメントをフィルタリング
    return this.documents.filter(doc => {
      return doc.title.includes(keyword) ||
             doc.path.includes(keyword) ||
             doc.content.includes(keyword);
    });
  }
}

module.exports = DocumentSearcher;
