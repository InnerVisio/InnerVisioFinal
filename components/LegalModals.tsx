import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EASE_OUT } from './ui/brand';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShellProps extends ModalProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

// Dark liquid-glass dialog over a dimmed backdrop. Rendered into <body> so no section's stacking context can trap it.
function LegalModalShell({ isOpen, onClose, title, children }: ShellProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(5,3,8,0.78)] backdrop-blur-md"
          />
          {/* Plum glow behind the panel so the glass has something to refract */}
          <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] max-w-[120vw] h-[560px] rounded-full glow-plum opacity-70 pointer-events-none" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden z-10 rounded-card-lg bg-[rgba(24,12,30,0.86)] backdrop-blur-[28px] backdrop-saturate-150 border-[1.5px] border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_30px_80px_rgba(0,0,0,0.6),0_0_70px_rgba(162,77,184,0.22)]"
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-48 glass-inner-glow pointer-events-none" />
            <div className="relative flex items-start justify-between gap-4 px-6 sm:px-10 pt-7 sm:pt-9 pb-5 border-b border-white/[0.08] shrink-0">
              <div>
                <span className="eyebrow block mb-2">InnerVisio</span>
                <h2 id={titleId} className="text-2xl sm:text-3xl font-display font-bold tracking-tightest text-ink leading-tight">{title}</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="btn-glass focus-ring w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-ink-2 hover:text-ink"
                title="Zavřít"
                aria-label="Zavřít"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="relative px-6 sm:px-10 py-7 overflow-y-auto custom-scrollbar text-ink-2 font-light space-y-6 text-sm sm:text-[15px] leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function PrivacyPolicyModal({ isOpen, onClose }: ModalProps) {
  return (
    <LegalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={<>Zásady ochrany <span className="text-gradient">osobních údajů</span></>}
    >
          <p>Tyto zásady ochrany osobních údajů vysvětlují, jak InnerVisio Studio shromažďuje, používá a chrání vaše osobní údaje v souvislosti s poskytováním služeb architektonické vizualizace.</p>
          
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">1. Jaké údaje shromažďujeme</h3>
            <p className="mb-2">Můžeme shromažďovat následující údaje:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-orchid-soft">
              <li>Vaše jméno a kontaktní údaje (e-mail, telefon, adresa), které nám poskytnete prostřednictvím kontaktních formulářů nebo e-mailové komunikace.</li>
              <li>Podklady pro vizualizace (plány, náčrty, fotografie), které mohou v některých případech obsahovat informace o vašem soukromém vlastnictví či bydlení.</li>
              <li>Fakturační a platební údaje nutné pro zpracování vašich objednávek.</li>
              <li>Technické údaje (IP adresa, cookies, údaje o prohlížeči) při používání našich webových stránek.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">2. Jak údaje používáme</h3>
            <p className="mb-2">Vaše údaje využíváme k následujícím účelům:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-orchid-soft">
              <li>Poskytování sjednaných služeb, zpracování architektonických vizualizací a komunikace týkající se projektů.</li>
              <li>Zpracování fakturace a plnění zákonných evidenčních povinností.</li>
              <li>Zlepšování našich služeb, analýza návštěvnosti a zajištění bezpečnosti webu.</li>
              <li>Zasílání novinek a obchodních sdělení, pokud k tomu udělíte souhlas.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">3. Jak údaje chráníme a sdílíme</h3>
            <p>Vaše údaje zpracováváme důvěrně a s maximálním ohledem na jejich bezpečnost. K údajům mají přístup pouze osoby podílející se na plnění zakázky. Údaje neposkytujeme třetím stranám za účelem marketingu. K předání může dojít pouze důvěryhodným dodavatelům (např. účetní, poskytovatelé IT služeb), kteří jsou vázáni mlčenlivostí, nebo pokud to vyžaduje zákon.</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">4. Vaše práva</h3>
            <p className="mb-2">V souladu s předpisy GDPR máte právo:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-orchid-soft">
              <li>Požadovat přístup ke svým osobním údajům a kopii těchto údajů.</li>
              <li>Požádat o opravu nepřesných nebo neúplných údajů.</li>
              <li>Požádat o výmaz údajů ("právo být zapomenut"), pokud již nejsou potřebné nebo byl odvolán souhlas.</li>
              <li>Omezit zpracování nebo vznést námitku proti zpracování.</li>
              <li>Požádat o přenositelnost údajů k jinému správci.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">5. Kontaktujte nás</h3>
            <p>Pokud máte jakékoli dotazy nebo chcete uplatnit svá práva, kontaktujte nás na e-mailu: <a href="mailto:zakazky@innervisio.cz" className="link-orchid focus-ring rounded font-medium">zakazky@innervisio.cz</a>.</p>
          </div>
          
          <p className="mt-8 pt-4 border-t border-white/[0.08] text-xs text-ink-3">Poslední aktualizace: Duben 2026</p>
    </LegalModalShell>
  );
}

