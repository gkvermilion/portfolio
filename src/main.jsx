import React, { lazy, StrictMode, Suspense, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import ScrambleHover from '@/components/fancy/text/scramble-hover';
import BreathingText from '@/components/fancy/text/breathing-text';
import Typewriter from '@/components/fancy/text/typewriter';
import MediaBetweenText from '@/components/fancy/blocks/media-between-text';
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity"
import { I18nProvider, SUPPORTED_LANGUAGES, useI18n } from '@/i18n';
import './styles.css';

const AboutModel = lazy(() => import('@/components/about-model'));
const DynastyModel = lazy(() => import('@/components/dynasty-model'));
const CV_URL = 'https://vijbx2zmgnhkafkc.public.blob.vercel-storage.com/Vadim_Yarovoy_CV.pdf';

const downloadCv = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(CV_URL, { mode: 'cors' });
    if (!response.ok) throw new Error(`CV download failed: ${response.status}`);

    const blobUrl = URL.createObjectURL(await response.blob());
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'Vadim_Yarovoy_CV.pdf';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    window.open(CV_URL, '_blank', 'noopener,noreferrer');
  }
};

const projects = [
  {
    id: 'hentainest',
    title: 'hentainest.net',
    type: 'Manga Library',
    year: '2026',
    filter: 'product',
    image: '/media/project-red.svg',
    description: 'HentaiNest is a reading space for adults with support of streaks, ratings, reactions and other tools',
    href: 'https://hentainest.net',
  },
  {
    id: 'kolhoziners',
    title: 'Kotlovan',
    type: 'Clothing brand',
    year: '2026',
    filter: 'product',
    image: '/media/kotlovan.png',
    description: 'Upcycle modern clothing brand from Moscow',
    href: 'https://kolhoziners.ru',
  },
  {
    id: 'finoffice',
    title: 'Tabula',
    type: 'Finance interface',
    year: '2024',
    filter: 'product',
    image: '/media/tabula.png',
    description: 'Excel in 1C. Absolute cinema.',
    href: 'https://finoffice.ru/tabula',
  },
  {
    id: 'dudinka',
    title: 'Dudinka digital port',
    type: 'Port operations',
    year: '2024',
    filter: 'systems',
    image: '/media/port.png',
    description: 'A connected operations system that makes the movement of cargo, crews and decisions easier to control.',
  },
  {
    id: 'dream-ads',
    title: 'SIBINTEK ITSM',
    type: 'Campaign system',
    year: '2023',
    filter: 'archive',
    image: '/media/project-red.svg',
    description: 'A system for managing services, inquiries, and tickets, designed for a vast number of people.',
  },
  {
    id: 'ossig',
    title: 'AIS «CDESW»',
    type: 'Public system',
    year: '2021',
    filter: 'systems',
    image: '/media/DIT-logo.png',
    description: 'Automated information system for managing and monitoring the handling of construction, demolition, and excavation waste.',
  },
  {
    id: 'ecp-moscow',
    title: 'UDP',
    type: 'Civic platform',
    year: '2021',
    filter: 'systems',
    image: '/media/DIT-logo.png',
    description: 'A comprehensive technological solution or ecosystem that integrates various information systems, services, and databases into a unified collaborative environment.',
  },
];

const extras = [
  { title: 'Product', items: ['Product thinking', 'UX direction', 'Design systems', 'Prototyping'] },
  { title: 'Engineering', items: ['React and TypeScript', 'Node.js and APIs', 'Data and integrations', 'Deployment and care'] },
  { title: 'Context', items: ['Public systems', 'Digital culture', 'Commerce', 'Remote collaboration'] },
];

