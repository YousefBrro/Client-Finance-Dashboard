# Tibr — منصة عرض الحسابات المالية للعملاء

واجهة Web Dashboard تحوّل ملف Excel الخاص بكل عميل إلى تجربة حديثة وسهلة، خصوصاً على الهاتف.
Stack: React 19 · TypeScript (strict) · Vite · Tailwind CSS 4 · React Router · Lucide · SheetJS.

## التشغيل

```bash
npm install
npm run dev        # http://localhost:5173  (يفتح تلقائياً /c/client-001)
npm run build      # tsc -b && vite build
npm run preview
```

الروابط التجريبية (في `npm run dev` فقط): `/c/client-001` · `/c/client-002` (ملف Excel بعناوين عربية) · `/c/client-003`

## البنية

```
public/demo-data/     ملفات Excel التجريبية (بيانات وهمية فقط)
src/
├─ data/              clients.ts (إعدادات العملاء) · currencies.ts
├─ services/          excelService.ts (قراءة Excel) · clientDataService.ts (نقطة دخول البيانات الوحيدة للواجهة)
├─ hooks/             useClientData · useClient · useTransactionFilters
├─ lib/               finance (الحسابات والفلترة) · format · labels · navigation
├─ i18n/              translations.ts · LanguageContext.tsx
├─ types/             الأنواع المشتركة
├─ components/        layout · dashboard · transactions · ui
└─ pages/             ClientLayout · DashboardPage · TransactionsPage · NotFoundPage
```

الواجهة لا تعرف شيئاً عن Excel. كل ما تحتاجه هو `loadClientData(client)` في `services/clientDataService.ts`.
في الإنتاج الملف يُجلب من `/api/c/<token>/data` (انظر قسم النشر).

## شكل ملف Excel

أعمدة بأي ترتيب، بعناوين إنجليزية أو عربية:

| Date / التاريخ | Description / البيان | Type / نوع العملية | Currency / العملة | Incoming / وارد | Outgoing / صادر |
|---|---|---|---|---|---|

- Type: `Capital · Payment · Exchange` أو `رأس مال · دفعة · صرف`
- Currency: `SYP · USD · EUR` (تُقبل أيضاً `ل.س` و`$` و`€` و`دولار` و`يورو`)
- التواريخ النصية بصيغة `DD/MM/YYYY` تُقرأ يوم-أولاً.
- الصفوف غير الصالحة تُتجاوز بدون كسر الصفحة (`skippedRows`).
- يُقرأ الورقة المسماة `Transactions` أو `العمليات`، وإلا فأول ورقة. `.xlsm` مدعوم (القيم المحسوبة فقط، بدون تشغيل macros).

## قرارات مالية مهمة

- لا يتم جمع SYP وUSD وEUR أبداً. كل عملة لها رصيدها.
- الرسم البياني في كل بطاقة هو الرصيد التراكمي الفعلي بعد كل عملية. إن كانت العمليات أقل من اثنتين يظهر خط زخرفي منقّط.
- نسبة التغيّر = صافي حركة آخر 30 يوماً من بيانات العملة ÷ الرصيد قبلها. إن لم يوجد رصيد سابق موجب لا تُعرض نسبة.

## ملاحظات نشر

- الفلاتر محفوظة في الرابط (`?q=&cur=&op=`) فيمكن مشاركتها.
- عند النشر تحت مسار فرعي: `VITE_BASE=/tibr/ npm run build`.
- على استضافة ثابتة (GitHub Pages مثلاً) أضف fallback يعيد `index.html` لكل المسارات (نسخة باسم `404.html`).
- روابط OneDrive العادية لا تسمح بقراءة الملف من المتصفح (CORS). استخدم رابطاً مباشراً يدعم CORS أو Backend صغير لاحقاً.
- مكتبة `xlsx` مثبّتة من CDN الرسمي لـ SheetJS (نسخة npm قديمة وفيها ثغرات معروفة). الملفات هنا داخلية وموثوقة.
- لا تضع بيانات عملاء حقيقية في `public/demo-data` داخل GitHub.

## تثبيت التطبيق (PWA)

- زر «تثبيت التطبيق» يظهر في الـ Header فقط عندما يكون التثبيت ممكناً (Chrome/Edge/Android مباشرة، وiPhone عبر نافذة شرح: مشاركة ← إضافة إلى الشاشة الرئيسية).
- الـ manifest يُبنى لكل عميل (`hooks/useClientManifest.ts`)، فالتطبيق المثبّت يفتح مباشرة على رابط ذلك العميل الخاص.
- الـ Service Worker (`public/sw.js`) يخزّن هيكل التطبيق فقط. بيانات Excel لا تُخزَّن أبداً.
- يعمل التثبيت على HTTPS فقط، ويُسجَّل الـ SW في نسخة `build` (وليس في `dev`).
- في الإنتاج الصفحة الرئيسية `/` لا تكشف أي عميل، وكل الصفحات `noindex`.

## النشر على Cloudflare Pages مع OneDrive (بدون أي بيانات عملاء على GitHub)

**الفكرة:** على GitHub الكود فقط. بيانات كل عميل (الاسم + رابط OneDrive) محفوظة في KV خاص على Cloudflare،
ورابط العميل رمز عشوائي: `https://موقعك/c/k8Zq3vN...`. الموقع يطلب من Function،
والـ Function تجلب الملف من OneDrive وقت الطلب. المتصفح لا يرى رابط OneDrive أبداً.

