# UI Consistency Audit — Discipline App

Phạm vi: toàn bộ `app/`, `screens/`, `components/`, `constants/`, `global.css`. Chỉ audit, không sửa code, không đề xuất giá trị thiết kế mới.

---

## 1) ICON AUDIT

### Tóm tắt hiện trạng
Chỉ có **một** nguồn icon duy nhất: [components/Icon/AppIcon.tsx](components/Icon/AppIcon.tsx) — bộ icon tự viết bằng `react-native-svg` (`Path`/`Circle`/`Rect`/`Line`), export qua `<AppIcon name="..." />`. Không có `lucide-react-native`, `@expo/vector-icons`, hay `react-native-vector-icons` nào được cài hoặc import — không bị trộn nhiều thư viện. `react-native-svg` còn được dùng trực tiếp (không qua `AppIcon`) một lần ở [screens/RecoveryWorkoutScreen.tsx:3](screens/RecoveryWorkoutScreen.tsx#L3) để vẽ `Circle` (progress ring), đây không phải icon nhưng là điểm cần lưu ý cho phần "1 nguồn duy nhất".

Tất cả 30 icon (`dumbbell`, `clock`, `mapPin`, `calendar`, `calendarDate`, `lightning`, `refresh`, `shieldBroken`, `home`, `user`, `moon`, `sun`, `arrowRight`, `play`, `plusCircle`, `mail`, `creditCard`, `crown`, `lock`, `globe`, `edit`, `shield`, `logOut`, `bell`, `chevronLeft`, `music`, `image`, `camera`, `gameController`, `checkCircle`, `check`) đều là **outline/stroke-based** (`fill="none"`, `stroke={color}`), ngoại trừ:
- `play` ([AppIcon.tsx:214-221](components/Icon/AppIcon.tsx#L214-L221)) — filled (`fill={color}` trên `Path`), đúng theo convention icon "play" thông thường, không phải lỗi nhưng là icon filled duy nhất trong bộ toàn outline.
- `calendarDate` ([AppIcon.tsx:114-133](components/Icon/AppIcon.tsx#L114-L133)) — có thêm `SvgText` render số ngày, không đồng nhất kỹ thuật vẽ với các icon còn lại nhưng có lý do chức năng (badge ngày trong lịch).

Trung bình mỗi icon dùng `strokeWidth` mặc định = `Math.max(1.5, size/12)` (auto theo size, [AppIcon.tsx:428](components/Icon/AppIcon.tsx#L428)), ngoại trừ 1 chỗ override cứng `strokeWidth={2}` ở [screens/VerifyWorkoutScreen.tsx:358](screens/VerifyWorkoutScreen.tsx#L358) và nhiều chỗ override `strokeWidth={1.8}` cố định (xem danh sách bên dưới) — nghĩa là công thức auto-scale không được áp dụng nhất quán, một số nơi ghi đè thủ công.

### Vấn đề cụ thể

| # | Vấn đề | File:line | Mức độ |
|---|--------|-----------|--------|
| 1 | **14 giá trị `size` khác nhau** đang được dùng cho icon không theo scale rõ ràng: 8, 11, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 56, 64px. Ví dụ size=8 ở [components/RestrictedApps.tsx:100](components/RestrictedApps.tsx#L100) (icon "check" trong dot nhỏ) so với size=30 ở [components/WorkoutCard.tsx:92](components/WorkoutCard.tsx#L92) cho cùng ngữ cảnh "icon trong card". Không có file hằng số kiểu `IconSize.sm/md/lg`. | nhiều file, xem danh sách grep | Medium |
| 2 | **Màu icon trộn lẫn giữa token và hex hardcode** cho cùng một ý nghĩa (primary/accent icon color). Ví dụ token: `color={colors.iconSoft}` ([components/WorkoutCard.tsx:93](components/WorkoutCard.tsx#L93)), `color={colors.textSecondary}` ([components/WorkoutCard.tsx:146](components/WorkoutCard.tsx#L146)). Hardcode tương đương: `color={isDark ? "#FF8C64" : "#FF7B54"}` lặp lại y hệt ở ít nhất 9 nơi: [components/ProfileSettingRow.tsx:61](components/ProfileSettingRow.tsx#L61), [screens/ProfileScreen.tsx:162](screens/ProfileScreen.tsx#L162), [:251](screens/ProfileScreen.tsx#L251), [:307](screens/ProfileScreen.tsx#L307), [screens/AccountSecurityScreen.tsx:110](screens/AccountSecurityScreen.tsx#L110), [screens/GymLocationScreen.tsx:124](screens/GymLocationScreen.tsx#L124), [screens/RecoveryWorkoutSettingsScreen.tsx:129](screens/RecoveryWorkoutSettingsScreen.tsx#L129), [screens/SubscriptionPlanScreen.tsx:252](screens/SubscriptionPlanScreen.tsx#L252). Giá trị này thực chất trùng khớp `colors.primary` đã có sẵn trong token nhưng không được dùng. | xem trên | High |
| 3 | **Màu vàng accent `#FFC947` hardcode trực tiếp** (không qua `colors.accent`/`colors.iconAccent`) ở 6 nơi: [components/DisciplineRecoveryCard.tsx:47](components/DisciplineRecoveryCard.tsx#L47), [components/DisciplineHero.tsx:28](components/DisciplineHero.tsx#L28), [screens/RecoveryCompleteScreen.tsx:48](screens/RecoveryCompleteScreen.tsx#L48), [screens/ScheduleScreen.tsx:155](screens/ScheduleScreen.tsx#L155), [screens/SubscriptionPlanScreen.tsx:106](screens/SubscriptionPlanScreen.tsx#L106), [screens/VerifyWorkoutScreen.tsx:142](screens/VerifyWorkoutScreen.tsx#L142) và [:239](screens/VerifyWorkoutScreen.tsx#L239), [:398](screens/VerifyWorkoutScreen.tsx#L398). Vì `#FFC947` giống nhau ở cả light/dark token nên không gây lỗi hiển thị, nhưng phá vỡ việc "single source of truth". | xem trên | Medium |
| 4 | **Ternary màu icon vô nghĩa (bug logic, không chỉ hardcode)**: `color={isDark ? "#FFC947" : "#FFC947"}` — cả hai nhánh giống hệt nhau, ở [components/AppearanceSelector.tsx:55](components/AppearanceSelector.tsx#L55) và [:137](components/AppearanceSelector.tsx#L137). Cho thấy code còn sót lại từ một lần refactor theme dở dang. | components/AppearanceSelector.tsx:55, 137 | High |
| 5 | **`strokeWidth` bị ghi đè thủ công không nhất quán**: phần lớn icon dùng công thức auto (`size/12`), nhưng nhiều nơi ép `strokeWidth={1.8}` hoặc `{2}` bất kể size, ví dụ [screens/AccountSecurityScreen.tsx:111](screens/AccountSecurityScreen.tsx#L111) (`size=18` + `strokeWidth=1.8`, gần bằng auto ~1.5 nên khác biệt nhỏ) nhưng [screens/VerifyWorkoutScreen.tsx:358](screens/VerifyWorkoutScreen.tsx#L358) (`size=20` + `strokeWidth=2` ép cứng thay vì auto ~1.67) → độ dày nét icon không đồng đều giữa các màn hình khi đặt cạnh nhau. | xem trên | Low |
| 6 | Icon `gameController` được dùng để biểu trưng app bị khoá (Locked Apps) — về mặt phong cách, đây là icon duy nhất trong bộ có hình khối "vui nhộn/gaming" rõ rệt, ngữ cảnh sử dụng phù hợp (đại diện game app) nhưng phong cách vẽ (bo tròn, 2 nút tròn to) nổi bật hơn so với các icon còn lại vốn tối giản/hình học. | components/Icon/AppIcon.tsx (GameController, dùng ở screens/LockedAppsScreen.tsx) | Low |

---

## 2) TYPOGRAPHY AUDIT

### Tóm tắt hiện trạng
**Không có file/theme typography chung nào** (không có `constants/typography.ts` hay tương đương). `grep -r fontFamily` trên toàn bộ `app/ components/ screens/` trả về **0 kết quả** — không nơi nào set `fontFamily` tuỳ chỉnh, nghĩa là toàn app dùng font hệ thống mặc định (San Francisco trên iOS / Roboto trên Android). Cũng không có `useFonts`/`expo-font` loading nào được gọi, và thư mục `assets/` không có file `.ttf`/`.otf` nào — mặc dù `expo-font` có trong `package.json` dependencies nhưng không được sử dụng.

Toàn bộ `fontSize` và `fontWeight` được set **inline trực tiếp trên từng `<Text style={{...}}>`**, lặp lại thủ công ở gần như mọi file thay vì tham chiếu một scale chung.

### Số liệu thực tế
- **16 giá trị `fontSize` khác nhau** đang tồn tại trong code: `10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 48, 64`.
  - Tần suất cao nhất: `12` (24 lần), `13` (27 lần), `16` (23 lần), `17` (19 lần), `28` (18 lần) — đây nhiều khả năng là ý định "label nhỏ / body / heading màn hình con / heading lớn", nhưng không có tên gọi (token) chính thức cho từng mức.
  - `10` chỉ xuất hiện 1 lần ([screens/SubscriptionPlanScreen.tsx:180](screens/SubscriptionPlanScreen.tsx#L180)) và `11` chỉ 2 lần ([components/BottomTabBar.tsx:72](components/BottomTabBar.tsx#L72), [screens/VerifyWorkoutScreen.tsx:81](screens/VerifyWorkoutScreen.tsx#L81)) — các giá trị lẻ tẻ, khả năng cao nên gộp vào `12` (mục đích tương tự: label/caption nhỏ).
  - `18` chỉ 2 lần ([screens/SubscriptionPlanScreen.tsx:160](screens/SubscriptionPlanScreen.tsx#L160), [components/AppIcon.tsx](components/Icon/AppIcon.tsx) không tính vì đó là SVG text) — nằm giữa `17` (19 lần) và `20` (3 lần), khả năng cao là trùng mục đích với `17`.
  - `26` chỉ 2 lần ([components/DisciplineHero.tsx:37](components/DisciplineHero.tsx#L37), [screens/VerifyWorkoutScreen.tsx:405](screens/VerifyWorkoutScreen.tsx#L405)) rất gần `28` (18 lần, dùng làm heading màn hình ở gần như mọi screen dạng `EditNameScreen`, `PaymentMethodScreen`, `AccountSecurityScreen`...) — nghi ngờ nên gộp.
  - `48` (2 lần, [screens/RecoveryWorkoutSettingsScreen.tsx:199](screens/RecoveryWorkoutSettingsScreen.tsx#L199) và [:218](screens/RecoveryWorkoutSettingsScreen.tsx#L218)) và `64` (1 lần, [screens/RecoveryWorkoutScreen.tsx:216](screens/RecoveryWorkoutScreen.tsx#L216)) là các số hiển thị lớn (đồng hồ đếm giờ / số to) — hợp lý về mặt hero number nhưng không có quy tắc rõ khi nào dùng 48 vs 64.
- **6 giá trị `fontWeight`** đang dùng: `"300", "400", "500", "600", "700", "800"`. `"300"` (light) chỉ xuất hiện đúng **1 lần** duy nhất ở [components/TimePicker.tsx:335](components/TimePicker.tsx#L335) — không rõ có chủ đích hay là giá trị lạc so với phần còn lại của app (không nơi nào khác dùng font nhẹ hơn 400). `"800"` (extra-bold) dùng khá phổ biến (22 lần) cho heading nhưng cùng lúc `"700"` (32 lần) cũng được dùng cho heading ở nhiều nơi khác — ví dụ heading màn hình cùng cấp bậc (`fontSize:28`) khi thì `fontWeight:"800"` (hầu hết edit-screens: [screens/EditNameScreen.tsx:66](screens/EditNameScreen.tsx#L66), [screens/PaymentMethodScreen.tsx:70](screens/PaymentMethodScreen.tsx#L70)...) khi thì không nhất quán về cấp độ heading kế tiếp — không có ranh giới rõ giữa khi nào heading dùng 700 vs 800.
- **`letterSpacing`** xuất hiện rải rác ở 27 file (80 chỗ) — thường đi kèm label uppercase nhỏ (`fontSize:12/13` + `letterSpacing`), là dấu hiệu có "label style" lặp lại nhất quán về mặt ý định nhưng chưa được rút thành 1 style dùng chung (mỗi Text tự khai lại `{fontSize:12, fontWeight:"600", letterSpacing:0.5, color: colors.textSecondary}` tương tự nhau ở hàng chục nơi, ví dụ [screens/AccountSecurityScreen.tsx:127-133](screens/AccountSecurityScreen.tsx#L127-L133), [screens/GymLocationScreen.tsx:90-96](screens/GymLocationScreen.tsx#L90-L96), [screens/PaymentMethodScreen.tsx:109-115](screens/PaymentMethodScreen.tsx#L109-L115)).

### Xác nhận
**Chưa có typography scale/theme chuẩn hoá.** Toàn bộ 16 fontSize + 6 fontWeight đang được khai báo lặp lại thủ công tại từng component, không có constant/enum trung tâm nào định nghĩa các mức (vd. `Typography.heading`, `Typography.body`, `Typography.caption`).

### Vấn đề cụ thể

| # | Vấn đề | File:line | Mức độ |
|---|--------|-----------|--------|
| 1 | Không tồn tại file typography token — toàn bộ 16 fontSize/6 fontWeight lặp lại rải rác | toàn bộ `screens/`, `components/` | High |
| 2 | Không có font tuỳ chỉnh nào được load — thương hiệu "premium" nhưng dùng font hệ thống mặc định, `expo-font` cài nhưng không dùng | package.json, không có `assets/fonts/` | Medium |
| 3 | `fontWeight:"300"` chỉ dùng đúng 1 lần, lệch khỏi mọi nơi khác (min là 400) | components/TimePicker.tsx:335 | Low |
| 4 | Các cặp fontSize gần nhau, khả năng trùng mục đích nên gộp: `10`↔`12`, `11`↔`12`, `18`↔`17`, `26`↔`28` | xem danh sách trên | Medium |
| 5 | Heading cùng cấp (`fontSize:28`, đầu màn hình "edit/settings") không nhất quán `fontWeight` 700 vs 800 giữa các screen | screens/EditNameScreen.tsx:66 (800) vs cần đối chiếu case khác cùng cấp dùng 700 | Medium |
| 6 | Style "uppercase label nhỏ" (`fontSize:12-13` + `letterSpacing` + `textSecondary`) lặp lại thủ công ~80 lần thay vì 1 style dùng chung | 27 file, xem danh sách grep `letterSpacing` | Low |

---

## 3) COLOR PALETTE AUDIT

### Tóm tắt hiện trạng
Có tồn tại **một** file token chính thức: [constants/colors.ts](constants/colors.ts), export `Colors.light` / `Colors.dark` với các key ngữ nghĩa (`primary`, `accent`, `text`, `textSecondary`, `background`, `card`, `separator`, `iconPrimary`, v.v.), được cấp qua `ThemeContext` (`useTheme().colors`). Đây là cấu trúc tốt về mặt kỹ thuật.

Tuy nhiên phát hiện **2 vấn đề cấu trúc lớn**:

**(a) Token thứ hai, song song và không đồng bộ, không được dùng ở đâu cả.** [global.css](global.css) định nghĩa một bộ `@theme` Tailwind riêng (`--color-primary`, `--color-dark-card-secondary`, `--color-dark-button-bg`...) cho NativeWind, nhưng `grep -r "className="` trên toàn bộ `app/ components/ screens/` trả về **0 kết quả** — nghĩa là NativeWind/Tailwind đã setup (postcss, metro config, global.css) nhưng **không một component nào dùng `className`**. Bộ token trong `global.css` đã lệch khỏi `constants/colors.ts` (ví dụ `--color-dark-card-secondary: #243044` không tồn tại trong `colors.ts`, còn `colors.ts` có `iconSoft`, `iconMuted`, `badgeBg`... không có trong `global.css`). Đây là dead config / nguồn sự thật thứ hai không ai duy trì.

**(b) Hầu hết các giá trị hex trong token đã bị hardcode lặp lại trực tiếp trong hơn 40 file** thay vì gọi `colors.xxx`, phổ biến nhất:
- `isDark ? "#FF8C64" : "#FF7B54"` (= `colors.primary`) lặp lại ≥9 lần (liệt kê ở mục Icon Audit #2).
- `"#FFC947"` (= `colors.accent`) hardcode ≥8 lần.
- Cặp `isDark ? "#FFFFFF" : "#2C3E5B"` / `isDark ? "#2C3E5B" : "#FFFFFF"` (text-on-primary hoặc ngược lại) lặp lại ≥20 lần khắp các nút bấm chính (button primary text), ví dụ [components/RecoveryButton.tsx:48](components/RecoveryButton.tsx#L48), [screens/ProfileScreen.tsx:280](screens/ProfileScreen.tsx#L280), [screens/HomeScreen.tsx:90](screens/HomeScreen.tsx#L90), [screens/VerifyWorkoutScreen.tsx:151](screens/VerifyWorkoutScreen.tsx#L151).
- Các màu **neutral/gray không hề có trong token** (`colors.ts` không định nghĩa các key này) nhưng được hardcode lặp lại nhiều nơi: `#F0EBE6` (surface nhạt, ≥9 lần), `#F5F0EB` (≥11 lần), `#D0D0D0` (border/track màu xám, 3 lần), `#F8F0F0`/`#F8F4F0`/`#E8E4E0` (mỗi màu 1 lần, gần giống nhau nhưng không trùng hex — có thể là 3 biến thể của cùng một ý định "surface secondary nhạt").

### Đánh giá mood: cam `#FF7B54` (primary) + vàng `#FFC947` (accent)
Palette hiện tại thiên về **ấm áp, năng lượng, "lifestyle/wellness app"** hơn là tinh thần "kỷ luật / nghiêm túc / phòng gym" mà sản phẩm đặt ra:
- **Apple Fitness** dùng phần lớn nền đen/trắng trung tính với 1 màu nhấn (hồng/đỏ) chỉ xuất hiện ở ring tiến độ và CTA — tỷ lệ màu nhấn trên tổng UI rất thấp. **Linear/Notion** gần như đơn sắc (đen-trắng-xám) với accent chỉ ở nút hành động chính.
- Ở Discipline app, cam (`primary`) và vàng (`accent`) xuất hiện dày đặc: icon màu cam ở hầu hết setting rows ([screens/ProfileScreen.tsx](screens/ProfileScreen.tsx) — 3 icon setting liên tiếp đều cam), badge vàng, hero icon vàng 56-64px ở các màn hình cảm xúc quan trọng nhất của app (`DisciplineHero`, `RecoveryComplete`, `VerifyWorkout`) — đây đúng ra là những khoảnh khắc "nghiêm túc/căng thẳng" trong core loop (bị phá kỷ luật → hồi phục) nhưng lại được thể hiện bằng màu vàng rực (`#FFC947`) vốn gợi cảm giác vui vẻ/thưởng/game hơn là nghiêm túc.
- Cụ thể các điểm lệch mood rõ nhất:
  - [components/DisciplineHero.tsx:28](components/DisciplineHero.tsx#L28) — icon lightning/shieldBroken màu vàng `#FFC947` kích thước 56px cho màn hình "Discipline Mode" (hậu quả của việc phá kỷ luật) — mood đang là "cảnh báo nghiêm trọng" nhưng màu chọn giống icon "thành tích/thưởng".
  - [screens/RecoveryCompleteScreen.tsx:47-48](screens/RecoveryCompleteScreen.tsx#L47-L48) — icon 64px màu vàng cho màn hình ăn mừng hoàn thành — chấp nhận được cho khoảnh khắc celebration, nhưng cùng tông vàng y hệt cũng dùng cho cảnh báo (mục trên) khiến vàng mất khả năng phân biệt ngữ cảnh "cảnh báo" vs "ăn mừng".
  - [screens/SubscriptionPlanScreen.tsx](screens/SubscriptionPlanScreen.tsx) — icon `crown` màu vàng + badge cam trên nền card — kết hợp cam/vàng/crown đặt cạnh nhau tạo cảm giác gần với app "gamification/rewards" hoặc app lifestyle thông thường hơn là công cụ kỷ luật nghiêm túc.
  - [components/ThemeToggle.tsx:55](components/ThemeToggle.tsx#L55) và [components/AppearanceSelector.tsx](components/AppearanceSelector.tsx) — dùng vàng làm màu "active state" cho toggle giao diện (không liên quan nội dung "discipline") — vàng bị dùng cho quá nhiều vai trò khác nhau (cảnh báo, ăn mừng, trạng thái chọn UI, premium/crown) nên không còn mang ý nghĩa ngữ cảnh riêng.
- Nền sáng `#FFF8F3` (kem ấm) + card trắng + text `#2C3E5B` (xanh navy) là lựa chọn trung tính, chuyên nghiệp, không có vấn đề — phần "calm/professional" nằm chủ yếu ở nền/text, còn phần "playful" tập trung ở cam/vàng của primary+accent+icon.

### Vấn đề cụ thể

| # | Vấn đề | File:line | Mức độ |
|---|--------|-----------|--------|
| 1 | Tồn tại 2 bộ design token song song, không đồng bộ; bộ trong `global.css` (Tailwind) không được dùng ở bất kỳ đâu (0 `className`) | global.css (toàn file) vs constants/colors.ts | High |
| 2 | `colors.primary` bị hardcode lặp lại (`isDark ? "#FF8C64" : "#FF7B54"`) thay vì gọi token, ≥9 vị trí | xem mục Icon Audit #2 | High |
| 3 | `colors.accent` (`#FFC947`) hardcode ≥8 vị trí | xem mục Icon Audit #3 | Medium |
| 4 | Cặp màu text-trên-primary (`#FFFFFF`/`#2C3E5B` theo theme) hardcode lặp lại ≥20 vị trí thay vì token `buttonText`/`text` có sẵn | components/RecoveryButton.tsx:48, screens/ProfileScreen.tsx:280, screens/HomeScreen.tsx:90, screens/VerifyWorkoutScreen.tsx:151, và nhiều nơi khác | High |
| 5 | Các màu neutral/gray nền phụ (`#F0EBE6`, `#F5F0EB`, `#F8F0F0`, `#F8F4F0`, `#E8E4E0`, `#D0D0D0`) không có trong `colors.ts` nhưng được hardcode lặp lại hàng chục lần, có vẻ là cùng một ý định thiết kế nhưng bị lệch hex mỗi nơi một kiểu | components/RecoveryCard.tsx:23, components/LocationInput.tsx:21, components/TimePicker.tsx:315/388, screens/PaymentMethodScreen.tsx (6 vị trí), screens/AccountSecurityScreen.tsx (3 vị trí), v.v. | Medium |
| 6 | Vàng accent `#FFC947` được tái sử dụng cho nhiều ngữ cảnh cảm xúc trái ngược nhau (cảnh báo kỷ luật bị phá vs ăn mừng hoàn thành vs trạng thái UI được chọn vs biểu tượng premium) khiến màu mất tính phân biệt ngữ cảnh | components/DisciplineHero.tsx:28, screens/RecoveryCompleteScreen.tsx:48, components/ThemeToggle.tsx:55, screens/SubscriptionPlanScreen.tsx:106 | Medium |
| 7 | Palette cam/vàng ấm tổng thể nghiêng về mood "lifestyle/wellness/rewards" hơn là "kỷ luật nghiêm túc" mà brief sản phẩm mô tả, đặc biệt rõ ở các màn hình cảm xúc cao (Discipline Mode, Recovery, Subscription) | components/DisciplineHero.tsx, screens/RecoveryCompleteScreen.tsx, screens/SubscriptionPlanScreen.tsx | Medium |

---

*Audit thực hiện trên toàn bộ nội dung `app/`, `components/`, `screens/`, `constants/`, `contexts/`, `hooks/`, `global.css` tại thời điểm hiện tại. Không có file nào bị chỉnh sửa trong quá trình audit.*