const transitionColumns = [
  [
    '1. One More Time - 5:20', '2. Aerodynamic - 3:27', '3. Digital Love - 4:58', '4. Harder, Better, Faster - 3:45',
    '5. Crescendolls - 3:57', '6. Nightvision - 1:44', '7. Superheroes - 3:57', '8. High Life - 3:22',
    '9. Something About Us - 3:51', '10. Voyager - 3:47', '11. Veridis Quo - 5:44', '12. Short Circuit - 3:26',
    '13. Face to Face - 3:58', '14. Too Long - 10:00',
  ],
  [
    '01. REACT / TYPESCRIPT', '02. NEXT.JS / NODE.JS', '03. ANGULAR / NGRX', '04. JAVA / SPRING BOOT',
    '05. GO / PYTHON', '06. FASTAPI / DJANGO', '07. POSTGRESQL / REDIS', '08. MONGODB / MS SQL',
    '09. DOCKER / KUBERNETES', '10. AWS / VERCEL', '11. CI / CD', '12. GITHUB ACTIONS',
    '13. REST / GRAPHQL', '14. MCP / AI WORKFLOWS',
  ],
  [
    '01. DIGITAL PORT DUDINKA', '02. FINOFFICE / TABULA', '03. HENTAINEST.NET', '04. KOLHOZINERS.RU',
    '05. АИС ОССИГ', '06. ЕЦП МОСКВА', '07. DREAM PRODUCT ADS', '08. PORT OPERATIONS',
    '09. CIVIC PLATFORM', '10. PRODUCT SYSTEMS', '11. PUBLIC WORKFLOWS', '12. SELECTED ARCHIVE',
    '13. SHANGHAI / CHINA', '14. MOSCOW / RUSSIA',
  ],
  [
    'TO THINE OWN SELF BE TRUE', 'ALL THE WORLD IS A STAGE', 'TO BE OR NOT TO BE', 'WE KNOW WHAT WE ARE',
    'KNOWLEDGE AND HUMAN POWER', 'LIFE IS SHORT / ART IS LONG', 'I THINK THEREFORE I AM', 'ACTA NON VERBA',
    'FESTINA LENTE', 'MAKE THE INVISIBLE VISIBLE', 'FORTUNE FAVOURS THE BOLD', 'THE ART IS LONG',
    'BUILD / TEST / SHIP', 'YAROVOY VADIM / FULL STACK',
  ],
];

function shuffle(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

const transitionItems = shuffle(
  transitionColumns.flatMap((lines) => lines.map((text) => text.replace(/^\d+\.\s*/, '')))
).map((text, position) => ({
  id: `transition-${position}`,
  text: `${String(Math.floor(Math.random() * 98) + 1).padStart(2, '0')}. ${text}`,
  column: position % 4,
  row: Math.floor(position / 4),
  x: `${Math.round(Math.random() * 30 - 15)}px`,
  y: `${Math.round(Math.random() * 8 - 4)}px`,
}));

const adultScrambleCharacters = '$%#*@?!&';

function scrambleVisibleText(text) {
  return Array.from(text, (character) => {
    if (/\s/.test(character)) return character;
    return adultScrambleCharacters[Math.floor(Math.random() * adultScrambleCharacters.length)];
  }).join('');
}

function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [locked]);
}

const ScrambleIn = forwardRef(function ScrambleIn({
  text,
  scrambleSpeed = 42,
  scrambledLetterCount = 4,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+',
  className = '',
  scrambledClassName = '',
  autoStart = true,
  delay = 0,
  onComplete,
}, ref) {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleLetterCount, setVisibleLetterCount] = useState(0);

  const start = useCallback(() => {
    setDisplayText('');
    setVisibleLetterCount(0);
    setIsAnimating(true);
  }, []);

  const reset = useCallback(() => {
    setDisplayText('');
    setVisibleLetterCount(0);
    setIsAnimating(false);
  }, []);

  useImperativeHandle(ref, () => ({ start, reset }), [reset, start]);

  useEffect(() => {
    if (!autoStart) return undefined;
    const timer = window.setTimeout(start, delay);
    return () => window.clearTimeout(timer);
  }, [autoStart, delay, start]);

  useEffect(() => {
    if (!isAnimating) return undefined;

    const interval = window.setInterval(() => {
      setVisibleLetterCount((current) => {
        const next = current + 1;
        const visible = text.slice(0, Math.min(next, text.length));
        const scrambleCount = Math.min(scrambledLetterCount, Math.max(0, text.length - next));
        const scrambled = Array.from({ length: scrambleCount }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        setDisplayText(visible + scrambled);

        if (next >= text.length) {
          window.clearInterval(interval);
          setIsAnimating(false);
          window.setTimeout(() => onComplete?.(), scrambleSpeed * 1.5);
        }

        return next;
      });
    }, scrambleSpeed);

    return () => window.clearInterval(interval);
  }, [characters, isAnimating, onComplete, scrambleSpeed, scrambledLetterCount, text]);

  const revealed = displayText.slice(0, Math.min(visibleLetterCount, text.length));
  const scrambled = displayText.slice(revealed.length);

  return (
    <span className="scramble-in">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true"><span className={className}>{revealed}</span><span className={scrambledClassName}>{scrambled}</span></span>
    </span>
  );
});

