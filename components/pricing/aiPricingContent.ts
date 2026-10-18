import { Language } from '../LanguageContext';
import { ServiceOptionId } from './pricingNav';

export type BenefitIcon = 'clock' | 'phone' | 'palette' | 'scan';
export type PlanIcon = 'sofa' | 'sparkles' | 'video';

export interface AiPlan {
  id: ServiceOptionId;
  icon: PlanIcon;
  title: string;
  price: string;
  unit: string;
  note?: string;
  description: string;
  features: string[];
  cta: string;
  isFeatured?: boolean;
}

export interface AiPricingContent {
  tabAi: string;
  tab3d: string;
  tab3dShort: string;
  newBadge: string;
  from: string;
  benefits: { icon: BenefitIcon; title: string; text: string }[];
  featuredBadge: string;
  plans: AiPlan[];
  package: {
    eyebrow: string;
    title: string;
    text: string;
    price: string;
    oldPrice: string;
    oldPriceLabel: string;
    saving: string;
    cta: string;
  };
  beforeAfter: {
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
    sliderLabel: string;
    beforePlaceholder: string;
    afterPlaceholder: string;
  };
  comparison: {
    title: string;
    subtitle: string;
    colAi: string;
    col3d: string;
    rows: { label: string; ai: string; classic: string }[];
    scrollHint: string;
    noticeTitle: string;
    noticeText: string;
  };
  classicIntro: string;
  classicCrossLink: string;
}

