import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  // en: {
  //   translation: {
  //     welcome: 'Welcome',
  //     customers: 'Customers',
  //     add_customer: 'Add Customer',
  //     add_policy:'Add Policy',
  //     name:'Name',
  //     full_name:'Full Name',
  //     phone:'Phone',
  //     national_id:'National ID',
  //     birth_date:'Birth Date',
  //     address:'Address',
  //     policy_count:'Policy Count',
  //     delete:'Delete',
  //     edit:'Edit',
  //     edit_policy:'Edit Policy',
  //     view_policies:'View Policies',
  //     save:'Save',
  //     saving:'Saving',
  //     cancel:'Cancel',
  //     your_customers:'Your Cosutomers',
  //     policy:"Policy",
  //     no_policy_found:"No policies found.",
  //     type:"Type",
  //     start_date:"Start Date",
  //     end_date:"End Date",
  //     payment:"Payment",
  //     details:"Details",
  //     actions:"Actions",
  //     car:'Car',
  //     life:'Life',
  //     logout:'Logout',
  //     home:'Home',
  //     signup:'Sign Up',
  //     login:'Login',
  //     // ...other keys
  //   }
  // },
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
      cancel:'کنسل',
      your_customers:'لیست مشتری ها',
      policy:"بیمه نامه",
      no_policy_found:"هیج بیمه نامه ای یافت نشد",
      type:"نوع",
      start_date:"ناریخ شروع",
      end_date:"تاریخ انقضا",
      payment:"قیمت",
      details:"مشخصات",
      actions:'اقدام',
      edit_policy:'ویرایش بیمه نامه',
      car:'خودرو',
      life:'عمر',
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
