import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { Printer, Edit, RotateCcw } from 'lucide-react';

interface FormData {
  contractCity: string;
  contractDate: string;
  landlord1Name: string;
  landlord1Id: string;
  landlord1Address: string;
  landlord2Name: string;
  landlord2Id: string;
  landlord2Address: string;
  tenant1Name: string;
  tenant1Id: string;
  tenant1Address: string;
  tenant2Name: string;
  tenant2Id: string;
  tenant2Address: string;
  propertyRooms: string;
  propertyAddress: string;
  leaseMonths: string;
  leaseStartDate: string;
  leaseEndDate: string;
  optionMonths: string;
  optionRentAmount: string;
  rentAmount: string;
  upfrontMonths: string;
  upfrontAmount: string;
  firstCheckDate: string;
  lastCheckDate: string;
  checkDay: string;
  purpose: string;
  inventory: string;
  lateFee: string;
  securityDeposit: string;
  additionalA: string;
  additionalB: string;
  additionalC: string;
  additionalD: string;
  guarantor1Name: string;
  guarantor1Id: string;
  guarantor1Address: string;
  guarantor1Phone: string;
  guarantor2Name: string;
  guarantor2Id: string;
  guarantor2Address: string;
  guarantor2Phone: string;
}

const todayDate = new Date();
const today = `${String(todayDate.getDate()).padStart(2, '0')}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${todayDate.getFullYear()}`;

const initialData: FormData = {
  contractCity: '', contractDate: today,
  landlord1Name: '', landlord1Id: '', landlord1Address: '',
  landlord2Name: '', landlord2Id: '', landlord2Address: '',
  tenant1Name: '', tenant1Id: '', tenant1Address: '',
  tenant2Name: '', tenant2Id: '', tenant2Address: '',
  propertyRooms: '', propertyAddress: '',
  leaseMonths: '', leaseStartDate: '', leaseEndDate: '',
  optionMonths: '', optionRentAmount: '',
  rentAmount: '',
  upfrontMonths: '', upfrontAmount: '',
  firstCheckDate: '', lastCheckDate: '', checkDay: '',
  purpose: 'מגורים',
  inventory: '',
  lateFee: '',
  securityDeposit: '',
  additionalA: '', additionalB: '', additionalC: '', additionalD: '',
  guarantor1Name: '', guarantor1Id: '', guarantor1Address: '', guarantor1Phone: '',
  guarantor2Name: '', guarantor2Id: '', guarantor2Address: '', guarantor2Phone: ''
};


