# README — راه‌اندازی پروژه Vite + React

> **اول اجرا کن:**
>
> ```bash
> npm install vite --save-dev
> ```
>
> بعد از این دستور ادامه مراحل زیر را انجام بده.

---

## پیش‌نیازها

- Node.js (نسخه LTS توصیه می‌شود). برای بررسی:

  ```bash
  node -v
  npm -v
  ```

- در صورتی که پروژه با Yarn یا pnpm ساخته شده باشد، از همان ابزار استفاده کن (فایل `yarn.lock` یا `pnpm-lock.yaml` را چک کن).

---

## مراحل سریع (Recommended)

1. در ریشهٔ پروژه (جایی که `package.json` قرار دارد) باز کن.
2. نصب Vite به عنوان dev dependency (اگر قبلاً نصب نشده):

   ```bash
   npm install vite --save-dev
   ```

3. نصب تمام وابستگی‌ها:

   ```bash
   npm install
   ```

4. اجرای سرور توسعه:

   ```bash
   npm run dev
   ```

> اگر در `package.json` اسکریپت `dev` تعریف نشده، از `npx vite` استفاده کن:
>
> ```bash
> npx vite
> ```

---

## اگر با خطای `'vite' is not recognized` روبه‌رو شدی

این خطا معمولاً یعنی:

- `vite` به‌صورت محلی نصب نشده (`node_modules/.bin` حاوی باینری vite نیست)، یا
- ویندوز مسیر اجرای محلی را برای دستور `vite` پیدا نمی‌کند.

راه‌حل‌ها:

1. مطمئن شو `vite` در `devDependencies` هست:

   ```bash
   npm ls vite
   ```

   اگر نصب نبود، نصب کن:

   ```bash
   npm install vite --save-dev
   ```

2. به جای اجرای مستقیم `vite`، از `npm run dev` استفاده کن — این باعث می‌شود `node_modules/.bin` به‌صورت خودکار در PATH اسکریپت‌ها قرار بگیرد.

3. اگر فقط می‌خواهی سریع تست کنی:

   ```bash
   npx vite
   ```

4. اگر از Yarn یا pnpm استفاده می‌کنی:

   - Yarn:

     ```bash
     yarn
     yarn dev
     ```

   - pnpm:

     ```bash
     pnpm install
     pnpm dev
     ```

5. بازنشانی و نصب دوباره در صورت بروز مشکل:

   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

   (در ویندوز از File Explorer یا `rd /s /q node_modules` و `del package-lock.json` استفاده کن.)

---

## بررسی `package.json`

مطمئن شو که در بخش `scripts` یک اسکریپت برای اجرای dev وجود دارد، مثلاً:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

اگر `dev` تعریف نشده بود، می‌تونی همین خطوط را اضافه کنی.

---

## نکات مخصوص ویندوز

- خطای `'vite' is not recognized` معمولاً با اجرای `npm run dev` حل می‌شود چون npm مسیر محلی را مدیریت می‌کند.
- اگر از PowerShell یا CMD استفاده می‌کنی و باز هم مشکل هست، امتحان کن ترمینال را ببندی و دوباره باز کنی یا از Windows Terminal استفاده کنی.

---

## خطاهای رایج و رفع آن‌ها

- `Invalid or unexpected token` پس از نصب: احتمالاً نسخهٔ Node خیلی قدیمیه — نسخه LTS نصب کن.
- `ERR_OSSL_EVP_UNSUPPORTED` (مربوط به OpenSSL در Node 17+): می‌توانی از متغیر محیطی زیر استفاده کنی قبل از اجرای npm:

  ```bash
  set NODE_OPTIONS=--openssl-legacy-provider   # windows
  export NODE_OPTIONS=--openssl-legacy-provider # mac/linux
  ```

- اگر بسته‌ای نصب نمی‌شود (خطاهای شبکه): بررسی کن که فایروال یا پراکسی مانع نشده باشد.

---

## اگر خواستی من برات انجام بدم

اگر تمایل داری من می‌تونم برایت یک نسخهٔ آماده از `package.json` یا یک اسکریپت ریکاوری پیشنهاد بدم. فقط بفرست `package.json` یا خروجی `npm ls --depth=0` تا دقیق‌تر بگم.

---

موفق باشی! اگر می‌خواهی من همین README را به فایل `README.md` در پروژه‌ات اضافه کنم یا اصلاحی بخوای، بگو تا انجام بدم.
