# 004: デプロイ先をNetlifyからConoHa VPSへ変更

日付: 2026-07-30
状態: 採用

## 決定

デプロイ先を Netlify から ConoHa VPS(160.251.252.203)の `/var/www/hexa-defense` へ変更する。
公開URLは `https://hexa.ea-journey.com/`。
デプロイは `deploy.sh` 一発で行う。

## 理由

- 既存アプリ(ea-dashboard-templates 等)がすべて同一VPSで稼働しており、インフラを集約できる
- `ea-journey.com` サブドメイン配下で URL を統一できる
- Netlify アカウントを増やさずに済む
- DNS・nginx・Let's Encrypt 証明書はVPS側で設定済みのため追加コストなし

## 影響

- Netlify は使用しない
- デプロイは `./deploy.sh` で実行(scp による index.html 転送のみ)
- portfolio-dashboard の repos.yml に `url: https://hexa.ea-journey.com/` を記入する必要がある
