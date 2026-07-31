# 014: STATUSステータス画面の追加
日付: 2026-07-31
状態: 採用

## 決定
ポーズメニューから開けるSTATUS画面を追加する。
STATE='pause'を維持したまま、scrPauseを非表示にしてscrStatusをflexで表示する方式。

## 理由
強化状況を確認できる手段がなく、次に何を伸ばすべきか判断できないUX上の課題があった。
別STATEを追加すると中断/再開ロジックへの影響が大きいため、既存STATE='pause'の上にオーバーレイする方式が安全。

## 影響
- showStatusScreen() / hideStatusScreen() / subRow() / spRow() の4関数を追加
- closePauseScreen()でscrStatusも明示的にdisplay:noneにする(BACKせずRESUMEした場合)
- iOS Safari: -webkit-overflow-scrolling:touch でスクロール対応
- テンプレートリテラル不使用(CLAUDE.mdルール遵守)
