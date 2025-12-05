/**
 * DatabaseManager - SQLiteによるドキュメント管理
 *
 * ドキュメントのメタデータ（タイトル、ファイルパス、プロジェクト名、文書種類）を
 * SQLiteデータベースで管理し、検索機能を提供する
 */

const Database = require('better-sqlite3');

class DatabaseManager {
  /**
   * @param {string} dbPath - データベースファイルのパス
   */
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = new Database(dbPath);
  }

  /**
   * データベースを初期化（テーブル作成）
   */
  initialize() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        file_path TEXT NOT NULL,
        project_name TEXT,
        document_type TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.db.exec(createTableSQL);

    // インデックス作成
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_project_name ON documents(project_name)');
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_document_type ON documents(document_type)');
  }

  /**
   * テーブル情報を取得
   * @param {string} tableName - テーブル名
   * @returns {Array} カラム情報の配列
   */
  getTableInfo(tableName) {
    const stmt = this.db.prepare(`PRAGMA table_info(${tableName})`);
    return stmt.all();
  }

  /**
   * ドキュメントを追加
   * @param {Object} doc - ドキュメント情報
   * @param {string} doc.title - タイトル
   * @param {string} doc.filePath - ファイルパス
   * @param {string} doc.projectName - プロジェクト名
   * @param {string} doc.documentType - 文書種類
   * @param {string} doc.description - 説明
   * @returns {number} 追加されたドキュメントのID
   */
  addDocument(doc) {
    const stmt = this.db.prepare(`
      INSERT INTO documents (title, file_path, project_name, document_type, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      doc.title,
      doc.filePath,
      doc.projectName || null,
      doc.documentType || null,
      doc.description || null
    );
    return result.lastInsertRowid;
  }

  /**
   * ドキュメント数を取得
   * @returns {number} ドキュメント数
   */
  getDocumentCount() {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM documents');
    const result = stmt.get();
    return result.count;
  }

  /**
   * IDでドキュメントを取得
   * @param {number} id - ドキュメントID
   * @returns {Object|undefined} ドキュメント情報
   */
  getDocumentById(id) {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * プロジェクト名で検索
   * @param {string} projectName - プロジェクト名
   * @returns {Array} 検索結果
   */
  searchByProjectName(projectName) {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE project_name = ?');
    return stmt.all(projectName);
  }

  /**
   * 文書種類で検索
   * @param {string} documentType - 文書種類
   * @returns {Array} 検索結果
   */
  searchByDocumentType(documentType) {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE document_type = ?');
    return stmt.all(documentType);
  }

  /**
   * キーワードで検索（title, file_path, descriptionを対象）
   * @param {string} keyword - 検索キーワード
   * @returns {Array} 検索結果
   */
  searchByKeyword(keyword) {
    if (!keyword || keyword === '') {
      const stmt = this.db.prepare('SELECT * FROM documents');
      return stmt.all();
    }

    const stmt = this.db.prepare(`
      SELECT * FROM documents
      WHERE title LIKE ? OR file_path LIKE ? OR description LIKE ?
    `);
    const pattern = `%${keyword}%`;
    return stmt.all(pattern, pattern, pattern);
  }

  /**
   * 複合検索
   * @param {Object} options - 検索オプション
   * @param {string} [options.projectName] - プロジェクト名
   * @param {string} [options.documentType] - 文書種類
   * @param {string} [options.keyword] - キーワード
   * @returns {Array} 検索結果
   */
  search(options = {}) {
    const conditions = [];
    const params = [];

    if (options.projectName) {
      conditions.push('project_name = ?');
      params.push(options.projectName);
    }

    if (options.documentType) {
      conditions.push('document_type = ?');
      params.push(options.documentType);
    }

    if (options.keyword) {
      conditions.push('(title LIKE ? OR file_path LIKE ? OR description LIKE ?)');
      const pattern = `%${options.keyword}%`;
      params.push(pattern, pattern, pattern);
    }

    let sql = 'SELECT * FROM documents';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  /**
   * データベース接続を閉じる
   */
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = DatabaseManager;
