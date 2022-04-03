# 大阪府ゴールドステッカーマップ

[大阪府ゴールドステッカーマップ](https://covid19-osaka-map.info/)

# 貢献の仕方

Issue にある色々な修正にご協力いただけると嬉しいです。

# 行動原則

詳しくは[サイト構築にあたっての行動原則](./.github/CODE_OF_CONDUCT.md)を御覧ください。

## ライセンス

本ソフトウェアは、[MIT ライセンス](./LICENSE.txt)の元提供されています。

## 開発者向けの情報

### 環境情報

|Node.js|v16.14.2|
|npm|8.5.0|
|yarn|1.22.18|

### Mapbox

地図部分は Mapbox を利用しています。
開発時にはアカウントを作成し、環境変数 TOKEN に token を設定してください。

```
export TOKEN="XXXXX";
```

### ビルド

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```
