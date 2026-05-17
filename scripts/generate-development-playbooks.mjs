import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "docs", "development-playbooks");
const tempDir = path.join(tmpdir(), `brenych-playbooks-${Date.now()}`);

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chromePath) {
  throw new Error("Chrome or Edge executable was not found. PDF generation requires a local Chromium browser.");
}

mkdirSync(outputDir, { recursive: true });
mkdirSync(tempDir, { recursive: true });

const versionLabel = "Версія 1.0 / 17 травня 2026";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function codeBlock(value, language = "tsx") {
  return `<pre data-language="${language}"><code>${escapeHtml(value.trim())}</code></pre>`;
}

const docs = [
  {
    file: "01-active-chamber-console.pdf",
    title: "Консольне вікно Active Chamber System",
    eyebrow: "Immersive / Cinematic Atlas",
    summary:
      "Документація універсального консольного середовища, яке відкриває просторовий атлас, керує контентом як живою системою і підтримує кінематографічні переходи, drag, wheel, keyboard та звукові сигнали.",
    content: String.raw`
      <section>
        <h2>1. Що це за розробка</h2>
        <p><strong>Active Chamber System</strong> — це не звичайне модальне вікно і не галерея. Це повноекранне консольне середовище для Immersive-напрямку, де кожен проєкт або просторовий модуль поводиться як окрема «камера»: має свій статус, медіа, сигнал, набір engine-зв'язків і можливий маршрут входу.</p>
        <p>Ключова ідея: користувач не просто відкриває картинку чи блок інформації, а ніби заходить у технічний атлас живої системи. Середовище реагує на wheel, drag, клавіатуру, наведення, вибір chamber, зміну режиму orbit / assembly і звукові події.</p>
        <div class="callout"><strong>Головна цінність:</strong> один патерн може презентувати XR-експерименти, інтерактивні архіви, продукт-світи, медіа-інсталяції, AR/VR proof і майбутні просторові кейси без копіювання окремих шаблонів.</div>
      </section>

      <section>
        <h2>2. Де використано на сайті</h2>
        <table>
          <tr><th>Рівень</th><th>Файл / зона</th><th>Призначення</th></tr>
          <tr><td>Дані chambers</td><td><code>src/data/immersiveSystems.ts</code></td><td>Опис камер, статусів, медіа, тегів, engine-зв'язків і CTA.</td></tr>
          <tr><td>Основний екран</td><td><code>src/pages/ImmersiveV2.tsx</code></td><td>Хаб Immersive, orbit-карта, консольний атлас і assembly-режим.</td></tr>
          <tr><td>Стан активної камери</td><td><code>useImmersiveChamberSelection</code></td><td>Єдине джерело істини для активної chamber і пов'язаних engine-сигналів.</td></tr>
          <tr><td>Звуки</td><td><code>useSound()</code></td><td>Ролі <code>hover</code>, <code>select</code>, <code>transition</code>, <code>atlasOpen</code>, <code>close</code>.</td></tr>
          <tr><td>Повноекранний шар</td><td><code>createPortal(..., document.body)</code></td><td>Виносить консоль над сторінкою, щоб її не ламали parent transforms або overflow.</td></tr>
        </table>
      </section>

      <section>
        <h2>3. Архітектура патерну</h2>
        <ul>
          <li><strong>Chamber data model.</strong> Кожна камера має id, shortTitle, room, statusLabel, proofLine, summary, media, tags, route і ctaLabel. Це дозволяє підключати нові кімнати через дані, а не через нову верстку.</li>
          <li><strong>Selection controller.</strong> <code>useImmersiveChamberSelection</code> тримає activeChamberId, повертає activeChamber і activeChamberEngines, а також методи <code>selectChamber</code> і <code>resetChamber</code>.</li>
          <li><strong>Surface layer.</strong> Основний темний простір показує активну камеру, фоновий blur-постер, grid, орбітальні карточки, trace-фрагменти й кнопку <code>Open cinematic atlas</code>.</li>
          <li><strong>Console layer.</strong> При відкритті atlas створюється fixed portal із власним scroll/drag/wheel контекстом, закриттям через Escape і блокуванням body scroll.</li>
          <li><strong>Modes.</strong> Режим <code>orbit</code> дає просторову навігацію між камерами. Режим <code>assemble</code> перетворює атлас у довший структурований proof field.</li>
        </ul>
      </section>

      <section>
        <h2>4. UX-поведінка</h2>
        <ul>
          <li><strong>Вхід.</strong> Користувач бачить активну chamber у темному середовищі й відкриває atlas через одну зрозумілу дію.</li>
          <li><strong>Навігація.</strong> Wheel і drag перемикають камери по колу. Arrow keys дублюють цю логіку для keyboard UX.</li>
          <li><strong>Фокус.</strong> Клік по площині не одразу викидає користувача з атласу; він спочатку інспектує chamber і показує terminal focus signal.</li>
          <li><strong>Вихід.</strong> Escape працює каскадно: спочатку повертає з assembly, потім знімає inspected chamber, потім закриває atlas.</li>
          <li><strong>Звук.</strong> Звукові ролі не є декором. Вони підтверджують зміну стану, відкриття, закриття, hover і вибір.</li>
        </ul>
      </section>

      <section>
        <h2>5. Візуальні принципи</h2>
        <ul>
          <li>Консоль має відчуватись як технічне середовище, але не як «чорний квадрат». Потрібні напівпрозорі шари, grid, blur-медіа, орбітальні лінії, сигнали та зміщені площини.</li>
          <li>Медіа не повинні просто лежати у карточці. Вони працюють як planes: можуть мати clip-path, depth, rotate, trace-версії, secondary memory fragments.</li>
          <li>Тексти мають бути короткі й сигнальні: status, proofLine, chamberSignal, engine signal. Довгі описи краще переносити в assembly mode.</li>
          <li>Контролі не мають перебивати атмосферу: тонкі borders, uppercase microcopy, низький контраст для вторинних елементів, чіткий акцент для основної дії.</li>
        </ul>
      </section>

      <section>
        <h2>6. Як адаптувати для майбутнього проєкту</h2>
        <ol>
          <li>Сформувати список chambers: 3-7 об'єктів достатньо для сильного orbit-відчуття.</li>
          <li>Для кожної chamber підготувати poster, 1-3 stills або коротке video loop.</li>
          <li>Описати proofLine як одну сильну тезу, а summary залишити для розгорнутого режиму.</li>
          <li>Прив'язати engine-зв'язки: motion, media loader, spatial route, audio state, content graph, commerce layer тощо.</li>
          <li>Визначити, чи chamber має route. Якщо route немає, CTA має залишатися inspect-only.</li>
          <li>Перевірити reduced motion: без анімацій система має залишатися зрозумілою і доступною.</li>
        </ol>
      </section>

      <section>
        <h2>7. Чеклист якості</h2>
        <ul class="checklist">
          <li>Atlas відкривається через portal і не обрізається parent контейнерами.</li>
          <li>Body scroll блокується при відкритому atlas і відновлюється після закриття.</li>
          <li>Wheel, drag, arrow keys і buttons не конфліктують між собою.</li>
          <li>Клік по контрольних кнопках не запускає drag / background close.</li>
          <li>Escape має передбачуваний порядок: assembly → inspected → close.</li>
          <li>Звукові ролі не повторюються надмірно і не створюють шум.</li>
          <li>Темний фон має достатньо деталей, щоб не виглядати пустим чорним екраном.</li>
        </ul>
      </section>

      <section>
        <h2>8. Типові помилки</h2>
        <ul>
          <li><strong>Зробити це звичайною модалкою.</strong> Якщо прибрати просторовість, консоль втрачає сенс і стає просто lightbox.</li>
          <li><strong>Перевантажити даними.</strong> Кожна chamber має говорити коротко. Деталізація живе в assembly mode.</li>
          <li><strong>Забути про pointer control.</strong> Drag і click мають розрізнятися, інакше відкриття chamber буде випадковим.</li>
          <li><strong>Поставити звук без логіки.</strong> Audio має відповідати станам, а не просто грати на кожному mousemove.</li>
        </ul>
      </section>
    `,
  },
  {
    file: "02-whisper-section-color-morph.pdf",
    title: "Плавне перетікання кольору між секціями",
    eyebrow: "WHISPER / Atmospheric Scroll",
    summary:
      "Документація scroll-driven кольорової морфології сторінки: секції WHISPER змінюють атмосферу без жорстких розривів, а header працює як «хамелеон» і адаптується до темних та світлих сцен.",
    content: String.raw`
      <section>
        <h2>1. Концепція</h2>
        <p>WHISPER побудований як одна цілісна інсталяція, а не набір розділів. Тому перехід між секціями не має відчуватися як «перемкнули фон». Колір, прозорість, header, rail і контраст поступово змінюються під час scroll, створюючи відчуття, що наступна кімната входить у поточну.</p>
        <p>Це рішення особливо корисне для преміальних кейсів, де сторінка має не тільки пояснювати роботу, а й сама демонструвати рівень режисури, ритму і motion grammar.</p>
      </section>

      <section>
        <h2>2. Складові системи</h2>
        <table>
          <tr><th>Складова</th><th>Роль</th><th>Приклад</th></tr>
          <tr><td><code>data-header-scene</code></td><td>Маркер сцени, яку бачить observer.</td><td><code>whisper-threshold</code>, <code>whisper-atlas</code>, <code>whisper-mobile</code></td></tr>
          <tr><td><code>headerSceneThemes</code></td><td>Набір токенів для кожної сцени.</td><td>surface, foreground, muted, border, blur, elevation</td></tr>
          <tr><td><code>useActiveHeaderScene</code></td><td>Визначає активну сцену за верхнім sensor-line.</td><td>IntersectionObserver + scoring</td></tr>
          <tr><td><code>useHeaderThemeMorph</code></td><td>Записує CSS variables у header.</td><td><code>--header-bg</code>, <code>--header-text</code>, <code>--header-progress</code></td></tr>
          <tr><td><code>header-chameleon.css</code></td><td>Плавні transition-и для кольору, border, blur і shadow.</td><td>560-720ms cubic-bezier</td></tr>
        </table>
      </section>

      <section>
        <h2>3. Як це працює</h2>
        <ol>
          <li>Кожна велика секція отримує стабільний scene id через <code>data-header-scene</code>.</li>
          <li>Observer дивиться не на центр viewport, а ближче до header-зони, щоб theme змінювався саме тоді, коли секція заходить під навігацію.</li>
          <li>Resolver бере route theme як fallback і scene theme як пріоритет, якщо активна сцена знайдена.</li>
          <li>Hook записує CSS variables у DOM-елемент header.</li>
          <li>CSS transition згладжує зміну фону, тексту, бордерів, chips, CTA і progress-dot.</li>
        </ol>
        <div class="callout"><strong>Важливо:</strong> це не тільки про header. Такий самий принцип можна застосовувати для page wash, right rail tone, sound scene, ambient layer або scroll-progress атмосфери.</div>
      </section>

      <section>
        <h2>4. WHISPER як reference</h2>
        <ul>
          <li><strong>Threshold.</strong> Темний cinematic entry, header переходить у світлий текст і темну translucent surface.</li>
          <li><strong>Atlas / Web / Collector.</strong> Світлі кремові сцени повертають header у щільний світлий режим.</li>
          <li><strong>Quest proof і Mobile proof.</strong> Темні proof-секції вимагають dark header tokens, щоб навігація не ставала сліпою.</li>
          <li><strong>Engine ledger.</strong> Closing-сцена може мати більш action-oriented темний token, щоб відчувалась фінальною.</li>
        </ul>
      </section>

      <section>
        <h2>5. Правила дизайну</h2>
        <ul>
          <li>Колір не має стрибати. Якщо секція різко темна, додайте проміжний wash, gradient або top padding, щоб header встиг перейти.</li>
          <li>Header має залишатися функціональним: активна мова, CTA, nav labels і live signal завжди читаються.</li>
          <li>Не змішуйте занадто багато різних палітр. Достатньо 3-5 головних станів: light, dense light, dark proof, action dark, special scene.</li>
          <li>Секційний фон і header token мають говорити одним тоном. Якщо фон кремовий, header не повинен виглядати як окремий чорний банер.</li>
          <li>Для темних сцен використовуйте не чистий чорний, а rgba з blur і elevation, щоб header не був «діркою» у сторінці.</li>
        </ul>
      </section>

      <section>
        <h2>6. Як адаптувати</h2>
        <ol>
          <li>Складіть карту секцій і визначте mood кожної: світла, темна, proof, commerce, closing.</li>
          <li>Додайте scene id у кожну секцію: <code>data-header-scene="project-section"</code>.</li>
          <li>Опишіть токени у <code>headerSceneThemes</code>: signalLabel, surface, foreground, muted, border, chipSurface, progress, action colors.</li>
          <li>Перевірте зміну на реальному scroll, а не тільки на статичному скріншоті.</li>
          <li>Для нестандартних сторінок додайте окремий route fallback через <code>getHeaderMoodForPath</code>.</li>
          <li>Завжди тестуйте мобільний viewport: header може мати іншу щільність і менше місця для contrast помилок.</li>
        </ol>
      </section>

      <section>
        <h2>7. Чеклист</h2>
        <ul class="checklist">
          <li>Усі секції мають унікальний і стабільний scene id.</li>
          <li>Header не блимає при швидкому scroll.</li>
          <li>Контраст тексту відповідає фону у кожній сцені.</li>
          <li>Reduced motion зберігає читабельність, навіть якщо transition майже миттєвий.</li>
          <li>CTA і language switch не губляться на dark proof sections.</li>
          <li>Right rail tone не конфліктує з header tone.</li>
          <li>Фінальна секція має окремий closing/action mood, якщо вона просить користувача діяти.</li>
        </ul>
      </section>

      <section>
        <h2>8. Для яких проєктів підходить</h2>
        <ul>
          <li>Портфоліо з різними типами кейсів, де кожен розділ має власну атмосферу.</li>
          <li>Hospitality / real estate сайти з переходом між place, rooms, services, booking.</li>
          <li>Культурні платформи, exhibition pages, digital catalogues.</li>
          <li>Product storytelling, де proof, features і conversion мають різний візуальний тон.</li>
          <li>Immersive / WebGL / XR сторінки, де scroll має відчуватись як рух між кімнатами.</li>
        </ul>
      </section>
    `,
  },
  {
    file: "03-field-spatial-extended-navigation.pdf",
    title: "Field / Spatial навігація і Extended Field",
    eyebrow: "Case Content Navigation",
    summary:
      "Документація системи перегляду великої кількості кейсів, скріншотів або proof-контенту: перемикач Field / Spatial, Flow / Atlas, відкриття extended field і автоматичне згортання при поверненні назад.",
    content: String.raw`
      <section>
        <h2>1. Проблема, яку вирішує патерн</h2>
        <p>Коли кейс або архів має багато доказів, звичайний список швидко перетворюється на каталог. Користувач втрачає ритм, а сторінка стає важкою. Наш патерн вирішує це через два режими читання і controlled expansion.</p>
        <p>На рівні Work cases це проявляється як <strong>Flow / Atlas</strong>. На рівні archive / evidence field — як <strong>Field / Index</strong>, який можна адаптувати під Field / Spatial для інших ніш. Ідея одна: користувач сам обирає, як читати контент — кінематографічно або сканувально.</p>
      </section>

      <section>
        <h2>2. Основні режими</h2>
        <table>
          <tr><th>Режим</th><th>Призначення</th><th>Коли використовувати</th></tr>
          <tr><td>Field / Flow</td><td>Великий, ритмічний, просторовий перегляд.</td><td>Коли потрібно створити відчуття авторського walkthrough.</td></tr>
          <tr><td>Spatial / Atlas / Index</td><td>Компактний grid або scan mode.</td><td>Коли користувач хоче швидко порівняти багато об'єктів.</td></tr>
          <tr><td>Open extended field</td><td>Розгортає приховану частину proof.</td><td>Коли контенту більше, ніж варто показувати одразу.</td></tr>
          <tr><td>Auto collapse</td><td>Згортає expanded state при поверненні вгору.</td><td>Щоб сторінка не залишалась розтягнутою після перегляду.</td></tr>
        </table>
      </section>

      <section>
        <h2>3. Реалізація у CasePageV2</h2>
        <ul>
          <li><code>EvidenceViewToggle</code> дає два режими: <code>sequence</code> / Flow і <code>atlas</code> / Grid scan.</li>
          <li><code>ScreensAsEvidence</code> тримає стан <code>viewMode</code> і <code>expanded</code>.</li>
          <li>За замовчуванням показуються перші 5 evidence frames. Це зберігає темп сторінки.</li>
          <li>Якщо frames більше 5, з'являється CTA <code>Open full evidence field</code>.</li>
          <li>Кожна карточка proof відкриває shared inspect reveal, тому компактний режим не втрачає глибину.</li>
        </ul>
      </section>

      <section>
        <h2>4. Реалізація в Evidence Atlas</h2>
        <ul>
          <li><code>ArchiveViewToggle</code> перемикає archive field між spatial field і transformed index.</li>
          <li><code>archiveExpanded</code> відкриває додатковий блок cases через <code>Open extended field</code>.</li>
          <li><code>expandedArchiveRef</code> і <code>expandedArchiveSeenRef</code> дозволяють зрозуміти, чи користувач уже зайшов у expanded area.</li>
          <li>Scroll listener згортає extended field, коли користувач повертається вище порогу. Це економить простір і повертає сторінку в легкий стан.</li>
        </ul>
        <div class="callout"><strong>Ключова деталь:</strong> extended field не має бути «другим сайтом всередині сторінки». Це тимчасове розгортання, яке допомагає переглянути більше, але не знищує основний ритм.</div>
      </section>

      <section>
        <h2>5. UX правила</h2>
        <ul>
          <li>Початковий стан має бути коротким і сильним. Не показуйте весь контент одразу, якщо його багато.</li>
          <li>Назви режимів мають бути зрозумілі, але не побутові: Field, Flow, Atlas, Spatial, Index.</li>
          <li>CTA розгортання має пояснювати, що саме відкривається: more surfaces, full evidence field, extended case field.</li>
          <li>Після розгортання має бути можливість закрити поле вручну.</li>
          <li>Якщо користувач повертається назад угору, автоматичне згортання має спрацювати непомітно і без ривка.</li>
          <li>Усі об'єкти у будь-якому режимі мають відкриватися в inspect viewer або мати чіткий route.</li>
        </ul>
      </section>

      <section>
        <h2>6. Для яких ніш підходить</h2>
        <ul>
          <li><strong>Real estate.</strong> Field для районів / об'єктів, Spatial для швидкого порівняння квартир.</li>
          <li><strong>Hospitality.</strong> Flow для історії місця, Atlas для номерів, сервісів, локацій.</li>
          <li><strong>Clinics.</strong> Flow для patient journey, Index для процедур / результатів / довіри.</li>
          <li><strong>Product tools.</strong> Flow для workflow, Atlas для screens, states, modules.</li>
          <li><strong>Culture / exhibition.</strong> Field для кураторської траєкторії, Atlas для робіт / авторів / медіа.</li>
        </ul>
      </section>

      <section>
        <h2>7. Технічний recipe</h2>
        <ol>
          <li>Підготуйте масив content frames з id, label, caption, media, role.</li>
          <li>Визначте <code>INITIAL_VISIBLE_COUNT</code> — зазвичай 5 або 6.</li>
          <li>Додайте state: <code>viewMode</code>, <code>expanded</code>, active/filter якщо потрібно.</li>
          <li>Створіть Toggle з двома режимами і shared transition.</li>
          <li>Для Flow використайте вертикальну sequence-композицію з великими кадрами.</li>
          <li>Для Spatial/Atlas використайте grid, masonry або горизонтальне поле.</li>
          <li>Додайте expansion CTA тільки тоді, коли hiddenCount > 0.</li>
          <li>Підключіть inspect modal, щоб кожен кадр залишався deep-viewable.</li>
        </ol>
      </section>

      <section>
        <h2>8. Чеклист</h2>
        <ul class="checklist">
          <li>Перемикач не зміщує layout агресивно.</li>
          <li>Expanded state не відкривається, якщо додаткового контенту немає.</li>
          <li>Hidden count і visible count показують правдиві числа.</li>
          <li>Після відкриття extended field користувача плавно підводить до нового блоку.</li>
          <li>Повернення назад не залишає сторінку надто довгою.</li>
          <li>Inspect працює однаково з Flow і Atlas режимів.</li>
          <li>На мобільному режим не стає дрібною сіткою без читабельності.</li>
        </ul>
      </section>
    `,
  },
  {
    file: "04-section-rail-navigation.pdf",
    title: "Права навігаційна панель SectionRail",
    eyebrow: "Canonical Site Navigation",
    summary:
      "Документація правої секційної навігації: компактний прогрес, активний розділ, адаптація до темних/світлих сцен і правила, щоб панель допомагала орієнтації, але не відволікала.",
    content: String.raw`
      <section>
        <h2>1. Призначення</h2>
        <p><strong>SectionRail</strong> — це права вертикальна навігація для довгих сторінок. Вона показує структуру сторінки, прогрес scroll і активну секцію, але залишається тихою: маленькі індекси, короткі labels, тонкий progress line, низький візуальний шум.</p>
        <p>На сайті це стало канонічним рішенням для Work, Offer, About, Evidence Atlas і WHISPER. Його варто використовувати на сторінках, де користувач має пройти кілька логічних шарів і може захотіти швидко повернутися до конкретного блоку.</p>
      </section>

      <section>
        <h2>2. Компоненти</h2>
        <table>
          <tr><th>Компонент</th><th>Що робить</th></tr>
          <tr><td><code>SectionRail</code></td><td>Рендерить fixed nav справа, індекси, labels і scroll progress.</td></tr>
          <tr><td><code>SectionRailItem</code></td><td>Мінімальна модель: <code>id</code>, <code>index</code>, <code>label</code>.</td></tr>
          <tr><td><code>useSectionRailActive</code></td><td>Визначає активну секцію через viewport anchor, scroll і resize.</td></tr>
          <tr><td><code>scrollToRailSection</code></td><td>Плавно скролить до секції з offset під fixed header.</td></tr>
          <tr><td><code>tone</code></td><td>Може бути <code>auto</code>, <code>light</code> або <code>dark</code>.</td></tr>
        </table>
      </section>

      <section>
        <h2>3. Поведінка</h2>
        <ul>
          <li>Rail видно тільки на ширших екранах, де він не заважає основному контенту.</li>
          <li>Progress line прив'язаний до <code>scrollYProgress</code>, тому користувач бачить не тільки активний пункт, а й загальний прогрес.</li>
          <li>Active state визначається не точним top секції, а логічною anchor-зоною viewport. Це робить перемикання природнішим.</li>
          <li>При появі footer rail плавно зникає, щоб не конфліктувати з фінальним CTA і нижніми елементами.</li>
          <li>Dark/Light tone адаптує колір індексів, labels, progress line і border.</li>
        </ul>
      </section>

      <section>
        <h2>4. Візуальні принципи</h2>
        <ul>
          <li><strong>Не кнопкова панель, а навігаційний інструмент.</strong> Панель має виглядати як частина системи, а не як floating menu.</li>
          <li><strong>Короткі назви.</strong> 1-2 слова: Threshold, Atlas, Web, Quest, Collector, Mobile, Engine.</li>
          <li><strong>Індекси важливі.</strong> Вони дають відчуття порядку й дозволяють швидко зрозуміти масштаб сторінки.</li>
          <li><strong>Активний стан сильний, неактивний тихий.</strong> Неактивні labels можуть бути 40-50% opacity.</li>
          <li><strong>Жодних великих карточок.</strong> Rail не має ставати другим sidebar.</li>
        </ul>
      </section>

      <section>
        <h2>5. Як підключати</h2>
        <ol>
          <li>Створіть масив items із id секцій.</li>
          <li>Додайте відповідні <code>id</code> до секцій сторінки.</li>
          <li>Отримайте activeId через <code>useSectionRailActive(items)</code>.</li>
          <li>Рендеріть <code>SectionRail items={items} activeId={activeId} onSelect={scrollToRailSection}</code>.</li>
          <li>Для темних сторінок або proof sections використайте <code>tone="dark"</code> або auto logic.</li>
          <li>Перевірте, чи fixed header offset не перекриває секцію після кліку.</li>
        </ol>
      </section>

      <section>
        <h2>6. Accessibility</h2>
        <ul>
          <li>Rail має <code>aria-label</code>, щоб screen reader розумів призначення навігації.</li>
          <li>Активний пункт отримує <code>aria-current</code>.</li>
          <li>Кнопки мають focus-visible ring.</li>
          <li>Якщо rail прихований на мобільному, основна навігація сторінки все одно має бути зрозумілою через контент і header.</li>
          <li>Labels не мають бути тільки декоративними цифрами. Короткий текст потрібен для орієнтації.</li>
        </ul>
      </section>

      <section>
        <h2>7. Коли використовувати</h2>
        <ul>
          <li>Довгі case pages з 5+ логічними секціями.</li>
          <li>Offer / service pages, де користувач порівнює deliverables, architecture, formats, output.</li>
          <li>Immersive pages з темними та світлими сценами.</li>
          <li>Documentation-like pages, де потрібне швидке повернення до розділів.</li>
        </ul>
      </section>

      <section>
        <h2>8. Чеклист</h2>
        <ul class="checklist">
          <li>Rail не перекриває контент, CTA, sound dock або scrollbar.</li>
          <li>Active state збігається з тим, що реально бачить користувач.</li>
          <li>Labels короткі й не переносяться в кілька рядків.</li>
          <li>Tone читається на світлому і темному фоні.</li>
          <li>Footer hide працює, якщо сторінка має сильний closing block.</li>
          <li>Scroll to section має offset під fixed header.</li>
          <li>На малих екранах rail прихований, а не стиснутий до незручного стану.</li>
        </ul>
      </section>
    `,
  },
  {
    file: "05-living-spatial-covers.pdf",
    title: "Живі просторові обкладинки",
    eyebrow: "Home / Work Covers",
    summary:
      "Документація патерну обрізаних просторових обкладинок: обкладинка не є статичною карткою, а працює як живий сигнал кейсу, взаємодіє з hover/scroll/active state і створює преміальне відчуття глибини.",
    content: String.raw`
      <section>
        <h2>1. Ідея</h2>
        <p>Замість стандартних рівних thumbnails ми використовуємо обкладинки як просторові сигнали. Вони можуть бути обрізані, зміщені, частково затемнені, мати glass/halo шар, реагувати на hover, просвічуватися через gradients або масштабуватися дуже м'яко.</p>
        <p>Це робить головну сторінку не просто списком робіт, а живим інтерфейсним полем. Кожен кейс відчувається як окремий об'єкт із власною атмосферою.</p>
      </section>

      <section>
        <h2>2. Де це проявляється</h2>
        <ul>
          <li><strong>Home sticky stage.</strong> Активний кейс змінює preview справа під час scroll, з плавним blur/scale transition.</li>
          <li><strong>Work Archive covers.</strong> <code>CaseCover</code> нормалізує tone, focus, loading blur, objectPosition і frame styling.</li>
          <li><strong>Evidence hero fragments.</strong> Case objects можуть лежати у spatial field як різні площини, а не як одна grid-картка.</li>
          <li><strong>Immersive chamber planes.</strong> Та сама логіка переноситься у dark spatial environments через clip-path і orbit depth.</li>
        </ul>
      </section>

      <section>
        <h2>3. Принципи композиції</h2>
        <ul>
          <li><strong>Обрізання має бути авторським.</strong> Якщо кадр crop-иться, це має підсилювати фокус, а не випадково відрізати UI.</li>
          <li><strong>Обкладинка має мати depth.</strong> Frame, inner border, subtle shadow, background wash і scale дають відчуття об'єкта.</li>
          <li><strong>Hover не має бути гучним.</strong> 1-4% scale, легке підсвічування border, opacity або translate достатні.</li>
          <li><strong>Завантаження має бути м'яким.</strong> Placeholder + blur-to-sharp transition прибирають різкий pop-in.</li>
          <li><strong>Focus metadata важлива.</strong> Для різних кейсів потрібні focus values: center, top, left, right.</li>
        </ul>
      </section>

      <section>
        <h2>4. Технічна структура</h2>
        <table>
          <tr><th>Елемент</th><th>Роль</th></tr>
          <tr><td><code>CaseCover</code></td><td>Базовий reusable frame для work covers.</td></tr>
          <tr><td><code>coverTone</code></td><td>light / dark / mixed, щоб frame відповідав реальному screenshot.</td></tr>
          <tr><td><code>coverFocus</code></td><td>Керує object-position, щоб обрізання було контрольованим.</td></tr>
          <tr><td><code>loaded state</code></td><td>Дає blur/opacity transition після завантаження зображення.</td></tr>
          <tr><td><code>StickyStage</code></td><td>Scroll-driven preview активного кейсу на головній.</td></tr>
          <tr><td><code>HomeStageBridge</code></td><td>Перемикає case preview і WebGL/metamorph stage залежно від активного блоку.</td></tr>
        </table>
      </section>

      <section>
        <h2>5. Interaction model</h2>
        <ul>
          <li>Scroll визначає активний кейс і змінює preview без різкого jump.</li>
          <li>Hover на текстовому рядку може підсилювати активність: translate label, opacity, progress line.</li>
          <li>Hover на самій обкладинці може підсвічувати border, давати легкий scale і показувати «Open / Inspect» сигнал.</li>
          <li>Активна обкладинка має бути чіткішою за неактивні, але не настільки, щоб інші зникали повністю.</li>
          <li>На мобільному краще показувати стабільну картку, а не складний sticky spatial stage.</li>
        </ul>
      </section>

      <section>
        <h2>6. Як адаптувати</h2>
        <ol>
          <li>Для кожного кейсу визначте головний screenshot або poster, який зрозумілий без додаткового тексту.</li>
          <li>Поставте <code>coverTone</code> відповідно до screenshot: light, dark або mixed.</li>
          <li>Вручну оберіть <code>coverFocus</code>, якщо головний UI знаходиться не в центрі.</li>
          <li>Для головної сторінки підключіть scroll-active logic, щоб preview змінювався від секції до секції.</li>
          <li>Для archive grid використовуйте однакову систему frame, але дозволяйте різні tones.</li>
          <li>Якщо потрібен просторовий ефект, використовуйте clip-path, overlapping planes, rotate, subtle shadows, але не ламайте читабельність screenshot.</li>
        </ol>
      </section>

      <section>
        <h2>7. Для майбутніх проєктів</h2>
        <ul>
          <li><strong>Luxury product.</strong> Обкладинки можуть виглядати як object cards або editorial plates.</li>
          <li><strong>SaaS / CRM.</strong> Краще робити clean device/screen frames без надмірного clipping.</li>
          <li><strong>Hospitality.</strong> Можна змішувати фото місця і UI-панелі як просторові fragments.</li>
          <li><strong>Culture.</strong> Підійдуть collage planes, overlapping artwork, soft inspection labels.</li>
          <li><strong>Immersive.</strong> Доречні темні planes, cinematic traces, orbital depth, motion-light hover.</li>
        </ul>
      </section>

      <section>
        <h2>8. Чеклист</h2>
        <ul class="checklist">
          <li>Обкладинка не обрізає критичний UI або текст.</li>
          <li>Hover не викликає layout shift.</li>
          <li>Loading state не показує порожній білий або чорний прямокутник.</li>
          <li>Активний state читається без пояснення.</li>
          <li>На retina / wide desktop зображення не розтягується низькоякісно.</li>
          <li>На мобільному є стабільна fallback-композиція.</li>
          <li>Всі картинки мають alt або декоративний empty alt залежно від ролі.</li>
        </ul>
      </section>
    `,
  },
  {
    file: "06-mobile-phone-screenshot-carousel.pdf",
    title: "Карусель телефонних скріншотів",
    eyebrow: "Mobile Surface Rail",
    summary:
      "Документація красивої каруселі для phone-format зображень: кругове перемикання, drag, wheel, dots, active caption, inspect action і адаптація під різні мобільні співвідношення.",
    content: String.raw`
      <section>
        <h2>1. Призначення</h2>
        <p><strong>Mobile Surface Rail</strong> — це патерн для презентації вертикальних скріншотів телефону без банального ряду mockup-картинок. Центральний phone frame активний, сусідні кадри відходять у глибину, користувач може перемикати через кнопки, dots, drag, wheel або клік.</p>
        <p>Ми застосували цю логіку у звичайних case pages і в WHISPER, де mobile proof має виглядати як частина immersive-системи, а не як окрема технічна секція.</p>
      </section>

      <section>
        <h2>2. Основні можливості</h2>
        <ul>
          <li><strong>Кругове перемикання.</strong> Next з останнього кадру переходить на перший, Prev з першого — на останній.</li>
          <li><strong>Drag gesture.</strong> Горизонтальний drag змінює активний кадр.</li>
          <li><strong>Wheel support.</strong> На desktop wheel може перемикати кадри в capture zone, але не блокує сторінку на межах.</li>
          <li><strong>Dots navigation.</strong> Швидкий direct access до будь-якого кадру.</li>
          <li><strong>Inspect action.</strong> Клік по активному кадру відкриває повний перегляд.</li>
          <li><strong>Phone aspect variants.</strong> Різні кейси можуть мати 9:16, 1080/2088, 1080/2340 або інше співвідношення.</li>
        </ul>
      </section>

      <section>
        <h2>3. Технічна структура</h2>
        <table>
          <tr><th>Елемент</th><th>Роль</th></tr>
          <tr><td><code>MobileSurfaceRail</code></td><td>Основний компонент каруселі у CasePageV2.</td></tr>
          <tr><td><code>activeIndex</code></td><td>Поточний активний кадр.</td></tr>
          <tr><td><code>wrapIndex</code></td><td>Циклічний індекс для кнопок, dots і click/focus.</td></tr>
          <tr><td><code>circularOffset</code></td><td>Розраховує позицію кадру відносно activeIndex.</td></tr>
          <tr><td><code>dragStart</code></td><td>Запам'ятовує початкову x-позицію drag.</td></tr>
          <tr><td><code>wheelLockRef</code></td><td>Захищає від занадто частого wheel-перемикання.</td></tr>
          <tr><td><code>onInspect</code></td><td>Відкриває active frame у cinematic inspect viewer.</td></tr>
        </table>
      </section>

      <section>
        <h2>4. Візуальна модель</h2>
        <ul>
          <li>Активний phone frame стоїть у центрі, має scale 1 і найвищу opacity.</li>
          <li>Сусідні кадри зміщені по x, трохи повернуті й зменшені до приблизно 0.78 scale.</li>
          <li>Дальні кадри приховані або розмиті, щоб не створювати хаос.</li>
          <li>Caption block внизу показує номер, label і пояснення активного кадру.</li>
          <li>На hover активний кадр може трохи підніматися і показувати маленький Inspect label.</li>
          <li>Для dark mobile screenshots frame може бути темним; для advisory/light UI — білим або кремовим.</li>
        </ul>
      </section>

      <section>
        <h2>5. UX правила</h2>
        <ul>
          <li>Карусель має показувати не просто phone images, а маршрут: landing, index, drawer, detail, action, confirmation.</li>
          <li>Активний кадр має відкриватися в inspect viewer, інакше користувач не зможе прочитати дрібний UI.</li>
          <li>Wheel не повинен захоплювати сторінку назавжди. На boundary або mobile краще дозволити нормальний scroll.</li>
          <li>Drag threshold має бути достатнім, щоб випадковий клік не перемикав кадр.</li>
          <li>Dots потрібні навіть якщо є кнопки: вони дають відчуття кількості кадрів.</li>
          <li>Не використовуйте занадто багато телефонів одночасно. Центральний + два сусіди достатньо.</li>
        </ul>
      </section>

      <section>
        <h2>6. Адаптація під різні кейси</h2>
        <ul>
          <li><strong>Advisory / real estate.</strong> Вищі screenshot proportions, світла рамка, чистий caption, акцент на journey.</li>
          <li><strong>Creator tools.</strong> Темний frame, більша висота, акцент на workflow states.</li>
          <li><strong>Hospitality.</strong> Більше простору навколо кадрів, тепліший фон, route через booking/search/action.</li>
          <li><strong>Immersive / WHISPER.</strong> Темна cinematic phone field, м'який glow, interaction як proof, не як device mockup.</li>
          <li><strong>SaaS.</strong> Менше декоративності, чіткі labels для states: dashboard, detail, edit, report.</li>
        </ul>
      </section>

      <section>
        <h2>7. Implementation recipe</h2>
        <ol>
          <li>Відфільтруйте mobile frames з case story media.</li>
          <li>Визначте phone aspect class за типом кейсу.</li>
          <li>Створіть <code>activeIndex</code>, <code>activeIndexRef</code>, <code>dragStart</code>, <code>wheelLockRef</code>.</li>
          <li>Додайте <code>wrapIndex</code> для циклічного setActive.</li>
          <li>Розрахуйте <code>circularOffset</code>, щоб кадри з іншого краю могли стати сусідами.</li>
          <li>Для кожного кадру задайте x, y, scale, rotate, opacity, zIndex через motion animate.</li>
          <li>Клік по неактивному кадру робить focus, клік по активному відкриває inspect.</li>
          <li>Додайте mobile thumbnail strip як fallback для вузьких екранів.</li>
        </ol>
      </section>

      <section>
        <h2>8. Чеклист</h2>
        <ul class="checklist">
          <li>Перший і останній кадр перемикаються по колу.</li>
          <li>Drag не відкриває inspect випадково.</li>
          <li>Active frame priority-loads або не блимає під час перемикання.</li>
          <li>Aspect ratio відповідає реальним скріншотам.</li>
          <li>Caption не перекриває телефон і не стрибає при довгому тексті.</li>
          <li>Dots і arrows мають aria-label.</li>
          <li>На mobile є простий horizontal thumbnail fallback.</li>
          <li>Inspect viewer відкриває саме той кадр, який активний.</li>
        </ul>
      </section>
    `,
  },
];