function ContinuousScramble({ text }) {
  const [reduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [displayText, setDisplayText] = useState(() => reduceMotion ? text : scrambleVisibleText(text));

  useEffect(() => {
    if (reduceMotion) return undefined;
    const interval = window.setInterval(() => setDisplayText(scrambleVisibleText(text)), 120);
    return () => window.clearInterval(interval);
  }, [reduceMotion, text]);

  return (
    <span className="continuous-scramble">
      <span className="sr-only">18+ project: {text}</span>
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}

function Preloader() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(true);
  const [captionReady, setCaptionReady] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(() => typeof window !== 'undefined' && window.__heroVideoReady === true);
  const [isFlooding, setIsFlooding] = useState(false);
  const scrambleRefs = useRef([]);

  useEffect(() => {
    const handleHeroVideoReady = () => setHeroVideoReady(true);
    window.addEventListener('hero-video-ready', handleHeroVideoReady);
    if (window.__heroVideoReady) handleHeroVideoReady();
    return () => window.removeEventListener('hero-video-ready', handleHeroVideoReady);
  }, []);

  useEffect(() => {
    if (introComplete && heroVideoReady) setIsFlooding(true);
  }, [heroVideoReady, introComplete]);

  useEffect(() => {
    if (!isFlooding) return undefined;

    const lineTimers = transitionItems.map((item) => window.setTimeout(() => {
      scrambleRefs.current[item.id]?.start();
    }, item.row * 58 + item.column * 16));
    const exitTimer = window.setTimeout(() => setVisible(false), 2150);

    return () => {
      lineTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(exitTimer);
    };
  }, [isFlooding]);

  return (
    <div className={`preloader ${visible ? 'is-visible' : 'is-hidden'} ${isFlooding ? 'is-flooding' : ''}`} aria-hidden={!visible}>
      <div className="preloader-intro">
        <h1 className="preloader-mark" aria-label={`${t('hero.name')}, ${t('hero.role')}`}>
          <span>
            <span className="hero-title-emoji" aria-hidden="true">🔶</span>
            <ScrambleIn
              text={t('hero.name')}
              scrambleSpeed={54}
              scrambledLetterCount={3}
              className="preloader-revealed"
              scrambledClassName="preloader-scrambled"
            />
          </span>
          <span>
            <ScrambleIn
              text={t('hero.role')}
              scrambleSpeed={54}
              scrambledLetterCount={3}
              className="preloader-revealed"
              scrambledClassName="preloader-scrambled"
              onComplete={() => setCaptionReady(true)}
            />
            <span className="hero-title-emoji" aria-hidden="true">🍺</span>
          </span>
        </h1>
        {captionReady && (
          <span className="preloader-caption">
            <ScrambleIn
              text={t('preloader.loading')}
              scrambleSpeed={36}
              scrambledLetterCount={5}
              className="preloader-revealed"
              scrambledClassName="preloader-scrambled"
              onComplete={() => setIntroComplete(true)}
            />
          </span>
        )}
      </div>
      {isFlooding && (
        <div className="preloader-flood" aria-hidden="true">
          {Array.from({ length: 4 }, (_, column) => (
            <div className="preloader-column" key={column}>
              {transitionItems.filter((item) => item.column === column).map((item) => (
                <span className="flood-word" key={item.id} style={{ '--word-x': item.x, '--word-y': item.y }}>
                  <ScrambleIn
                    ref={(element) => { scrambleRefs.current[item.id] = element; }}
                    text={item.text}
                    autoStart={false}
                    scrambleSpeed={25}
                    scrambledLetterCount={5}
                    className="flood-revealed"
                    scrambledClassName="flood-scrambled"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  const { language, setLanguage, t } = useI18n();
  const closeButton = useRef(null);
  const menuButton = useRef(null);
  const [isOnLightSurface, setIsOnLightSurface] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    window.setTimeout(() => menuButton.current?.focus({ preventScroll: true }), 80);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const focusTimer = window.setTimeout(() => closeButton.current?.focus(), 80);
    return () => window.clearTimeout(focusTimer);
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setMenuOpen]);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setIsOnLightSurface(!entry.isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px', threshold: 0 });

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={`site-header ${isOnLightSurface ? 'is-on-light-surface' : ''}`}>
        <a className="wordmark" href="#top" aria-label={t('common.home')}>
          <ScrambleHover text="Yarovoy Vadim" />
        </a>
        <nav className="desktop-nav" aria-label={t('nav.work')}>
          <a href="#work"><ScrambleHover text={t('nav.work')} /></a><span aria-hidden="true">,</span>
          <a href="#experience"><ScrambleHover text={t('nav.experience')} /></a>
        </nav>
        <label className="language-switcher desktop-language">
          <span className="sr-only">{t('nav.language')}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('nav.language')}>
            {SUPPORTED_LANGUAGES.map(({ code, label, name }) => <option key={code} value={code}>{label} · {name}</option>)}
          </select>
          <span aria-hidden="true">↗</span>
        </label>
        <a className="talk-link" href="#contact"><ScrambleHover text={t('nav.letsTalk')} /></a>
        <button
          ref={menuButton}
          className="menu-trigger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => {
            setMenuOpen(true);
            window.setTimeout(() => closeButton.current?.focus(), 80);
          }}
        ><ScrambleHover text={t('nav.menu')} /></button>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} id="mobile-menu" aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <div className="mobile-menu-top">
            <span>Yarovoy Vadim</span>
            <button ref={closeButton} type="button" onClick={closeMenu}><ScrambleHover text={t('nav.close')} /></button>
          </div>
          <nav className="mobile-nav" aria-label={t('nav.menu')}>
            <a href="#work" onClick={closeMenu}><ScrambleHover text={t('nav.work')} /></a>
            <a href="#experience" onClick={closeMenu}><ScrambleHover text={t('nav.experience')} /></a>
            <a href="#about" onClick={closeMenu}><ScrambleHover text={t('nav.about')} /></a>
            <a href="#contact" onClick={closeMenu}><ScrambleHover text={t('nav.letsTalk')} /></a>
          </nav>
          <div className="mobile-menu-bottom">
            <label className="language-switcher mobile-language">
              <span className="sr-only">{t('nav.language')}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('nav.language')}>
                {SUPPORTED_LANGUAGES.map(({ code, label, name }) => <option key={code} value={code}>{label} · {name}</option>)}
              </select>
              <span aria-hidden="true">↗</span>
            </label>
            <span>31.17612 / 121.27122</span>
          </div>
        </div>
      </div>
    </>
  );
}

function Hero() {
  const { t } = useI18n();
  const [reduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const markHeroVideoReady = useCallback(() => {
    if (typeof window === 'undefined' || window.__heroVideoReady) return;
    window.__heroVideoReady = true;
    window.dispatchEvent(new Event('hero-video-ready'));
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-visual" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero-still.svg"
          onLoadedData={markHeroVideoReady}
          onError={markHeroVideoReady}
        >
          <source src="https://vijbx2zmgnhkafkc.public.blob.vercel-storage.com/hf_20260918_180211_7598e3ae-e173-4758-8c76-5d731306d79a.mp4" type="video/mp4" />
        </video>
        <div className="hero-noise" />
      </div>
      <div className="hero-meta">
      </div>
      <div className="hero-title-wrap">
        <h1 id="hero-title">
          <span className="hero-title-line">
            <span className="hero-title-emoji" aria-hidden="true">🔶</span>
            {reduceMotion ? t('hero.name') : (
              <ScrambleIn text={t('hero.name')} scrambleSpeed={42} scrambledLetterCount={4} />
            )}
          </span>
          <span className="hero-title-line">
            {reduceMotion ? t('hero.role') : (
              <ScrambleIn text={t('hero.role')} scrambleSpeed={42} scrambledLetterCount={4} delay={180} />
            )}
            {' '}<span className="hero-title-emoji" aria-hidden="true">🍺</span>
          </span>
        </h1>
      </div>
    </section>
  );
}

function Summary() {
  const { t } = useI18n();
  const summaryRef = useRef(null);

  return (
    <section ref={summaryRef} className="summary section-grid" aria-labelledby="summary-title">
      <div className="summary-title">
        <h2 id="summary-title">{t('summary.heading')}</h2>
      </div>
      <div className="summary-copy">
        <p className="summary-label">{t('summary.label')}</p>
      </div>
      <figure className="summary-media media-frame" aria-label={t('summary.mediaLabel')}>
        <Suspense fallback={<span className="model-loading-placeholder" aria-hidden="true">{t('common.loading3d')}</span>}>
          <DynastyModel scrollTarget={summaryRef} />
        </Suspense>
        <figcaption className="sr-only">{t('summary.mediaCaption')}</figcaption>
      </figure>
      <div className="summary-caption"><span>{t('summary.years')}</span></div>
      <a className="summary-link line-link" href="#work"><ScrambleHover text={t('summary.works')} /><span className="link-arrow" aria-hidden="true">→</span></a>
    </section>
  );
}

function splitProjectTitle(title) {
  const words = title.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  return [`${words.slice(0, midpoint).join(' ')} `, words.slice(midpoint).join(' ')];
}

function ProjectRow({ project, onOpen }) {
  const { t } = useI18n();
  const isAdultProject = project.id === 'hentainest';
  const mediaRef = useRef(null);
  const projectCopyKey = project.id === 'dream-ads' ? 'dreamAds' : project.id === 'ecp-moscow' ? 'ecpMoscow' : project.id;
  const projectTitle = t(`projects.${projectCopyKey}.title`) || project.title;
  const [firstText, secondText] = splitProjectTitle(projectTitle);

  return (
    <li className="project-row">
      <button
        type="button"
        className="project-button"
        onClick={() => onOpen(project)}
        onFocus={() => !isAdultProject && mediaRef.current?.animate()}
        onBlur={() => !isAdultProject && mediaRef.current?.reset()}
      >
        {isAdultProject ? <ContinuousScramble text={projectTitle} /> : (
          <MediaBetweenText
            ref={mediaRef}
            firstText={firstText}
            secondText={secondText}
            mediaUrl={project.image}
            mediaType="image"
            triggerType="hover"
            as="span"
            className="project-media-between"
            mediaContainerClassName="project-between-media"
            leftTextClassName="project-name-part"
            rightTextClassName="project-name-part"
            scrambleOnHover
            alt={`${projectTitle} ${t('work.preview')}`}
          />
        )}
      </button>
    </li>
  );
}

function FeaturedWork({ onOpen }) {
  const { t } = useI18n();
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="section-grid section-heading">
        <h2 id="work-title">{t('work.heading')}</h2>
      </div>
      <ol className="project-list">
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} onOpen={onOpen} />
        ))}
      </ol>
    </section>
  );
}

