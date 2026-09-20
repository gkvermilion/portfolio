import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ru', label: 'RU', name: 'Русский' },
];

const englishMessages = {
    nav: {
      work: 'Work',
      experience: 'Experience',
      about: 'About',
      letsTalk: "Let's talk",
      menu: 'Menu',
      close: 'Close',
      language: 'Language',
    },
    preloader: { loading: 'Loading the work' },
    hero: { name: 'Yarovoy Vadim', role: 'Full Stack Developer' },
    summary: {
      heading: 'More than five years',
      label: 'Developing applications',
      mediaLabel: 'Five year coin rendered in 3D',
      mediaCaption: 'A five year coin rendered as a monochrome 3D object.',
      years: '2021-2026',
      works: 'The works',
    },
    work: { heading: 'Featured work', preview: 'project preview' },
    marquee: { text: 'Strategy / Design / Code / Care / Strategy / Design / Code / Care / Strategy / Design / Code / Care /' },
    about: {
      heading: 'Design and code are tools of expression. What sets the work apart is people.',
      mediaLabel: 'Monochrome 3D streetwear figure',
      mediaCaption: 'A monochrome 3D streetwear figure rendered in the About section.',
      body: 'From strategy to deployment and maintenance, I build meaningful digital experiences for teams that care about the details and the people using them.',
    },
    experience: { heading: 'Experience' },
    footer: {
      menu: 'Menu',
      social: 'Social',
      telephone: 'Telephone',
      email: 'vadim2027@gmail.com',
      locations: [
        { address: 'Ye Lian Street 699', city: 'Shanghai, China', phone: '+7(908)995-94-99' },
        { address: 'Tolstogo 40А', city: 'Vladivostok, Russia', phone: '+56 156 0197 8320' },
        { address: 'Muravskaya 38c1', city: 'Moscow, Russia', phone: '+7(908)995-94-99' },
      ],
    },
    common: {
      loading3d: 'Loading 3D object',
      downloadCv: 'download cv',
      openProject: 'Open project',
      closeProject: 'Close project details',
      home: 'Yarovoy Vadim home',
    },
    ageGate: {
      meta: '18+ project',
      title: 'Are you 18 or older?',
      body: 'This project may contain adult-oriented material. Please confirm your age before continuing.',
      confirm: "I'm 18 or older",
      back: 'Go back',
      close: 'Close age confirmation',
    },
    projects: {
      hentainest: {
        title: 'hentainest.net',
        type: 'Manga Library',
        description: 'HentaiNest is a reading space for adults with support of streaks, ratings, reactions and other tools',
      },
      kolhoziners: { title: 'Kotlovan', type: 'Clothing brand', description: 'Upcycle modern clothing brand from Moscow' },
      finoffice: { title: 'Tabula', type: 'Finance interface', description: 'Excel in 1C. Absolute cinema.' },
      dudinka: { title: 'Dudinka digital port', type: 'Port operations', description: 'A connected operations system that makes the movement of cargo, crews and decisions easier to control.' },
      dreamAds: { title: 'SIBINTEK ITSM', type: 'Campaign system', description: 'A system for managing services, inquiries, and tickets, designed for a vast number of people.' },
      ossig: { title: 'AIS «CDESW»', type: 'Public system', description: 'Automated information system for managing and monitoring the handling of construction, demolition, and excavation waste.' },
      ecpMoscow: { title: 'UDP', type: 'Civic platform', description: 'A comprehensive technological solution or ecosystem that integrates various information systems, services, and databases into a unified collaborative environment.' },
    },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [localeMessages, setLocaleMessages] = useState({ en: englishMessages });

  const changeLanguage = async (nextLanguage) => {
    if (nextLanguage === 'ru' && !localeMessages.ru) {
      const { ruMessages } = await import('./i18n.ru.js');
      setLocaleMessages((current) => ({ ...current, ru: ruMessages }));
    }

    setLanguage(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;

    if (language !== 'ru' || typeof FontFace === 'undefined') return undefined;

    const font = new FontFace(
      'Chiron Sung HK',
      'url(/fonts/ChironSungHK-VariableFont_wght.ttf)',
      { weight: '300 400', style: 'normal', display: 'swap' },
    );
    let active = true;

    font.load().then((loadedFont) => {
      if (active) document.fonts.add(loadedFont);
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: changeLanguage,
    t: (key) => {
      const read = (locale) => key.split('.').reduce((value, part) => value?.[part], locale);
      return read(localeMessages[language]) ?? read(englishMessages) ?? key;
    },
  }), [language, localeMessages]);

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