export const AI_PRICING_CONTENT: Record<Language, AiPricingContent> = {
  cs: {
    tabAi: 'AI vizualizace',
    tab3d: 'Klasické 3D vizualizace',
    tab3dShort: 'Klasické 3D',
    newBadge: 'Nové',
    from: 'od',
    benefits: [
      {
        icon: 'clock',
        title: 'Hotovo do 24 hodin',
        text: 'Když inzerát nebo prezentace nepočká. Pošlete podklady dnes, vizualizace máte zítra.',
      },
      {
        icon: 'phone',
        title: 'Stačí fotka z mobilu',
        text: 'Bez projektové dokumentace. Fotka stávajícího stavu, půdorys nebo ruční skica.',
      },
      {
        icon: 'palette',
        title: '3 styly za cenu jednoho',
        text: 'Ukažte kupujícím, jak může prostor vypadat ve skandinávském, moderním i útulném stylu.',
      },
      {
        icon: 'scan',
        title: 'Žádný „AI slop“',
        text: 'Každý snímek ručně kontrolujeme. Držíme geometrii, proporce, okna i světlo prostoru.',
      },
    ],
    featuredBadge: 'Nejoblíbenější',
    plans: [
      {
        id: 'ai-staging',
        icon: 'sofa',
        title: 'AI Home staging',
        price: '290 Kč',
        unit: '/ fotka',
        description: 'Prázdné a neprodejné fotky proměníme v zařízené domovy.',
        features: [
          'Virtuální vybavení prázdných místností',
          'Odstranění nepořádku a starého nábytku',
          'Korekce světla, oblohy a perspektivy',
          'Dodání do 24 hodin, od 5 fotek',
        ],
        cta: 'Poptat home staging',
      },
      {
        id: 'ai-viz',
        icon: 'sparkles',
        title: 'AI vizualizace interiéru & exteriéru',
        price: '2 900 Kč',
        unit: '/ 4 snímky',
        note: 'tj. cca 725 Kč za snímek',
        description: 'Rekonstrukce, novostavby i zahrady. Z fotky, skici nebo půdorysu.',
        features: [
          '3 stylové varianty v ceně',
          'Zachovaná geometrie a proporce prostoru',
          '1 kolo úprav',
          'Rozlišení 4K, dodání do 24 hodin',
        ],
        cta: 'Poptat AI vizualizaci',
        isFeatured: true,
      },
      {
        id: 'ai-video',
        icon: 'video',
        title: 'AI video',
        price: '1 990 Kč',
        unit: '/ klip',
        description: 'Rozpohybujte inzerát. Video na web i sociální sítě.',
        features: [
          'Videoprohlídka interiéru',
          'Dronový průlet okolo domu',
          'Lifestyle scéna s rodinou v novém domově',
          'Formát 16:9 i 9:16 pro Reels',
        ],
        cta: 'Poptat AI video',
      },
    ],
    package: {
      eyebrow: 'Pro realitní makléře',
      title: 'Balíček pro inzerát',
      text: 'Vše, co potřebuje prodejní inzerát, na jednom místě: 10× AI home staging, 4× AI vizualizace a 1× AI video. Hotovo do 48 hodin.',
      price: '6 490 Kč',
      oldPrice: '7 790 Kč',
      oldPriceLabel: 'Původní cena',
      saving: 'Ušetříte 1 300 Kč',
      cta: 'Chci balíček',
    },
    beforeAfter: {
      title: 'Z fotky z mobilu k prodejnímu snímku',
      subtitle: 'Skutečná ukázka z naší práce. Stejný prostor, stejná geometrie.',
      beforeLabel: 'Před · fotka z mobilu',
      afterLabel: 'Po · AI vizualizace do 24 h',
      sliderLabel: 'Porovnání před a po. Posuňte táhlo doleva nebo doprava.',
      beforePlaceholder: 'Fotka z mobilu',
      afterPlaceholder: 'AI vizualizace',
    },
    comparison: {
      title: 'AI, nebo klasické 3D?',
      subtitle: 'Obě cesty mají své místo. Rádi vám poradíme, která se hodí právě pro váš projekt.',
      colAi: 'AI vizualizace',
      col3d: 'Klasické 3D vizualizace',
      rows: [
        { label: 'Dodání', ai: 'Do 24 hodin', classic: 'Dle rozsahu, modelujeme na míru' },
        { label: 'Podklady', ai: 'Fotka, skica nebo půdorys', classic: 'Projektová dokumentace, 3D model' },
        { label: 'Přesnost', ai: 'Věrná atmosféra a proporce', classic: 'Přesně podle projektu, každý materiál' },
        { label: 'Ideální pro', ai: 'Inzerci, rekonstrukce, rychlé ověření nápadu', classic: 'Developerské projekty, prodej z plánu, architekty' },
        { label: 'Cena', ai: 'od 290 Kč / fotka', classic: 'od 2 500 Kč' },
      ],
      scrollHint: 'posuňte tabulku do strany',
      noticeTitle: 'Férově a transparentně.',
      noticeText: 'Každou AI vizualizaci dodáváme označenou jako ilustrační, v souladu s pravidly EU AI Act. Vaši kupující se tak na prohlídce nedočkají nepříjemného překvapení.',
    },
    classicIntro: 'Precizní 3D vizualizace modelované na míru podle projektové dokumentace.',
    classicCrossLink: 'Potřebujete to rychleji? Zkuste AI vizualizace do 24 h',
  },
  en: {
    tabAi: 'AI visualization',
    tab3d: 'Classic 3D rendering',
    tab3dShort: 'Classic 3D',
    newBadge: 'New',
    from: 'from',
    benefits: [
      {
        icon: 'clock',
        title: 'Ready within 24 hours',
        text: 'For listings and presentations that can’t wait. Send the materials today, get the visuals tomorrow.',
      },
      {
        icon: 'phone',
        title: 'A phone photo is enough',
        text: 'No project documentation needed. A photo of the current state, a floor plan or a hand sketch.',
      },
      {
        icon: 'palette',
        title: '3 styles for the price of one',
        text: 'Show buyers the space in Scandinavian, modern and cosy styles.',
      },
      {
        icon: 'scan',
        title: 'No “AI slop”',
        text: 'We check every image by hand. Geometry, proportions, windows and light stay true to the space.',
      },
    ],
    featuredBadge: 'Most popular',
    plans: [
      {
        id: 'ai-staging',
        icon: 'sofa',
        title: 'AI Home staging',
        price: '€12',
        unit: '/ photo',
        description: 'We turn empty, hard-to-sell photos into furnished homes.',
        features: [
          'Virtual furnishing of empty rooms',
          'Removal of clutter and old furniture',
          'Light, sky and perspective correction',
          'Delivered within 24 hours, from 5 photos',
        ],
        cta: 'Request home staging',
      },
      {
        id: 'ai-viz',
        icon: 'sparkles',
        title: 'AI interior & exterior visualization',
        price: '€116',
        unit: '/ 4 images',
        note: 'approx. €29 per image',
        description: 'Renovations, new builds and gardens. From a photo, sketch or floor plan.',
        features: [
          '3 style variants included',
          'Geometry and proportions preserved',
          '1 revision round',
          '4K resolution, delivered within 24 hours',
        ],
        cta: 'Request AI visualization',
        isFeatured: true,
      },
      {
        id: 'ai-video',
        icon: 'video',
        title: 'AI video',
        price: '€80',
        unit: '/ clip',
        description: 'Bring your listing to life. Video for web and social media.',
        features: [
          'Interior video tour',
          'Drone fly-around of the house',
          'Lifestyle scene with a family in their new home',
          '16:9 and 9:16 formats for Reels',
        ],
        cta: 'Request AI video',
      },
    ],
    package: {
      eyebrow: 'For real estate agents',
      title: 'Listing package',
      text: 'Everything a sales listing needs in one place: 10× AI home staging, 4× AI visualization and 1× AI video. Ready within 48 hours.',
      price: '€260',
      oldPrice: '€312',
      oldPriceLabel: 'Regular price',
      saving: 'You save €52',
      cta: 'Get the package',
    },
    beforeAfter: {
      title: 'From a phone photo to a sales-ready image',
      subtitle: 'A real example of our work. Same space, same geometry.',
      beforeLabel: 'Before · phone photo',
      afterLabel: 'After · AI visualization in 24 h',
      sliderLabel: 'Before and after comparison. Move the handle left or right.',
      beforePlaceholder: 'Phone photo',
      afterPlaceholder: 'AI visualization',
    },
    comparison: {
      title: 'AI or classic 3D?',
      subtitle: 'Both have their place. We’re happy to advise which one suits your project.',
      colAi: 'AI visualization',
      col3d: 'Classic 3D rendering',
      rows: [
        { label: 'Delivery', ai: 'Within 24 hours', classic: 'Depends on scope, modelled to measure' },
        { label: 'Input', ai: 'Photo, sketch or floor plan', classic: 'Project documentation, 3D model' },
        { label: 'Accuracy', ai: 'True atmosphere and proportions', classic: 'Exactly to plan, every material' },
        { label: 'Best for', ai: 'Listings, renovations, quick idea checks', classic: 'Developments, off-plan sales, architects' },
        { label: 'Price', ai: 'from €12 / photo', classic: 'from €100' },
      ],
      scrollHint: 'scroll the table sideways',
      noticeTitle: 'Fair and transparent.',
      noticeText: 'Every AI visualization is delivered labelled as illustrative, in line with the EU AI Act. Your buyers won’t get an unpleasant surprise at the viewing.',
    },
    classicIntro: 'Precise 3D renderings modelled to measure from your project documentation.',
    classicCrossLink: 'Need it faster? Try AI visualizations in 24 h',
  },
};
