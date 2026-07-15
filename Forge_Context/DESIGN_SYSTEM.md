# Discipline — Design Tokens (BẢN CHỐT CUỐI)

Thay thế hoàn toàn bảng token mono đen/trắng ban đầu trong DESIGN_SYSTEM.md. Giữ nguyên tên token
(`primary`, `warning`, `success`, `premium`...) để không phải đổi tên biến trong code đã có —
chỉ đổi **giá trị** và **phạm vi sử dụng** của `primary`/`warning`.

## Nguyên tắc hệ màu: chia theo LUỒNG, không phải theo loại component

- **`primary` (xanh chanh)** — dùng cho toàn bộ luồng **Home / Workout / quản lý bình thường**:
  Home, Schedule, Profile, Settings, Subscription, Verify Workout. Áp dụng cho nút CTA, nav active,
  progress ring, icon nhấn mạnh.
- **`warning` (đỏ rực)** — dùng cho toàn bộ luồng **Discipline Mode / Recovery** (không chỉ badge
  cảnh báo như trước, mà cả nút CTA trong luồng này): Discipline Mode Activated, Recovery Workout,
  Recovery Complete, Locked Apps. Áp dụng cho nút CTA, badge, icon, progress bar trong các màn này.
- **`success` (xanh rêu trầm)** — KHÔNG dùng cho CTA. Chỉ dùng cho badge/text nhỏ mang tính xác
  nhận tách biệt khỏi luồng chính (vd "7 Day Streak" trên Home) — cố tình trầm hơn `primary` để
  không bị lẫn.
- **`premium` (vàng gold)** — không đổi vai trò, dùng cho crown icon, badge Premium, Upgrade.

## Bảng giá trị đầy đủ

| Token           | Light     | Dark      | Dùng cho                                              |
| --------------- | --------- | --------- | ----------------------------------------------------- |
| `background`    | `#EAE6DF` | `#0A0A0A` | Nền toàn app                                          |
| `surface`       | `#FFFFFF` | `#201F20` | Card, sheet, modal                                    |
| `border`        | `#D8D2C7` | `#333133` | Viền, separator                                       |
| `textPrimary`   | `#1C1C1E` | `#F5F5F4` | Chữ chính                                             |
| `textSecondary` | `#6B6B68` | `#9C9C99` | Chữ phụ, caption                                      |
| `primary`       | `#607E1B` | `#C6F135` | CTA/nav/ring — luồng Home/Workout                     |
| `onPrimary`     | `#FFFFFF` | `#14171A` | Chữ/icon trên nền `primary`                           |
| `primaryContainer` | `#E2E8D6` | `#333B1D` | Nền tint nhạt sau icon/text (vd vòng tròn nền sau icon Dumbbell) |
| `onPrimaryContainer` | `#35450F` | `TODO` | Chữ/icon nằm trong khối nền `primaryContainer` |
| `warning`       | `#F03059` | `#FF4D6D` | CTA/badge/icon — luồng Discipline/Recovery            |
| `onWarning`     | `#FFFFFF` | `#FFFFFF` | Chữ/icon trên nền `warning`                           |
| `success`       | `#3F6B4A` | `#6FA37D` | Badge xác nhận nhỏ (streak...), KHÔNG dùng cho CTA    |
| `premium`       | `#D9B34A` | `#E8C468` | Crown, badge Premium                                  |
| `premiumText`   | `#4A3510` | `#3D2B0A` | Chữ trên nền `premium`                                |

## Icon (đã chốt ở phần trước, không đổi)

- Upper Body / workout type: **Dumbbell**, màu theo context card (thường `textPrimary`).
- Discipline Mode: **ShieldAlert**, màu `warning`.
- Recovery Workout: **khiên nứt + badge mũi tên đặc màu**, màu `warning`.
- Empty state Schedule: **Calendar + gạch ngang giữa**, màu `textSecondary`.

## Lưu ý quan trọng khi bàn giao cho Claude Code

- `onWarning` là token MỚI (trước đây `warning` chỉ dùng cho text/icon nên chưa cần "chữ trên nền
  warning" — giờ dùng làm nền nút nên cần thêm token này).
- Cần rà lại toàn bộ nơi đang dùng `primary` mono cũ (đen/trắng) trong các màn thuộc luồng
  Discipline/Recovery — đổi sang `warning`, KHÔNG giữ `primary` xanh ở các màn này.
- Ngược lại, các màn Home/Workout/Schedule/Profile/Settings/Subscription giữ `primary` xanh, không
  lẫn `warning` đỏ vào.
- `primary` (Light) đổi từ `#B9E828` sang `#607E1B` (đậm hơn): giá trị cũ vừa dùng làm nền CTA vừa
  dùng làm màu nét/text đứng riêng (icon, text nhấn mạnh không nằm trên nền CTA) — quá sáng nên khi
  làm màu nét mỏng hoặc chữ, contrast thấp, nhìn nhạt/mờ/khó đọc. Giá trị mới đủ đậm để dùng được ở
  cả hai vai trò. Dark mode (`#C6F135`) không đổi.
- `primaryContainer`/`onPrimaryContainer` là cặp token cho icon/text nằm bên trong một khối có nền
  tint nhạt riêng (vd icon Dumbbell trong vòng tròn nền `primaryContainer`) — khác với icon/text
  đứng độc lập trên nền `surface`/`background` bình thường (dùng `textPrimary`) hay trên nền `primary`
  đặc (dùng `onPrimary`). Giá trị Dark của `onPrimaryContainer` chưa được xác định (TODO) — không tự
  bịa, cần chốt riêng khi cần dùng ở dark mode.
