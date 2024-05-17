const path = require('path');

module.exports = {
  mode: 'development', // 또는 'production'
  entry: './src/index.js', // 프로젝트의 시작점
  output: { // 번들 파일 설정
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { // JavaScript와 JSX 파일을 위한 설정
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      { // CSS 파일을 위한 설정
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // 확장자를 생략하고 파일을 불러올 수 있게 설정
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
    hot: true,
    historyApiFallback: true // SPA의 라우팅을 위해 필요
  }
};
