const CONFIG = {
    text: {
        en: {
            title: "🇨🇾 Cyprus residence days calculator for a citizenship application",
            description: "Calculate the days of your residence in Cyprus for the M127 application, and print the application forms",
            disclaimer1: "🔒 Privacy notice: this page works offline and doesn't collect any personal information. All your inputs will be stored in your browser, unless you clean the cookies. Also, you can also save all inputs and upload them later using buttons at the bottom of the page.",
            disclaimer2: "⚠️ Disclaimer: This tool is for estimation purposes only and does not constitute legal advice. Please consult with a legal professional before applying. Licensed under Creative Commons Attribution-NonCommercial 4.0 International. Allowed for personal non-commercial use.",
            blocks: {
                app: "Days calculator", law: "Law Interpretation", trips: "Trips", statement: "Form M127 addendums"
            },
            lawDesc: `This form calculates a period of residence in Cyprus for acquisition of Cypriot citizenship by naturalization (<a href="https://www.gov.cy/moi/en/documents/acquisition-of-cypriot-citizenship-by-naturalization-due-to-years-of-residence-form-m127/" target="_blank" style="color: var(--primary); text-decoration: underline;">see official info</a>).
There are different interpretations of the law, so please critically assess the options below, and rely on your own understanding.
Days of absence logic:
• Year preceding application: >90 days of absence is not allowed. Possible interpretations of ≤90 days of absence:
    ≤90 days are subtracted
    ≤90 days are ignored
• Previous years: ≤90 days of absence are ignored. Possible interpretations of >90 days of absence:
    Only days exceeding 90 are subtracted
    If absence exceeds 90 days, all absence days are subtracted
Count starts backwards from the date of application to an officer to the date of the ARC (receipt from migration).
By default, the form shows the earliest application date possible, but you can change it to a planned one.
Addendums to M127 form are based on <a href="https://drive.google.com/file/d/1oTmu-PkwiYlrjeLkeiL2DUiDPkm9X-ww/view" target="_blank" style="color: var(--primary); text-decoration: underline;">this template</a>, but you can use your own.`,
            labels: {
                langLevel: "Application type", firstReceipt: "ARC date", appDate: "Date of M127 application",
                lastYear: "Year preceding application:", prevYears: "Previous years:",
                lastYearSubtract: "≤90 days are subtracted", lastYearIgnore: "≤90 days are ignored",
                prevYearsSimple: "Only days exceeding 90 are subtracted", prevYearsStrict: ">90 days are fully subtracted",
                arc: "ARC №", name: "Name and Surname", mp: "MP (folder №)",
                statementInfo: "To generate addendums to the M127 application, please provide:"
            },
            levels: { b1: "B1 (fast track 3+1 yrs)", a2: "A2 (fast track 4+1 yrs)", reg: "B1 (regular 7+1 yrs)" },
            appTable: { period: "Period", absence: "Absence days", daysInCy: "Days in Cyprus", credited: "Credited days", total: "Total:" },
            tripTable: { trip: "Trip", depDate: "Departure date", depPass: "Passport №", depStamp: "Stamp page", retDate: "Return date", retPass: "Passport №", retStamp: "Stamp page", daysAway: "Days away" },
            buttons: { generate: "Generate statements", save: "Save data", load: "Load data", clear: "Clear all" },
            placeholders: [ "Went to see snow", "Went to see trains", "Couldn't resist a WizzAir sale", "Ate mom's borsch", "Escaped the summer heat", "Went for Uniqlo shopping" ],
            status: { ready: "✅ You can apply!", wait: "⏳ You need at least {target} days to apply", good: "☑️ Less than 90 days", deducted: "⚠️ Absence of more than 90 days is deducted", fail: "❌ >90 absence days in final year not allowed" },
            contactDesc: "14/03/2026: Added 2nd Interpretation of the last year, and analytics. \n Please write your questions and suggestions. If this page saved your time, you can support the author.",
            contactBtn: "Contact",
            supportBtn: "Support"
        },
        ru: {
            title: "🇨🇾 Калькулятор дней на Кипре для подачи на гражданство",
            description: "Вы можете подсчитать дни своего пребывания на Кипре для формы M127 и распечатать приложения к заявлению",
            disclaimer1: "🔒 Конфиденциальность: эта страница работает оффлайн и не собирает никаких личных данных. Вся информация хранится локально в вашем браузере, пока вы не очистите cookies. Также, вы можете сохранить данные в файл и загрузить их позже с помощью кнопок в конце страницы.",
            disclaimer2: "⚠️ Отказ от ответственности: инструмент предназначен только для оценки в соответствии с публичной информацией и не является юридической консультацией. Пожалуйста, советуйтесь с юристами перед подачей. Для личного некоммерческого использования под лицензией Creative Commons Attribution-NonCommercial 4.0 International.",
            blocks: {
                app: "Подсчет дней", law: "Трактовка закона", trips: "Поездки", statement: "Приложения к форме M127"
            },
            lawDesc: `Эта форма считает период пребывания на Кипре для получения гражданства по натурализации <a href="https://www.gov.cy/moi/en/documents/acquisition-of-cypriot-citizenship-by-naturalization-due-to-years-of-residence-form-m127/" target="_blank" style="color: var(--primary); text-decoration: underline;">согласно официальной информации (en)</a>, а также последним разъяснениям и интерпретациям в чате @CyLaw (<a href="https://t.me/cylaw/355929" target="_blank" style="color: var(--primary); text-decoration: underline;">например</a>), и <a href="https://cypassport.tilda.ws/days" target="_blank" style="color: var(--primary); text-decoration: underline;">сайте с информацией об ускоренной подаче</a> (не связана с автором этой страницы).
Официальной формулы расчёта нет, пожалуйста, критически оценивайте эти расчёты и полагайтесь на своё понимание.
Логика дней отсутствия:
• Последний год перед подачей: >90 дней не допускается. Возможные интерпретации ≤90 дней отсутствия:
    ≤90 дней вычитаются
    ≤90 дней игнорируются
• Предыдущие годы: ≤90 дней отсутствия игнорируются. Возможные интерпретации >90 дней отсутствия:
    Вычитаются только дни сверх 90
    Если отсутствие превышает 90 дней, все дни вычитаются полностью
Отсчет идет назад от даты подачи документов офицеру до даты ARC (receipt из миграции).
По умолчанию форма показывает самую раннюю дату подачи, но её можно поменять на планируемую.
Приложения к форме M127 основаны <a href="https://drive.google.com/file/d/1oTmu-PkwiYlrjeLkeiL2DUiDPkm9X-ww/view" target="_blank" style="color: var(--primary); text-decoration: underline;">на шаблоне</a>, вы можете использовать свои.`,
            labels: {
                langLevel: "Тип подачи", firstReceipt: "Дата ARC", appDate: "Дата подачи M127",
                lastYear: "Последний год:", prevYears: "Предыдущие годы:",
                lastYearSubtract: "≤90 дней вычитаются", lastYearIgnore: "≤90 дней игнорируются",
                prevYearsSimple: "Вычитаются только дни сверх 90", prevYearsStrict: ">90 дней вычитаются полностью",
                arc: "ARC №", name: "Имя и фамилия", mp: "MP (№ папки)",
                statementInfo: "Для генерации приложений укажите:"
            },
            levels: { b1: "B1 (ускоренная 3+1 лет)", a2: "A2 (ускоренная 4+1 лет)", reg: "B1 (обычная 7+1 лет)" },
            appTable: { period: "Период", absence: "Дни отсутствия", daysInCy: "Дней на Кипре", credited: "Зачтено дней", total: "Итого:" },
            tripTable: { trip: "Поездка", depDate: "Дата вылета", depPass: "№ Паспорта", depStamp: "Стр. печати", retDate: "Дата прилета", retPass: "№ Паспорта", retStamp: "Стр. печати", daysAway: "Дней" },
            buttons: { generate: "Сгенерировать заявления", save: "Сохранить данные", load: "Загрузить данные", clear: "Очистить всё" },
            placeholders: [ "Смотрел на снег", "Смотрел на поезда", "Распродажа WizzAir", "Ел на мамин борщ", "Сбежал от летней жары", "Полетел за Uniqlo" ],
            status: { ready: "✅ Можно подаваться!", wait: "⏳ Вам нужно минимум {target} дней для подачи", good: "☑️ Менее 90 дней", deducted: "⚠️ Отсутствие более 90 дней вычитается", fail: "❌ >90 дней отсутствия в последний год не допускается" },
            contactDesc: "14/03/2026: Добавлена вторая интерпретация для последнего года перед подачей и аналитика. \n Пишите по вопросам или предложениям по улучшению. Если эта страница помогла вам сэкономить время, можете поддержать автора.",
            contactBtn: "Написать",
            supportBtn: "Поддержать"
        }
    }
}
;