### مرة واحدة
1. ارفع المشروع إلى GitHub (لا يحتوي بيانات عملاء).
2. Cloudflare Dashboard ← Workers & Pages ← Create ← Pages ← Connect to Git.
   Build command: `npm run build` · Output directory: `dist`.
3. Storage & Databases ← KV ← Create namespace (مثلاً `tibr-clients`) وانسخ الـ **Namespace ID**.
4. مشروع Pages ← Settings ← Bindings ← Add ← KV namespace. Variable name: `CLIENTS` واختر الـ namespace. ثم Redeploy.
5. على جهازك: `cp .env.example .env.local` واملأ `KV_NAMESPACE_ID` و`SITE_URL`. ثم `npm install` و`npx wrangler login`.
6. احذف مجلد `public/demo-data` (بيانات وهمية فقط للتطوير).

### لكل عميل جديد
1. OneDrive ← الملف ← Share ← "Anyone with the link" + **Can view** ← Copy link.
2. نفّذ:
```bash
npm run client:add -- --name-en "Al-Noor" --name-ar "شركة النور" --project-en "Retail" --project-ar "المتاجر" --url "رابط OneDrive"
```
3. يطبع الرابط الخاص بالعميل. أرسله له.
4. اختبر: افتح `الرابط` ثم `/api/c/<token>/data` بالمتصفح (يجب أن ينزّل الملف).

## لوحة الإدارة من الموبايل (`/admin`)

صفحة ويب مستقلة لإدارة العملاء من أي هاتف، بدون Terminal ولا فتح Cloudflare Dashboard.

### تفعيلها (مرة واحدة)
1. اختر كلمة مرور قوية للإدارة (لا تستخدمها بمكان ثاني).
2. من جهازك (بعد `npx wrangler login`):
   ```bash
   npx wrangler pages secret put ADMIN_PASSWORD --project-name=<اسم-مشروع-Pages>
   ```
   بيطلب منك يدخل كلمة المرور، وبتنحفظ فقط كـ secret على Cloudflare، ما بتنكتب بأي ملف ولا Git.
3. افتح `https://موقعك.pages.dev/admin/` من موبايلك وسجّل دخول.

### الاستخدام
- **إضافة عميل:** نفس الحقول يلي بسكربت `client:add` (الاسم والمشروع بالعربي والإنجليزي، رابط OneDrive، وخيار زر «فتح Excel»). عند الإنشاء، الرابط الخاص بينسخ تلقائياً للحافظة.
- **قائمة العملاء:** كل عميل مع رابطه، وأزرار نسخ / فتح / إلغاء.
- **إلغاء رابط:** فوري، مع تأكيد قبل التنفيذ.
- تسجيل الدخول محمي: بعد 6 محاولات خاطئة يُقفل لمدة 15 دقيقة.
- الجلسة صالحة 12 ساعة. تسجيل الخروج بيمسح الكوكي من جهازك، لكن بما إنه نظام بدون تخزين جلسات، الكوكي القديم نفسه (لو انسرق قبل تسجيل الخروج) بيضل صالح لنهاية الـ 12 ساعة. إذا شكيت بتسريب، غيّر `ADMIN_PASSWORD` فوراً (نفس أمر الخطوة 2)، وهاد بيلغي كل الجلسات القديمة دفعة وحدة.

سكربتات الطرفية (`client:add` و`client:list` و`client:revoke`) لسا شغالة وبتقدر تستخدمها بدل الصفحة أو معها، الاثنين بيكتبوا لنفس الـ KV.

### زر «فتح Excel» (اختياري لكل عميل)
- أضف `--show-excel` ليفتح الزر نفس رابط OneDrive، أو `--view-url "<رابط آخر>"` لرابط عرض منفصل (يُفضَّل، لأنه يُلغى بدون التأثير على البيانات).
- بدون أي منهما لا يظهر الزر لذلك العميل.
- انتبه: العميل سيرى رابط OneDrive ويستطيع مشاركته، فاستخدم رابط View فقط، ويُفضَّل مع تاريخ انتهاء.

### إدارة الروابط
- `npm run client:list` يعرض كل العملاء وروابطهم.
- `npm run client:revoke -- <token>` يلغي الرابط فوراً.
- تعديل ملف Excel على OneDrive يظهر في الموقع مباشرة (لا يوجد رفع).

### ملاحظات أمان
- الرمز 24 خانة عشوائية (144 بت)، ولا يمكن تخمينه. من يملك الرابط يرى بيانات ذلك العميل فقط، فلا تنشره علناً.
- رمز خاطئ أو ملغى يعطي نفس الرد (404).
- كل الصفحات `noindex` مع `Referrer-Policy: no-referrer`.
- إن لم يعمل رابط OneDrive من الـ Function (يحتاج تسجيل دخول)، البديل هو رفع الملفات إلى R2 الخاص بدل OneDrive.

## بنية Functions

```
functions/
├─ _lib/
│  ├─ clients.ts     أنواع البيانات + قراءة/التحقق من رمز العميل
│  ├─ session.ts      توقيع/تحقق كوكي الجلسة (HMAC)، بدون تخزين جلسات على الخادم
│  ├─ adminAuth.ts    تحقق تفويض الإدارة من الكوكي
│  └─ lockout.ts      قفل تسجيل الدخول بعد محاولات فاشلة متكررة
└─ api/
   ├─ c/[token]/       index.ts (بيانات العرض) · data.ts (ملف Excel)
   └─ admin/           login.ts · logout.ts · me.ts · clients/index.ts (قائمة/إضافة) · clients/[token].ts (إلغاء)
```
