import { Language } from '../LanguageContext';

// Strings used inside the phone mockup (profile chrome, post chrome, labels)
export interface MockCopy {
  tablistLabel: string;
  phoneLabel: Record<'instagram' | 'facebook', string>;
  follow: string;
  followLabel: string;
  message: string;
  displayName: string;
  category: string;
  bio: string;
  highlights: { id: 'ba' | 'ai' | '3d' | 'contact'; label: string }[];
  play: string;
  postTime: string;
  fbCategory: string;
  fbTabs: string[];
  like: string;
  comment: string;
  share: string;
  note: string;
}

export const MOCK_COPY: Record<Language, MockCopy> = {
  cs: {
    tablistLabel: 'Vyberte síť',
    phoneLabel: {
      instagram: 'Ukázka profilu InnerVisio na Instagramu (ilustrace)',
      facebook: 'Ukázka příspěvků InnerVisio ve stylu Facebooku (ilustrace)',
    },
    follow: 'Sledovat',
    followLabel: 'Sledovat InnerVisio na Instagramu (otevře se v nové záložce)',
    message: 'Napsat',
    displayName: 'InnerVisio',
    category: 'Vizualizace i AI · interiéry & exteriéry',
    bio: 'Klasické 3D i AI vizualizace pro makléře, developery a architekty',
    highlights: [
      { id: 'ba', label: 'Před a po' },
      { id: 'ai', label: 'AI' },
      { id: '3d', label: '3D' },
      { id: 'contact', label: 'Kontakt' },
    ],
    play: 'Přehrát video',
    postTime: 'Ukázka',
    fbCategory: 'Vizualizace',
    fbTabs: ['Příspěvky', 'Videa', 'Fotky', 'Info'],
    like: 'Líbí se mi',
    comment: 'Komentář',
    share: 'Sdílet',
    note: 'Ilustrativní náhled. Takto vypadá náš obsah v síti, bez skutečných čísel a reakcí.',
  },
  en: {
    tablistLabel: 'Choose a network',
    phoneLabel: {
      instagram: 'Preview of the InnerVisio Instagram profile (illustration)',
      facebook: 'Preview of InnerVisio posts in a Facebook style (illustration)',
    },
    follow: 'Follow',
    followLabel: 'Follow InnerVisio on Instagram (opens in a new tab)',
    message: 'Message',
    displayName: 'InnerVisio',
    category: 'Visualization & AI · interiors & exteriors',
    bio: 'Classic 3D and AI visualization for agents, developers and architects',
    highlights: [
      { id: 'ba', label: 'Before/after' },
      { id: 'ai', label: 'AI' },
      { id: '3d', label: '3D' },
      { id: 'contact', label: 'Contact' },
    ],
    play: 'Play video',
    postTime: 'Sample',
    fbCategory: 'Visualization',
    fbTabs: ['Posts', 'Videos', 'Photos', 'About'],
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    note: 'Illustrative preview. This is how our content looks on the network, without real numbers or reactions.',
  },
};