export function TermsOfServiceModal({ isOpen, onClose }: ModalProps) {
  return (
    <LegalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={<>Podmínky <span className="text-gradient">služby</span></>}
    >
          <p>Tyto obchodní podmínky (dále jen "Podmínky") upravují smluvní vztah mezi InnerVisio Studio (dále jen "Zhotovitel") a vámi jako klientem (dále jen "Objednatel") při poskytování služeb v oblasti architektonických vizualizací.</p>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">1. Předmět služeb</h3>
            <p>Zhotovitel poskytuje tvorbu 3D architektonických vizualizací (interiéry, exteriéry, půdorysy, zákresy do fotografií, webové prezentace s vizualizací). Rozsah konkrétní zakázky, její termín a specifikace jsou vymezeny ve vzájemné e-mailové či jiné písemné dohodě a cenové nabídce.</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">2. Podklady a spolupráce</h3>
            <p>Zhotovitel začne na zakázce pracovat na základě dodaných podkladů (půdorysy, CAD výkresy, referenční obrázky atp.). Objednatel se zavazuje, že k dodaným podkladům drží náležitá autorská či distribuční práva. Čas dodání závisí na včasném a úplném dodání podkladů i rychlosti zpětné vazby ze strany Objednatele.</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">3. Revize a úpravy</h3>
            <p>Cena zakázky obvykle zahrnuje předem definovaný počet korekčních kol (pokud není sjednáno jinak, jedná se typicky o 2 kola pro drobné úpravy detailů, materiálů atd.). Případné výrazné zásahy do modelu nebo zadání (např. změna dispozice po odsouhlasení rozpracované vizualizace) ze strany Objednatele mohou být naceněny jako vícepráce formou dodatečné hodinové sazby.</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">4. Autorská práva</h3>
            <p>Po uhrazení plné sjednané ceny náleží Objednateli licence a práva k užívání dodaných výstupů k účelům prezentace, prodeje a marketingu navázanému na předmět vizualizace. Zhotovitel si vyhrazuje právo (pokud není oboustranně písemně sjednáno s ohledem na NDA v dohodě o mlčenlivosti) použít dokončené vizualizace ve svém vlastním portfoliu nebo na sociálních sítích za účelem vlastní propagace po zveřejnění projektu nebo dohodnutém termínu.</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">5. Platební podmínky</h3>
            <p>Na základě odsouhlasené cenové nabídky či sjednané sazby bude Zhotovitelem vystavena faktura. Zhotovitel může před začátkem prací požadovat zaplacení zálohy z celkové částky. Výstupy ve finálním (plném) rozlišení bez jakéhokoliv vodoznaku jsou zpravidla zasílány po proplacení celkové faktury nebo po zaslání potvrzení o provedené platbě.</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold tracking-tightest text-ink mt-2 mb-3">6. Odstoupení od smlouvy a stornopoplatky</h3>
            <p>Objednatel může zakázku před dokončením stornovat. Zhotoviteli však v takovém případě náleží adekvátní odměna a proplacení nákladů úměrně za již odpracované hodiny či vytvořený 3D model, nasvícení a materiálovou přípravu vizualizace. Tuto částku Zhotovitel vyfakturuje na základě odhadu rozpracovanosti, případně si ponechá nezbytnou část vybrané zálohy.</p>
          </div>

          <p className="mt-8 pt-4 border-t border-white/[0.08] text-xs text-ink-3">Tyto podmínky nabývají platnosti od 1. ledna 2024. InnerVisio Studio (Daniel Sváček, IČ: 21666244).</p>
    </LegalModalShell>
  );
}
