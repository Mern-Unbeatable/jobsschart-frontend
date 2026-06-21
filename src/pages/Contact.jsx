import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Mail, MapPin, Landmark, Send, CheckCircle2, MessageSquare, PhoneCall, ShieldCheck } from 'lucide-react';

const Contact = () => {
  useSEO({
    title: 'Contact - IlluminOracle',
    description: 'Neem contact op met het team van IlluminOracle en DCAPZ voor support, vragen over uw beltegoed of samenwerkingsmogelijkheden.',
    keywords: ['contact', 'support', 'klantenservice', 'IlluminOracle', 'DCAPZ', 'Dordrecht'],
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased pt-24 pb-16">
      
      {/* Background Gradient Elements */}
      <div className="absolute top-0 left-0 right-0 h-[380px] bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Header */}
      <div className="container mx-auto px-4 max-w-7xl mb-12 relative z-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl/10 p-8 md:p-12 text-center max-w-3xl mx-auto overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gray-50 rounded-full pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-purple-50/30 rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-purple-100/50">
              <MessageSquare size={14} />
              <span>We staan voor u klaar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Neem contact op
            </h1>
            <p className="text-gray-500 text-base font-medium leading-relaxed max-w-xl mx-auto">
              Heeft u een vraag over ons platform, uw account of beltegoed? Stuur ons gerust een bericht. Ons supportteam helpt u graag verder.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details & Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Info Cards List */}
            <div className="space-y-6">
              
              {/* Mail Box */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-start gap-4 hover:border-purple-600/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">E-mail</h3>
                  <p className="text-gray-500 text-sm mb-2 font-medium">Stuur ons direct een e-mailbericht.</p>
                  <a href="mailto:info@netwerkmediums.nl" className="text-purple-600 hover:underline font-bold text-sm">
                    info@netwerkmediums.nl
                  </a>
                </div>
              </div>

              {/* Location Box */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-start gap-4 hover:border-purple-600/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Hoofdkantoor</h3>
                  <p className="text-gray-500 text-sm mb-2 font-medium">Onze fysieke kantoorlocatie.</p>
                  <p className="text-gray-700 font-bold text-sm leading-relaxed">
                    DCAPZ B.V.<br />
                    Wijnstraat 75<br />
                    3311 BT Dordrecht
                  </p>
                </div>
              </div>

              {/* Corporate Details */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-start gap-4 hover:border-purple-600/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Landmark size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Bedrijfsregistratie</h3>
                  <p className="text-gray-500 text-sm mb-2 font-medium">Kamer van Koophandel & Belastingdienst.</p>
                  <div className="text-gray-700 font-bold text-sm space-y-1">
                    <p>KvK-nummer: 42039361</p>
                    <p>BTW-nummer: NL005448711B24</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Help Callout */}
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
              <ShieldCheck className="mb-4 text-purple-300" size={32} />
              <h4 className="font-bold text-xl mb-2">Veilig & Betrouwbaar</h4>
              <p className="text-purple-200 text-sm mb-0 leading-relaxed font-medium">
                Als beheerder van het IlluminOracle platform garandeert DCAPZ een zorgvuldige verwerking van uw gegevens en een beveiligde betalingsinfrastructuur.
              </p>
            </div>

          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full flex flex-col justify-center">
              
              {submitSuccess ? (
                <div className="text-center py-12 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Bericht verzonden!</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-6">
                    Bedankt voor uw bericht. Ons team zal uw vraag zo snel mogelijk en uiterlijk binnen 24 uur in behandeling nemen.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-600/20"
                  >
                    Nieuw bericht sturen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                        Uw Naam
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="bijv. Jan de Vries"
                        className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                        E-mailadres
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="bijv. jan@voorbeeld.nl"
                        className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                      Onderwerp
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Waar gaat uw vraag over?"
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                      Bericht
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Typ hier uw bericht of vraag..."
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Verzend bericht</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;
