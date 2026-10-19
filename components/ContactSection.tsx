import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, ChevronDown, Mail, Phone, MapPin, User } from 'lucide-react';
import { useLanguage, Language } from './LanguageContext';
import { ServiceOptionId, onServiceRequested } from './pricing/pricingNav';
import { BRAND, EASE_OUT, blurInRise } from './ui/brand';
import { trackLead } from '../analytics';

const SERVICE_OPTIONS: Record<Language, { id: ServiceOptionId; label: string }[]> = {
  en: [
    { id: 'ai-staging', label: "AI Home staging" },
    { id: 'ai-viz', label: "AI Visualization" },
    { id: 'ai-video', label: "AI Video" },
    { id: 'ai-package', label: "Listing Package" },
    { id: 'exterior', label: "Exterior Rendering" },
    { id: 'interior', label: "Interior Rendering" },
    { id: 'floor-3d', label: "3D Floor Plans" },
    { id: 'floor-2d', label: "2D Floor Plans" },
    { id: 'tour', label: "Virtual Tours" },
    { id: 'video', label: "Video production" },
    { id: 'web', label: "Developer Configurator" },
  ],
  cs: [
    { id: 'ai-staging', label: "AI home staging" },
    { id: 'ai-viz', label: "AI vizualizace" },
    { id: 'ai-video', label: "AI video" },
    { id: 'ai-package', label: "Balíček pro inzerát" },
    { id: 'exterior', label: "Vizualizace Exteriéru" },
    { id: 'interior', label: "Vizualizace Interiéru" },
    { id: 'floor-3d', label: "3D Půdorysy" },
    { id: 'floor-2d', label: "2D Půdorysy" },
    { id: 'tour', label: "Virtuální prohlídky" },
    { id: 'video', label: "Video tvorba" },
    { id: 'web', label: "Web s konfigurátorem" },
  ],
};

// Subtle glass field with a Soft Orchid focus ring (inputs always match :focus-visible)
const FIELD =
  'w-full rounded-2xl bg-white/[0.05] border border-white/[0.14] px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-3 font-light ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[background-color,border-color,box-shadow] duration-300 outline-none ' +
  'md:hover:border-white/25 focus-visible:border-orchid-soft/70 focus-visible:bg-white/[0.08] focus-visible:shadow-[0_0_0_3px_rgba(196,139,224,0.28)]';

