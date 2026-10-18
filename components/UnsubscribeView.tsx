import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { BRAND, blurInOnMount } from './ui/brand';

interface UnsubscribeViewProps {
  emailParam: string;
  onGoBack: () => void;
}

export function UnsubscribeView({ emailParam, onGoBack }: UnsubscribeViewProps) {
  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Prosím zadejte platnou e-mailovou adresu.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let textMsg = 'Odhlášení selhalo';
        try {
          const data = await response.json();
          textMsg = data.error || textMsg;
        } catch (e) {
          textMsg = `Chyba serveru (${response.status}).`;
        }
        throw new Error(textMsg);
      }

      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Nastala neočekávaná chyba při komunikaci se serverem.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col items-center justify-center px-4 py-10 sm:p-8 font-sans relative overflow-hidden">
      {/* Plum glows: the glass card needs something to refract */}
      {/* Centered with flex because the drift animation owns `transform` */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden>
        <div className="w-[680px] h-[680px] shrink-0 rounded-full glow-plum opacity-90 animate-drift-slow" />
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-end justify-end" aria-hidden>
        <div className="w-[460px] h-[460px] shrink-0 -mr-40 -mb-40 rounded-full glow-orchid opacity-40" />
      </div>

      {/* Logo */}
      <motion.button
        {...blurInOnMount(0)}
        type="button"
        onClick={onGoBack}
        className="focus-ring relative z-10 inline-flex items-center gap-3 mb-8 rounded-2xl"
        aria-label="InnerVisio – zpět na hlavní stránku"
      >
        <span className="bg-logo-plum w-11 h-11 rounded-2xl flex items-center justify-center border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_rgba(0,0,0,0.45)]">
          <img src="/FavIcon.png" alt="" className="w-7 h-7 object-contain" width={28} height={28} />
        </span>
        <span className="text-2xl font-display font-bold tracking-tightest text-ink">InnerVisio</span>
      </motion.button>

      <motion.div
        {...blurInOnMount(0.1)}
        className="glass-strong glass-inner-glow max-w-md w-full rounded-card-lg p-6 sm:p-9 relative flex flex-col gap-7 z-10"
      >

        <div className="flex flex-col items-center text-center pb-6 border-b border-white/[0.08]">
          <span className="eyebrow mb-3">Newsletter</span>
          <h1 className="text-[26px] sm:text-3xl font-display font-bold tracking-tightest leading-tight text-ink">
            Odhlášení z <span className="text-gradient">newsletteru</span>
          </h1>
          <p className="text-sm text-ink-2 mt-3 font-light leading-relaxed">
            Je nám líto, že odcházíte. Po potvrzení Vám již nebudeme posílat žádné novinky ani nabídky.
          </p>
        </div>

        {status === 'success' ? (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center py-2 gap-4"
          >
            <span className="icon-chip w-16 h-16 rounded-[20px] mb-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_40px_rgba(162,77,184,0.45)]">
              <Check className="w-8 h-8 icon-gradient" strokeWidth={1.5} />
            </span>
            <h2 className="text-xl font-display font-semibold tracking-tightest text-ink">Úspěšně odhlášeno</h2>
            <p className="text-sm text-ink-2 font-light leading-relaxed break-words">
              E-mailová adresa <span className="text-orchid-soft font-medium bg-white/[0.07] border border-white/10 px-2 py-0.5 rounded-lg break-all">{email}</span> byla úspěšně odebrána z našeho seznamu příjemců.
            </p>
            <button
              type="button"
              onClick={onGoBack}
              className={`${BRAND.btnGlass} group mt-3 px-5 py-2.5 text-sm`}
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-500 md:group-hover:-translate-x-0.5" strokeWidth={1.75} />
              Zpět na hlavní stránku
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-ink-2">
                Vaše e-mailová adresa
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled={status === 'loading'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jmeno@priklad.cz"
                autoComplete="email"
                className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.14] px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-3 font-light shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[background-color,border-color,box-shadow] duration-300 outline-none md:hover:border-white/25 focus-visible:border-orchid-soft/70 focus-visible:bg-white/[0.08] focus-visible:shadow-[0_0_0_3px_rgba(196,139,224,0.28)] disabled:opacity-60"
                required
              />
            </div>

            {status === 'error' && (
              <div role="alert" className="bg-rose/[0.08] border border-rose/25 text-rose rounded-2xl p-3.5 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`${BRAND.btnPrimary} w-full py-3.5 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Ruším odběr...</span>
                </>
              ) : (
                'Potvrdit odhlášení z odběru'
              )}
            </button>

            <button
              type="button"
              onClick={onGoBack}
              className="focus-ring self-center rounded text-sm text-ink-3 md:hover:text-orchid-pink text-center transition-colors py-1 underline underline-offset-4 decoration-white/20"
            >
              Možná jindy, vzít zpět
            </button>
          </form>
        )}
      </motion.div>

      {/* Contact always visible */}
      <motion.p {...blurInOnMount(0.2)} className="relative z-10 mt-8 text-sm text-ink-3 font-light text-center">
        Dotazy? <a href="mailto:innervisio@gmail.com" className="link-orchid focus-ring rounded font-medium">innervisio@gmail.com</a>
      </motion.p>
    </div>
  );
}