function Marquee() {
  const { t } = useI18n();
  return (
    <div className="marquee" aria-label={t('marquee.text')}>
      <div className="marquee-track" aria-hidden="true">
        <span>{t('marquee.text')}</span>
      </div>
    </div>
  );
}

function About() {
  const { t } = useI18n();
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-statement">
        <h2 id="about-title">{t('about.heading')}</h2>
      </div>
      <div className="about-lower section-grid">
        <figure className="about-media media-frame" aria-label={t('about.mediaLabel')}>
          <Suspense fallback={<span className="model-loading-placeholder" aria-hidden="true">{t('common.loading3d')}</span>}>
            <AboutModel />
          </Suspense>
          <figcaption className="sr-only">{t('about.mediaCaption')}</figcaption>
        </figure>
        <div className="about-copy">
          <p>{t('about.body')}</p>
          <a className="line-link" href="#experience"><ScrambleHover text={t('nav.experience')} /><span className="link-arrow" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}

function Extras() {
  const { t } = useI18n();
  const gravityRef = useRef(null);
  const gravityDemoRef = useRef(null);

  useEffect(() => {
    const gravityDemo = gravityDemoRef.current;
    const gravity = gravityRef.current;
    if (!gravityDemo || !gravity) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      gravity.start();
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(gravityDemo);
    return () => observer.disconnect();
  }, []);

  const gravityTechnologies = [
    { name: 'react', color: 'blue', x: '30%', y: '10%' },
    { name: 'typescript', color: 'pink', x: '30%', y: '30%' },
    { name: 'motion', color: 'teal', x: '40%', y: '20%', angle: 10 },
    { name: 'tailwind', color: 'coral', x: '75%', y: '10%' },
    { name: 'nodejs', color: 'green', x: '15%', y: '12%', angle: -8 },
    { name: 'nestjs', color: 'violet', x: '60%', y: '12%', angle: 7 },
    { name: 'next', color: 'black', x: '85%', y: '16%' },
    { name: 'go', color: 'mint', x: '12%', y: '35%', angle: 8 },
    { name: 'java', color: 'orange', x: '68%', y: '30%', angle: -6 },
    { name: 'springboot', color: 'green-dark', x: '48%', y: '8%' },
    { name: 'redux', color: 'purple', x: '88%', y: '36%', angle: 5 },
    { name: 'redis', color: 'coral', x: '22%', y: '20%', angle: -10 },
    { name: 'postgresql', color: 'navy', x: '55%', y: '28%' },
    { name: '1C', color: 'yellow', x: '42%', y: '35%', angle: 6 },
    { name: 'python', color: 'blue-soft', x: '78%', y: '25%', angle: -5 },
    { name: 'docker', color: 'indigo', x: '8%', y: '22%', angle: 10 },
  ];

  return (
    <section className="extras-section" id="experience" aria-labelledby="extras-title">
      <div className="extras-intro">
        <h2 id="extras-title">{t('experience.heading')} <span>(16)</span></h2>
      </div>
      <div ref={gravityDemoRef} className="gravity-demo">
        <div className="gravity-download-stage">
          <a
            className="gravity-download-link"
            href={CV_URL}
            download="Vadim_Yarovoy_CV.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={downloadCv}
            aria-label={t('common.downloadCv')}
          >
            <BreathingText
              as="span"
              className="gravity-download-text"
              staggerDuration={0.08}
              fromFontVariationSettings="'wght' 100, 'slnt' 0"
              toFontVariationSettings="'wght' 800, 'slnt' -10"
            >
              {t('common.downloadCv')}
            </BreathingText>
          </a>
        </div>
        <Gravity ref={gravityRef} autoStart={false} gravity={{ x: 0, y: 1 }} className="gravity-canvas">
              {gravityTechnologies.map(({ name, color, x, y, angle }) => (
                <MatterBody
                  key={name}
                  className="gravity-body"
                  matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
                  x={x}
                  y={y}
                  angle={angle}
                >
                  <div className={`gravity-chip gravity-chip-${color}`}>
                    {name}
                  </div>
                </MatterBody>
              ))}
            </Gravity>
          </div>
    </section>
  );
}

