import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  fa: {
    translation: {
      welcome: 'خوش آمدید',
      customers: 'مشتریان',
      add_customer: 'افزودن مشتری',
      add_policy:'اضافه کردن بیمه نامه',
      full_name:'نام و نام خانوادگی',
      name:'نام مشتری',
      phone:'شماره تلفن',
      national_id:'کد ملی',
      birth_date:'تاریخ تولد',
      address:'آدرس',
      policy_count:'تعداد بیمه نامه ها',
      delete:'حذف',
      edit:'ویرایش',
      view_policies:'نمایش بیمه نامه ها',
      save:'ذخیره',
      saving:'ذخیره کردن',
      cancel:'انصراف',
      your_customers:'لیست مشتری ها',
      policy:"بیمه نامه",
      no_policy_found:"هیج بیمه نامه ای یافت نشد",
      type:"نوع",
      start_date:"تاریخ شروع",
      end_date:"تاریخ انقضا",
      payment:"قیمت",
      details:"مشخصات",
      actions:'اقدام',
      edit_policy:'ویرایش بیمه نامه',
      Car:'خودرو',
      Life:'عمر',
      logout:'خروج از حساب',
      home:'خانه',
      signup:'ساخت حساب',
      login:'ورود به حساب',
      // ...other keysذ
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
