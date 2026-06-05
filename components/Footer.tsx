import React, { useState } from 'react';
import { Instagram, Loader2, CheckCircle2 } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { PrivacyPolicyModal, TermsOfServiceModal } from './LegalModals';

export const Footer: React.FC = () => {
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
        const data = await response.json();
        throw new Error(data.error || 'Failed to subscribe');
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
    <footer className="border-t border-white/10 bg-[#020102] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          <div className="md:col-span-5">
            <a href="#root" className="inline-block">
              <h2 className="text-3xl font-display font-bold text-white mb-6 md:hover:text-secondary transition-colors">InnerVisio</h2>
            </a>
            <p className="text-gray-400 max-w-sm mb-8">
              Prezentace nemovitostí na nové úrovni. Povyšujeme architektonické příběhy skrze světlo, stín a digitální preciznost. Sídlíme v Havířově, pracujeme pro celou ČR.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/innervisio/" 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 md:hover:text-white md:hover:bg-secondary/20 md:hover:border-secondary/50 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h4 className="text-white font-semibold mb-6">Mapa stránek</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#root" className="md:hover:text-secondary transition-colors">Domů</a></li>
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="md:hover:text-secondary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-6">Newsletter</h4>
            <p className="text-xs text-gray-500 mb-4">Nejnovější vizualizace a zprávy přímo do vaší schránky.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Emailová adresa" 
                  className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary w-full disabled:opacity-50"
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
                    'Odebírat'
                  )}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-[10px] text-green-500">Děkujeme za přihlášení!</p>
              )}
              {status === 'error' && (
                <p className="text-[10px] text-red-500">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <div className="flex flex-col gap-1 mb-4 md:mb-0">
            <p>&copy; 2024 InnerVisio Studio. Všechna práva vyhrazena.</p>
            <p>Daniel Sváček | IČ: 21666244 | U Stromovky 416/62, Havířov</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button onClick={() => setIsPrivacyModalOpen(true)} className="md:hover:text-gray-400 transition-colors text-left">Zásady ochrany osobních údajů</button>
            <button onClick={() => setIsTermsModalOpen(true)} className="md:hover:text-gray-400 transition-colors text-left">Podmínky služby</button>
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