const technicalAppendices = {
  "01-active-chamber-console.pdf": String.raw`
    <section>
      <h2>9. Базова модель даних chamber</h2>
      <p>Щоб консоль була універсальною, дані камери мають бути самодостатніми. Компонент не повинен знати, чи це XR, архів, продуктова кімната або AR-preview: він читає однакову модель.</p>
      ${codeBlock(`
export type ImmersiveChamberId =
  | "whisper"
  | "product-world"
  | "presence-archive"
  | "collector-continuation"
  | "installation-field";

export type ImmersiveSystemItem = {
  id: ImmersiveChamberId;
  room: string;
  shortTitle: string;
  statusLabel: string;
  chamberSignal: string;
  proofLine: string;
  summary: string;
  tags: string[];
  route?: string;
  ctaLabel?: string;
  media?: {
    poster?: string;
    video?: string;
    stills?: string[];
  };
};`)}
    </section>

    <section>
      <h2>10. Контролер вибору активної chamber</h2>
      <p>Стан активної chamber краще ізолювати в hook. Так orbit, console, right signals і CTA читають одну правду, а не дублюють локальні стани.</p>
      ${codeBlock(`
function useImmersiveChamberSelection() {
  const [activeChamberId, setActiveChamberId] =
    useState<ImmersiveChamberId>(defaultImmersiveChamberId);
  const sound = useSound();

  const activeChamber = getImmersiveChamber(activeChamberId);
  const activeChamberEngines = getChamberEngines(activeChamberId);

  const selectChamber = useCallback(
    (id: ImmersiveChamberId, feedback: "transition" | "select" | "none" = "transition") => {
      if (id !== activeChamberId && feedback !== "none") {
        sound.playRole(feedback);
      }
      setActiveChamberId(id);
    },
    [activeChamberId, sound],
  );

  return { activeChamberId, activeChamber, activeChamberEngines, selectChamber };
}`)}
    </section>

    <section>
      <h2>11. Portal-механіка консольного вікна</h2>
      <p>Повноекранний atlas потрібно рендерити через portal у <code>document.body</code>. Інакше fixed overlay може обрізатись через <code>transform</code>, <code>overflow</code> або stacking context батьківських блоків.</p>
      ${codeBlock(`
{createPortal(
  <AnimatePresence>
    {atlasOpen ? (
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Cinematic chamber atlas"
        className="fixed inset-0 z-[999] bg-[#050504] text-white"
        onWheel={handleAtlasWheel}
        onPointerDown={handleAtlasPointerDown}
        onPointerUp={handleAtlasPointerUp}
      >
        {/* orbit planes, terminal signal, assembly mode, route controls */}
      </motion.div>
    ) : null}
  </AnimatePresence>,
  document.body,
)}`)}
    </section>

    <section>
      <h2>12. Wheel / drag / keyboard state machine</h2>
      <p>Консоль має поводитись як інструмент, тому всі входи повинні вести до одного select-механізму. Нижче логіка, яку можна переносити в інші атласи.</p>
      ${codeBlock(`
const selectChamberByOffset = useCallback((offset: number) => {
  const currentIndex = chambers.findIndex((item) => item.id === activeChamberId);
  const nextIndex = (currentIndex + offset + chambers.length) % chambers.length;
  const nextId = chambers[nextIndex].id;

  selectChamber(nextId);
  if (atlasOpen) setInspectedChamberId(nextId);
}, [activeChamberId, atlasOpen, selectChamber]);

function handleAtlasWheel(event: WheelEvent<HTMLDivElement>) {
  if (atlasMode === "assemble") return;
  if (Math.abs(event.deltaY) < 18 && Math.abs(event.deltaX) < 18) return;

  const now = Date.now();
  if (now - wheelLockRef.current < 520) return;

  wheelLockRef.current = now;
  selectChamberByOffset(event.deltaY + event.deltaX > 0 ? 1 : -1);
}`)}
      ${codeBlock(`
useEffect(() => {
  if (!atlasOpen) return;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      if (atlasMode === "assemble") return setAtlasMode("orbit");
      if (inspectedChamberId) return setInspectedChamberId(null);
      setAtlasOpen(false);
    }

    if (atlasMode === "orbit" && ["ArrowDown", "ArrowRight"].includes(event.key)) {
      selectChamberByOffset(1);
    }
    if (atlasMode === "orbit" && ["ArrowUp", "ArrowLeft"].includes(event.key)) {
      selectChamberByOffset(-1);
    }
  };

  window.addEventListener("keydown", onKeyDown);
  return () => {
    document.body.style.overflow = previousOverflow;
    window.removeEventListener("keydown", onKeyDown);
  };
}, [atlasOpen, atlasMode, inspectedChamberId, selectChamberByOffset]);`, "ts")}
    </section>
  `,

  "02-whisper-section-color-morph.pdf": String.raw`
    <section>
      <h2>9. Маркування секцій</h2>
      <p>Кожна секція, яка має змінювати header або атмосферу, отримує <code>data-header-scene</code>. Це дешевий і надійний контракт між layout і header.</p>
      ${codeBlock(`
