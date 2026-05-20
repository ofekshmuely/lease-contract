import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { Printer, Edit, RotateCcw, CalendarDays, Download, Upload } from 'lucide-react';
import citiesData from './cities.json';

interface FormData {
  contractCity: string;
  contractDate: string;
  landlord1Name: string;
  landlord1Id: string;
  landlord1Street: string;
  landlord1HouseNum: string;
  landlord1City: string;
  landlord2Name: string;
  landlord2Id: string;
  landlord2Street: string;
  landlord2HouseNum: string;
  landlord2City: string;
  tenant1Name: string;
  tenant1Id: string;
  tenant1Street: string;
  tenant1HouseNum: string;
  tenant1City: string;
  tenant2Name: string;
  tenant2Id: string;
  tenant2Street: string;
  tenant2HouseNum: string;
  tenant2City: string;
  propertyRooms: string;
  propertyStreet: string;
  propertyHouseNum: string;
  propertyCity: string;
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
  guarantor1Street: string;
  guarantor1HouseNum: string;
  guarantor1City: string;
  guarantor1Phone: string;
  guarantor2Name: string;
  guarantor2Id: string;
  guarantor2Street: string;
  guarantor2HouseNum: string;
  guarantor2City: string;
  guarantor2Phone: string;
}

const todayDate = new Date();
const today = `${String(todayDate.getDate()).padStart(2, '0')}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${todayDate.getFullYear()}`;

const initialData: FormData = {
  contractCity: '', contractDate: today,
  landlord1Name: '', landlord1Id: '', landlord1Street: '', landlord1HouseNum: '', landlord1City: '',
  landlord2Name: '', landlord2Id: '', landlord2Street: '', landlord2HouseNum: '', landlord2City: '',
  tenant1Name: '', tenant1Id: '', tenant1Street: '', tenant1HouseNum: '', tenant1City: '',
  tenant2Name: '', tenant2Id: '', tenant2Street: '', tenant2HouseNum: '', tenant2City: '',
  propertyRooms: '', propertyStreet: '', propertyHouseNum: '', propertyCity: '',
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
  guarantor1Name: '', guarantor1Id: '', guarantor1Street: '', guarantor1HouseNum: '', guarantor1City: '', guarantor1Phone: '',
  guarantor2Name: '', guarantor2Id: '', guarantor2Street: '', guarantor2HouseNum: '', guarantor2City: '', guarantor2Phone: ''
};

