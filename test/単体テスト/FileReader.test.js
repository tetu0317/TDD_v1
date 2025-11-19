/**
 * FileReader クラス - 単体テスト
 * テスト仕様書: docs/test-specs.md
 */

const FileReader = require('../../src/FileReader');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('FileReader クラス', () => {
  let fileReader;
  let tempDir;
  let testFilePath;

  beforeEach(() => {
    fileReader = new FileReader();
    // 一時ディレクトリを作成
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'filereadtest-'));
    testFilePath = path.join(tempDir, 'test.txt');
  });

  afterEach(() => {
    // 一時ファイルとディレクトリをクリーンアップ
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  /**
   * TC_007: ファイル読み込み成功テスト
   * 事前条件: 指定パスにtxtファイルが存在する
   * 判定条件: ファイル内容が文字列として返却される
   */
  describe('TC_007: ファイル読み込み成功テスト', () => {
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

  /**
   * TC_008: ファイル読み込み失敗テスト
   * 事前条件: 指定パスにファイルが存在しない
   * 判定条件: エラーがthrowされ、エラーメッセージに"File not found"が含まれる
   */
  describe('TC_008: ファイル読み込み失敗テスト', () => {
    test('存在しないファイルを読み込むとエラーがthrowされる', () => {
      const nonExistentPath = path.join(tempDir, 'non-existent-file.txt');

      expect(() => {
        fileReader.readFile(nonExistentPath);
      }).toThrow();
    });

    test('エラーメッセージに"File not found"または"ENOENT"が含まれる', () => {
      const nonExistentPath = path.join(tempDir, 'non-existent-file.txt');

      expect(() => {
        fileReader.readFile(nonExistentPath);
      }).toThrow(/File not found|ENOENT/);
    });
  });
});