export default function App() {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem('contractFormData');
      return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem('contractFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (window.confirm('האם לנקות את כל הנתונים?')) {
      setFormData(initialData);
      localStorage.removeItem('contractFormData');
    }
  };

  const handlePrint = () => window.print();

  const B = ({ field, minWidth = 'min-w-[60px]', money = false }: { field: keyof FormData; minWidth?: string; money?: boolean }) => {
    const raw = formData[field];
    const val = money && raw ? Number(raw).toLocaleString('he-IL') : raw;
    return (
      <span className={`inline-block border-b border-black text-center font-bold text-blue-900 print:text-black leading-tight px-1 ${val ? '' : minWidth}`}>
        {val || ' '}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100 flex-col md:flex-row print:block print:h-auto print:bg-white" dir="rtl">

      {/* FORM SIDEBAR */}
      <div className="w-full md:w-1/3 bg-white border-l border-slate-200 flex flex-col h-screen sticky top-0 print:hidden shadow-lg z-10">
        <div className="p-4 bg-blue-600 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <Edit size={20} />
            <h1 className="text-xl font-bold">הזנת נתוני חוזה</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              title="נקה טופס"
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded transition-colors font-medium text-sm"
            >
              <RotateCcw size={16} />
              נקה
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-50 transition-colors font-semibold"
            >
              <Printer size={18} />
              הדפס
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Section title="כללי">
            <InputField label="נערך ונחתם ב-" name="contractCity" value={formData.contractCity} onChange={handleChange} />
            <InputField label="תאריך החתימה" name="contractDate" placeholder="DD-MM-YYYY" value={formData.contractDate} onChange={handleChange} />
          </Section>

          <Section title="המשכירים (צד א')">
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">משכיר 1</h4>
              <InputField label="שם מלא" name="landlord1Name" value={formData.landlord1Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="landlord1Id" value={formData.landlord1Id} onChange={handleChange} maxLength={9} onlyDigits />
              <InputField label="כתובת" name="landlord1Address" value={formData.landlord1Address} onChange={handleChange} />
            </div>
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">משכיר 2 (אופציונלי)</h4>
              <InputField label="שם מלא" name="landlord2Name" value={formData.landlord2Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="landlord2Id" value={formData.landlord2Id} onChange={handleChange} maxLength={9} onlyDigits />
              <InputField label="כתובת" name="landlord2Address" value={formData.landlord2Address} onChange={handleChange} />
            </div>
          </Section>

          <Section title="השוכרים (צד ב')">
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">שוכר 1</h4>
              <InputField label="שם מלא" name="tenant1Name" value={formData.tenant1Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="tenant1Id" value={formData.tenant1Id} onChange={handleChange} maxLength={9} onlyDigits />
              <InputField label="כתובת" name="tenant1Address" value={formData.tenant1Address} onChange={handleChange} />
            </div>
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">שוכר 2 (אופציונלי)</h4>
              <InputField label="שם מלא" name="tenant2Name" value={formData.tenant2Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="tenant2Id" value={formData.tenant2Id} onChange={handleChange} maxLength={9} onlyDigits />
              <InputField label="כתובת" name="tenant2Address" value={formData.tenant2Address} onChange={handleChange} />
            </div>
          </Section>

          <Section title="המושכר">
            <InputField label="מספר חדרים" name="propertyRooms" value={formData.propertyRooms} onChange={handleChange} onlyNumeric />
            <InputField label="כתובת המושכר" name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} />
            <InputField label="מטרת השכירות" name="purpose" value={formData.purpose} onChange={handleChange} />
            <TextAreaField label="ריהוט וציוד בנכס" name="inventory" value={formData.inventory} onChange={handleChange} />
          </Section>

          <Section title="תקופת השכירות">
            <InputField label="מספר חודשים" name="leaseMonths" value={formData.leaseMonths} onChange={handleChange} onlyDigits />
            <InputField label="תאריך התחלה" name="leaseStartDate" placeholder="DD-MM-YYYY" value={formData.leaseStartDate} onChange={handleChange} />
            <InputField label="תאריך סיום" name="leaseEndDate" placeholder="DD-MM-YYYY" value={formData.leaseEndDate} onChange={handleChange} />
            <div className="pt-3 border-t border-slate-200">
              <h4 className="font-bold mb-2 text-sm text-slate-600">אופציה (הארכה)</h4>
              <InputField label="מספר חודשי אופציה" name="optionMonths" value={formData.optionMonths} onChange={handleChange} onlyDigits />
              <div className="mt-3">
                <InputField label="שכ״ד בתקופת אופציה (₪)" name="optionRentAmount" value={formData.optionRentAmount} onChange={handleChange} onlyDigits />
              </div>
            </div>
          </Section>

          <Section title="תשלומים">
            <InputField label="שכ״ד חודשי (₪)" name="rentAmount" value={formData.rentAmount} onChange={handleChange} onlyDigits />
            <InputField label="חודשים תשלום מראש" name="upfrontMonths" value={formData.upfrontMonths} onChange={handleChange} onlyDigits />
            <InputField label="סכום תשלום מראש (₪)" name="upfrontAmount" value={formData.upfrontAmount} onChange={handleChange} onlyDigits />
            <div className="grid grid-cols-2 gap-2">
              <InputField label="תאריך צ׳ק ראשון" name="firstCheckDate" placeholder="DD-MM-YYYY" value={formData.firstCheckDate} onChange={handleChange} />
              <InputField label="תאריך צ׳ק אחרון" name="lastCheckDate" placeholder="DD-MM-YYYY" value={formData.lastCheckDate} onChange={handleChange} />
            </div>
            <InputField label="מועד חיוב חודשי (למשל: כל 10 לחודש)" name="checkDay" value={formData.checkDay} onChange={handleChange} />
            <InputField label="קנס פיגור בפינוי (₪ ליום)" name="lateFee" value={formData.lateFee} onChange={handleChange} onlyDigits />
            <InputField label="שטר ביטחון (₪)" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} onlyDigits />
          </Section>

          <Section title="תנאים נוספים">
            <TextAreaField label="סעיף א'" name="additionalA" value={formData.additionalA} onChange={handleChange} />
            <TextAreaField label="סעיף ב'" name="additionalB" value={formData.additionalB} onChange={handleChange} />
            <TextAreaField label="סעיף ג'" name="additionalC" value={formData.additionalC} onChange={handleChange} />
            <TextAreaField label="סעיף ד'" name="additionalD" value={formData.additionalD} onChange={handleChange} />
          </Section>

          <Section title="ערבים">
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">ערב 1</h4>
              <InputField label="שם מלא" name="guarantor1Name" value={formData.guarantor1Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="guarantor1Id" value={formData.guarantor1Id} onChange={handleChange} maxLength={9} onlyDigits />
              <InputField label="כתובת" name="guarantor1Address" value={formData.guarantor1Address} onChange={handleChange} />
              <InputField label="טלפון" name="guarantor1Phone" type="tel" value={formData.guarantor1Phone} onChange={handleChange} />
            </div>
            <div className="space-y-3 bg-slate-50 p-3 rounded border mt-4">
              <h4 className="font-bold text-sm text-slate-600">ערב 2</h4>
              <InputField label="שם מלא" name="guarantor2Name" value={formData.guarantor2Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="guarantor2Id" value={formData.guarantor2Id} onChange={handleChange} maxLength={9} onlyDigits />
              <InputField label="כתובת" name="guarantor2Address" value={formData.guarantor2Address} onChange={handleChange} />
              <InputField label="טלפון" name="guarantor2Phone" type="tel" value={formData.guarantor2Phone} onChange={handleChange} />
            </div>
          </Section>
        </div>
      </div>

      {/* CONTRACT PREVIEW */}
      <div className="w-full md:w-2/3 h-screen overflow-y-auto bg-slate-200 flex justify-center p-4 md:p-8 print:p-0 print:overflow-visible print:w-full print:block">
        <div className="bg-white w-full max-w-full md:max-w-[210mm] min-h-[297mm] self-start shadow-2xl p-8 md:p-16 print:shadow-none print:max-w-none print:w-full print:p-0 text-slate-900 leading-relaxed font-serif text-sm md:text-base">

          <h1 className="text-center text-3xl font-bold mb-2">חוזה שכירות</h1>
          <h2 className="text-center text-xl font-bold mb-8">(בלתי מוגנת)</h2>

          <div className="mb-8">
            שנערך ונחתם ב: <B field="contractCity" minWidth="min-w-[120px]" /> בתאריך: <B field="contractDate" minWidth="min-w-[120px]" />
          </div>

          <div className="mb-8 space-y-4">
            <div>
              <span className="font-bold">בין: </span>
              <div className="mt-1 pr-6 space-y-1">
                <div>1. שם: <B field="landlord1Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="landlord1Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <B field="landlord1Address" minWidth="min-w-[200px]" /></div>
                {formData.landlord2Name && (
                  <div>2. שם: <B field="landlord2Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="landlord2Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <B field="landlord2Address" minWidth="min-w-[200px]" /></div>
                )}
                <div className="font-bold pt-1">ביחד ולחוד, מצד אחד (להלן: "המשכיר")</div>
              </div>
            </div>

            <div>
              <span className="font-bold">לבין: </span>
              <div className="mt-1 pr-6 space-y-1">
                <div>1. שם: <B field="tenant1Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="tenant1Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <B field="tenant1Address" minWidth="min-w-[200px]" /></div>
                {formData.tenant2Name && (
                  <div>2. שם: <B field="tenant2Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="tenant2Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <B field="tenant2Address" minWidth="min-w-[200px]" /></div>
                )}
                <div className="font-bold pt-1">ביחד ולחוד, מצד שני (להלן: "השוכר")</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex">
              <span className="font-bold w-16 shrink-0">הואיל:</span>
              <span>והמשכיר הינו בעל הזכויות והמחזיק הבלעדי בדירה/חנות/נכס ובו <B field="propertyRooms" minWidth="min-w-[40px]" /> חדרים. והכתובת <B field="propertyAddress" minWidth="min-w-[200px]" /> (להלן - "המושכר")</span>
            </div>
            <div className="flex">
              <span className="font-bold w-16 shrink-0">והואיל:</span>
              <span>והשוכר מעוניין לשכור את המושכר מאת המשכיר, בשכירות שאינה מוגנת על ידי חוקי הגנת הדייר.</span>
            </div>
            <div className="font-bold mt-4">
              אי לכך הוסכם הותנה והוצהר בין הצדדים כדלקמן:
            </div>
          </div>

          <ol className="list-decimal list-outside pr-5 space-y-3 print:space-y-2 text-justify">
            <li>המבוא לחוזה זה מהווה חלק בלתי ניפרד ממנו.</li>
            <li>
              א. השוכר שוכר בזה את המושכר מאת המשכיר לתקופה של <B field="leaseMonths" minWidth="min-w-[50px]" /> חודשים החל מיום <B field="leaseStartDate" minWidth="min-w-[100px]" /> וכלה ביום <B field="leaseEndDate" minWidth="min-w-[100px]" /> (להלן תקופת השכירות).<br />
              ב. המשכיר נותן בזה לשוכר זכות אופציה להאריך את תקופת השכירות לתקופה נוספת של <B field="optionMonths" minWidth="min-w-[50px]" /> חודשים, ובלבד שהשוכר יודיע על כוונתו לממש זכות האופציה, במכתב רשום. לא יאוחר מ-45 יום לפני תום תקופת השכירות. דמי השכירות לכל חודש עבור תקופת האופציה יהיו סך של <B field="optionRentAmount" minWidth="min-w-[80px]" money /> ₪. תנאי חוזה זה בשינויים המחוייבים יחולו גם על תקופת האופציה.
            </li>
            <li>
              א. תמורת השכירות ישלם השוכר דמי שכירות לכל חודש בסכום של <B field="rentAmount" minWidth="min-w-[80px]" money /> ₪.<br />
              ב. דמי השכירות ישולמו כדלקמן:<br />
              &nbsp;&nbsp;1. עם חתימת חוזה ישלם השוכר עבור <B field="upfrontMonths" minWidth="min-w-[40px]" /> חודשים מראש סך של <B field="upfrontAmount" minWidth="min-w-[80px]" money /> ₪.<br />
              &nbsp;&nbsp;2. יתרת דמי השכירות ישולמו ב- 11 צקים עוקבים עד סוף תקופת השכירות, כאשר צ'ק ראשון ליום <B field="firstCheckDate" minWidth="min-w-[80px]" /> ועד צ'ק האחרון ליום <B field="lastCheckDate" minWidth="min-w-[80px]" /> כל <B field="checkDay" minWidth="min-w-[100px]" />.
            </li>
            <li>השוכר שוכר את המושכר למטרת <B field="purpose" minWidth="min-w-[100px]" /> בלבד והינו מתחייב שלא להרשות לצד ג' אחר להשתמש במושכר בין בתמורה ובין ללא תמורה וכן לא להעביר זכות מזכויותיו על פי חוזה זה לצד ג' אחר.</li>
            <li>אסור לשוכר לעשות כל שינוי שהוא במושכר לגרוע ממנו או להוסיף לו אלא בהסכמת המשכיר ובכתב לכל שינוי.</li>
            <li>השוכר ישלם במועדם את מיסי העיריה החלים וכן חשבונות המים, החשמל, הגז וועד הבית וכל התשלומים החלים על המחזיק בדירה. מס רכוש ומיסים המוטלים על הבעלים יחולו על המשכיר.</li>
            <li>השוכר מצהיר כי ראה ובחן את הדירה ומצאה מתאימה למטרותיו והינו מוותר מראש על כל טענת פגם או אי התאמה.</li>
            <li>השוכר מצהיר ומאשר כי לא שילם ולא התחייב לשלם דמי מפתח בגין שכירת הנכס. לשוכר ידוע כי אינו זכאי לזכויות דייר מוגן בנכס. עובר לחתימת חוזה זה ובכל המועדים הרלוונטיים על פי חוק הגנת הדייר (נ"מ) תשל"ב-1972 לא היה דייר הזכאי להחזיק בנכס.</li>
            <li>השוכר מתחייב להשתמש במושכר באופן זהיר וסביר, להימנע מלגרום כל נזק, קלקול או אבדן. פרט לבלאי הנובע משימוש סביר, יתקן המשכיר על חשבונו כל נזק קלקול או אבדן שיתרחש במושכר והכל תוך 7 ימים.</li>
            <li>למשכיר ו/או לבא כוחו הזכות להיכנס למושכר בכל עת בתיאום ובמתן התראה של 24 ש' מראש, על מנת לברר אם ממלא השוכר את תנאי חוזה זה ו/או לבצע בו תיקונים על פי שיקול דעתו הבלעדי.</li>
            <li>השוכר מאשר כי במושכר מצוי הריהוט והציוד כמפורט להלן: <B field="inventory" minWidth="min-w-[300px]" /> (להלן "הציוד"). השוכר יהיה אחראי לשלמותו ותקינותו של הציוד.</li>
            <li>מוסכם בזה כי ביצוע כל תשלום המוטל על השוכר על פי חוזה זה במלואו ובמועדו הינו מעיקרי החוזה וכל אי ביצוע או איחור לבצע תשלום כלשהו יהווה הפרה יסודית ועיקרית של החוזה.</li>
            <li>השוכר יהיה חייב בתשלום מלוא דמי השכירות לכל תקופת השכירות גם אם יפסיק או יחדל להשתמש במושכר מכל סיבה שהיא, לפני תום החוזה.</li>
            <li>
              א. עם תום השכירות יפנה השוכר את המושכר ויחזיר את החזקה בו למשכיר כשהוא נקי ופנוי מכל אדם וחפץ שאינם שייכים למשכיר והבית צבוע וללא פגמים (כפי שהתקבל מהמשכיר).<br />
              ב. בנוסף לכל סעד או תרופה העומדים למשכיר הרי שבמידה והשוכר לא יפנה ויחזיר את המושכר במועד ו/או יאחר בתשלום דמי השכירות במועד שניקבע מראש, ישלם למשכיר כפיצוי מוסכם ומוערך מראש סכום של <B field="lateFee" minWidth="min-w-[80px]" money /> ₪ עבור כל יום איחור בפינוי המושכר.
            </li>
            <li>להבטחת מילוי כל התחייבויות השוכר על פי הסכם זה כולל פינוי המושכר במועד, יפקיד השוכר בידי המשכיר שטר בטחון ע"ס <B field="securityDeposit" minWidth="min-w-[100px]" money /> ₪ בחתימתו ובערבות שני ערבים וניתנת בזה הרשאה בלתי חוזרת למשכיר למלא בשטר החוב את מועד הפרעון ופרטים אחרים וזאת מבלי לגרוע מזכות המשכיר לכל סעד נוסף.</li>
            <li>מוסכם ומוצהר בזה כי רק אישור בכתב חתום על ידי המשכיר או מי מהוסמך לכך מטעמו יחשב כאישור או הסכמה מצידו בכל דבר ועניין הקשור במישרין או בעקיפין להסכם זה.</li>
            <li>מוסכם ומוצהר בזה כי כל מעשה או מחדל של המשכיר לרבות אי עמידה על קיום מלוא התחייבות השוכר ו/או אי הפעלת זכויות או סעדים מצד המשכיר או השהייתם לא יחשבו הסכמה ויתור או שינוי הוראות הסכם זה ולא יפגעו בזכות או סעד כלשהם הנתונים למשכיר.</li>
            <li>השוכר לא יהא רשאי לתלות שלטים ודברי פרסומת במושכר אלא בכפוף להסכמה מפורשת ובכתב מצד המשכיר לגבי גודל השלט ומיקומו ותוכנו.</li>
            <li>השוכר חייב להשיג רשיון כחוק במידת הצורך לכל פעולה או עיסוק הקשורים להחזקתו ו/או עיסוקו במושכר.</li>
            <li>כל צד שיפר הסכם זה יהא חייב לשלם לצד השני את מלוא הנזקים וההפסדים שיגרמו לו, ואולם אין באמור בסעיף זה לפגוע בזכותו של המשכיר לדרוש פינויו של השוכר במקרה הפרה.</li>
            <li>הצדדים מצהירים כי כתובותיהם הינן כמפורט בכותרת החוזה וכל הודעה הנישלחת למי מן הצדדים בדואר רשום תחשב כמתקבלת תוך 48 שעות מיום המישלוח.</li>
            <li>
              תנאים נוספים:<br />
              א. <B field="additionalA" minWidth="min-w-[400px]" /><br />
              ב. <B field="additionalB" minWidth="min-w-[400px]" /><br />
              ג. <B field="additionalC" minWidth="min-w-[400px]" /><br />
              ד. <B field="additionalD" minWidth="min-w-[400px]" />
            </li>
          </ol>

          <div className="mt-12 mb-8 font-bold text-lg text-center">
            ולראיה באו הצדדים על החתום:
          </div>

          <div className="flex justify-around mb-16 mt-4">
            <div className="text-center">
              <div className="mb-16">המשכיר</div>
              <div className="border-b border-black w-52"></div>
            </div>
            <div className="text-center">
              <div className="mb-16">השוכר</div>
              <div className="border-b border-black w-52"></div>
            </div>
          </div>

          <div className="border-t-2 border-black pt-8 mt-8">
            <h3 className="text-xl font-bold text-center mb-6">כתב ערבות</h3>
            <p className="mb-6">
              אנו החתומים מטה ערבים בזה באופן אישי, ביחד ולחוד, לכל התחייבויות השוכר על פי הסכם זה.
            </p>
            <div className="space-y-8">
              {[
                { label: "ערב מס' 1", name: 'guarantor1Name', id: 'guarantor1Id', address: 'guarantor1Address', phone: 'guarantor1Phone' },
                { label: "ערב מס' 2", name: 'guarantor2Name', id: 'guarantor2Id', address: 'guarantor2Address', phone: 'guarantor2Phone' },
              ].map(g => (
                <div key={g.label} className="space-y-4 pr-4 pb-8">
                  <div>
                    <span className="font-bold">{g.label}: </span>
                    שם: <B field={g.name as keyof FormData} minWidth="min-w-[160px]" />
                    &nbsp;&nbsp; ת.ז: <B field={g.id as keyof FormData} minWidth="min-w-[110px]" />
                    &nbsp;&nbsp; כתובת: <B field={g.address as keyof FormData} minWidth="min-w-[180px]" />
                  </div>
                  <div>טלפון: <B field={g.phone as keyof FormData} minWidth="min-w-[130px]" /></div>
                  <div className="mt-16 flex justify-end">חתימה: <span className="inline-block border-b border-black min-w-[220px] mr-2">&nbsp;</span></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Components

type SectionProps = React.PropsWithChildren<{ title: string }>;
const Section = ({ title, children }: SectionProps) => (
  <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
    <h3 className="text-lg font-bold text-blue-800 mb-4 border-b pb-2">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

type InputFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  onlyDigits?: boolean;
  onlyNumeric?: boolean;
  onlyLetters?: boolean;
};
const InputField = ({ label, name, value, onChange, type = 'text', placeholder, maxLength, onlyDigits, onlyNumeric, onlyLetters }: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onlyDigits) e.target.value = e.target.value.replace(/\D/g, '');
    if (onlyNumeric) {
      let v = e.target.value.replace(/[^0-9.]/g, '');
      const parts = v.split('.');
      if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
      e.target.value = v;
    }
    if (onlyLetters) e.target.value = e.target.value.replace(/[^a-zA-Zא-ת\s'"-]/g, '');
    onChange(e);
  };
  return (
    <div className="flex flex-col">
      <label className="text-sm text-slate-600 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={onlyDigits ? 'numeric' : onlyNumeric ? 'decimal' : undefined}
        className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
      />
    </div>
  );
};

type TextAreaFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};
const TextAreaField = ({ label, name, value, onChange, rows = 3 }: TextAreaFieldProps) => (
  <div className="flex flex-col">
    <label className="text-sm text-slate-600 font-medium mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm resize-y"
    />
  </div>
);

// Mount
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
