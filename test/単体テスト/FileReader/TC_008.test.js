/**
 * TC_008: ファイル読み込み失敗テスト
 * テスト仕様書: docs/test-cases/TC_008.md
 */

const FileReader = require('../../../src/FileReader');
const path = require('path');
const os = require('os');

describe('TC_008: ファイル読み込み失敗テスト', () => {
  let fileReader;

  beforeEach(() => {
    fileReader = new FileReader();
  });

  test('存在しないファイルを読み込むとエラーがthrowされる', () => {
    const nonExistentPath = path.join(os.tmpdir(), 'non-existent-file.txt');

    expect(() => {
      fileReader.readFile(nonExistentPath);
    }).toThrow();
  });

  test('エラーメッセージに"File not found"または"ENOENT"が含まれる', () => {
    const nonExistentPath = path.join(os.tmpdir(), 'non-existent-file.txt');

    expect(() => {
      fileReader.readFile(nonExistentPath);
    }).toThrow(/File not found|ENOENT/);
  });
});
