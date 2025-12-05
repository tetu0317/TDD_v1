/**
 * TC_020: ロック解放テスト
 *
 * 事前条件: ロックが取得済み
 * 判定条件: .lockファイルが削除され、trueが返却される
 */

const path = require('path');
const fs = require('fs');
const LockManager = require('../../../src/LockManager');

describe('TC_020: ロック解放テスト', () => {
  const testLockPath = path.join(__dirname, 'test_tc020.lock');
  let lockManager;

  beforeEach(() => {
    // テスト前にロックファイルを削除
    if (fs.existsSync(testLockPath)) {
      fs.unlinkSync(testLockPath);
    }
    lockManager = new LockManager(testLockPath);
  });

  afterEach(() => {
    // テスト後にロックファイルを削除
    if (fs.existsSync(testLockPath)) {
      fs.unlinkSync(testLockPath);
    }
  });

  test('releaseLock()がtrueを返す', () => {
    lockManager.acquireLock();
    const result = lockManager.releaseLock();
    expect(result).toBe(true);
  });

  test('.lockファイルが削除される', () => {
    lockManager.acquireLock();
    expect(fs.existsSync(testLockPath)).toBe(true);

    lockManager.releaseLock();
    expect(fs.existsSync(testLockPath)).toBe(false);
  });

  test('ロックが取得されていない場合でもエラーにならない', () => {
    const result = lockManager.releaseLock();
    expect(result).toBe(true);
  });

  test('ロック解放後に再度ロックを取得できる', () => {
    lockManager.acquireLock();
    lockManager.releaseLock();

    const result = lockManager.acquireLock();
    expect(result).toBe(true);
  });
});
