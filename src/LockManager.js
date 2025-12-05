/**
 * LockManager - ファイルベースの排他制御
 *
 * .lockファイルを使用した簡易的な排他制御を提供する
 * 複数ユーザーによる同時アクセスを最小限の方法で制御する
 */

const fs = require('fs');

class LockManager {
  /**
   * @param {string} lockPath - ロックファイルのパス
   */
  constructor(lockPath) {
    this.lockPath = lockPath;
    this.isLocked = false;
  }

  /**
   * ロックを取得
   * @returns {boolean} ロック取得成功時true、既にロックされている場合false
   */
  acquireLock() {
    // 既にロックファイルが存在する場合は取得失敗
    if (fs.existsSync(this.lockPath)) {
      return false;
    }

    try {
      // ロックファイル作成（排他的に作成）
      const timestamp = Date.now();
      fs.writeFileSync(this.lockPath, String(timestamp), { flag: 'wx' });
      this.isLocked = true;
      return true;
    } catch (error) {
      // ファイルが既に存在する場合（競合状態）
      if (error.code === 'EEXIST') {
        return false;
      }
      throw error;
    }
  }

  /**
   * ロックを解放
   * @returns {boolean} 常にtrue（ロックファイルが存在しない場合も成功扱い）
   */
  releaseLock() {
    try {
      if (fs.existsSync(this.lockPath)) {
        fs.unlinkSync(this.lockPath);
      }
      this.isLocked = false;
      return true;
    } catch (error) {
      // ファイルが存在しない場合は成功扱い
      if (error.code === 'ENOENT') {
        this.isLocked = false;
        return true;
      }
      throw error;
    }
  }

  /**
   * ロック状態を確認
   * @returns {boolean} ロック中の場合true
   */
  isCurrentlyLocked() {
    return fs.existsSync(this.lockPath);
  }
}

module.exports = LockManager;
