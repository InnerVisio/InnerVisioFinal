import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from './LanguageContext';

const getServicesOptions = (language: Language): string[] => {
  if (language === 'en') {
    return [
      "Exterior Rendering",
      "Interior Rendering",
      "3D Floor Plans",
      "2D Floor Plans",
      "Virtual Tours",
      "Developer Configurator"
    ];
  } else {
    return [
      "Vizualizace Exteriéru",
      "Vizualizace Interiéru",
      "3D Půdorysy",
      "2D Půdorysy",
      "Virtuální prohlídky",
      "Web s konfigurátorem"
    ];
  }
};

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const serviceOptions = getServicesOptions(language);

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
      // Reset after some time
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : (language === 'cs' ? 'Omlouváme se, zprávu se nepodařilo odeslat. Zkuste to prosím později.' : 'We are sorry, we could not send your message. Please try again later.'));
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-[#0a050a] border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-[#050205] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative min-h-[500px] flex flex-col justify-center order-1"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6" 
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-400">{t('formName')}</label>
                      <input 
                        required
                        name="name"
                        type="text" 
                        id="name" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary md:focus:bg-white/10 transition-all font-light"
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-400">{t('formEmail')}</label>
                      <input 
                        required
                        name="email"
                        type="email" 
                        id="email" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary md:focus:bg-white/10 transition-all font-light"
                        placeholder="jan@email.cz"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-400">{t('formSubject')}</label>
                    <input 
                      required
                      name="subject"
                      type="text" 
                      id="subject" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary md:focus:bg-white/10 transition-all font-light"
                      placeholder={language === 'cs' ? 'Nová vizualizace projektu' : 'New rendering project'}
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-gray-400">{t('formInquiry')}</label>
                    <div 
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center transition-all ${isDropdownOpen ? 'border-secondary md:bg-white/10' : 'border-white/10 md:hover:bg-white/10 md:hover:border-white/20'}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className={selectedService ? "text-white font-medium" : "text-gray-500 font-light"}>
                        {selectedService || t('formInquiryPlaceholder')}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[85px] left-0 w-full z-50 bg-[#0a050a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
                          >
                            <div className="py-2">
                              {serviceOptions.map((option, idx) => (
                                <div
                                  key={idx}
                                  className="px-4 py-2.5 text-sm md:text-base text-gray-300 md:hover:text-white md:hover:bg-secondary/20 cursor-pointer transition-colors"
                                  onClick={() => {
                                    setSelectedService(option);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-400">{t('formMessage')}</label>
                    <textarea 
                      required
                      name="message"
                      id="message" 
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary md:focus:bg-white/10 transition-all resize-none font-light"
                      placeholder={t('formMessagePlaceholder')}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full group flex items-center justify-center gap-3 px-8 py-4 bg-secondary md:hover:bg-[#7a2c85] text-white rounded-xl font-semibold transition-all shadow-[0_0_30px_rgba(101,36,111,0.3)] md:hover:shadow-[0_0_50px_rgba(101,36,111,0.5)]"
                  >
                    <span>{t('formSubmitBtn')}</span>
                    <Send className="w-4 h-4 md:group-hover:translate-x-1 md:group-hover:-translate-y-1 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-secondary/30">
                    <CheckCircle className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">{t('formSuccessTitle')}</h3>
                  <p className="text-gray-400 font-light">{t('formSuccessDesc')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Text */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 animate-fade-in"
          >
            <span className="text-secondary font-medium tracking-widest uppercase text-xs md:text-sm mb-4 block font-display">
              {t('contactSubtitle')}
            </span>
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 tracking-tighter leading-tight">
              {language === 'cs' ? (
                <>Jste připraveni vizualizovat <br/> své další <span className="text-gray-500">mistrovské dílo?</span></>
              ) : (
                <>Ready to render <br/> your next <span className="text-gray-500">masterpiece?</span></>
              )}
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-md mb-12 font-light">
              {t('contactDesc')}
            </p>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2 font-display">Email</h3>
                <a href="mailto:innervisio@gmail.com" className="text-gray-400 md:hover:text-secondary transition-colors font-light text-sm sm:text-base">innervisio@gmail.com</a>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2 font-display">{language === 'cs' ? 'Telefon' : 'Phone'}</h3>
                <a href="tel:+420604445240" className="text-gray-400 md:hover:text-secondary transition-colors font-light text-sm sm:text-base">+420 604 445 240</a>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2 font-display">{language === 'cs' ? 'Adresa' : 'Location'}</h3>
                <p className="text-gray-400 font-light text-sm sm:text-base">U Stromovky 416/62, Havířov</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2 font-display">{t('contactContactName')}</h3>
                <p className="text-gray-400 font-light text-sm sm:text-base">Daniel Sváček</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