function Chapter({ id, children, className = "" }) {
  return (
    <motion.section
      id={\`whisper-\${id}\`}
      data-header-scene={\`whisper-\${id}\`}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.84, ease }}
    >
      {children}
    </motion.section>
  );
}`)}
    </section>

    <section>
      <h2>10. Theme tokens для сцени</h2>
      <p>Theme має описувати не тільки background, а весь header state: text, muted text, borders, chips, CTA, progress signal, blur і elevation.</p>
      ${codeBlock(`
const darkProof = {
  surface: "rgba(8, 8, 8, 0.72)",
  foreground: "#f7f3ea",
  muted: "rgba(247, 243, 234, 0.68)",
  border: "rgba(255, 255, 255, 0.16)",
  chipSurface: "rgba(255, 255, 255, 0.08)",
  progress: "#f7f3ea",
  actionSurface: "#f7f3ea",
  actionForeground: "#070707",
  actionBorder: "rgba(247, 243, 234, 0.86)",
  activeChipSurface: "#f7f3ea",
  activeChipForeground: "#070707",
  blur: 18,
  elevation: 0.18,
};

export const headerSceneThemes = {
  "whisper-threshold": {
    id: "whisper-threshold",
    signalLabel: "WHISPER XR",
    ...darkProof,
    surface: "rgba(5, 5, 5, 0.7)",
  },
  "whisper-collector": {
    id: "whisper-collector",
    signalLabel: "OBJECT HANDOFF",
    ...lightDense,
    surface: "rgba(247, 244, 237, 0.82)",
  },
};`, "ts")}
    </section>

    <section>
      <h2>11. Observer активної сцени</h2>
      <p>Observer працює як sensor під header. Він не просто бере найбільшу секцію, а оцінює близькість до верхньої зони viewport.</p>
      ${codeBlock(`
export function useActiveHeaderScene(routeKey: string) {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-header-scene]"));
    const visibleScenes = new Map<Element, { id: string; ratio: number; top: number }>();

    const chooseActiveScene = () => {
      const target = Math.min(92, window.innerHeight * 0.12);
      const candidates = Array.from(visibleScenes.values());

      candidates.sort((a, b) => {
        const scoreA = a.ratio * 120 - Math.abs(a.top - target) / 18;
        const scoreB = b.ratio * 120 - Math.abs(b.top - target) / 18;
        return scoreB - scoreA;
      });

      setActiveSceneId(candidates[0]?.id ?? null);
    };

    const observer = new IntersectionObserver(/* update visibleScenes */, {
      rootMargin: "0px 0px -86% 0px",
      threshold: [0, 0.01, 0.04, 0.08, 0.12],
    });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [routeKey]);

  return activeSceneId;
}`, "ts")}
    </section>

    <section>
      <h2>12. CSS variables morph</h2>
      <p>Header не отримує нові className на кожну сцену. Замість цього hook записує variables, а CSS відповідає за плавність.</p>
      ${codeBlock(`
export function useHeaderThemeMorph(headerRef, theme, scrolled) {
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    element.style.setProperty("--header-bg", theme.surface);
    element.style.setProperty("--header-text", theme.foreground);
    element.style.setProperty("--header-muted", theme.muted);
    element.style.setProperty("--header-border", theme.border);
    element.style.setProperty("--header-progress", theme.progress);
    element.style.setProperty("--header-blur", \`\${scrolled ? theme.blur + 2 : theme.blur}px\`);
    element.style.setProperty("--header-elevation", String(scrolled ? theme.elevation : theme.elevation * 0.35));
  }, [headerRef, scrolled, theme]);
}`, "ts")}
      ${codeBlock(`
.site-header {
  background-color: var(--header-bg);
  color: var(--header-text);
  border-color: var(--header-border);
  backdrop-filter: blur(var(--header-blur));
  box-shadow: 0 18px 60px rgba(0, 0, 0, var(--header-elevation));
  transition:
    background-color 720ms cubic-bezier(0.19, 1, 0.22, 1),
    color 560ms cubic-bezier(0.19, 1, 0.22, 1),
    border-color 720ms cubic-bezier(0.19, 1, 0.22, 1),
    box-shadow 720ms cubic-bezier(0.19, 1, 0.22, 1),
    backdrop-filter 720ms cubic-bezier(0.19, 1, 0.22, 1);
}`, "css")}
    </section>
  `,

  "03-field-spatial-extended-navigation.pdf": String.raw`
    <section>
      <h2>9. State-модель Flow / Atlas</h2>
      <p>Патерн тримається на двох станах: режим перегляду і expanded. Вони незалежні, тому користувач може розгорнути proof і дивитись його як Flow або як Atlas.</p>
      ${codeBlock(`
const INITIAL_EVIDENCE_FRAME_COUNT = 5;

function ScreensAsEvidence({ story, onInspect }) {
  const frames = getEvidenceFrames(story);
  const [viewMode, setViewMode] = useState<"sequence" | "atlas">("sequence");
  const [expanded, setExpanded] = useState(false);

  const visibleFrames = expanded
    ? frames
    : frames.slice(0, INITIAL_EVIDENCE_FRAME_COUNT);

  const hasHiddenFrames = frames.length > INITIAL_EVIDENCE_FRAME_COUNT;
  const hiddenFrameCount = Math.max(0, frames.length - INITIAL_EVIDENCE_FRAME_COUNT);

  return (
    <>
      <EvidenceViewToggle mode={viewMode} onChange={setViewMode} />
      {viewMode === "sequence"
        ? <EvidenceFlow frames={visibleFrames} onInspect={onInspect} />
        : <EvidenceAtlasGrid frames={visibleFrames} onInspect={onInspect} />}
      {hasHiddenFrames ? <ExpansionControl hiddenFrameCount={hiddenFrameCount} /> : null}
    </>
  );
}`)}
    </section>

    <section>
      <h2>10. Toggle як reusable component</h2>
      <p>Segmented control має не тільки змінювати стан, а й пояснювати різницю між режимами через короткий caption.</p>
      ${codeBlock(`
function EvidenceViewToggle({ mode, onChange }) {
  const options = [
    { value: "sequence", label: "Flow", caption: "Cinematic" },
    { value: "atlas", label: "Atlas", caption: "Grid scan" },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-full border bg-white/48 p-1">
      {options.map((option) => {
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={active ? "text-white" : "text-neutral-400"}
          >
            {active ? <motion.span layoutId="case-evidence-view-active" /> : null}
            <span>{option.label}</span>
            <span>{option.caption}</span>
          </button>
        );
      })}
    </div>
  );
}`)}
    </section>

    <section>
      <h2>11. Extended field і auto-collapse</h2>
      <p>Auto-collapse потрібен, щоб після перегляду додаткового контенту сторінка знову ставала компактною, коли користувач повертається вгору.</p>
      ${codeBlock(`
const expandedArchiveRef = useRef<HTMLDivElement | null>(null);
const expandedArchiveSeenRef = useRef(false);
const [archiveExpanded, setArchiveExpanded] = useState(false);

useEffect(() => {
  if (!archiveExpanded) return;

  const collapseWhenReturning = () => {
    const expandedTop = expandedArchiveRef.current?.offsetTop;
    if (!expandedTop) return;

    if (window.scrollY >= expandedTop - window.innerHeight * 0.35) {
      expandedArchiveSeenRef.current = true;
    }

    if (
      expandedArchiveSeenRef.current &&
      window.scrollY < expandedTop - window.innerHeight * 0.72
    ) {
      setArchiveExpanded(false);
    }
  };

  window.addEventListener("scroll", collapseWhenReturning, { passive: true });
  return () => window.removeEventListener("scroll", collapseWhenReturning);
}, [archiveExpanded]);`, "ts")}
    </section>

    <section>
      <h2>12. Механіка відкриття</h2>
      <p>Кнопка відкриття має і змінити стан, і підвести користувача до нового блоку. Це важливо для довгих сторінок.</p>
      ${codeBlock(`
const expandArchive = () => {
  playRole("transition");
  expandedArchiveSeenRef.current = false;
  setArchiveExpanded(true);

  window.setTimeout(() => {
    expandedArchiveRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 120);
};`, "ts")}
    </section>
  `,

  "04-section-rail-navigation.pdf": String.raw`
    <section>
      <h2>9. Мінімальне підключення</h2>
      <p>У кожної сторінки має бути власний список секцій, але форма даних однакова. Це робить rail переносним.</p>
      ${codeBlock(`
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import { scrollToRailSection, useSectionRailActive } from "../ui/useSectionRailActive";

const railItems: SectionRailItem[] = [
  { id: "whisper-threshold", index: "01", label: "Threshold" },
  { id: "whisper-atlas", index: "02", label: "Atlas" },
  { id: "whisper-web", index: "03", label: "Web" },
  { id: "whisper-xr", index: "04", label: "Quest" },
  { id: "whisper-collector", index: "05", label: "Collector" },
];

export function Page() {
  const activeId = useSectionRailActive(railItems, railItems[0].id);

  return (
    <>
      <SectionRail
        items={railItems}
        activeId={activeId}
        onSelect={scrollToRailSection}
        label="WHISPER case sections"
      />
      <section id="whisper-threshold">...</section>
    </>
  );
}`)}
    </section>

    <section>
      <h2>10. Active-section hook</h2>
      <p>Hook використовує anchor-зону всередині viewport, а не просто scrollTop. Це прибирає нервове перемикання між сусідніми секціями.</p>
      ${codeBlock(`
export function useSectionRailActive(items: SectionRailItem[], fallbackId?: string) {
  const [activeId, setActiveId] = useState(fallbackId ?? items[0]?.id ?? "");
  const activeRef = useRef(activeId);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const viewportAnchor = window.innerHeight * 0.46;
      let nextId = ids[0] ?? "";
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const id of ids) {
        const section = document.getElementById(id);
        if (!section) continue;
        const rect = section.getBoundingClientRect();

        if (rect.top <= viewportAnchor && rect.bottom >= viewportAnchor) {
          nextId = id;
          break;
        }

        const distance = Math.min(
          Math.abs(rect.top - viewportAnchor),
          Math.abs(rect.bottom - viewportAnchor),
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          nextId = id;
        }
      }

      if (nextId && activeRef.current !== nextId) {
        activeRef.current = nextId;
        setActiveId(nextId);
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [items]);

  return activeId;
}`, "ts")}
    </section>

    <section>
      <h2>11. Tone-механіка</h2>
      <p>Rail має адаптуватися до темних сцен. У поточній реалізації є ручний tone і auto-логіка за id активної секції.</p>
      ${codeBlock(`
export type SectionRailTone = "auto" | "light" | "dark";

const autoDarkActive =
  activeId.includes("whisper") ||
  activeId.includes("proof") ||
  activeId.includes("principles");

const darkActive = tone === "dark" || (tone === "auto" && autoDarkActive);

const indexClass = active
  ? darkActive
    ? "border-white bg-white text-neutral-950"
    : "border-neutral-950 bg-neutral-950 text-white"
  : darkActive
    ? "border-white/18 bg-black/12 text-white/48"
    : "border-neutral-950/12 bg-white/34 text-neutral-400";`, "ts")}
    </section>

    <section>
      <h2>12. Smooth scroll offset</h2>
      <p>Fixed header потребує offset. Інакше секція після кліку відкриється під header.</p>
      ${codeBlock(`
function getSectionTop(id: string) {
  const section = document.getElementById(id);
  if (!section) return null;

  return Math.max(0, section.getBoundingClientRect().top + window.scrollY - 76);
}

export function scrollToRailSection(id: string) {
  const top = getSectionTop(id);
  if (top == null) return;
  window.scrollTo({ top, behavior: "smooth" });
}`, "ts")}
    </section>
  `,

  "05-living-spatial-covers.pdf": String.raw`
    <section>
      <h2>9. Reusable CaseCover API</h2>
      <p>Обкладинка має приймати не тільки src/alt, а й тон, focus, variant і loading priority. Це дозволяє однаково працювати з різними типами скріншотів.</p>
      ${codeBlock(`
type CaseCoverProps = {
  src: string;
  alt: string;
  tone: "light" | "dark" | "mixed";
  focus?: "center" | "top" | "left" | "right";
  priority?: boolean;
  variant?: "cards" | "list";
  className?: string;
  imageClassName?: string;
};

<CaseCover
  src={item.poster.src}
  alt={item.poster.alt ?? item.title}
  tone={item.coverTone}
  focus={item.coverFocus}
  priority={index < 2}
/>`)}
    </section>

    <section>
      <h2>10. Tone і focus maps</h2>
      <p>Це простий, але важливий шар якості: кожен poster може мати свій tone і свою точку фокусу, не змінюючи компонент.</p>
      ${codeBlock(`
const focusMap = {
  center: "50% 50%",
  top: "50% 0%",
  left: "0% 50%",
  right: "100% 50%",
};

const toneMap = {
  light: {
    shell: "border bg-[#f5f5f7] p-2 shadow-[0_16px_34px_rgba(15,23,42,0.04)]",
    frame: "border bg-white",
    placeholder: "bg-[#ececf0]",
  },
  dark: {
    shell: "border bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.03)]",
    frame: "border bg-neutral-50",
    placeholder: "bg-neutral-100",
  },
  mixed: {
    shell: "border bg-[#f4f4f6] p-1.5 shadow-[0_14px_30px_rgba(15,23,42,0.035)]",
    frame: "border bg-white/96",
    placeholder: "bg-[#ececef]",
  },
};`, "ts")}
    </section>

    <section>
      <h2>11. Loading blur-to-sharp</h2>
      <p>Жива обкладинка не має з'являтися різким pop-in. Поки картинка вантажиться, frame тримає placeholder.</p>
      ${codeBlock(`
function CaseCover({ src, alt, tone, focus = "center", priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const toneStyles = toneMap[tone];

  return (
    <div className={\`relative h-full w-full rounded-[18px] \${toneStyles.shell}\`}>
      <div className={\`relative h-full w-full overflow-hidden rounded-[14px] \${toneStyles.frame}\`}>
        <div
          className={\`absolute inset-0 transition-opacity duration-500 \${toneStyles.placeholder} \${loaded ? "opacity-0" : "opacity-100"}\`}
        />
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{ objectPosition: focusMap[focus] }}
          className={\`absolute inset-0 h-full w-full object-cover transition duration-700 \${loaded ? "opacity-100 blur-0" : "opacity-0 blur-[8px]"}\`}
        />
      </div>
    </div>
  );
}`)}
    </section>

    <section>
      <h2>12. Scroll-driven active cover</h2>
      <p>На головній активна обкладинка залежить від секції, біля якої зараз знаходиться користувач. Preview рухається і змінюється без ручного hover.</p>
      ${codeBlock(`
const activeSlug = useActiveSection(slugs, 0.54, 0.055);
const matchedCaseIndex = homeCases.findIndex((caseItem) => caseItem.slug === activeSlug);
const activeCase = homeCases[Math.max(0, matchedCaseIndex)];

<HomeStageBridge
  activeSlug={activeSlug}
  activeCase={activeCase}
  activeIndex={matchedCaseIndex}
  total={homeCases.length}
  progressBySlug={progressBySlug}
  caseSlugs={homeCases.map((caseItem) => caseItem.slug)}
/>`, "tsx")}
      ${codeBlock(`
<motion.div
  key={activeCase.slug}
  initial={{ opacity: 0, filter: "blur(14px)", scale: 1.028 }}
  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
  exit={{ opacity: 0, filter: "blur(14px)", scale: 0.988 }}
  transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
>
  <img src={activeCase.poster.src} alt={activeCase.poster.alt} draggable={false} />
</motion.div>`, "tsx")}
    </section>
  `,

  "06-mobile-phone-screenshot-carousel.pdf": String.raw`
    <section>
      <h2>9. Props і базовий state</h2>
      <p>Карусель має знати тільки story, frames і callback inspect. Усе інше розраховується всередині.</p>
      ${codeBlock(`
function MobileSurfaceRail({
  story,
  frames,
  onInspect,
}: {
  story: CaseStory;
  frames: CaseStoryMedia[];
  onInspect: (id: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const activeIndexRef = useRef(0);
  const wheelLockRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  if (!frames.length) return null;
}`)}
    </section>

    <section>
      <h2>10. Циклічний індекс і offset</h2>
      <p>Саме <code>wrapIndex</code> робить карусель круговою. <code>circularOffset</code> дозволяє останньому кадру бути сусідом першого і навпаки.</p>
      ${codeBlock(`
const wrapIndex = (index: number) => (index + frames.length) % frames.length;
const clampIndex = (index: number) => Math.min(Math.max(index, 0), frames.length - 1);

const setActive = (index: number, wrap = true) => {
  const nextIndex = wrap ? wrapIndex(index) : clampIndex(index);
  if (nextIndex === activeIndexRef.current) return;

  sound.playRole("transition");
  activeIndexRef.current = nextIndex;
  setActiveIndex(nextIndex);
};

const circularOffset = (index: number) => {
  let offset = index - activeIndex;
  const half = frames.length / 2;

  if (offset > half) offset -= frames.length;
  if (offset < -half) offset += frames.length;

  return offset;
};`, "ts")}
    </section>

    <section>
      <h2>11. Wheel і drag механіка</h2>
      <p>Wheel має lock, щоб трекпад не перескочив кілька кадрів. Drag має threshold, щоб випадковий клік не став перемиканням.</p>
      ${codeBlock(`
const moveCarousel = (direction: 1 | -1) => {
  setActive(activeIndex + direction);
};

function handleCarouselWheel(event: WheelEvent<HTMLElement>) {
  const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
  const now = window.performance.now();

  if (!horizontalIntent) return;
  if (now - wheelLockRef.current < 520) return;

  event.preventDefault();
  wheelLockRef.current = now;
  moveCarousel(event.deltaX + event.deltaY > 0 ? 1 : -1);
}`, "ts")}
      ${codeBlock(`
<motion.div
  drag={frames.length > 1 && !reduceMotion ? "x" : false}
  dragElastic={0.12}
  dragConstraints={{ left: 0, right: 0 }}
  onDragStart={(_, info) => setDragStart(info.point.x)}
  onDragEnd={(_, info) => {
    const start = dragStart ?? info.point.x;
    const delta = info.point.x - start;
    setDragStart(null);

    if (Math.abs(delta) < 44) return;
    moveCarousel(delta < 0 ? 1 : -1);
  }}
>
  {frames.map(renderPhoneFrame)}
</motion.div>`)}
    </section>

    <section>
      <h2>12. Render phone frame</h2>
      <p>Активний кадр відкриває inspect, неактивний кадр стає активним. Це природна модель для презентації phone screenshots.</p>
      ${codeBlock(`
{frames.map((media, index) => {
  const offset = circularOffset(index);
  const depth = Math.abs(offset);
  const visible = depth <= 1 || frames.length <= 3;
  const active = index === activeIndex;

  return (
    <motion.button
      key={media.id}
      type="button"
      onClick={() => (active ? onInspect(media.id) : setActive(index))}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      animate={{
        x: \`calc(-50% + \${offset * 250}px)\`,
        y: active ? 0 : 28,
        scale: active ? 1 : 0.78,
        rotate: offset * -9,
        opacity: visible ? (active ? 1 : 0.48) : 0,
        zIndex: 20 - depth,
      }}
      aria-label={active ? \`Inspect \${media.label}\` : \`Focus \${media.label}\`}
    >
      <CaseMediaView media={media} fit="contain" priority={active} />
    </motion.button>
  );
})}`)}
    </section>

    <section>
      <h2>13. WHISPER spatial evidence loop note</h2>
      <p>Для горизонтального поля screenshots у WHISPER ми використали ту саму ідею циклічного індексу, але з фізичним scroll container. Важлива деталь: край визначається і за <code>scrollLeft</code>, і за активним індексом, бо останній кадр не завжди дорівнює абсолютному max scroll.</p>
      ${codeBlock(`
const wrapIndex = (index: number) => {
  if (!frames.length) return 0;
  return ((index % frames.length) + frames.length) % frames.length;
};

if ((atEnd || atLastFrame) && drag.lastDelta < -5) {
  focusFrame(nextIndex + 1, "transition"); // last -> first
} else if ((atStart || atFirstFrame) && drag.lastDelta > 5) {
  focusFrame(nextIndex - 1, "transition"); // first -> last
}`, "ts")}
    </section>
  `,
};

function renderDocument(doc, index) {
  return `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${doc.title}</title>
  <style>
    @page { size: A4; margin: 14mm 13mm 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f6f3ec;
      color: #121212;
      font-family: "Segoe UI", "Arial", sans-serif;
      font-size: 10.7pt;
      line-height: 1.55;
    }
    .page {
      min-height: 100vh;
      background:
        radial-gradient(circle at 74% 8%, rgba(0,0,0,0.055), transparent 25%),
        linear-gradient(180deg, #faf8f2 0%, #f3efe6 100%);
    }
    header {
      min-height: 205mm;
      display: grid;
      align-content: space-between;
      border-bottom: 1px solid rgba(18,18,18,0.14);
      padding: 7mm 0 11mm;
      page-break-after: always;
    }
    .brand {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid rgba(18,18,18,0.12);
      padding-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 8pt;
      color: rgba(18,18,18,0.52);
    }
    .eyebrow {
      display: inline-block;
      border-top: 1px solid rgba(18,18,18,0.18);
      border-bottom: 1px solid rgba(18,18,18,0.18);
      padding: 7px 0;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 8pt;
      color: rgba(18,18,18,0.52);
    }
    h1 {
      max-width: 12ch;
      margin: 20mm 0 0;
      font-size: 42pt;
      line-height: 0.9;
      letter-spacing: -0.035em;
      font-weight: 650;
    }
    .summary {
      max-width: 152mm;
      margin: 12mm 0 0;
      font-size: 13.4pt;
      line-height: 1.55;
      color: rgba(18,18,18,0.68);
    }
    .cover-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      border-top: 1px solid rgba(18,18,18,0.12);
      padding-top: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 7.8pt;
      color: rgba(18,18,18,0.44);
    }
    main { padding: 0 0 8mm; }
    section {
      break-inside: avoid;
      padding: 7mm 0;
      border-bottom: 1px solid rgba(18,18,18,0.1);
    }
    h2 {
      margin: 0 0 4mm;
      font-size: 18pt;
      line-height: 1.05;
      letter-spacing: -0.01em;
    }
    p { margin: 0 0 3.2mm; color: rgba(18,18,18,0.76); }
    strong { color: #111; }
    code {
      font-family: "Cascadia Mono", "Consolas", monospace;
      font-size: 8.7pt;
      background: rgba(18,18,18,0.055);
      border: 1px solid rgba(18,18,18,0.08);
      padding: 0.5px 3px;
    }
    pre {
      margin: 4mm 0 0;
      padding: 4mm 4.5mm;
      max-width: 100%;
      overflow: hidden;
      white-space: pre-wrap;
      word-break: break-word;
      border: 1px solid rgba(18,18,18,0.12);
      background: rgba(17,17,17,0.045);
      color: rgba(18,18,18,0.82);
      font-family: "Cascadia Mono", "Consolas", monospace;
      font-size: 7.4pt;
      line-height: 1.46;
      break-inside: avoid;
    }
    pre::before {
      content: attr(data-language);
      display: block;
      margin-bottom: 2mm;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-family: "Segoe UI", "Arial", sans-serif;
      font-size: 6.7pt;
      color: rgba(18,18,18,0.42);
    }
    pre code {
      background: transparent;
      border: 0;
      padding: 0;
      font-size: inherit;
    }
    ul, ol {
      margin: 0;
      padding-left: 5.2mm;
      color: rgba(18,18,18,0.76);
    }
    li { margin: 0 0 2.2mm; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4mm;
      font-size: 9.4pt;
      color: rgba(18,18,18,0.74);
    }
    th {
      text-align: left;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 7.4pt;
      color: rgba(18,18,18,0.46);
      border-bottom: 1px solid rgba(18,18,18,0.16);
      padding: 8px 8px 7px 0;
    }
    td {
      vertical-align: top;
      border-bottom: 1px solid rgba(18,18,18,0.08);
      padding: 9px 9px 9px 0;
    }
    .callout {
      margin-top: 5mm;
      border-top: 1px solid rgba(18,18,18,0.18);
      border-bottom: 1px solid rgba(18,18,18,0.18);
      background: rgba(255,255,255,0.46);
      padding: 4mm 5mm;
      color: rgba(18,18,18,0.74);
    }
    .checklist li::marker { content: "✓  "; }
    footer {
      margin-top: 7mm;
      padding-top: 4mm;
      display: flex;
      justify-content: space-between;
      gap: 18px;
      border-top: 1px solid rgba(18,18,18,0.14);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 7.4pt;
      color: rgba(18,18,18,0.42);
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <div class="brand">
        <span>Brenych Studio / Interface Systems</span>
        <span>${versionLabel}</span>
      </div>
      <div>
        <div class="eyebrow">${String(index + 1).padStart(2, "0")} / ${doc.eyebrow}</div>
        <h1>${doc.title}</h1>
        <p class="summary">${doc.summary}</p>
      </div>
      <div class="cover-meta">
        <span>Формат: внутрішній playbook</span>
        <span>Мова: українська</span>
        <span>Використання: майбутні проєкти</span>
      </div>
    </header>
    <main>
      ${doc.content}
      ${technicalAppendices[doc.file] ?? ""}
    </main>
    <footer>
      <span>Brenych Studio</span>
      <span>${doc.title}</span>
    </footer>
  </div>
</body>
</html>`;
}

for (const [index, doc] of docs.entries()) {
  const htmlPath = path.join(tempDir, doc.file.replace(/\.pdf$/i, ".html"));
  const pdfPath = path.join(outputDir, doc.file);
  writeFileSync(htmlPath, renderDocument(doc, index), "utf8");
  if (existsSync(pdfPath)) rmSync(pdfPath);

  const result = spawnSync(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--allow-file-access-from-files",
      `--user-data-dir=${path.join(tempDir, "profile")}`,
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    throw new Error(`Failed to generate ${doc.file}`);
  }
}

rmSync(tempDir, { recursive: true, force: true });

console.log(`Generated ${docs.length} PDF playbooks in ${outputDir}`);