const numberToHebrew = (n: number): string => {
  if (!n || isNaN(n) || n <= 0) return '';
  n = Math.floor(n);
  if (n >= 10000000) return '';
  const u20 = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה',
    'עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר',
    'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר'];
  const t10 = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
  const sub100 = (x: number): string => {
    if (x === 0) return '';
    if (x < 20) return u20[x];
    return t10[Math.floor(x / 10)] + (x % 10 ? ` ו${u20[x % 10]}` : '');
  };
  const sub1000 = (x: number): string => {
    const h = Math.floor(x / 100);
    const hStr = h === 0 ? '' : h === 1 ? 'מאה' : h === 2 ? 'מאתיים'
      : ['', '', '', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע'][h] + ' מאות';
    const rStr = sub100(x % 100);
    return hStr && rStr ? `${hStr} ו${rStr}` : hStr || rStr;
  };
  const tSpecial = ['', 'אלף', 'אלפיים', 'שלושת', 'ארבעת', 'חמשת', 'ששת', 'שבעת', 'שמונת', 'תשעת', 'עשרת'];
  const parts: string[] = [];
  if (n >= 1000000) { parts.push(sub1000(Math.floor(n / 1000000)) + ' מיליון'); n %= 1000000; }
  if (n >= 1000) {
    const t = Math.floor(n / 1000);
    parts.push(t <= 2 ? tSpecial[t] : t <= 10 ? tSpecial[t] + ' אלפים' : sub100(t) + ' אלף');
    n %= 1000;
  }
  if (n > 0) parts.push(sub1000(n));
  return parts.join(' ו');
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

  const [streetsData, setStreetsData] = useState<Record<string, string[]>>({});
  useEffect(() => {
    import('./streets.json').then(m => setStreetsData(m.default as Record<string, string[]>));
  }, []);

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

  const handleDateChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `חוזה-${formData.tenant1Name || 'חדש'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        setFormData({ ...initialData, ...data });
      } catch {
        alert('קובץ לא תקין');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = () => window.print();

  const B = ({ field, minWidth = 'min-w-[60px]', money = false }: { field: keyof FormData; minWidth?: string; money?: boolean }) => {
    const raw = formData[field];
    const num = money ? Number(raw) : 0;
    const formatted = money && raw ? num.toLocaleString('he-IL') : raw;
    const words = money && num > 0 ? numberToHebrew(num) : '';
    return (
      <span className={`inline-block border-b border-black text-center font-bold text-blue-900 print:text-black leading-tight px-1 ${formatted ? '' : minWidth}`}>
        {formatted || ' '}{words && ` (${words})`}
      </span>
    );
  };

  const AddressB = ({ prefix, minWidth = 'min-w-[220px]' }: { prefix: string; minWidth?: string }) => {
    const street = formData[`${prefix}Street` as keyof FormData];
    const houseNum = formData[`${prefix}HouseNum` as keyof FormData];
    const city = formData[`${prefix}City` as keyof FormData];
    const full = [street, houseNum].filter(Boolean).join(' ') + (city ? `, ${city}` : '');
    return (
      <span className={`inline-block border-b border-black font-bold text-blue-900 print:text-black leading-tight px-1 ${full ? '' : minWidth}`}>
        {full || ' '}
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
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={handleReset} title="נקה טופס"
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded transition-colors font-medium text-sm">
              <RotateCcw size={16} />
              נקה
            </button>
            <label title="טען חוזה"
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded transition-colors font-medium text-sm cursor-pointer">
              <Upload size={16} />
              טען
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={handleExport} title="שמור חוזה"
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded transition-colors font-medium text-sm">
              <Download size={16} />
              שמור
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-50 transition-colors font-semibold">
              <Printer size={18} />
              הדפס
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Section title="כללי">
            <InputField label="נערך ונחתם ב-" name="contractCity" value={formData.contractCity} onChange={handleChange} />
            <DatePickerField label="תאריך החתימה" name="contractDate" value={formData.contractDate} onDateChange={handleDateChange} />
          </Section>

          <Section title="המשכירים (צד א')">
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">משכיר 1</h4>
              <InputField label="שם מלא" name="landlord1Name" value={formData.landlord1Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="landlord1Id" value={formData.landlord1Id} onChange={handleChange} maxLength={9} onlyDigits />
              <AutocompleteField label="עיר" name="landlord1City" value={formData.landlord1City} onChange={handleChange} suggestions={citiesData} placeholder="הקלד שם עיר..." />
              <AutocompleteField label="רחוב" name="landlord1Street" value={formData.landlord1Street} onChange={handleChange} suggestions={formData.landlord1City ? (streetsData[formData.landlord1City] ?? []) : []} placeholder="הקלד שם רחוב..." />
              <InputField label="מספר בית" name="landlord1HouseNum" value={formData.landlord1HouseNum} onChange={handleChange} onlyDigits placeholder="12" />
            </div>
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">משכיר 2 (אופציונלי)</h4>
              <InputField label="שם מלא" name="landlord2Name" value={formData.landlord2Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="landlord2Id" value={formData.landlord2Id} onChange={handleChange} maxLength={9} onlyDigits />
              <AutocompleteField label="עיר" name="landlord2City" value={formData.landlord2City} onChange={handleChange} suggestions={citiesData} placeholder="הקלד שם עיר..." />
              <AutocompleteField label="רחוב" name="landlord2Street" value={formData.landlord2Street} onChange={handleChange} suggestions={formData.landlord2City ? (streetsData[formData.landlord2City] ?? []) : []} placeholder="הקלד שם רחוב..." />
              <InputField label="מספר בית" name="landlord2HouseNum" value={formData.landlord2HouseNum} onChange={handleChange} onlyDigits placeholder="12" />
            </div>
          </Section>

          <Section title="השוכרים (צד ב')">
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">שוכר 1</h4>
              <InputField label="שם מלא" name="tenant1Name" value={formData.tenant1Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="tenant1Id" value={formData.tenant1Id} onChange={handleChange} maxLength={9} onlyDigits />
              <AutocompleteField label="עיר" name="tenant1City" value={formData.tenant1City} onChange={handleChange} suggestions={citiesData} placeholder="הקלד שם עיר..." />
              <AutocompleteField label="רחוב" name="tenant1Street" value={formData.tenant1Street} onChange={handleChange} suggestions={formData.tenant1City ? (streetsData[formData.tenant1City] ?? []) : []} placeholder="הקלד שם רחוב..." />
              <InputField label="מספר בית" name="tenant1HouseNum" value={formData.tenant1HouseNum} onChange={handleChange} onlyDigits placeholder="12" />
            </div>
            <div className="space-y-3 bg-slate-50 p-3 rounded border">
              <h4 className="font-bold text-sm text-slate-600">שוכר 2 (אופציונלי)</h4>
              <InputField label="שם מלא" name="tenant2Name" value={formData.tenant2Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="tenant2Id" value={formData.tenant2Id} onChange={handleChange} maxLength={9} onlyDigits />
              <AutocompleteField label="עיר" name="tenant2City" value={formData.tenant2City} onChange={handleChange} suggestions={citiesData} placeholder="הקלד שם עיר..." />
              <AutocompleteField label="רחוב" name="tenant2Street" value={formData.tenant2Street} onChange={handleChange} suggestions={formData.tenant2City ? (streetsData[formData.tenant2City] ?? []) : []} placeholder="הקלד שם רחוב..." />
              <InputField label="מספר בית" name="tenant2HouseNum" value={formData.tenant2HouseNum} onChange={handleChange} onlyDigits placeholder="12" />
            </div>
          </Section>

          <Section title="המושכר">
            <InputField label="מספר חדרים" name="propertyRooms" value={formData.propertyRooms} onChange={handleChange} onlyNumeric />
            <AutocompleteField label="עיר" name="propertyCity" value={formData.propertyCity} onChange={handleChange} suggestions={citiesData} placeholder="הקלד שם עיר..." />
            <AutocompleteField label="רחוב" name="propertyStreet" value={formData.propertyStreet} onChange={handleChange} suggestions={formData.propertyCity ? (streetsData[formData.propertyCity] ?? []) : []} placeholder="הקלד שם רחוב..." />
            <InputField label='מספר בית' name="propertyHouseNum" value={formData.propertyHouseNum} onChange={handleChange} onlyDigits placeholder="12" />
            <InputField label="מטרת השכירות" name="purpose" value={formData.purpose} onChange={handleChange} />
            <TextAreaField label="ריהוט וציוד בנכס" name="inventory" value={formData.inventory} onChange={handleChange} />
          </Section>

          <Section title="תקופת השכירות">
            <InputField label="מספר חודשים" name="leaseMonths" value={formData.leaseMonths} onChange={handleChange} onlyDigits />
            <DatePickerField label="תאריך התחלה" name="leaseStartDate" value={formData.leaseStartDate} onDateChange={handleDateChange} />
            <DatePickerField label="תאריך סיום" name="leaseEndDate" value={formData.leaseEndDate} onDateChange={handleDateChange} />
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
              <DatePickerField label="תאריך צ׳ק ראשון" name="firstCheckDate" value={formData.firstCheckDate} onDateChange={handleDateChange} />
              <DatePickerField label="תאריך צ׳ק אחרון" name="lastCheckDate" value={formData.lastCheckDate} onDateChange={handleDateChange} />
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
              <AutocompleteField label="עיר" name="guarantor1City" value={formData.guarantor1City} onChange={handleChange} suggestions={citiesData} placeholder="הקלד שם עיר..." />
              <AutocompleteField label="רחוב" name="guarantor1Street" value={formData.guarantor1Street} onChange={handleChange} suggestions={formData.guarantor1City ? (streetsData[formData.guarantor1City] ?? []) : []} placeholder="הקלד שם רחוב..." />
              <InputField label="מספר בית" name="guarantor1HouseNum" value={formData.guarantor1HouseNum} onChange={handleChange} onlyDigits placeholder="12" />
              <InputField label="טלפון" name="guarantor1Phone" type="tel" value={formData.guarantor1Phone} onChange={handleChange} onlyDigits maxLength={10} placeholder="0501234567" />
            </div>
            <div className="space-y-3 bg-slate-50 p-3 rounded border mt-4">
              <h4 className="font-bold text-sm text-slate-600">ערב 2</h4>
              <InputField label="שם מלא" name="guarantor2Name" value={formData.guarantor2Name} onChange={handleChange} onlyLetters />
              <InputField label="ת.ז" name="guarantor2Id" value={formData.guarantor2Id} onChange={handleChange} maxLength={9} onlyDigits />
              <AutocompleteField label="עיר" name="guarantor2City" value={formData.guarantor2City} onChange={handleChange} suggestions={citiesData} placeholder="הקלד שם עיר..." />
              <AutocompleteField label="רחוב" name="guarantor2Street" value={formData.guarantor2Street} onChange={handleChange} suggestions={formData.guarantor2City ? (streetsData[formData.guarantor2City] ?? []) : []} placeholder="הקלד שם רחוב..." />
              <InputField label="מספר בית" name="guarantor2HouseNum" value={formData.guarantor2HouseNum} onChange={handleChange} onlyDigits placeholder="12" />
              <InputField label="טלפון" name="guarantor2Phone" type="tel" value={formData.guarantor2Phone} onChange={handleChange} onlyDigits maxLength={10} placeholder="0501234567" />
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
                <div>1. שם: <B field="landlord1Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="landlord1Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <AddressB prefix="landlord1" /></div>
                {formData.landlord2Name && (
                  <div>2. שם: <B field="landlord2Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="landlord2Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <AddressB prefix="landlord2" /></div>
                )}
                <div className="font-bold pt-1">ביחד ולחוד, מצד אחד (להלן: "המשכיר")</div>
              </div>
            </div>
            <div>
              <span className="font-bold">לבין: </span>
              <div className="mt-1 pr-6 space-y-1">
                <div>1. שם: <B field="tenant1Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="tenant1Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <AddressB prefix="tenant1" /></div>
                {formData.tenant2Name && (
                  <div>2. שם: <B field="tenant2Name" minWidth="min-w-[180px]" /> &nbsp;&nbsp; ת.ז: <B field="tenant2Id" minWidth="min-w-[110px]" /> &nbsp;&nbsp; כתובת: <AddressB prefix="tenant2" /></div>
                )}
                <div className="font-bold pt-1">ביחד ולחוד, מצד שני (להלן: "השוכר")</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex">
              <span className="font-bold w-16 shrink-0">הואיל:</span>
              <span>והמשכיר הינו בעל הזכויות והמחזיק הבלעדי בדירה/חנות/נכס ובו <B field="propertyRooms" minWidth="min-w-[40px]" /> חדרים. והכתובת <B field="propertyStreet" minWidth="min-w-[140px]" />{formData.propertyHouseNum && <> <B field="propertyHouseNum" minWidth="min-w-[40px]" /></>}{formData.propertyCity && <>, <B field="propertyCity" minWidth="min-w-[100px]" /></>} (להלן - "המושכר")</span>
            </div>
            <div className="flex">
              <span className="font-bold w-16 shrink-0">והואיל:</span>
              <span>והשוכר מעוניין לשכור את המושכר מאת המשכיר, בשכירות שאינה מוגנת על ידי חוקי הגנת הדייר.</span>
            </div>
            <div className="font-bold mt-4">אי לכך הוסכם הותנה והוצהר בין הצדדים כדלקמן:</div>
          </div>

          <ol className="list-decimal list-outside pr-5 space-y-3 print:space-y-2 text-justify">
            <li className="print:break-inside-avoid">המבוא לחוזה זה מהווה חלק בלתי ניפרד ממנו.</li>
            <li className="print:break-inside-avoid">
              א. השוכר שוכר בזה את המושכר מאת המשכיר לתקופה של <B field="leaseMonths" minWidth="min-w-[50px]" /> חודשים החל מיום <B field="leaseStartDate" minWidth="min-w-[100px]" /> וכלה ביום <B field="leaseEndDate" minWidth="min-w-[100px]" /> (להלן תקופת השכירות).<br />
              ב. המשכיר נותן בזה לשוכר זכות אופציה להאריך את תקופת השכירות לתקופה נוספת של <B field="optionMonths" minWidth="min-w-[50px]" /> חודשים, ובלבד שהשוכר יודיע על כוונתו לממש זכות האופציה, במכתב רשום. לא יאוחר מ-45 יום לפני תום תקופת השכירות. דמי השכירות לכל חודש עבור תקופת האופציה יהיו סך של <B field="optionRentAmount" minWidth="min-w-[80px]" money /> ₪. תנאי חוזה זה בשינויים המחוייבים יחולו גם על תקופת האופציה.
            </li>
            <li className="print:break-inside-avoid">
              א. תמורת השכירות ישלם השוכר דמי שכירות לכל חודש בסכום של <B field="rentAmount" minWidth="min-w-[80px]" money /> ₪.<br />
              ב. דמי השכירות ישולמו כדלקמן:<br />
              &nbsp;&nbsp;1. עם חתימת חוזה ישלם השוכר עבור <B field="upfrontMonths" minWidth="min-w-[40px]" /> חודשים מראש סך של <B field="upfrontAmount" minWidth="min-w-[80px]" money /> ₪.<br />
              &nbsp;&nbsp;2. יתרת דמי השכירות ישולמו ב- 11 צקים עוקבים עד סוף תקופת השכירות, כאשר צ'ק ראשון ליום <B field="firstCheckDate" minWidth="min-w-[80px]" /> ועד צ'ק האחרון ליום <B field="lastCheckDate" minWidth="min-w-[80px]" /> כל <B field="checkDay" minWidth="min-w-[100px]" />.
            </li>
            <li className="print:break-inside-avoid">השוכר שוכר את המושכר למטרת <B field="purpose" minWidth="min-w-[100px]" /> בלבד והינו מתחייב שלא להרשות לצד ג' אחר להשתמש במושכר בין בתמורה ובין ללא תמורה וכן לא להעביר זכות מזכויותיו על פי חוזה זה לצד ג' אחר.</li>
            <li className="print:break-inside-avoid">אסור לשוכר לעשות כל שינוי שהוא במושכר לגרוע ממנו או להוסיף לו אלא בהסכמת המשכיר ובכתב לכל שינוי.</li>
            <li className="print:break-inside-avoid">השוכר ישלם במועדם את מיסי העיריה החלים וכן חשבונות המים, החשמל, הגז וועד הבית וכל התשלומים החלים על המחזיק בדירה. מס רכוש ומיסים המוטלים על הבעלים יחולו על המשכיר.</li>
            <li className="print:break-inside-avoid">השוכר מצהיר כי ראה ובחן את הדירה ומצאה מתאימה למטרותיו והינו מוותר מראש על כל טענת פגם או אי התאמה.</li>
            <li className="print:break-inside-avoid">השוכר מצהיר ומאשר כי לא שילם ולא התחייב לשלם דמי מפתח בגין שכירת הנכס. לשוכר ידוע כי אינו זכאי לזכויות דייר מוגן בנכס. עובר לחתימת חוזה זה ובכל המועדים הרלוונטיים על פי חוק הגנת הדייר (נ"מ) תשל"ב-1972 לא היה דייר הזכאי להחזיק בנכס.</li>
            <li className="print:break-inside-avoid">השוכר מתחייב להשתמש במושכר באופן זהיר וסביר, להימנע מלגרום כל נזק, קלקול או אבדן. פרט לבלאי הנובע משימוש סביר, יתקן המשכיר על חשבונו כל נזק קלקול או אבדן שיתרחש במושכר והכל תוך 7 ימים.</li>
            <li className="print:break-inside-avoid">למשכיר ו/או לבא כוחו הזכות להיכנס למושכר בכל עת בתיאום ובמתן התראה של 24 ש' מראש, על מנת לברר אם ממלא השוכר את תנאי חוזה זה ו/או לבצע בו תיקונים על פי שיקול דעתו הבלעדי.</li>
            <li className="print:break-inside-avoid">השוכר מאשר כי במושכר מצוי הריהוט והציוד כמפורט להלן: <B field="inventory" minWidth="min-w-[300px]" /> (להלן "הציוד"). השוכר יהיה אחראי לשלמותו ותקינותו של הציוד.</li>
            <li className="print:break-inside-avoid">מוסכם בזה כי ביצוע כל תשלום המוטל על השוכר על פי חוזה זה במלואו ובמועדו הינו מעיקרי החוזה וכל אי ביצוע או איחור לבצע תשלום כלשהו יהווה הפרה יסודית ועיקרית של החוזה.</li>
            <li className="print:break-inside-avoid">השוכר יהיה חייב בתשלום מלוא דמי השכירות לכל תקופת השכירות גם אם יפסיק או יחדל להשתמש במושכר מכל סיבה שהיא, לפני תום החוזה.</li>
            <li className="print:break-inside-avoid">
              א. עם תום השכירות יפנה השוכר את המושכר ויחזיר את החזקה בו למשכיר כשהוא נקי ופנוי מכל אדם וחפץ שאינם שייכים למשכיר והבית צבוע וללא פגמים (כפי שהתקבל מהמשכיר).<br />
              ב. בנוסף לכל סעד או תרופה העומדים למשכיר הרי שבמידה והשוכר לא יפנה ויחזיר את המושכר במועד ו/או יאחר בתשלום דמי השכירות במועד שניקבע מראש, ישלם למשכיר כפיצוי מוסכם ומוערך מראש סכום של <B field="lateFee" minWidth="min-w-[80px]" money /> ₪ עבור כל יום איחור בפינוי המושכר.
            </li>
            <li className="print:break-inside-avoid">להבטחת מילוי כל התחייבויות השוכר על פי הסכם זה כולל פינוי המושכר במועד, יפקיד השוכר בידי המשכיר שטר בטחון ע"ס <B field="securityDeposit" minWidth="min-w-[100px]" money /> ₪ בחתימתו ובערבות שני ערבים וניתנת בזה הרשאה בלתי חוזרת למשכיר למלא בשטר החוב את מועד הפרעון ופרטים אחרים וזאת מבלי לגרוע מזכות המשכיר לכל סעד נוסף.</li>
            <li className="print:break-inside-avoid">מוסכם ומוצהר בזה כי רק אישור בכתב חתום על ידי המשכיר או מי מהוסמך לכך מטעמו יחשב כאישור או הסכמה מצידו בכל דבר ועניין הקשור במישרין או בעקיפין להסכם זה.</li>
            <li className="print:break-inside-avoid">מוסכם ומוצהר בזה כי כל מעשה או מחדל של המשכיר לרבות אי עמידה על קיום מלוא התחייבות השוכר ו/או אי הפעלת זכויות או סעדים מצד המשכיר או השהייתם לא יחשבו הסכמה ויתור או שינוי הוראות הסכם זה ולא יפגעו בזכות או סעד כלשהם הנתונים למשכיר.</li>
            <li className="print:break-inside-avoid">השוכר לא יהא רשאי לתלות שלטים ודברי פרסומת במושכר אלא בכפוף להסכמה מפורשת ובכתב מצד המשכיר לגבי גודל השלט ומיקומו ותוכנו.</li>
            <li className="print:break-inside-avoid">השוכר חייב להשיג רשיון כחוק במידת הצורך לכל פעולה או עיסוק הקשורים להחזקתו ו/או עיסוקו במושכר.</li>
            <li className="print:break-inside-avoid">כל צד שיפר הסכם זה יהא חייב לשלם לצד השני את מלוא הנזקים וההפסדים שיגרמו לו, ואולם אין באמור בסעיף זה לפגוע בזכותו של המשכיר לדרוש פינויו של השוכר במקרה הפרה.</li>
            <li className="print:break-inside-avoid">הצדדים מצהירים כי כתובותיהם הינן כמפורט בכותרת החוזה וכל הודעה הנישלחת למי מן הצדדים בדואר רשום תחשב כמתקבלת תוך 48 שעות מיום המישלוח.</li>
            <li className="print:break-inside-avoid">
              תנאים נוספים:<br />
              א. <B field="additionalA" minWidth="min-w-[400px]" /><br />
              ב. <B field="additionalB" minWidth="min-w-[400px]" /><br />
              ג. <B field="additionalC" minWidth="min-w-[400px]" /><br />
              ד. <B field="additionalD" minWidth="min-w-[400px]" />
            </li>
          </ol>

          <div className="mt-12 mb-8 font-bold text-lg text-center">ולראיה באו הצדדים על החתום:</div>

          <div className="grid grid-cols-2 mb-16 mt-4 gap-y-12">
            {[formData.landlord1Name, formData.landlord2Name].filter(Boolean).map((name, i) => (
              <div key={`l${i}`} className="text-center min-w-[180px]">
                <div className="mb-16">{i === 0 ? 'המשכיר' : 'המשכיר השני'}</div>
                <div className="border-b border-black w-52 mx-auto"></div>
                <div className="mt-2 text-sm">{name}</div>
              </div>
            ))}
            {[formData.tenant1Name, formData.tenant2Name].filter(Boolean).map((name, i) => (
              <div key={`t${i}`} className="text-center min-w-[180px]">
                <div className="mb-16">{i === 0 ? 'השוכר' : 'השוכר השני'}</div>
                <div className="border-b border-black w-52 mx-auto"></div>
                <div className="mt-2 text-sm">{name}</div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-black pt-8 mt-8">
            <h3 className="text-xl font-bold text-center mb-6">כתב ערבות</h3>
            <p className="mb-6">אנו החתומים מטה ערבים בזה באופן אישי, ביחד ולחוד, לכל התחייבויות השוכר על פי הסכם זה.</p>
            <div className="space-y-8">
              {([
                { label: "ערב מס' 1", num: '1' },
                { label: "ערב מס' 2", num: '2' },
              ] as { label: string; num: '1' | '2' }[]).map(({ label, num }) => {
                const n = (f: string) => `guarantor${num}${f}` as keyof FormData;
                return (
                  <div key={label} className="space-y-4 pr-4 pb-8 print:break-inside-avoid">
                    <div>
                      <span className="font-bold">{label}: </span>
                      שם: <B field={n('Name')} minWidth="min-w-[160px]" />
                      &nbsp;&nbsp; ת.ז: <B field={n('Id')} minWidth="min-w-[110px]" />
                      &nbsp;&nbsp; כתובת: <AddressB prefix={`guarantor${num}`} />
                    </div>
                    <div>טלפון: <B field={n('Phone')} minWidth="min-w-[130px]" /></div>
                    <div className="mt-16 flex justify-end">חתימה: <span className="inline-block border-b border-black min-w-[220px] mr-2">&nbsp;</span></div>
                  </div>
                );
              })}
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

type DatePickerFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onDateChange: (name: keyof FormData, value: string) => void;
};
const DatePickerField = ({ label, name, value, onDateChange }: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parseDate = (str: string): Date | null => {
    if (!str?.match(/^\d{2}-\d{2}-\d{4}$/)) return null;
    const [d, m, y] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const fmt = (date: Date) =>
    `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="flex flex-col relative" ref={ref}>
      <label className="text-sm text-slate-600 font-medium mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="border border-slate-300 rounded px-3 py-2 text-right text-sm flex justify-between items-center bg-white hover:border-blue-400 transition-colors"
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>{value || 'בחר תאריך'}</span>
        <CalendarDays size={16} className="text-slate-400 shrink-0 mr-2" />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 shadow-xl rounded-lg overflow-hidden border border-slate-200" style={{ right: 0 }}>
          <Calendar
            onChange={(val) => { onDateChange(name, fmt(val as Date)); setOpen(false); }}
            value={parseDate(value)}
            locale="he-IL"
          />
        </div>
      )}
    </div>
  );
};

type AutocompleteFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: string[];
  placeholder?: string;
};
const AutocompleteField = ({ label, name, value, onChange, suggestions, placeholder }: AutocompleteFieldProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = value.length >= 1
    ? suggestions.filter(s => s.includes(value)).slice(0, 12)
    : [];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="flex flex-col relative" ref={ref}>
      <label className="text-sm text-slate-600 font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => { onChange(e); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl w-full max-h-48 overflow-y-auto">
          {filtered.map(s => (
            <li key={s}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange({ target: { name, value: s } } as unknown as React.ChangeEvent<HTMLInputElement>);
                setOpen(false);
              }}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Mount
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