function useSyncedFooterLocation() {
  const { t } = useI18n();
  const footerLocations = t('footer.locations');
  const [locationIndex, setLocationIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [phase, setPhase] = useState('typing');
  const location = footerLocations[locationIndex];
  const longestTextLength = Math.max(
    location.address.length,
    location.city.length,
    location.phone.length,
  );

  useEffect(() => {
    let timer;

    if (phase === 'typing') {
      if (characterIndex < longestTextLength) {
        timer = window.setTimeout(() => setCharacterIndex((value) => value + 1), 42);
      } else {
        timer = window.setTimeout(() => setPhase('holding'), 0);
      }
    } else if (phase === 'holding') {
      timer = window.setTimeout(() => setPhase('deleting'), 3000);
    } else if (phase === 'deleting') {
      if (characterIndex > 0) {
        timer = window.setTimeout(() => setCharacterIndex((value) => value - 1), 28);
      } else {
        timer = window.setTimeout(() => setPhase('restarting'), 0);
      }
    } else {
      timer = window.setTimeout(() => {
        setLocationIndex((value) => (value + 1) % footerLocations.length);
        setPhase('typing');
      }, 500);
    }

    return () => window.clearTimeout(timer);
  }, [characterIndex, footerLocations.length, longestTextLength, phase]);

  return {
    address: location.address.slice(0, characterIndex),
    city: location.city.slice(0, characterIndex),
    phone: location.phone.slice(0, characterIndex),
  };
}

function Footer() {
  const { t } = useI18n();
  const { address, city, phone } = useSyncedFooterLocation();

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-links section-grid">
        <div><h2>{t('footer.menu')}</h2><a href="#work"><ScrambleHover text={t('nav.work')} /></a><a href="#experience"><ScrambleHover text={t('nav.experience')} /></a><a href="#contact"><ScrambleHover text={t('nav.letsTalk')} /></a></div>
        <div><h2>{t('footer.social')}</h2><a href="https://wa.me/79089959499" target="_blank" rel="noreferrer"><ScrambleHover text="WhatsApp" /> <span aria-hidden="true">↗</span></a><a href="https://t.me/yarovoyvv" target="_blank" rel="noreferrer"><ScrambleHover text="Telegram" /> <span aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/vadim-yarovoy-17a3a9322" target="_blank" rel="noreferrer"><ScrambleHover text="LinkedIn" /> <span aria-hidden="true">↗</span></a><a href="https://github.com/gkvermilion" target="_blank" rel="noreferrer"><ScrambleHover text="GitHub" /> <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="footer-poster" aria-label={`${address}, ${city}. ${t('footer.telephone')} ${phone}. ${t('footer.email')}.`}>
        <span className="footer-poster-line footer-poster-large">{address}</span>
        <span className="footer-poster-line footer-poster-city">{city}</span>
        <span className="footer-poster-line footer-poster-contact"><span>{t('footer.telephone')} <span className="footer-poster-phone">{phone}</span></span><span className="footer-poster-separator">/</span><span className="footer-poster-email">{t('footer.email')}</span></span>
        <Typewriter
          as="span"
          className="footer-poster-line footer-poster-coords"
          text={["31.17612 / 121.27122 ◆ ©2026", ""]}
          speed={38}
          deleteSpeed={24}
          waitTime={3000}
          restartDelay={500}
          initialDelay={700}
          showCursor={false}
        />
      </div>
    </footer>
  );
}

