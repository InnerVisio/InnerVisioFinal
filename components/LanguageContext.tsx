import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'cs' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Attempt local storage recall
    try {
      const stored = localStorage.getItem('language');
      if (stored === 'cs' || stored === 'en') {
        return stored;
      }
    } catch (e) {}
    return 'cs'; // Default to Czech
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {}
  };

  // Standard dictionary translations for general labels
  const dictionary: Record<Language, Record<string, any>> = {
    cs: {
      // Navbar
      startProject: "Zahájit projekt",
      servicesLabel: "Služby",
      workLabel: "Práce",
      pricingLabel: "Ceník",
      faqLabel: "FAQ",
      logoSub: "Architecture",

      // Hero Section
      heroTitle1: "Navrhujeme",
      heroTitle2: "Nepředstavitelné",
      heroSub: "Přinášíme prezentaci nemovitostí na nové úrovni. Zvyšte svou úroveň prezentace skrze světlo, emoce a profesionální vizuál.",
      heroExploreBtn: "Prozkoumat portfolio",
      heroContactBtn: "Kontaktovat studio",
      infoNewProjects: "Máme prostor pro nové zakázky",
      infoFastDelivery: "Rychlá doba dodání",
      infoModernPres: "Moderní prezentace",

      // Stats
      statsProjects: "Dokončených projektů",
      statsSatisfied: "Spokojených klientů",
      statsResponse: "Rychlost odezvy",

      // Slides
      slideTitle1: "Prezentační Weby s Vizualizací",
      slideLoc1: "Komplexní řešení",
      slideStat1: "Top Služba",
      slideTitle2: "Developerské Projekty",
      slideLoc2: "Praha, ČR",
      slideStat2: "Ve výstavbě",
      slideTitle3: "Moderní Rodinné Domy",
      slideLoc3: "ČR",
      slideStat3: "Koncept",
      slideTitle4: "Nadčasová Architektura",
      slideLoc4: "ČR",
      slideStat4: "Nové",

      // Services UI
      servicesTitle: "Služby",
      servicesSubtitle: "Služby Studia",
      servicesDesc: "Kompletní škála vizualizačních služeb pro architekty, developery, designéry i soukromé klienty.",
      serviceBackBtn: "Zpět na přehled služeb",
      serviceDetailsTitle: "Popis služby",
      serviceAdvantages: "Hlavní výhody",
      serviceInquiryBtn: "Nezávazně poptat tuto službu",
      ourExpertise: "Naše Odbornost",
      ourExpertiseDesc: "Spojujeme uměleckou vizi s technickou precizností. Naše špičkové architektonické vizualizace exteriéru i interiéru pomáhají prezentovat reality v městech jako Praha, Ostrava, Havířov a po celé České republice.",

      // Portfolio Section
      portfolioTitle: "Naše Práce",
      portfolioSubtitle: "Ukázky realizací",
      portfolioDesc: "Prohlédněte si naše vybrané projekty. Od detailních návrhů interiérů po rozsáhlé exteriérové vizualizace developerských projektů.",
      portfolioCatAll: "Vše",
      portfolioCatExterier: "Exteriér",
      portfolioCatInterier: "Interiér",
      portfolioCloseBtn: "Zavřít",
      portfolioLocationLabel: "Lokalita",
      portfolioCategoryLabel: "Kategorie",
      portfolioContactBtn: "Kontaktujte nás",

      // Pricing Section
      pricingTitle: "Ceník",
      pricingSubtitle: "Přehledné Ceny",
      pricingDesc: "Ceny jsou orientační a závisí na složitosti projektu a dodaných podkladech. Kontaktujte nás pro individuální kalkulaci.",
      pricingPopular: "Populární",
      currencyUnit: "Kč",
      fromLabel: "od",

      // FAQ Section
      faqHeaderLabel: "Máte dotazy?",
      faqTitle: "Časté",
      faqTitleSpan: "Dotazy (FAQ)",
      faqSub: "Zde najdete odpovědi na nejčastější otázky ohledně průběhu tvorby 3D vizualizací, potřebných podkladů i struktury našich cen.",
      faqTabAll: "Všechny dotazy",
      faqTabProcess: "Průběh & Spolupráce",
      faqTabPricing: "Ceny & Termíny",
      faqFreeQuoteTitle: "Nezávazná nabídka zdarma",
      faqFreeQuoteDesc: "Zaslání a nacenění podkladů je plně zdarma a k ničemu vás nezavazuje. Ozveme se do 24 hodin.",
      faqDeadlinesTitle: "Dodržení termínů",
      faqDeadlinesDesc: "Časový plán, který si sjednáme na začátku spolupráce, je pro nás svatý a podléhá záruce.",
      faqQualityTitle: "Vysoká kvalita (4K+)",
      faqQualityDesc: "Standardně dodáváme výstupy v ultravysokém rozlišení s citlivou postprodukcí.",

      // Contact Section
      contactSubtitle: "Spojte se s námi",
      contactTitleMain: "Jste připraveni vizualizovat",
      contactTitleSub: "své další",
      contactTitleSpan: "mistrovské dílo?",
      contactDesc: "Ať už máte jasnou představu nebo teprve hledáte inspiraci, rádi vám pomůžeme přenést vaše nápady do reality. Zanechte nám zprávu a my se vám brzy ozveme.",
      formName: "Jméno",
      formEmail: "Email",
      formSubject: "Předmět",
      formInquiry: "Poptávám",
      formInquiryPlaceholder: "Vyberte z možností...",
      formMessage: "Zpráva",
      formMessagePlaceholder: "Popište nám svůj projekt...",
      formSubmitBtn: "Odeslat zprávu",
      formSuccessTitle: "Zpráva odeslána!",
      formSuccessDesc: "Děkujeme za váš zájem. Ozveme se vám co nejdříve.",
      dropdownWarning: "Prosím, vyberte co poptáváte z nabídky 'Poptávám'.",
      contactContactName: "Kontakt",

      // Footer & Modals
      footerTitle: "InnerVisio",
      footerDesc: "Profesionální 3D vizualizace a weby s konfigurátorem, které přemění vaše nápady v dechberoucí realitu.",
      footerQuickLinks: "Rychlé odkazy",
      footerLegal: "Právní náležitosti",
      footerContact: "Kontakt",
      footerRights: "Všechna práva vyhrazena.",
      privacyPolicy: "Zásady ochrany osobních údajů",
      termsOfService: "Všeobecné obchodní podmínky",
      cookieBannerText: "Tento web používá soubory cookies k poskytování co nejlepších služeb a analýze návštěvnosti.",
      cookieAccept: "Přijmout vše",
      cookieDecline: "Odmítnout",
    },
    en: {
      // Navbar
      startProject: "Start project",
      servicesLabel: "Services",
      workLabel: "Work",
      pricingLabel: "Pricing",
      faqLabel: "FAQ",
      logoSub: "Architecture",

      // Hero Section
      heroTitle1: "We Design",
      heroTitle2: "The Unimaginable",
      heroSub: "Elevate property presentations to the next level. Maximize presentation value through masterfully rendered light, emotions, and professional visuals.",
      heroExploreBtn: "Explore portfolio",
      heroContactBtn: "Contact studio",
      infoNewProjects: "Open for new commissions",
      infoFastDelivery: "Fast turnaround time",
      infoModernPres: "Modern presentation",

      // Stats
      statsProjects: "Completed projects",
      statsSatisfied: "Satisfied clients",
      statsResponse: "Response speed",

      // Slides
      slideTitle1: "Presentation Websites with Visualizations",
      slideLoc1: "Comprehensive solutions",
      slideStat1: "Top Service",
      slideTitle2: "Developer Projects",
      slideLoc2: "Prague, CZ",
      slideStat2: "Under construction",
      slideTitle3: "Modern Family Houses",
      slideLoc3: "CZ",
      slideStat3: "Concept",
      slideTitle4: "Timeless Architecture",
      slideLoc4: "CZ",
      slideStat4: "New",

      // Services UI
      servicesTitle: "Services",
      servicesSubtitle: "Studio Services",
      servicesDesc: "Full range of physical & digital architectural visualization services for developers, architects, and private clients.",
      serviceBackBtn: "Back to services overview",
      serviceDetailsTitle: "Service Details",
      serviceAdvantages: "Key Advantages",
      serviceInquiryBtn: "Inquire about this service",
      ourExpertise: "Our Expertise",
      ourExpertiseDesc: "We blend artistic vision with technical precision. Our high-end architectural exterior and interior visualizations help showcase property in cities like Prague, Ostrava, Havirov, and all over the Czech Republic.",

      // Portfolio Section
      portfolioTitle: "Our Work",
      portfolioSubtitle: "Project Showcases",
      portfolioDesc: "Browse through our selected works. From detailed modern interior schemes to large-scale exterior visualizations for developments.",
      portfolioCatAll: "All",
      portfolioCatExterier: "Exterior",
      portfolioCatInterier: "Interior",
      portfolioCloseBtn: "Close",
      portfolioLocationLabel: "Location",
      portfolioCategoryLabel: "Category",
      portfolioContactBtn: "Contact us",

      // Pricing Section
      pricingTitle: "Pricing",
      pricingSubtitle: "Transparent Rates",
      pricingDesc: "Prices are introductory guidelines depending on project complexity and provided data quality. Contact us for a personalized, exact quotation.",
      pricingPopular: "Popular",
      currencyUnit: "CZK",
      fromLabel: "from",

      // FAQ Section
      faqHeaderLabel: "Any questions?",
      faqTitle: "Frequently",
      faqTitleSpan: "Asked Questions (FAQ)",
      faqSub: "Here you will find detailed answers regarding the timeline of 3D visualization creations, necessary assets, and our pricing structures.",
      faqTabAll: "All questions",
      faqTabProcess: "Process & Cooperation",
      faqTabPricing: "Pricing & Timelines",
      faqFreeQuoteTitle: "Free No-obligation Offer",
      faqFreeQuoteDesc: "Evaluating your blueprints and sending code estimates is fully free. We usually respond within 24 hours.",
      faqDeadlinesTitle: "Absolute Deadlines",
      faqDeadlinesDesc: "The launch schedule we contract on day one is set in stone and fully guaranteed.",
      faqQualityTitle: "Ultra-High Quality (4K+)",
      faqQualityDesc: "All standard visual delivery assets are exported in high-res 4K, fine-tuned with precision color post-production.",

      // Contact Section
      contactSubtitle: "Get in touch",
      contactTitleMain: "Are you ready to visualize",
      contactTitleSub: "your next",
      contactTitleSpan: "masterpiece?",
      contactDesc: "Whether you have a fully formed vision or seek early design advice, we are ready to build it into photoreal formats. Share a message and we'll reply promptly.",
      formName: "Name",
      formEmail: "Email",
      formSubject: "Subject",
      formInquiry: "Interested in",
      formInquiryPlaceholder: "Select from options...",
      formMessage: "Message",
      formMessagePlaceholder: "Tell us about your project...",
      formSubmitBtn: "Send message",
      formSuccessTitle: "Message Sent!",
      formSuccessDesc: "Thank you for your interest! We will get back to you as soon as possible.",
      dropdownWarning: "Please choose what you are inquiring about from the 'Interested in' menu.",
      contactContactName: "Contact Person",

      // Footer & Modals
      footerTitle: "InnerVisio",
      footerDesc: "Premium 3D architectural renders and custom web configurators turning ideas into breathtaking realities.",
      footerQuickLinks: "Quick links",
      footerLegal: "Legal guidelines",
      footerContact: "Contact",
      footerRights: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      cookieBannerText: "This website uses cookies to configure user preferences and analyze traffic metrics.",
      cookieAccept: "Ok, got it",
      cookieDecline: "Decline",
    }
  };

  const t = (key: string): any => {
    return dictionary[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
