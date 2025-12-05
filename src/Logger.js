/**
 * Logger - ファイルベースのロギング
 *
 * アプリケーションのログをファイルに出力する
 * トラブルシューティング用
 */

const fs = require('fs');

class Logger {
  /**
   * @param {string} logPath - ログファイルのパス
   */
  constructor(logPath) {
    this.logPath = logPath;
  }

  /**
   * ログを出力
   * @param {string} level - ログレベル（INFO, WARN, ERROR）
   * @param {string} message - ログメッセージ
   */
  log(level, message) {
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} [${level}] ${message}\n`;

    fs.appendFileSync(this.logPath, logLine, 'utf8');
  }

  /**
   * INFOレベルのログを出力
   * @param {string} message - ログメッセージ
   */
  info(message) {
    this.log('INFO', message);
  }

  /**
   * WARNレベルのログを出力
   * @param {string} message - ログメッセージ
   */
  warn(message) {
    this.log('WARN', message);
  }

  /**
   * ERRORレベルのログを出力
   * @param {string} message - ログメッセージ
   */
  error(message) {
    this.log('ERROR', message);
  }

  /**
   * ログファイルの内容を取得
   * @returns {string} ログファイルの内容
   */
  getLogContent() {
    if (fs.existsSync(this.logPath)) {
      return fs.readFileSync(this.logPath, 'utf8');
    }
    return '';
  }

  /**
   * ログファイルをクリア
   */
  clear() {
    if (fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, '', 'utf8');
    }
  }
}

module.exports = Logger;
