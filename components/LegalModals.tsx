import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#0a050a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="text-2xl font-display font-semibold text-white">Zásady ochrany osobních údajů</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Zavřít"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar text-gray-300 space-y-6 text-sm leading-relaxed">
              <p>Tyto zásady ochrany osobních údajů vysvětlují, jak InnerVisio Studio shromažďuje, používá a chrání vaše osobní údaje v souvislosti s poskytováním služeb architektonické vizualizace.</p>
              
              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">1. Jaké údaje shromažďujeme</h3>
                <p className="mb-2">Můžeme shromažďovat následující údaje:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Vaše jméno a kontaktní údaje (e-mail, telefon, adresa), které nám poskytnete prostřednictvím kontaktních formulářů nebo e-mailové komunikace.</li>
                  <li>Podklady pro vizualizace (plány, náčrty, fotografie), které mohou v některých případech obsahovat informace o vašem soukromém vlastnictví či bydlení.</li>
                  <li>Fakturační a platební údaje nutné pro zpracování vašich objednávek.</li>
                  <li>Technické údaje (IP adresa, cookies, údaje o prohlížeči) při používání našich webových stránek.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">2. Jak údaje používáme</h3>
                <p className="mb-2">Vaše údaje využíváme k následujícím účelům:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Poskytování sjednaných služeb, zpracování architektonických vizualizací a komunikace týkající se projektů.</li>
                  <li>Zpracování fakturace a plnění zákonných evidenčních povinností.</li>
                  <li>Zlepšování našich služeb, analýza návštěvnosti a zajištění bezpečnosti webu.</li>
                  <li>Zasílání novinek a obchodních sdělení, pokud k tomu udělíte souhlas.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">3. Jak údaje chráníme a sdílíme</h3>
                <p>Vaše údaje zpracováváme důvěrně a s maximálním ohledem na jejich bezpečnost. K údajům mají přístup pouze osoby podílející se na plnění zakázky. Údaje neposkytujeme třetím stranám za účelem marketingu. K předání může dojít pouze důvěryhodným dodavatelům (např. účetní, poskytovatelé IT služeb), kteří jsou vázáni mlčenlivostí, nebo pokud to vyžaduje zákon.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">4. Vaše práva</h3>
                <p className="mb-2">V souladu s předpisy GDPR máte právo:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Požadovat přístup ke svým osobním údajům a kopii těchto údajů.</li>
                  <li>Požádat o opravu nepřesných nebo neúplných údajů.</li>
                  <li>Požádat o výmaz údajů ("právo být zapomenut"), pokud již nejsou potřebné nebo byl odvolán souhlas.</li>
                  <li>Omezit zpracování nebo vznést námitku proti zpracování.</li>
                  <li>Požádat o přenositelnost údajů k jinému správci.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">5. Kontaktujte nás</h3>
                <p>Pokud máte jakékoli dotazy nebo chcete uplatnit svá práva, kontaktujte nás na e-mailu: <a href="mailto:innervisio@gmail.com" className="text-primary hover:text-white transition-colors">innervisio@gmail.com</a>.</p>
              </div>
              
              <p className="mt-8 pt-4 border-t border-white/5 text-xs text-gray-500">Poslední aktualizace: Duben 2026</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function TermsOfServiceModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#0a050a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="text-2xl font-display font-semibold text-white">Podmínky služby</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Zavřít"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar text-gray-300 space-y-6 text-sm leading-relaxed">
              <p>Tyto obchodní podmínky (dále jen "Podmínky") upravují smluvní vztah mezi InnerVisio Studio (dále jen "Zhotovitel") a vámi jako klientem (dále jen "Objednatel") při poskytování služeb v oblasti architektonických vizualizací.</p>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">1. Předmět služeb</h3>
                <p>Zhotovitel poskytuje tvorbu 3D architektonických vizualizací (interiéry, exteriéry, půdorysy, zákresy do fotografií, webové prezentace s vizualizací). Rozsah konkrétní zakázky, její termín a specifikace jsou vymezeny ve vzájemné e-mailové či jiné písemné dohodě a cenové nabídce.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">2. Podklady a spolupráce</h3>
                <p>Zhotovitel začne na zakázce pracovat na základě dodaných podkladů (půdorysy, CAD výkresy, referenční obrázky atp.). Objednatel se zavazuje, že k dodaným podkladům drží náležitá autorská či distribuční práva. Čas dodání závisí na včasném a úplném dodání podkladů i rychlosti zpětné vazby ze strany Objednatele.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">3. Revize a úpravy</h3>
                <p>Cena zakázky obvykle zahrnuje předem definovaný počet korekčních kol (pokud není sjednáno jinak, jedná se typicky o 2 kola pro drobné úpravy detailů, materiálů atd.). Případné výrazné zásahy do modelu nebo zadání (např. změna dispozice po odsouhlasení rozpracované vizualizace) ze strany Objednatele mohou být naceněny jako vícepráce formou dodatečné hodinové sazby.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">4. Autorská práva</h3>
                <p>Po uhrazení plné sjednané ceny náleží Objednateli licence a práva k užívání dodaných výstupů k účelům prezentace, prodeje a marketingu navázanému na předmět vizualizace. Zhotovitel si vyhrazuje právo (pokud není oboustranně písemně sjednáno s ohledem na NDA v dohodě o mlčenlivosti) použít dokončené vizualizace ve svém vlastním portfoliu nebo na sociálních sítích za účelem vlastní propagace po zveřejnění projektu nebo dohodnutém termínu.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">5. Platební podmínky</h3>
                <p>Na základě odsouhlasené cenové nabídky či sjednané sazby bude Zhotovitelem vystavena faktura. Zhotovitel může před začátkem prací požadovat zaplacení zálohy z celkové částky. Výstupy ve finálním (plném) rozlišení bez jakéhokoliv vodoznaku jsou zpravidla zasílány po proplacení celkové faktury nebo po zaslání potvrzení o provedené platbě.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">6. Odstoupení od smlouvy a stornopoplatky</h3>
                <p>Objednatel může zakázku před dokončením stornovat. Zhotoviteli však v takovém případě náleží adekvátní odměna a proplacení nákladů úměrně za již odpracované hodiny či vytvořený 3D model, nasvícení a materiálovou přípravu vizualizace. Tuto částku Zhotovitel vyfakturuje na základě odhadu rozpracovanosti, případně si ponechá nezbytnou část vybrané zálohy.</p>
              </div>

              <p className="mt-8 pt-4 border-t border-white/5 text-xs text-gray-500">Tyto podmínky nabývají platnosti od 1. ledna 2024. InnerVisio Studio (Daniel Sváček, IČ: 21666244).</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
