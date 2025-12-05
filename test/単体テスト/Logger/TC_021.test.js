/**
 * TC_021: ログ出力テスト
 *
 * 事前条件: ログファイルが存在しない状態
 * 判定条件: ログファイルにタイムスタンプ付きメッセージが追記される
 */

const path = require('path');
const fs = require('fs');
const Logger = require('../../../src/Logger');

describe('TC_021: ログ出力テスト', () => {
  const testLogPath = path.join(__dirname, 'test_tc021.log');
  let logger;

  beforeEach(() => {
    // テスト前にログファイルを削除
    if (fs.existsSync(testLogPath)) {
      fs.unlinkSync(testLogPath);
    }
    logger = new Logger(testLogPath);
  });

  afterEach(() => {
    // テスト後にログファイルを削除
    if (fs.existsSync(testLogPath)) {
      fs.unlinkSync(testLogPath);
    }
  });

  test('log("INFO", "テストメッセージ")でログファイルに出力', () => {
    logger.log('INFO', 'テストメッセージ');

    expect(fs.existsSync(testLogPath)).toBe(true);
    const content = fs.readFileSync(testLogPath, 'utf8');
    expect(content).toContain('テストメッセージ');
  });

  test('タイムスタンプが含まれる', () => {
    logger.log('INFO', 'タイムスタンプテスト');

    const content = fs.readFileSync(testLogPath, 'utf8');
    // ISO形式のタイムスタンプパターン: 2025-12-05T10:30:00.000Z
    expect(content).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('ログレベル INFO が正しく出力', () => {
    logger.log('INFO', 'INFOレベルテスト');

    const content = fs.readFileSync(testLogPath, 'utf8');
    expect(content).toContain('[INFO]');
  });

  test('ログレベル WARN が正しく出力', () => {
    logger.log('WARN', 'WARNレベルテスト');

    const content = fs.readFileSync(testLogPath, 'utf8');
    expect(content).toContain('[WARN]');
  });

  test('ログレベル ERROR が正しく出力', () => {
    logger.log('ERROR', 'ERRORレベルテスト');

    const content = fs.readFileSync(testLogPath, 'utf8');
    expect(content).toContain('[ERROR]');
  });

  test('複数行のログが追記される', () => {
    logger.log('INFO', 'メッセージ1');
    logger.log('WARN', 'メッセージ2');
    logger.log('ERROR', 'メッセージ3');

    const content = fs.readFileSync(testLogPath, 'utf8');
    expect(content).toContain('メッセージ1');
    expect(content).toContain('メッセージ2');
    expect(content).toContain('メッセージ3');

    // 3行あることを確認
    const lines = content.trim().split('\n');
    expect(lines.length).toBe(3);
  });

  test('info(), warn(), error()のショートカットメソッドが動作する', () => {
    logger.info('INFOショートカット');
    logger.warn('WARNショートカット');
    logger.error('ERRORショートカット');

    const content = fs.readFileSync(testLogPath, 'utf8');
    expect(content).toContain('[INFO] INFOショートカット');
    expect(content).toContain('[WARN] WARNショートカット');
    expect(content).toContain('[ERROR] ERRORショートカット');
  });
});
