
# تبدیل برنامه به Local-First کامل

## هدف
حذف کامل وابستگی به Supabase در زمان اجرا. تمام داده‌ها (کاربران، نقش‌ها، رکوردهای سلامت، ارزیابی ریسک، آموزش، حوادث، مجوزها و …) به صورت **رمزنگاری‌شده** در IndexedDB مرورگر/Electron ذخیره می‌شوند. ثبت‌نام و ورود از همان بار اول بدون اینترنت ممکن است. ادمین/مدیر سیستم تنها کسی است که می‌تواند کاربر جدید بسازد و نقش بدهد.

## مراحل اجرا

### ۱) استخراج داده‌های فعلی Supabase
- نوشتن یک اسکریپت Node یک‌بارمصرف (`scripts/export-supabase.ts`) که با `SERVICE_ROLE_KEY` تمام جداول زیر را به `public/seed/seed.json` می‌ریزد:
  - `user_profiles`, `user_roles`, `role_audit_log`
  - `organizations`
  - `health_examinations`, `occupational_health_records`
  - `ergonomic_assessments`, `risk_assessments`
  - `safety_trainings`, `incidents`, `work_permits`, `daily_reports`
- اسکریپت روی سیستم خودم (sandbox) اجرا می‌شود؛ خروجی JSON رمزنگاری‌نشده داخل پروژه قرار می‌گیرد تا در نخستین اجرای برنامه بارگذاری شود. (پس از seed، خود برنامه آن را رمزنگاری و در IndexedDB می‌نویسد و فایل seed دیگر استفاده نمی‌شود.)

### ۲) لایه‌ی داده‌ی محلی (`src/lib/localDB.ts`)
- بر پایه‌ی `idb` یا API خام IndexedDB.
- یک object store به‌ازای هر «جدول» با همان نام جداول Supabase.
- هر رکورد قبل از نوشتن با **AES-GCM** (کلید مشتق‌شده از رمز کاربر فعلی + کلید دستگاه) رمزنگاری می‌شود. متادیتای ایندکس (id, user_id, organization_id, created_at) رمز نمی‌شود تا کوئری ممکن باشد.
- API شبیه Supabase:
  ```ts
  db.from('health_examinations').select().eq('user_id', uid)
  db.from('health_examinations').insert({...})
  db.from('health_examinations').update({...}).eq('id', x)
  db.from('health_examinations').delete().eq('id', x)
  ```
  این shim باعث می‌شود کد UI تقریباً بدون تغییر کار کند.

### ۳) احراز هویت محلی (`src/lib/localAuth.ts`)
- جدول محلی `local_users`: `{ id, email, password_hash (argon2id), salt, name, created_at }`.
- جدول `local_sessions`: توکن تصادفی + انقضا، در `localStorage` نگه داشته می‌شود.
- **ثبت‌نام اول**: اگر هیچ کاربری وجود ندارد، اولین ثبت‌نام به‌صورت خودکار نقش `admin` می‌گیرد. ثبت‌نام‌های بعدی غیرفعال می‌شوند مگر اینکه ادمین از پنل «مدیریت کاربران» کاربر بسازد.
- ادمین/مدیر سیستم در `UserManagementContent`: ساخت کاربر (email + رمز موقت + نقش)، تغییر نقش، غیرفعال‌سازی، حذف.
- نقش‌ها: همان ۷ نقش فعلی در جدول محلی `local_user_roles` ذخیره می‌شوند.

### ۴) جایگزینی `supabase` client
- `src/integrations/supabase/client.ts` به یک adapter تبدیل می‌شود که تماس‌ها را به `localDB` می‌فرستد. این کار از بازنویسی ده‌ها کامپوننت جلوگیری می‌کند.
- متدهای پشتیبانی‌شده: `.from().select/insert/update/delete/eq/order/limit/single()`، `.auth.signInWithPassword/signUp/signOut/getSession/getUser/onAuthStateChange`.
- متدهایی که local قابل پیاده‌سازی نیستند (مثل Edge Functions, Realtime, Storage) یا حذف یا با fallback محلی جایگزین می‌شوند:
  - `send-custom-email`, `admin-create-user`: حذف فراخوانی؛ ادمین مستقیماً در local user می‌سازد.
  - `hse-ai-chat`: مستقیماً به Ollama محلی (که قبلاً اضافه شد) متصل می‌شود.

### ۵) همگام‌سازی اختیاری «حالت سرور»
- متغیر محیطی `VITE_SYNC_ENABLED` (پیش‌فرض false).
- اگر true بود (نصب روی سرور)، یک sync adapter ساده داده‌های تغییریافته را با endpoint دلخواه (مثلاً همان Supabase یا REST سفارشی) push/pull می‌کند. در حالت local-only هیچ تماس شبکه‌ای انجام نمی‌شود.

### ۶) حذف وابستگی‌های اجرایی
- نگه‌داشتن `@supabase/supabase-js` فقط برای اسکریپت استخراج اولیه؛ از import در runtime جلوگیری می‌شود (adapter جایگزین).
- حذف فراخوانی Edge Functions از UI.
- به‌روزرسانی Service Worker تا هیچ‌گاه به دامنه supabase.co درخواست ندهد.

### ۷) اسناد و راهنمای کاربر
- `README-LocalFirst.md`: نحوه اجرا، اولین ثبت‌نام = ادمین، نحوه فعال‌سازی sync روی سرور.

## نکات فنی
- **رمزنگاری**: AES-GCM 256، کلید با PBKDF2 (250k iter) از رمز کاربر؛ کلید پایگاه‌داده با کلید کاربر wrap می‌شود تا تغییر رمز فقط wrap را عوض کند.
- **چندکاربری روی یک دستگاه**: هر کاربر key wrap جداگانه دارد؛ داده‌های مشترک با کلید سازمان رمز می‌شوند.
- **عملکرد**: indexهای IndexedDB روی `user_id`, `organization_id`, `created_at` ساخته می‌شوند.
- **بدون نیاز به مهاجرت DB Supabase**: هیچ migration جدیدی روی Supabase زده نمی‌شود؛ Supabase فقط منبع seed اولیه است.

## فایل‌های اصلی که ایجاد/تغییر می‌کنند
- ایجاد: `scripts/export-supabase.ts`, `public/seed/seed.json`, `src/lib/localDB.ts`, `src/lib/localAuth.ts`, `src/lib/syncAdapter.ts`, `README-LocalFirst.md`
- جایگزینی: `src/integrations/supabase/client.ts` (adapter)
- تغییر: `src/pages/Auth.tsx`, `src/components/UserManagementContent.tsx`, `src/components/HSEAIChat.tsx`, `public/sw.js`
- بدون تغییر باقی می‌مانند: تمام فرم‌ها و کامپوننت‌های UI (به لطف adapter).

## تأییدیه لازم قبل از اجرا
این یک بازسازی بزرگ است (~۱۵ فایل، چند ساعت کار). آیا با مسیر بالا موافقید تا شروع کنم؟ همچنین لطفاً تأیید کنید:
1. اسکریپت استخراج می‌تواند از `SUPABASE_SERVICE_ROLE_KEY` موجود استفاده کند؟ (بله/خیر)
2. آیا حذف ارسال ایمیل (Resend) و Edge Function `admin-create-user` در حالت local قابل قبول است؟ (در حالت local چاره‌ای نیست چون اینترنت نداریم.)
