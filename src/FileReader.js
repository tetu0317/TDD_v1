/**
 * FileReader クラス
 * ファイルの読み込み機能を提供
 */

const fs = require('fs');

class FileReader {
  /**
   * ファイルを読み込む
   * @param {string} path - ファイルのパス
   * @returns {string} - ファイルの内容
   * @throws {Error} - ファイルが存在しない場合
   */
  readFile(path) {
    try {
      // UTF-8エンコーディングでファイルを読み込む
      const content = fs.readFileSync(path, 'utf8');
      return content;
    } catch (error) {
      // ファイルが存在しない場合のエラーハンドリング
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${path}`);
      }
      // その他のエラーは再スロー
      throw error;
    }
  }
}

module.exports = FileReader;