const LABEL = 'block text-sm font-medium text-ink-2';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceOptionId | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const serviceOptions = SERVICE_OPTIONS[language];
  const selectedService = serviceOptions.find(option => option.id === selectedServiceId)?.label || "";

  // Pricing CTAs pre-select the matching service
  useEffect(() => onServiceRequested(setSelectedServiceId), []);

  // When the list opens, move focus to the selected option (or the first one) for keyboard users
  useEffect(() => {
    if (!isDropdownOpen) return;
    const selectedIdx = serviceOptions.findIndex(o => o.id === selectedServiceId);
    const target = optionRefs.current[selectedIdx >= 0 ? selectedIdx : 0];
    const id = window.requestAnimationFrame(() => target?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownOpen]);

  const closeDropdown = (returnFocus: boolean) => {
    setIsDropdownOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const selectOption = (id: ServiceOptionId) => {
    setSelectedServiceId(id);
    closeDropdown(true);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsDropdownOpen(true);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = optionRefs.current.filter(Boolean) as HTMLButtonElement[];
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (i: number) => items[(i + items.length) % items.length]?.focus({ preventScroll: false });

    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusAt(current + 1); break;
      case 'ArrowUp': e.preventDefault(); focusAt(current - 1); break;
      case 'Home': e.preventDefault(); focusAt(0); break;
      case 'End': e.preventDefault(); focusAt(items.length - 1); break;
      case 'Escape': e.preventDefault(); closeDropdown(true); break;
      case 'Tab': closeDropdown(false); break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      alert(t('dropdownWarning') || (language === 'cs' ? "Prosím, vyberte co poptáváte z nabídky 'Poptávám'." : "Please select what you are inquiring about from the list."));
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      service: selectedService,
      message: formData.get('message'),
      // Honeypot: humans never see this field, bots fill it in and get silently dropped server-side
      website: formData.get('website'),
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = language === 'cs' ? 'Odeslání zprávy selhalo' : 'Message delivery failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = language === 'cs'
            ? `Chyba serveru (${response.status}): Odezva nebyla ve formátu JSON. Zkontrolujte, zda jste nastaven RESEND_API_KEY.`
            : `Server Error (${response.status}): Response was not in JSON format. Please verify your RESEND_API_KEY configuration.`;
        }
        throw new Error(errorMessage);
      }

      setIsSubmitted(true);
      trackLead(selectedServiceId || selectedService);
      // Reset after some time
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : (language === 'cs' ? 'Omlouváme se, zprávu se nepodařilo odeslat. Zkuste to prosím později.' : 'We are sorry, we could not send your message. Please try again later.'));
    }
  };

  const details = [
    { icon: Phone, label: language === 'cs' ? 'Telefon' : 'Phone', value: '+420 604 445 240', href: 'tel:+420604445240' },
    { icon: MapPin, label: language === 'cs' ? 'Adresa' : 'Location', value: 'U Stromovky 416/62, Havířov' },
    { icon: User, label: t('contactContactName'), value: 'Daniel Sváček' },
  ];

  return (
    <section id="contact" className="relative z-20 bg-background py-28 md:py-36 px-6">
      {/* Plum glows behind the form card: glass only reads over a glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] max-w-[140vw] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-[20%] left-[-10%] lg:left-[2%] w-[720px] h-[720px] rounded-full glow-plum opacity-90 animate-drift-slow" />
        <div className="absolute bottom-[-10%] left-[30%] w-[480px] h-[480px] rounded-full glow-orchid opacity-40" />
        <div className="absolute top-[-5%] right-[-10%] w-[560px] h-[560px] rounded-full glow-plum opacity-50 animate-drift-slow [animation-delay:-9s]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Form card */}
          <motion.div
            {...blurInRise(0.1)}
            className="glass-strong glass-inner-glow rounded-card-lg p-6 sm:p-8 md:p-10 relative z-20 min-h-[520px] flex flex-col justify-center order-2 lg:order-1"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="space-y-5 md:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className={LABEL}>{t('formName')}</label>
                      <input
                        required
                        name="name"
                        type="text"
                        id="name"
                        autoComplete="name"
                        className={FIELD}
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className={LABEL}>{t('formEmail')}</label>
                      <input
                        required
                        name="email"
                        type="email"
                        id="email"
                        autoComplete="email"
                        className={FIELD}
                        placeholder="jan@email.cz"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className={LABEL}>{t('formSubject')}</label>
                    <input
                      required
                      name="subject"
                      type="text"
                      id="subject"
                      className={FIELD}
                      placeholder={language === 'cs' ? 'Nová vizualizace projektu' : 'New rendering project'}
                    />
                  </div>

                  {/* "Poptávám" custom dropdown: AI services first, divider, then classic 3D */}
                  <div className="space-y-2">
                    <span id="service-label" className={LABEL}>{t('formInquiry')}</span>
                    <div className="relative">
                      <button
                        ref={triggerRef}
                        type="button"
                        id="service-trigger"
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                        aria-controls="service-listbox"
                        aria-labelledby="service-label service-trigger"
                        onClick={() => setIsDropdownOpen(open => !open)}
                        onKeyDown={handleTriggerKeyDown}
                        className={`${FIELD} text-left flex justify-between items-center gap-3 cursor-pointer ${
                          isDropdownOpen ? '!border-orchid-soft/70 !bg-white/[0.08]' : ''
                        }`}
                      >
                        <span className={selectedService ? 'text-ink font-medium' : 'text-ink-3 font-light'}>
                          {selectedService || t('formInquiryPlaceholder')}
                        </span>
                        <ChevronDown
                          aria-hidden
                          strokeWidth={1.75}
                          className={`w-5 h-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDropdownOpen ? 'rotate-180 text-orchid-soft' : 'text-ink-2'}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" aria-hidden onClick={() => closeDropdown(false)} />
                            <motion.div
                              id="service-listbox"
                              role="listbox"
                              aria-labelledby="service-label"
                              onKeyDown={handleListKeyDown}
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.35, ease: EASE_OUT }}
                              className="absolute top-full mt-2 left-0 w-full z-50 rounded-2xl overflow-hidden bg-[rgba(22,11,28,0.97)] backdrop-blur-[28px] backdrop-saturate-150 border-[1.5px] border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(162,77,184,0.18)]"
                            >
                              <div className="p-1.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {serviceOptions.map((option, idx) => {
                                  const isSelected = option.id === selectedServiceId;
                                  return (
                                    <React.Fragment key={option.id}>
                                      {/* Divider between AI services and classic services */}
                                      {idx > 0 && option.id === 'exterior' && <div className="my-1.5 mx-3 h-px bg-white/10" role="presentation" />}
                                      <button
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        ref={el => { optionRefs.current[idx] = el; }}
                                        onClick={() => selectOption(option.id)}
                                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left text-[15px] transition-colors duration-200 outline-none focus-visible:bg-white/[0.09] focus-visible:text-ink focus-visible:shadow-[inset_0_0_0_1.5px_rgba(196,139,224,0.6)] md:hover:bg-white/[0.07] md:hover:text-ink ${
                                          isSelected ? 'text-ink font-medium bg-secondary/20' : 'text-ink-2'
                                        }`}
                                      >
                                        <span>{option.label}</span>
                                        {isSelected && <Check aria-hidden strokeWidth={2} className="w-4 h-4 shrink-0 text-orchid-soft" />}
                                      </button>
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className={LABEL}>{t('formMessage')}</label>
                    <textarea
                      required
                      name="message"
                      id="message"
                      rows={5}
                      className={`${FIELD} resize-none`}
                      placeholder={t('formMessagePlaceholder')}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className={`${BRAND.btnPrimary} group w-full gap-3 px-8 py-4 text-base`}
                  >
                    <span>{t('formSubmitBtn')}</span>
                    <Send className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5" strokeWidth={1.75} />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                  className="text-center py-12"
                >
                  <span className="icon-chip w-20 h-20 rounded-[24px] mx-auto mb-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_50px_rgba(162,77,184,0.45)]">
                    <Check className="w-9 h-9 icon-gradient" strokeWidth={1.5} />
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tightest text-ink mb-3">{t('formSuccessTitle')}</h3>
                  <p className="text-ink-2 font-light max-w-sm mx-auto">{t('formSuccessDesc')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Text column */}
          <div className="order-1 lg:order-2">
            <motion.span {...blurInRise(0)} className={BRAND.eyebrow}>
              {t('contactSubtitle')}
            </motion.span>
            <motion.h2 {...blurInRise(0.05)} className="font-display font-bold text-ink text-[40px] leading-[1.05] sm:text-5xl lg:text-[48px] xl:text-[56px] tracking-tightest mb-6 md:mb-8">
              {language === 'cs' ? (
                <>Jste připraveni vizualizovat své další <span className="text-gradient sm:whitespace-nowrap">mistrovské dílo?</span></>
              ) : (
                <>Ready to render your next <span className="text-gradient sm:whitespace-nowrap">masterpiece?</span></>
              )}
            </motion.h2>
            <motion.p {...blurInRise(0.1)} className={`${BRAND.lead} max-w-md mb-10 md:mb-12`}>
              {t('contactDesc')}
            </motion.p>

            {/* Email: always visible and prominent */}
            <motion.a
              {...blurInRise(0.15, 20)}
              href="mailto:zakazky@innervisio.cz"
              className="group focus-ring flex items-center gap-4 w-full sm:w-fit max-w-full mb-8 p-3 pr-6 rounded-[22px] glass-pill !rounded-[22px] md:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_40px_rgba(162,77,184,0.35)] transition-shadow duration-500"
            >
              <span className={BRAND.iconChip}>
                <Mail className="w-5 h-5 icon-gradient" strokeWidth={1.5} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-ink-3 font-display">Email</span>
                <span className="block link-orchid md:group-hover:text-orchid-pink font-display font-medium text-lg sm:text-xl truncate">zakazky@innervisio.cz</span>
              </span>
            </motion.a>

            <motion.ul {...blurInRise(0.2, 20)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={value} className="flex items-center gap-4 min-w-0">
                  <span className={BRAND.iconChip}>
                    <Icon className="w-5 h-5 icon-gradient" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-[0.18em] text-ink-3 font-display mb-0.5">{label}</span>
                    {href ? (
                      <a href={href} className="focus-ring rounded text-ink md:hover:text-orchid-pink transition-colors font-light text-[15px] sm:text-base">{value}</a>
                    ) : (
                      <span className="text-ink font-light text-[15px] sm:text-base">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

        </div>
      </div>
    </section>
  );
};
