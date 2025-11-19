/**
 * TC_007: ファイル読み込み成功テスト
 * テスト仕様書: docs/test-cases/TC_007.md
 */

const FileReader = require('../../../src/FileReader');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('TC_007: ファイル読み込み成功テスト', () => {
  let fileReader;
  let tempDir;
  let testFilePath;

  beforeEach(() => {
    fileReader = new FileReader();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc007-'));
    testFilePath = path.join(tempDir, 'test.txt');
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  test('ファイル内容が文字列として返却される', () => {
    const testContent = 'これはテストファイルの内容です。';
    fs.writeFileSync(testFilePath, testContent, 'utf8');

    const result = fileReader.readFile(testFilePath);

    expect(typeof result).toBe('string');
    expect(result).toBe(testContent);
  });

  test('日本語を含むファイルが正しく読み込める', () => {
    const testContent = 'システム設計に関する文書です。\n改行も含みます。';
    fs.writeFileSync(testFilePath, testContent, 'utf8');

    const result = fileReader.readFile(testFilePath);

    expect(result).toBe(testContent);
  });

  test('空ファイルを読み込むと空文字列が返される', () => {
    fs.writeFileSync(testFilePath, '', 'utf8');

    const result = fileReader.readFile(testFilePath);

    expect(result).toBe('');
  });
});
