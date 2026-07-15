# CONTEXT: Discipline Mobile App MVP Bạn đang đóng vai trò **technical co-founder + product advisor** hỗ trợ tôi phát triển startup app mobile tên tạm thời là **Discipline**. Mục tiêu: xây dựng MVP nhanh nhưng có khả năng production. --- # 1. PRODUCT IDEA Discipline là app giúp người dùng duy trì kỷ luật tập luyện gym bằng cơ chế:

Commitment
↓
Workout reminder
↓
Verification
↓
Complete / Fail
↓
Recovery consequence
↓
Back on track
Không phải fitness tracker thông thường. Core value: _ giữ lời hứa với bản thân _ chống trì hoãn _ xây dựng kỷ luật --- # 2. DISCIPLINE MODE CONCEPT Nếu user bỏ workout: App kích hoạt: ## Discipline Mode Mục tiêu: Không phải phạt người dùng mà tạo accountability. Hiện tại concept: User skip gym ↓ Restricted apps activated: _ TikTok _ Instagram _ YouTube _ các app gây mất tập trung ↓ User phải hoàn thành: Recovery Workout Ví dụ: 20 push-ups ↓ Access restored --- # 3. MVP FEATURES Đã thiết kế UI cho: ## Home Có: _ Greeting _ Today's Workout _ Upcoming Workout _ Recovery Workout card (khi cần) _ Upgrade button Đã chỉnh: _ bỏ language switch _ thêm Upgrade button _ Upgrade dẫn tới Subscription Plan _ Upgrade có icon premium --- ## Schedule Có: _ workout schedule management UI --- ## Profile Có: Header: _ User name _ Premium Member badge Đã chỉnh: _ bỏ icon edit cạnh name _ Premium Member nằm bên phải cùng dòng Commitment section: Đã bỏ: _ Workout Schedule Profile settings gồm: ### Personal Information Các trang: _ Name _ Email _ Payment Method _ Subscription Plan _ Account Security ### Gym Location Cho phép thêm/chỉnh gym. ### Recovery Workout Có: Push-up reps target. Đã làm: _ Push-up reps nằm cùng dòng. _ Có nút + - _ Nhấn số reps: _ mở keyboard số trực tiếp _ không popup _ click ra ngoài tự dismiss keyboard ### Discipline Mode Có: Toggle button. ### Locked Apps Có UI chọn app: Ví dụ: _ TikTok _ Instagram _ YouTube Mỗi app: _ icon _ name _ lock indicator --- # 4. WORKOUT VERIFICATION FLOW Đã tạo: ## Verify Workout screen Flow: Home ↓ Start Workout ↓ Verify Workout --- ## Verify Workout UI Có: Header: _ Back button _ Title Progress: 3 bước:
Location Photo Complete
Hiện tại design: _ 3 đoạn riêng _ có gap _ bo tròn Step 1: Location: Text: "Location" "Confirm you're at the gym" Có: _ tick circle giống Recovery Complete Button: Continue --- Step 2: Photo: Text: "Photo" "Take a photo of your gym" Camera placeholder: "Camera Ready" Button: Capture Photo Có icon camera. Sau capture: Hai nút ngang: _ Retake _ Continue --- Step 3: Complete: Title: Workout Complete Text: "Great work showing up. Your commitment is fulfilled for today." Có: _ success circle _ tick icon Button: Back to Home full width --- # 5. RECOVERY WORKOUT FLOW Flow: Discipline Mode Activated ↓ Start Recovery Workout ↓ Recovery Workout ↓ Recovery Complete --- # Recovery Workout Screen Có: Header: _ Back button _ Title Recovery Workout Back button: Có circular background giống Discipline Mode. Content: Exercise: Push-ups Hiện đã chỉnh: Text: "Do 20 push-ups to recover" Typography: _ normal text _ bold nhẹ theo yêu cầu Camera area: Placeholder: _ camera tracking area Rep counter: Có: _ số reps _ circular progress Progress: _ chạy clockwise _ tăng dần theo reps _ đầu/cuối progress stroke bo tròn Messages: 0 reps: "Get into push up position" 5 reps: "Keep going" 10 reps: "Stay focused" 15 reps: "Almost there" --- # Recovery Complete Screen Có: Success state: _ vòng tròn lớn _ tick icon Đã chỉnh: _ giữ vòng tròn ngoài _ bỏ vòng tròn bên trong Text: Recovery Complete Access Restored Button: Back to Home Đã chỉnh: _ full width _ màu navy --- # 6. DISCIPLINE MODE ACTIVATED SCREEN Có: Header: Back button Đã chỉnh: _ back button có circular background giống Recovery Workout. Content: Restricted Apps section: Đã chỉnh: _ app cards đẹp hơn _ bỏ nền trắng ngoài _ lock icon chuyển xuống góc phải _ light mode đổi background thành trắng Recovery section: Hiển thị: Recovery workout requirement --- # 7. DESIGN SYSTEM ## Overall style Premium minimalist. Inspired by: _ Apple Fitness _ Linear _ Notion Không dùng: _ gaming style _ quá nhiều màu _ gradient --- # LIGHT MODE Primary:
#FF7B54
Dùng cho: _ CTA _ progress bar _ action Primary tint:
#FFB499
Accent:
#FFC947
Chỉ dùng cho: _ achievement _ reward _ milestone Text:
#2C3E5B
Background:
#FFF8F3
Surface:
#FFFFFF
--- # DARK MODE Background:
#141A24
Card:
#1E2733
Elevated:
#2C3E5B
Primary:
#FF8C64
Primary tint:
#4A2A20
Accent:
#FFC947
Accent tint:
#4A3A14
Text:
#FFFFFF
Secondary:
#8592A6
--- # 8. TECH STACK Frontend: React Native + TypeScript Framework: Expo Styling: NativeWind Navigation: Expo Router / React Navigation Backend dự kiến: Supabase Bao gồm: _ PostgreSQL _ Auth _ Storage Auth: _ Email _ Google _ Apple Notification: Expo Notifications AI: MediaPipe Pose Local trên device. Camera: React Native Vision Camera Payment: RevenueCat Analytics: Firebase Analytics Crash: Firebase Crashlytics iOS: Screen Time API: _ FamilyControls _ ManagedSettings _ DeviceActivity --- # 9. CURRENT DEVELOPMENT STATUS Hiện tại: ✅ UI gần hoàn thiện Đã có: _ Home _ Schedule _ Profile _ Discipline Mode Activated _ Recovery Workout _ Recovery Complete _ Verify Workout _ Subscription related UI _ Profile settings UI Chưa làm: _ Backend _ Supabase _ Authentication _ Database _ GPS thật _ Camera thật _ MediaPipe push-up detection _ Screen Time API _ RevenueCat _ TestFlight --- # 10. NEXT DEVELOPMENT ORDER Tiếp tục theo thứ tự: 1. Refactor UI components 2. Setup project structure chuẩn 3. Setup Supabase 4. Authentication 5. Database schema 6. Workout CRUD 7. User profile storage 8. GPS verification 9. Camera verification 10. MediaPipe push-up detection 11. Screen Time API 12. RevenueCat subscription 13. TestFlight release