function ProjectModal({ project, onClose }) {
  const { t } = useI18n();
  const [adultConfirmed, setAdultConfirmed] = useState(false);

  useEffect(() => {
    if (!project) return undefined;
    setAdultConfirmed(false);
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;
  const projectCopyKey = project.id === 'dream-ads' ? 'dreamAds' : project.id === 'ecp-moscow' ? 'ecpMoscow' : project.id;
  const projectCopy = t(`projects.${projectCopyKey}`) || {};
  const projectTitle = projectCopy.title || project.title;

  if (project.id === 'hentainest' && !adultConfirmed) {
    return (
      <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
        <section className="project-modal age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-copy">
          <button className="modal-close" type="button" onClick={onClose} aria-label={t('ageGate.close')}><ScrambleHover text={t('nav.close')} /> <span aria-hidden="true">×</span></button>
          <div className="age-gate-copy">
            <p className="modal-meta">{t('ageGate.meta')}</p>
            <h2 id="age-gate-title">{t('ageGate.title')}</h2>
            <p id="age-gate-copy">{t('ageGate.body')}</p>
            <div className="age-gate-actions">
              <button type="button" className="line-link" onClick={() => setAdultConfirmed(true)}><ScrambleHover text={t('ageGate.confirm')} /><span className="link-arrow" aria-hidden="true">→</span></button>
              <button type="button" className="age-gate-back" onClick={onClose}><ScrambleHover text={t('ageGate.back')} /></button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label={t('common.closeProject')}><ScrambleHover text={t('nav.close')} /> <span aria-hidden="true">×</span></button>
        <div className="modal-grid">
          <figure className={`modal-media media-frame ${project.image === '/media/DIT-logo.png' ? 'modal-media-logo' : ''}`}>
            <img src={project.image} alt={`${projectTitle} logo`} />
          </figure>
          <div className="modal-copy">
            <p className="modal-meta">{projectCopy.type || project.type} / {project.year}</p>
            <h2 id="modal-title">{projectTitle}</h2>
            <p>{projectCopy.description || project.description}</p>
            {project.href && <a className="modal-link line-link" href={project.href} target="_blank" rel="noreferrer"><ScrambleHover text={t('common.openProject')} /><span className="link-arrow" aria-hidden="true">↗</span></a>}
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useBodyLock(menuOpen || Boolean(selectedProject));

  return (
    <>
      <Preloader />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <Summary />
        <FeaturedWork onOpen={setSelectedProject} />
        <Marquee />
        <About />
        <Extras />
      </main>
      <Footer />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <Analytics />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
