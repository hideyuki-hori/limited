# Limited - 3D Card Carousel Spec

## Overview

countdown-list を Cover Flow 風の3Dカルーセルに変更する。
CSS `perspective` + `rotateY` による本物の3D表現を使う。

## Layout

```
[rotated]  [rotated]  [ CURRENT ]  [rotated]  [rotated]
  card4      card3      card1         card2      (...)
```

- カレントカードが中央に正面向きで大きく表示
- 左右のカードはY軸回転して奥に配置
- カード数が多い場合、視界外のカードは非表示（パフォーマンス）

## 3D Transform

### Container
- `perspective: 1000px`
- `perspective-origin: center`

### Current Card (center)
- `transform: translateZ(0)`
- `rotateY(0deg)`
- `scale(1)`
- `z-index: 10`

### Adjacent Cards (1つ隣)
- `rotateY(±45deg)`
- `translateX(±60%)` (中央からの距離)
- `translateZ(-200px)` (奥行き)
- `scale(0.85)`
- `z-index: 5`

### Far Cards (2つ以上離れ)
- `rotateY(±55deg)`
- `translateX(±90%)`
- `translateZ(-300px)`
- `scale(0.75)`
- `opacity: 0.6`
- `z-index: 1`

### 3つ以上離れたカード
- `display: none`（パフォーマンス）

## Navigation

### Desktop
- 左右のカードをクリック → そのカードがカレントに
- キーボード: `←` `→` でカード切替

### Mobile
- スワイプで切替
- または左右タップ

## Animation

- カード切替時: `transition: transform 0.5s ease, opacity 0.3s ease`
- 新規カード追加時: カレントとして中央にフェードイン
- カード削除時: フェードアウト後、隣接カードがスライドイン

## Card Design

カード自体のデザインは design.pen の既存デザインを踏襲:
- 背景: `bg-card` (dark: #111111)
- ボーダー: 状態別 (normal/urgent/expired)
- 角丸: 8px
- padding: 20px
- カウントダウン表示、プログレスバー等は現行通り

### Current Card の強調
- ボーダーがアクセントカラーで微光 (box-shadow glow)
- ドロップシャドウが強め

### Side Cards
- インタラクション無効 (pointer-events: none on content)
- クリック領域のみ有効 (カード全体がボタン)

## Responsive

### Desktop (≥1024px)
- カルーセル表示
- 左右に最大2枚ずつ表示

### Tablet (768px - 1023px)
- カルーセル表示
- 左右に最大1枚ずつ
- 回転角度を少し浅く (±35deg)

### Mobile (<768px)
- カルーセル無効、現行の縦並びリストにフォールバック
- または横スワイプで1枚ずつ表示 (rotation無し、translateXのみ)

## State Management

```typescript
interface CarouselState {
  currentIndex: number
}
```

- `currentIndex` は countdowns 配列のインデックス
- カードの追加/削除時に currentIndex を適切に調整
- countdowns が空の場合、カルーセル自体を非表示

## Inline Editing

鉛筆ボタンを押すとカード上で直接編集モードに入る。
フォーカスが外れたら自動保存。save/cancel ボタンは無し。

### 編集モードの見た目
- カード枠: 薄赤ボーダー (`#C41E3A40`)
- 鉛筆アイコン: 赤 (`#C41E3A`) でアクティブ状態を示す
- タイトル: 赤アンダーライン + テキストカーソル表示
- deadline: 赤テキスト + 赤アンダーライン

### 編集フロー
1. 鉛筆アイコンをクリック → 編集モード ON
2. タイトルまたは deadline を直接編集
3. フォーカスアウト → バリデーション → 自動保存
4. 編集モード中にカルーセルのナビゲーションは無効

## Validation

### Title

| ルール | 条件 | 挙動 |
|--------|------|------|
| 必須 | trim後に空文字 | 編集前の値に戻す |
| 最大文字数 | 40文字超過 | 40文字で切り捨て（入力時にブロック） |
| 前後空白 | 先頭・末尾の空白 | trim して保存 |

- 空文字で blur → 値を戻し、保存しない
- `input[type=text]` + `maxlength=40` で制限（textarea は使わない）
- 表示時は `text-overflow: ellipsis` で1行に収める
- 編集時は input 内でスクロールして全文編集可能

### Deadline (日時)

| ルール | 条件 | 挙動 |
|--------|------|------|
| 有効日時 | パース不能な値 | 編集前の値に戻す |
| 年の範囲 | 2000〜2099 | DatePicker の桁選択で構造的に制約 |
| 月日の整合 | 2月30日等 | DatePicker が自動clamp（既存実装通り） |
| 時刻の範囲 | 00:00〜23:59 | DatePicker が自動clamp（既存実装通り） |

- DatePicker の桁選択UIを再利用するため、構造的に不正な日時は入力できない
- 過去日時は許可（expired 状態として自然に表示される）
- 値が変わっていなければ保存しない（無駄な書き込み防止）

## Implementation Notes

- `transform-style: preserve-3d` を carousel container に設定
- `backface-visibility: hidden` で裏面を非表示
- カード順序はDOM上のz-indexで制御（CSSのみ、JS不要）
- Tailwind のカスタムユーティリティ or `style` prop で動的transform
- SolidJS の `createSignal` で currentIndex を管理
