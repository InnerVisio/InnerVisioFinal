import React, { useState } from 'react';
import { Instagram, Loader2, CheckCircle2 } from 'lucide-react';
import { PrivacyPolicyModal, TermsOfServiceModal } from './LegalModals';
import { useLanguage } from './LanguageContext';

const LOCALIZED_NAV_ITEMS = [
  { labelKey: 'servicesLabel', href: '#services' },
  { labelKey: 'workLabel', href: '#work' },
  { labelKey: 'pricingLabel', href: '#pricing' },
  { labelKey: 'faqLabel', href: '#faq' },
];

export const Footer: React.FC = () => {
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
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#020102] pt-20 pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          <div className="md:col-span-5">
            <a href="#root" className="inline-block">
              <div className="text-3xl font-display font-bold text-white mb-6 md:hover:text-secondary transition-colors">InnerVisio</div>
            </a>
            <p className="text-gray-400 max-w-sm mb-8 font-light text-sm sm:text-base leading-relaxed">
              {language === 'cs' 
                ? 'Prezentace nemovitostí na nové úrovni. Povyšujeme architektonické příběhy skrze světlo, stín a digitální preciznost. Sídlíme v Havířově, pracujeme pro celou ČR.'
                : 'Real estate presentations on a whole new level. Elevating architectural narratives masterfully through light, shadow, and digital precision. Based in Czech Republic, working globally.'
              }
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/innervisio/" 
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 md:hover:text-white md:hover:bg-secondary/20 md:hover:border-secondary/50 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h3 className="text-white font-semibold mb-6 font-display">{language === 'cs' ? 'Mapa stránek' : 'Sitemap'}</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
              <li><a href="#root" className="md:hover:text-secondary transition-colors">{language === 'cs' ? 'Domů' : 'Home'}</a></li>
              {LOCALIZED_NAV_ITEMS.map((item) => (
                <li key={item.labelKey}>
                  <a href={item.href} className="md:hover:text-secondary transition-colors">
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-white font-semibold mb-6 font-display">Newsletter</h3>
            <p className="text-xs text-gray-400 mb-4 font-light">
              {language === 'cs' ? 'Nejnovější vizualizace a zprávy přímo do vaší schránky.' : 'Get our latest architectural designs and updates directly in your mailbox.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'cs' ? 'Emailová adresa' : 'Your email address'} 
                  className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary w-full disabled:opacity-50 font-light"
                  disabled={status === 'loading' || status === 'success'}
                />
                <button 
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="bg-secondary px-4 py-2 rounded-r-lg text-white text-sm font-medium md:hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    language === 'cs' ? 'Odebírat' : 'Subscribe'
                  )}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-xs text-green-400">{language === 'cs' ? 'Děkujeme za přihlášení!' : 'Thank you for subscribing!'}</p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-400">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-light leading-relaxed">
          <div className="flex flex-col gap-1 mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} InnerVisio Studio. {language === 'cs' ? 'Všechna práva vyhrazena.' : 'All rights reserved.'}</p>
            <p>Daniel Sváček | IČ: 21666244 | U Stromovky 416/62, Havířov</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 font-light">
            <button onClick={() => setIsPrivacyModalOpen(true)} className="md:hover:text-gray-400 transition-colors text-left">{t('privacyPolicy')}</button>
            <button onClick={() => setIsTermsModalOpen(true)} className="md:hover:text-gray-400 transition-colors text-left">{t('termsOfService')}</button>
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
