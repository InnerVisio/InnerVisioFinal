import React, { useState } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#070408] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-primary/35 selection:text-white relative overflow-hidden">
      {/* Background glow effects to match InnerVisio design styling */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 z-10 transition-all duration-300">
        
        {/* Header with subtle minimal styling */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-white/10">
          <span className="text-sm font-semibold tracking-[0.15em] uppercase text-primary mb-2">InnerVisio</span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Odhlášení z newsletteru
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Je nám líto, že odcházíte. Po potvrzení Vám již nebudeme posílat žádné novinky ani nabídky.
          </p>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center text-center py-4 gap-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold text-white">Úspěšně odhlášeno</h2>
            <p className="text-sm text-gray-400">
              E-mailová adresa <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">{email}</span> byla úspěšně odebrána z našeho seznamu příjemců.
            </p>
            <button
              onClick={onGoBack}
              className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Zpět na hlavní stránku
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-gray-300">
                Vaše e-mailová adresa
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  disabled={status === 'loading'}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jmeno@priklad.cz"
                  className="w-full bg-white/5 border border-white/11 rounded-lg py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition duration-200"
                  required
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-3 text-sm font-semibold tracking-wide transition shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
              className="text-xs text-gray-500 hover:text-gray-300 text-center transition py-1 underline underline-offset-4"
            >
              Možná jindy, vzít zpět
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
