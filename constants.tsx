import { Box, Layers, MonitorPlay, Zap, Cuboid, Eye } from 'lucide-react';
import { ServiceItem, NavItem, StatItem, ProjectItem, PricingItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Služby', href: '#services' },
  { label: 'Práce', href: '#work' },
  { label: 'Ceník', href: '#pricing' },
];

export const STATS: StatItem[] = [
  { value: '150+', label: 'Dokončených projektů' },
  { value: '50+', label: 'Spokojených klientů' },
  { value: '24h', label: 'Rychlost odezvy' }
];

export const SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'Vizualizace Exteriéru',
    description: 'Fotorealistické ztvárnění exteriérů budov s důrazem na světlo, materiály a okolní prostředí.',
    detailedDescription: 'Nabízíme špičkové fotorealistické vizualizace exteriérů pro developerské projekty i rodinné domy. Soustředíme se na dokonalou hru světel, stínů a zasazení rodinného domu do reálného terénu či okolní zástavby.',
    features: ['Realistické materiály a textury', 'Denní a noční scenérie', 'Zakomponování do fotografie', 'Úprava okolí podle architektonické studie'],
    icon: Box,
    colSpan: 2,
    rowSpan: 2,
    imageUrl: '/Exteriér/IMG_2578_opt.webp', 
    galleryUrls: [
      '/Exteriér/IMG_2578_opt.webp',
      '/Exteriér/Generated Image April 23, 2026 - 3_19AM_opt.webp',
      '/Exteriér/Generated Image April 23, 2026 - 3_38AM_opt.webp'
    ]
  },
  {
    id: '2',
    title: 'Vizualizace Interiéru',
    description: 'Detailní pohledy do vnitřních prostor, které zachycují atmosféru a designový záměr.',
    detailedDescription: 'Tvorba 3D návrhů interiérů, které klade důraz na atmosféru, správné osvětlení a rozvržení prostoru. Vaši klienti si díky tomu dokáží živě představit domov či kancelář dříve, než se položí první cihla.',
    features: ['Precizní nasvícení scény', 'Atmosférické záběry', 'Realistické modely nábytku', 'Vyladěné textury vybavení'],
    icon: Eye,
    colSpan: 1,
    rowSpan: 1,
    imageUrl: '/Lipence/Obývací pokoj 1.webp',
    galleryUrls: [
      '/Lipence/Obývací pokoj 1.webp',
      '/Lipence/Obývací pokoj 2.webp',
      '/Lipence/Kuchyně.webp',
      '/Lipence/Kuchyně 1.webp'
    ]
  },
  {
    id: '3',
    title: '3D půdorysy',
    description: 'Prostorové zobrazení dispozic, které pomáhá lépe pochopit objem a uspořádání interiéru.',
    detailedDescription: 'Klasické 2D půdorysy jsou často pro laiky nečitelné. Pomocí 3D půdorysu nabízíme prostorový náhled objektu z nadhledu, což zajišťuje perfektní představu o celkovém uspořádání a provozu domácnosti.',
    features: ['Trojrozměrná vizualizace příček a oken', 'Základní nebo detailní vybavení nábytkem', 'Skvělé pro inzerci na realitních portálech', 'Zvýšení důvěry a zájmu klientů'],
    icon: Cuboid,
    colSpan: 1,
    rowSpan: 2,
    imageUrl: '/3DPudorys/Generated Image April 23, 2026 - 3_52AM_opt.webp',
    galleryUrls: [
      '/3DPudorys/Generated Image April 23, 2026 - 3_52AM_opt.webp'
    ]
  },
  {
    id: '4',
    title: '2D půdorysy',
    description: 'Přehledná a estetická schémata podlaží pro marketingové účely a prezentace.',
    detailedDescription: 'Prezentujeme technické nákresy ve srozumitelné a esteticky laděné podobě. Ideální doplněk pro prodej bytů a pronájmy kancelářských ploch.',
    features: ['Barevné kódování a materiály (např. dekor dřeva)', 'Doplnění výměr jednotlivých místností', 'Možnost přidání vašeho loga', 'Jasné vyznačení dispozice s kótami'],
    icon: Layers,
    colSpan: 1,
    rowSpan: 1,
    imageUrl: '/2DPudorysy/1. Floor_opt.webp',
    galleryUrls: [
      '/2DPudorysy/1. Floor_opt.webp',
      '/2DPudorysy/2D Půdorys oprava_opt.webp',
      '/2DPudorysy/Půdorys vizualizace_opt.webp'
    ]
  },
  {
    id: '5',
    title: 'Virtuální prohlídky',
    description: 'Interaktivní 360° zážitky, které umožňují volný pohyb v budoucím prostoru.',
    detailedDescription: 'Nabízíme revoluční možnost, jak se projít domem ještě před jeho dokončením. Klient se může libovolně rozhlížet a procházet jednotlivými místnostmi v úhlu 360 stupňů.',
    features: ['Pohyb ve scéně pomocí hotspotů', 'Napojení pro brýle s virtuální realitou', 'Zapracování informačních bodů', 'Snadné sdílení formou odkazu'],
    icon: MonitorPlay,
    colSpan: 1,
    rowSpan: 1,
    imageUrl: 'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&q=80&w=2000',
    galleryUrls: [
      'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&q=80&w=2000'
    ]
  },
  {
    id: '6',
    title: 'Web s konfigurátorem',
    description: 'Komplexní digitální prezentace projektů integrující vizuální obsah do moderního webu.',
    detailedDescription: 'Developerům a realitním kancelářím tvoříme ucelené prezentační webové stránky pro konkrétní stavební projekty s interaktivním výběrem bytů a integrací vizuálního materiálu.',
    features: ['Interaktivní 2D/3D navigace (klikací budova)', 'Filtrování volných/obsazených bytů', 'Moderní animace a uživatelský UX/UI design', 'SEO optimalizace pro vyhledávače'],
    icon: Zap,
    colSpan: 2,
    rowSpan: 1,
    imageUrl: '/Banner/Banner.webp',
    galleryUrls: [
      '/Banner/Banner.webp'
    ]
  }
];

