/**
 * TC_019: ロック取得テスト
 *
 * 事前条件: ロックファイルが存在しない状態
 * 判定条件: .lockファイルが作成され、trueが返却される
 */

const path = require('path');
const fs = require('fs');
const LockManager = require('../../../src/LockManager');

describe('TC_019: ロック取得テスト', () => {
  const testLockPath = path.join(__dirname, 'test_tc019.lock');
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

  test('acquireLock()がtrueを返す', () => {
    const result = lockManager.acquireLock();
    expect(result).toBe(true);
  });

  test('.lockファイルが作成される', () => {
    lockManager.acquireLock();
    expect(fs.existsSync(testLockPath)).toBe(true);
  });

  test('ロックファイルにタイムスタンプが記録される', () => {
    lockManager.acquireLock();
    const content = fs.readFileSync(testLockPath, 'utf8');
    expect(content).toMatch(/\d+/); // タイムスタンプ（数字）が含まれる
  });

  test('既にロックが取得されている場合はfalseを返す', () => {
    lockManager.acquireLock();
    const result = lockManager.acquireLock();
    expect(result).toBe(false);
  });
});
