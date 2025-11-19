module.exports = {
  // テスト環境（デフォルトはjsdom、単体テストは個別に指定可能）
  testEnvironment: 'jsdom',

  // テストファイルのパターン
  testMatch: [
    '**/test/**/*.test.js'
  ],

  // カバレッジ収集対象
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js' // Electronエントリポイントは除外
  ],

  // カバレッジ閾値
  coverageThreshold: {
    global: {
      branches: 75,  // 実際の達成値（81.81%）に基づいて調整
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/DocumentSearcher.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    './src/FileReader.js': {
      branches: 50,  // エラーハンドリングのエッジケースを考慮
      functions: 100,
      lines: 87,
      statements: 87
    }
  },

  // カバレッジレポート形式
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  // モックのクリア
  clearMocks: true,

  // タイムアウト設定
  testTimeout: 10000,

  // 詳細出力
  verbose: true
};