export const PRICING: PricingItem[] = [
  {
    id: '1',
    title: 'Vizualizace Exteriéru',
    price: 'od 5 000',
    unit: 'Kč',
    features: ['4 snímky vizualizací', '4 snímky zákresy do dronu', 'Fotorealistické vizualizace'],
    isPopular: true,
  },
  {
    id: '2',
    title: 'Vizualizace Interiéru',
    price: 'od 2 500',
    unit: 'Kč / celá nemovitost',
    features: ['Detailní textury', 'Designový nábytek', 'Osvětlení na míru', '2 revize'],
  },
  {
    id: '3',
    title: '3D půdorysy',
    price: 'od 600',
    unit: 'Kč',
    features: ['Včetně vybavení', 'Materiálové řešení', 'Vysoké rozlišení', 'Popis místností'],
  },
  {
    id: '4',
    title: '2D půdorysy',
    price: 'od 400',
    unit: 'Kč',
    features: ['Marketingový styl', 'Barevné schéma', 'Kótování', 'Logo studia'],
  },
  {
    id: '5',
    title: 'Virtuální prohlídky',
    price: 'od 3 000',
    unit: 'Kč',
    features: ['Matterport', 'Interaktivní body', 'Vr kompatibilita'],
  },
  {
    id: '6',
    title: 'Web s konfigurátorem',
    price: 'Ceněno individuálně',
    unit: '',
    features: ['Moderní design', 'Integrace konfigurátoru', 'SEO optimalizace', 'CMS systém'],
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: '1',
    title: 'Moderní dům v Bludovicích',
    location: 'Bludovice, ČR',
    category: 'Exteriér',
    imageUrl: '/VizualizaceBludovice/IMG_6191_opt.webp',
    galleryUrls: [
      '/VizualizaceBludovice/IMG_6191_opt.webp',
      '/VizualizaceBludovice/IMG_6198_opt.webp',
      '/VizualizaceBludovice/IMG_6204_opt.webp',
      '/VizualizaceBludovice/IMG_6214_opt.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Návrh and vizualizace moderního bydlení v Bludovicích. Důraz na čisté linie, útulnou atmosféru a funkční prostorové uspořádání.',
  },
  {
    id: '2',
    title: 'Kancelář inspirovaná přírodou',
    location: 'ČR',
    category: 'Interiér',
    imageUrl: '/VizualizaceKancelare/IMG_9129_opt.webp',
    galleryUrls: [
      '/VizualizaceKancelare/IMG_9129_opt.webp',
      '/VizualizaceKancelare/IMG_9130_opt.webp',
      '/VizualizaceKancelare/IMG_9141_opt.webp',
      '/VizualizaceKancelare/Zasedací místnost_opt.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Hory, dřevo a zeleň. Kancelář navržená tak, aby se v ní dobře pracovalo i přemýšlelo.',
  },
  {
    id: '3',
    title: 'Moderní bungalov ve Skorkově',
    location: 'Skorkov, ČR',
    category: 'Exteriér',
    imageUrl: '/VizualizaceExterieruSkorkov/IMG_2580_opt.webp',
    galleryUrls: [
      '/VizualizaceExterieruSkorkov/IMG_2580_opt.webp',
      '/VizualizaceExterieruSkorkov/IMG_2577_opt.webp',
      '/VizualizaceExterieruSkorkov/IMG_2579_opt.webp',
      '/VizualizaceExterieruSkorkov/IMG_2582_opt.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Pozemek, který byl pouze zahradou, jsme proměnili ve vizualizaci moderního bungalovu.',
  },
  {
    id: '4',
    title: 'Nadčasový béžový interiér',
    location: 'ČR',
    category: 'Interiér',
    imageUrl: '/VizualizaceInterieru3/IMG_6047_opt.webp',
    galleryUrls: [
      '/VizualizaceInterieru3/IMG_6047_opt.webp',
      '/VizualizaceInterieru3/IMG_6074_opt.webp',
      '/VizualizaceInterieru3/IMG_6115_opt.webp',
      '/VizualizaceInterieru3/IMG_6121_opt.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Útulný dům, kde dominují teplé odstíny s kombinací dřeva, díky čemuž z interiéru srší domácí atmosféra.',
  },
  {
    id: '5',
    title: 'Dům v Třanovicích',
    location: 'Třanovice, ČR',
    category: 'Exteriér',
    imageUrl: '/VizualizaceExterieruTran/Image1_opt.webp',
    galleryUrls: [
      '/VizualizaceExterieruTran/Image1_opt.webp',
      '/VizualizaceExterieruTran/Image2_opt.webp',
      '/VizualizaceExterieruTran/Image4_opt.webp',
      '/VizualizaceExterieruTran/dji-fly-07_opt.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Původně starší chata, která díky naší vizualizaci znovu ožila a zájemcům ukázala její plný potenciál.',
  },
  {
    id: '6',
    title: 'Rezidence Horská, Litvínov',
    location: 'Litvínov, ČR',
    category: 'Exteriér',
    imageUrl: '/RezidenceHorska/Vizualizace Exteriéru_opt.webp',
    galleryUrls: [
      '/RezidenceHorska/Vizualizace Exteriéru_opt.webp',
      '/RezidenceHorska/Vizualizace Exteriér - Podvečer_opt.webp',
      '/RezidenceHorska/Image7_opt.webp',
      '/RezidenceHorska/Image8_opt.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Na místě původní střechy vznikla nástavba s dalším patrem, novými byty a terasou. Detaily byly navrženy tak, aby budoucí majitelé viděli, jak bude jejich nový domov vypadat.',
  },
];

export const HERO_SLIDES = [
  {
    id: 1,
    image: "/Banner/Banner.webp",
    title: "Prezentační Weby s Vizualizací",
    location: "Komplexní řešení",
    status: "Top Služba"
  },
  {
    id: 2,
    image: "/HeroSection/Generated Image April 23, 2026 - 3_29AM_opt.webp",
    title: "Developerské Projekty",
    location: "Praha, ČR",
    status: "Ve výstavbě"
  },
  {
    id: 3,
    image: "/HeroSection/IMG_0103_opt.webp",
    title: "Moderní Rodinné Domy",
    location: "ČR",
    status: "Koncept"
  },
  {
    id: 4,
    image: "/HeroSection/IMG_0104_opt.webp",
    title: "Nadčasová Architektura",
    location: "ČR",
    status: "Nové"
  }
];

// Deprecated single constants kept for safety
export const HERO_IMAGE = "https://picsum.photos/seed/building8/1200/1600";
export const HERO_VIDEO_THUMB = "https://picsum.photos/seed/interior9/800/600";
