const CONFIG = {
    text: {
        en: {
            title: "🇨🇾 Cyprus residence days calculator for a citizenship application",
            description: "Calculate the days of your residence in Cyprus for the M127 application, and print the application forms",
            disclaimer1: "🔒 Privacy notice: this page works offline and doesn't collect any personal information. All your inputs will be stored in your browser, unless you clean the cookies. Also, you can also save all inputs and upload them later using buttons at the bottom of the page.",
            disclaimer2: "⚠️ Disclaimer: This tool is for estimation purposes only and does not constitute legal advice. Please consult with a legal professional before applying.",
            blocks: {
                app: "Days calculator", law: "Law Interpretation", trips: "Trips", statement: "Form M127 addendums"
            },
            lawDesc: `This form calculates a period of residence in Cyprus for acquisition of Cypriot citizenship by naturalization (<a href="https://www.gov.cy/moi/en/documents/acquisition-of-cypriot-citizenship-by-naturalization-due-to-years-of-residence-form-m127/" target="_blank" style="color: var(--primary); text-decoration: underline;">see official info</a>).
There's no offical formula, please critically assess this calculation, and rely on your own understanding. 
Days of absence logic:
• A year preceding application: ≤90 days are subtracted, >90 days of absence is not allowed.
• Prior years: 
    • Strict interpretation: ≤90 days are not subtracted, >90 days - fully subtracted.
    • Latest interpretation: only absence days exceeding 90 are subtracted.
Count starts backwards from the date of application to an officer to the date of the ACR (receipt from migration).

Addendums to M127 form are based on <a href="https://drive.google.com/file/d/1oTmu-PkwiYlrjeLkeiL2DUiDPkm9X-ww/view" target="_blank" style="color: var(--primary); text-decoration: underline;">this temlpate</a>, but you can use your own.`,
            labels: {
                langLevel: "Application type", firstReceipt: "ARC date", appDate: "Date of M127 application",
                lawInterp: "Type", toggleLatest: "Latest", toggleStrict: "Strict",
                arc: "ARC №", name: "Name and Surname", mp: "MP (folder №)",
                statementInfo: "To generate addendums to the M127 application, please provide:"
            },
            levels: { b1: "B1 (fast track 3+1 yrs)", a2: "A2 (fast track 4+1 yrs)", reg: "B1 (regular 7+1 yrs)" },
            appTable: { period: "Period", absence: "Absence days", daysInCy: "Days in Cyprus", credited: "Credited days", total: "Total:" },
            tripTable: { trip: "Trip", depDate: "Departure date", depPass: "Passport №", depStamp: "Stamp page", retDate: "Return date", retPass: "Passport №", retStamp: "Stamp page", daysAway: "Days away" },
            buttons: { generate: "Generate statements", save: "Save data", load: "Load data", clear: "Clear all" },
            placeholders: [ "Went to see snow", "Went to see trains", "Couldn't resist a WizzAir sale", "Ate mom's borsch", "Escaped the summer heat", "Went for Uniqlo shopping" ],
            status: { ready: "✅ You can apply!", wait: "⏳ You need at least {target} days to apply", good: "✅ Less than 90 days", deducted: "⚠️ Absence of more than 90 days is deducted", fail: "❌ >90 absence days in final year not allowed" },
            contactDesc: "Please write your questions and suggestions. If this page saved your time, you can support the author.",
            contactBtn: "Contact",
            supportBtn: "Support"
        },
        ru: {
            title: "🇨🇾 Калькулятор дней на Кипре для подачи на гражданство",
            description: "Вы можете подсчитать дни своего пребывания на Кипре для формы M127 и распечатать приложения к заявлению",
            disclaimer1: "🔒 Конфиденциальность: эта страница работает оффлайн и не собирает никаких личных данных. Вся информация хранится локально в вашем браузере, пока вы не очистите cookies. Также, вы можете сохранить данные в файл и загрузить их позже с помощью кнопок в конце страницы.",
            disclaimer2: "⚠️ Отказ от ответственности: инструмент предназначен только для оценки в соответствии с публичной информацией и не является юридической консультацией. Пожалуйста, советуйтесь с юристами перед подачей.",
            blocks: {
                app: "Подсчет дней", law: "Трактовка закона", trips: "Поездки", statement: "Приложения к форме M127"
            },
            lawDesc: `Эта форма считает период пребывания на Кипре для получения гражданства по натурализации <a href="https://www.gov.cy/moi/en/documents/acquisition-of-cypriot-citizenship-by-naturalization-due-to-years-of-residence-form-m127/" target="_blank" style="color: var(--primary); text-decoration: underline;">согласно официальной информации (en)</a>, а также последним разъяснениям и интерпретациям в чате @CyLaw (<a href="https://t.me/cylaw/355929" target="_blank" style="color: var(--primary); text-decoration: underline;">например</a>), и <a href="https://cypassport.tilda.ws/days" target="_blank" style="color: var(--primary); text-decoration: underline;">сайте с информацией об ускоренной подаче</a> (не связана с автором этой страницы). 
Официальной формулы расчёта нет, пожалуйста, критически оценивайте эти расчёты и полагайтесь на своё понимание.
Логика дней отсутствия:
• Год, предшествующий подаче: вычитается ≤90 дней, >90 дней не допускается.
• Предыдущие годы: 
    • Строгая трактовка: ≤90 дней не вычитаются, >90 дней - вычитаются полностью.
    • Последняя трактовка: вычитаются только дни сверх 90 дней отсутствия.
Отсчет идет назад от даты подачи документов офицеру до даты ARC (receipt из миграции).

Приложения к форме M127 основаны <a href="https://drive.google.com/file/d/1oTmu-PkwiYlrjeLkeiL2DUiDPkm9X-ww/view" target="_blank" style="color: var(--primary); text-decoration: underline;">на шаблоне</a>, вы можете использовать свои.`,
            labels: {
                langLevel: "Тип подачи", firstReceipt: "Дата ARC", appDate: "Дата подачи M127",
                lawInterp: "Трактовка закона", toggleLatest: "Последняя", toggleStrict: "Строгая",
                arc: "ARC №", name: "Имя и фамилия", mp: "MP (№ папки)",
                statementInfo: "Для генерации приложений укажите:"
            },
            levels: { b1: "B1 (ускоренная 3+1 лет)", a2: "A2 (ускоренная 4+1 лет)", reg: "B1 (обычная 7+1 лет)" },
            appTable: { period: "Период", absence: "Дни отсутствия", daysInCy: "Дней на Кипре", credited: "Зачтено дней", total: "Итого:" },
            tripTable: { trip: "Поездка", depDate: "Дата вылета", depPass: "№ Паспорта", depStamp: "Стр. печати", retDate: "Дата прилета", retPass: "№ Паспорта", retStamp: "Стр. печати", daysAway: "Дней" },
            buttons: { generate: "Сгенерировать заявления", save: "Сохранить данные", load: "Загрузить данные", clear: "Очистить всё" },
            placeholders: [ "Смотрел на снег", "Смотрел на поезда", "Распродажа WizzAir", "Ел на мамин борщ", "Сбежал от летней жары", "Полетел за Uniqlo" ],
            status: { ready: "✅ Можно подаваться!", wait: "⏳ Вам нужно минимум {target} дней для подачи", good: "✅ Менее 90 дней", deducted: "⚠️ Отсутствие более 90 дней вычитается", fail: "❌ >90 дней отсутствия в последний год не допускается" },
            contactDesc: "Пишите по вопросам или предложениям по улучшению. Если эта страница помогла вам сэкономить время, можете поддержать автора.",
            contactBtn: "Написать",
            supportBtn: "Поддержать"
        }
    }
}
;