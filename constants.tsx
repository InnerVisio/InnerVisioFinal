import { Box, Layers, MonitorPlay, Zap, Cuboid, Eye, Sparkles, Clapperboard } from 'lucide-react';
import { ServiceItem, ProjectItem, PricingItem } from './types';

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
    imageUrl: '/Exterier/IMG_2578_opt.webp', 
    galleryUrls: [
      '/Exterier/IMG_2578_opt.webp',
      '/Exterier/exterier_1_opt.webp',
      '/Exterier/exterier_2_opt.webp'
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
    imageUrl: '/Lipence/obyvaci_pokoj_1.webp',
    galleryUrls: [
      '/Lipence/obyvaci_pokoj_1.webp',
      '/Lipence/obyvaci_pokoj_2.webp',
      '/Lipence/kuchyne.webp',
      '/Lipence/kuchyne_1.webp'
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
    imageUrl: '/3DPudorys/pudorys_3d_opt.webp',
    galleryUrls: [
      '/3DPudorys/pudorys_3d_opt.webp'
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
    imageUrl: '/2DPudorysy/floor_1_opt.webp',
    galleryUrls: [
      '/2DPudorysy/floor_1_opt.webp',
      '/2DPudorysy/pudorys_2d_2_opt.webp',
      '/2DPudorysy/pudorys_2d_3_opt.webp'
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
    imageUrl: 'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&q=70&w=900',
    galleryUrls: [
      'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&q=70&w=900'
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
  },
  {
    id: '7',
    title: 'AI vizualizace',
    description: 'Fotorealistické vizualizace z fotky nebo skici do 24 hodin. Ideální pro inzerci a rekonstrukce.',
    detailedDescription: 'Z fotky z mobilu, skici nebo půdorysu vytvoříme fotorealistickou vizualizaci interiéru či exteriéru do 24 hodin. AI je pro nás nástroj, nápad, materiály a funkčnost dodává člověk. Každý snímek ručně kontrolujeme, aby seděla geometrie, proporce i světlo.',
    features: ['Hotovo do 24 hodin', '3 stylové varianty v ceně', 'Zachovaná geometrie a proporce prostoru', 'Transparentní označení dle EU AI Act'],
    icon: Sparkles,
    colSpan: 1,
    rowSpan: 1,
    imageUrl: '/AIVizualizace/exterier-po.webp',
    galleryUrls: [
      '/AIVizualizace/exterier-po.webp',
      '/AIVizualizace/exterier-pred.webp',
      '/AIVizualizace/interier-obyvak.webp'
    ],
  },
  {
    id: '8',
    title: 'Video tvorba',
    description: 'Natočené videoprohlídky nemovitostí, i z dronu. Nemovitost v pohybu pro inzerát, web i sociální sítě.',
    detailedDescription: 'Nemovitost natočíme na místě a postaváme z ní videoprohlídku, která prodává. Stabilizované záběry interiéru, u domů i dron z výšky, střih, hudba, titulky a logo vaší kanceláře. Video dodáme ve formátu 16:9 pro web a inzerci i 9:16 pro Reels a Stories.',
    features: ['Natáčení nemovitosti přímo na místě', 'Záběry z dronu pro exteriér a okolí', 'Střih, hudba, titulky a logo', 'Formát 16:9 i 9:16 pro Reels'],
    icon: Clapperboard,
    colSpan: 2,
    rowSpan: 1,
    imageUrl: '/VizualizaceExterieruTran/dji-fly-07_opt.webp',
    galleryUrls: [
      '/VizualizaceExterieruTran/dji-fly-07_opt.webp'
    ],
  }
];

// Before/after example in the AI pricing tab (same viewpoint, 3:2). Empty strings fall back to placeholders.
export const AI_BEFORE_AFTER = {
  before: '/AIVizualizace/exterier-pred.webp',
  after: '/AIVizualizace/exterier-po.webp',
  // Small version for the services card (displayed at ~450 px wide)
  afterSmall: '/AIVizualizace/exterier-po-900.webp',
};

// AI showcase: sample video (H.264 MP4 with an "AI GENERATED" label burned in) and extra still examples
export const AI_VIDEO = {
  src: '/video/ai-video-nemovitosti.mp4',
  poster: '/video/ai-video-nemovitosti-poster.jpg',
  width: 1920,
  height: 1080,
  durationSeconds: 30,
};

export const AI_GALLERY = [
  { src: '/AIVizualizace/exterier-zahrada.webp', cs: 'AI exteriér: terasa s pergolou a zahrada', en: 'AI exterior: terrace with pergola and garden' },
  { src: '/AIVizualizace/interier-obyvak.webp', cs: 'AI interiér: obývací pokoj', en: 'AI interior: living room' },
  { src: '/AIVizualizace/interier-loznice.webp', cs: 'AI interiér: ložnice v teplých tónech', en: 'AI interior: bedroom in warm tones' },
];

export const PRICING: PricingItem[] = [
  {
    id: '1',
    title: 'Vizualizace Exteriéru',
    price: 'od 6 000',
    unit: 'Kč',
    features: ['4 snímky vizualizací', '4 snímky zákresy do dronu', 'Fotorealistické vizualizace'],
    isPopular: true,
  },
  {
    id: '2',
    title: 'Vizualizace Interiéru',
    price: 'od 3 000',
    unit: 'Kč / celá nemovitost',
    features: ['Detailní textury', 'Designový nábytek', 'Osvětlení na míru', '2 revize'],
  },
  {
    id: '3',
    title: '3D půdorysy',
    price: 'od 720',
    unit: 'Kč',
    features: ['Včetně vybavení', 'Materiálové řešení', 'Vysoké rozlišení', 'Popis místností'],
  },
  {
    id: '4',
    title: '2D půdorysy',
    price: 'od 480',
    unit: 'Kč',
    features: ['Marketingový styl', 'Barevné schéma', 'Kótování', 'Logo studia'],
  },
  {
    id: '5',
    title: 'Virtuální prohlídky',
    price: 'od 3 600',
    unit: 'Kč',
    features: ['Matterport', 'Interaktivní body', 'Vr kompatibilita'],
  },
  {
    id: '6',
    title: 'Web s konfigurátorem',
    price: 'Ceněno individuálně',
    unit: '',
    features: ['Moderní design', 'Integrace konfigurátoru', 'SEO optimalizace', 'CMS systém'],
  },
  {
    id: '7',
    title: 'Video tvorba',
    price: 'od 3 900',
    unit: 'Kč',
    features: ['Videoprohlídka interiéru od 3 900 Kč', 'Videoprohlídka s dronem od 5 900 Kč', 'Střih, hudba, titulky a logo', 'Formát 16:9 i 9:16 pro Reels'],
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
    description: 'Návrh a vizualizace moderního bydlení v Bludovicích. Důraz na čisté linie, útulnou atmosféru a funkční prostorové uspořádání.',
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
      '/VizualizaceKancelare/zasedaci_mistnost_opt.webp'
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
    imageUrl: '/RezidenceHorska/vizualizace_exterieru_opt.webp',
    galleryUrls: [
      '/RezidenceHorska/vizualizace_exterieru_opt.webp',
      '/RezidenceHorska/vizualizace_exterier_podvecer_opt.webp',
      '/RezidenceHorska/Image7_opt.webp',
      '/RezidenceHorska/Image8_opt.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Na místě původní střechy vznikla nástavba s dalším patrem, novými byty a terasou. Detaily byly navrženy tak, aby budoucí majitelé viděli, jak bude jejich nový domov vypadat.',
  },
  {
    id: '7',
    title: 'Rekonstrukce venkovského domu',
    location: 'ČR',
    category: 'AI vizualizace',
    imageUrl: '/AIVizualizace/exterier-po.webp',
    galleryUrls: [
      '/AIVizualizace/exterier-po.webp',
      '/AIVizualizace/exterier-pred.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'Z fotky zchátralého domu vznikla AI vizualizace hotové rekonstrukce. Stejný záběr, stejná geometrie. Na druhém snímku najdete stav před.',
  },
  {
    id: '8',
    title: 'Terasa s pergolou a zahrada',
    location: 'ČR',
    category: 'AI vizualizace',
    imageUrl: '/AIVizualizace/exterier-zahrada.webp',
    galleryUrls: [
      '/AIVizualizace/exterier-zahrada.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'AI vizualizace exteriéru: zastřešená terasa, ohniště a zahrada ve světle zapadajícího slunce.',
  },
  {
    id: '9',
    title: 'Obývací pokoj v zelených tónech',
    location: 'ČR',
    category: 'AI vizualizace',
    imageUrl: '/AIVizualizace/interier-obyvak.webp',
    galleryUrls: [
      '/AIVizualizace/interier-obyvak.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'AI vizualizace interiéru s měkkým denním světlem, přírodními materiály a výrazným akcentem v olivové barvě.',
  },
  {
    id: '10',
    title: 'Ložnice v teplých tónech',
    location: 'ČR',
    category: 'AI vizualizace',
    imageUrl: '/AIVizualizace/interier-loznice.webp',
    galleryUrls: [
      '/AIVizualizace/interier-loznice.webp'
    ],
    heightClass: 'aspect-[4/5]',
    description: 'AI vizualizace ložnice s vestavěnou šatnou, jemným osvětlením a lehkými záclonami.',
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
    image: "/HeroSection/hero_slide_2_opt.webp",
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

// Videos for the /socials page (Instagram/Facebook mockup). The two brand clips are silent 1080p slides;
// the AI property tour has a soundtrack. `title`/`caption` are post copy shown in the mockup.
export interface SocialVideo {
  id: string;
  src: string;
  poster: string;
  durationSeconds: number;
  hasAudio: boolean;
  title: { cs: string; en: string };
  caption: { cs: string; en: string };
}

export const SOCIAL_HASHTAGS = ['#innervisio', '#aivizualizace', '#vizualizace', '#archviz', '#interier', '#exterier', '#realestate', '#reality', '#architektura'];

export const SOCIAL_VIDEOS: SocialVideo[] = [
  {
    id: 'ai-vizualizace',
    src: '/video/brand-ai-vizualizace.mp4',
    poster: '/video/brand-ai-vizualizace-poster.jpg',
    durationSeconds: 20,
    hasAudio: false,
    title: { cs: 'AI vizualizace: nápad je náš, AI ho zrealizuje', en: 'AI visualization: the idea is ours, AI brings it to life' },
    caption: {
      cs: 'Stejný styl. Úplně jiný výsledek. Rozdíl dělá člověk za vizualizací. Z jedné fotky nový domov.',
      en: 'Same style. A completely different result. A professional makes the difference. From one photo, a new home.',
    },
  },
  {
    id: 'ai-vyhody',
    src: '/video/brand-ai-vyhody.mp4',
    poster: '/video/brand-ai-vyhody-poster.jpg',
    durationSeconds: 22.5,
    hasAudio: false,
    title: { cs: 'Většina lidí si myslí, že stačí tohle. Nestačí.', en: 'Most people think this is enough. It is not.' },
    caption: {
      cs: 'Rychle. Dostupně. Ve variantách. Hotovo i do druhého dne, interiéry i exteriéry. Vizualizace i AI.',
      en: 'Fast. Affordable. In variants. Ready within a day or two, interiors and exteriors. Visualization and AI.',
    },
  },
  {
    id: 'ai-videoprohlidka',
    src: AI_VIDEO.src,
    poster: AI_VIDEO.poster,
    durationSeconds: AI_VIDEO.durationSeconds,
    hasAudio: true,
    title: { cs: 'AI videoprohlídka: Dolní, Ostrava – Zábřeh', en: 'AI video tour: Dolní, Ostrava – Zábřeh' },
    caption: {
      cs: 'Rozpohybujte inzerát. Videoprohlídka interiéru z fotek do 24 hodin.',
      en: 'Bring your listing to life. An interior video tour made from photos within 24 hours.',
    },
  },
];