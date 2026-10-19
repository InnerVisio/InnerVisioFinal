import React, { useState } from 'react';
import { Instagram, Facebook, Loader2, Check, Mail } from 'lucide-react';
import { PrivacyPolicyModal, TermsOfServiceModal } from './LegalModals';
import { useLanguage } from './LanguageContext';
import { openCookieSettings, track } from '../analytics';
import { SITE } from '../site';

const FACEBOOK: string = SITE.facebook;

const LOCALIZED_NAV_ITEMS = [
  { labelKey: 'servicesLabel', href: '#services' },
  { labelKey: 'workLabel', href: '#work' },
  { labelKey: 'aiVizLabel', href: '#pricing-ai' },
  { labelKey: 'pricingLabel', href: '#pricing' },
  { labelKey: 'faqLabel', href: '#faq' },
];

const FOOTER_LINK = 'focus-ring rounded text-ink-2 md:hover:text-orchid-pink transition-colors duration-300';

interface FooterProps {
  /** '' on the home page; '/' on sub-pages so in-page anchors become '/#services' */
  homePrefix?: string;
}

export const Footer: React.FC<FooterProps> = ({ homePrefix = '' }) => {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let textMsg = language === 'cs' ? 'Přihlášení k odběru selhalo' : 'Subscription failed';
        try {
          const data = await response.json();
          textMsg = data.error || textMsg;
        } catch (e) {
          textMsg = language === 'cs'
            ? `Chyba serveru (${response.status}): Odezva nebyla ve formátu JSON. Zkontrolujte, zda jste správně nastaven RESEND_API_KEY.`
            : `Server Error (${response.status}): Response was not in JSON format. Please verify your RESEND_API_KEY configuration.`;
        }
        throw new Error(textMsg);
      }

      setStatus('success');
      track('sign_up', { method: 'newsletter' });
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const busy = status === 'loading' || status === 'success';

  return (
    <footer className="relative z-0 bg-background overflow-hidden pt-20 md:pt-24 pb-10">
      {/* Soft top glow and hairline separating the footer from the page */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] max-w-full h-px bg-gradient-to-r from-transparent via-orchid-soft/35 to-transparent" />
        <div className="absolute -top-[260px] left-1/2 -translate-x-1/2 w-[900px] h-[440px] rounded-full glow-plum opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,15,41,0.55)_0%,rgba(5,3,8,0)_60%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14 md:mb-16">

          <div className="md:col-span-5">
            <a href={homePrefix ? '/' : '#root'} className="focus-ring group inline-flex items-center gap-3.5 mb-6 rounded-2xl" aria-label="InnerVisio">
              <span className="bg-logo-plum w-12 h-12 rounded-2xl flex items-center justify-center border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_rgba(0,0,0,0.45)] transition-shadow duration-500 md:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_36px_rgba(162,77,184,0.5)]">
                <img src="/FavIcon.png" alt="" className="w-8 h-8 object-contain" width={32} height={32} />
              </span>
              <span className="text-2xl md:text-[28px] font-display font-bold tracking-tightest text-ink">InnerVisio</span>
            </a>
            <p className="text-ink-2 max-w-sm mb-7 font-light text-sm sm:text-base leading-relaxed">
              {language === 'cs'
                ? 'Prezentace nemovitostí na nové úrovni. Povyšujeme architektonické příběhy skrze světlo, stín a digitální preciznost. Sídlíme v Havířově, pracujeme pro celou ČR.'
                : 'Real estate presentations on a whole new level. Elevating architectural narratives masterfully through light, shadow, and digital precision. Based in Czech Republic, working globally.'
              }
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:zakazky@innervisio.cz"
                className="focus-ring btn-glass inline-flex items-center gap-2.5 rounded-full pl-2 pr-5 py-2 group"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/15">
                  <Mail className="w-4 h-4 icon-gradient" strokeWidth={1.5} />
                </span>
                <span className="link-orchid md:group-hover:text-orchid-pink font-display font-medium text-sm sm:text-[15px]">zakazky@innervisio.cz</span>
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="focus-ring btn-glass w-12 h-12 rounded-full flex items-center justify-center"
              >
                <Instagram className="w-[18px] h-[18px] icon-gradient" strokeWidth={1.5} />
              </a>
              {FACEBOOK && (
                <a
                  href={FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="focus-ring btn-glass w-12 h-12 rounded-full flex items-center justify-center"
                >
                  <Facebook className="w-[18px] h-[18px] icon-gradient" strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h3 className="eyebrow mb-5">{language === 'cs' ? 'Mapa stránek' : 'Sitemap'}</h3>
            <ul className="space-y-3.5 text-[15px] font-light">
              <li><a href={homePrefix ? '/' : '#root'} className={FOOTER_LINK}>{language === 'cs' ? 'Domů' : 'Home'}</a></li>
              {LOCALIZED_NAV_ITEMS.map((item) => (
                <li key={item.labelKey}>
                  <a href={`${homePrefix}${item.href}`} className={FOOTER_LINK}>
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
              <li><a href="/socials" className={FOOTER_LINK}>Socials</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow mb-5">Newsletter</h3>
            <p className="text-sm text-ink-2 mb-4 font-light leading-relaxed">
              {language === 'cs' ? 'Nejnovější vizualizace a zprávy přímo do vaší schránky.' : 'Get our latest architectural designs and updates directly in your mailbox.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.05] border border-white/[0.14] backdrop-blur-[20px] backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[border-color,box-shadow] duration-300 focus-within:border-orchid-soft/70 focus-within:shadow-[0_0_0_3px_rgba(196,139,224,0.25)]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label={language === 'cs' ? 'Emailová adresa' : 'Your email address'}
                  placeholder={language === 'cs' ? 'Emailová adresa' : 'Your email address'}
                  className="flex-1 min-w-0 bg-transparent pl-4 pr-2 py-2 text-sm text-ink placeholder:text-ink-3 outline-none disabled:opacity-50 font-light"
                  disabled={busy}
                />
                <button
                  type="submit"
                  disabled={busy}
                  aria-label={status === 'success' ? (language === 'cs' ? 'Přihlášeno' : 'Subscribed') : undefined}
                  className="btn-primary focus-ring rounded-full px-4 py-2.5 text-white text-sm font-display font-medium disabled:opacity-60 flex items-center justify-center min-w-[96px] shrink-0"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === 'success' ? (
                    <Check className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    language === 'cs' ? 'Odebírat' : 'Subscribe'
                  )}
                </button>
              </div>
              <div aria-live="polite" className="min-h-[1rem] pl-4">
                {status === 'success' && (
                  <p className="text-xs text-orchid-soft">{language === 'cs' ? 'Děkujeme za přihlášení!' : 'Thank you for subscribing!'}</p>
                )}
                {status === 'error' && (
                  <p className="text-xs text-rose">{errorMessage}</p>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-5 text-xs text-ink-3 font-light leading-relaxed">
          <div className="flex flex-col gap-1">
            <p>&copy; {new Date().getFullYear()} InnerVisio Studio. {language === 'cs' ? 'Všechna práva vyhrazena.' : 'All rights reserved.'}</p>
            <p>Daniel Sváček | IČ: 21666244 | U Stromovky 416/62, Havířov</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button type="button" onClick={() => setIsPrivacyModalOpen(true)} className="focus-ring rounded text-ink-3 md:hover:text-orchid-pink transition-colors text-left">{t('privacyPolicy')}</button>
            <button type="button" onClick={() => setIsTermsModalOpen(true)} className="focus-ring rounded text-ink-3 md:hover:text-orchid-pink transition-colors text-left">{t('termsOfService')}</button>
            <button type="button" onClick={openCookieSettings} className="focus-ring rounded text-ink-3 md:hover:text-orchid-pink transition-colors text-left">{language === 'cs' ? 'Nastavení cookies' : 'Cookie settings'}</button>
          </div>
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </footer>
  );
};
