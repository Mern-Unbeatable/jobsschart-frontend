import React, { useState, useEffect, useRef } from 'react';
import { useSEO } from '../hooks/useSEO';
import { FileText, Search, Printer, ArrowRight, ShieldAlert, Mail, Info } from 'lucide-react';

const privacySections = [
  {
    id: 'artikel-1',
    title: 'Artikel 1: Algemeen & Identiteit',
    content: [
      '1. Dit privacybeleid is van toepassing op de verwerking van persoonsgegevens door DCAPZ B.V., gevestigd te Dordrecht aan de Wijnstraat 75, ingeschreven in het Handelsregister van de Kamer van Koophandel onder nummer 42039361 (hierna te noemen: "DCAPZ" of "wij").',
      '2. DCAPZ is de verwerkingsverantwoordelijke voor de verwerking van persoonsgegevens via de website IlluminOracle.nl en alle bijbehorende subdomeinen en functionaliteiten.',
      '3. Wij respecteren uw privacy en dragen er zorg voor dat de persoonlijke informatie die u ons verschaft te allen tijde vertrouwelijk en in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG) wordt behandeld.'
    ]
  },
  {
    id: 'artikel-2',
    title: 'Artikel 2: Welke persoonsgegevens verwerken wij?',
    content: [
      'Wij kunnen de volgende gegevens verwerken die u direct of indirect aan ons verstrekt:',
      '• Account- en profielgegevens: Gebruikersnaam, e-mailadres, wachtwoord (versleuteld), telefoonnummer en eventuele profielfoto of persoonlijke beschrijving.',
      '• Financiële gegevens: Gegevens met betrekking tot de aanschaf van beltegoed, transactiehistorie en bankrekeningnummers bij terugstortingstegoeden.',
      '• Technische gegevens & Gebruiksgegevens: IP-adres, browser- en apparaattype, cookie-ID\'s, bezochte pagina\'s, duur van het bezoek en klikgedrag.',
      '• Communicatiegegevens: Inhoud van e-mails, chatberichten, feedback, reviews of vragen die u aan onze klantenservice of consulenten stuurt.',
      '• Metadata van consulten: Datum, tijdstip, duur en het type van de tot stand gekomen telefonische- of chatconsulten. De inhoud van telefoongesprekken wordt door DCAPZ uitdrukkelijk niet opgenomen.'
    ]
  },
  {
    id: 'artikel-3',
    title: 'Artikel 3: Doeleinden en grondslagen van de verwerking',
    content: [
      'DCAPZ verwerkt uw persoonsgegevens uitsluitend voor de volgende doeleinden:',
      '1. Uitvoering van de overeenkomst: Om het platform te laten functioneren, uw account te beheren, u te koppelen met consulenten en uw beltegoed te administreren.',
      '2. Wettelijke verplichting: Om te voldoen aan administratieve en fiscale wetgeving, zoals de fiscale bewaarplicht van facturen en transacties.',
      '3. Gerechtvaardigd belang: Om het platform te beveiligen, misbruik of fraude te voorkomen, technische storingen op te lossen en de kwaliteit van onze diensten te analyseren en te verbeteren.',
      '4. Toestemming: Indien u ons expliciet toestemming heeft gegeven voor marketingdoeleinden (zoals nieuwsbrieven) of het plaatsen van specifieke trackingcookies.'
    ]
  },
  {
    id: 'artikel-4',
    title: 'Artikel 4: Bewaartermijn van persoonsgegevens',
    content: [
      '1. Wij bewaren uw persoonsgegevens niet langer dan strikt noodzakelijk is om de doelen te realiseren waarvoor uw gegevens worden verzameld.',
      '2. Accountgegevens worden bewaard zolang uw account actief is. Indien u uw account verwijdert, zullen de persoonsgegevens binnen 30 dagen worden gewist of geanonimiseerd, tenzij een wettelijke verplichting langere bewaring vereist.',
      '3. Transactiegegevens en administratieve gegevens die fiscaal relevant zijn, bewaren wij gedurende de wettelijk verplichte termijn van 7 jaar conform de Nederlandse belastingwetgeving.'
    ]
  },
  {
    id: 'artikel-5',
    title: 'Artikel 5: Delen van gegevens met derden',
    content: [
      '1. Wij verstrekken uw persoonsgegevens alleen aan derden indien dit noodzakelijk is voor de uitvoering van onze overeenkomst met u, of om te voldoen aan een wettelijke verplichting.',
      '2. Consulenten: Om een telefonisch- of chatconsult mogelijk te maken, delen we de noodzakelijke technische identificatoren. Consulenten zijn zelfstandig en treden op als afzonderlijke verwerkingsverantwoordelijken voor de adviezen die zij geven.',
      '3. Verwerkers: Wij maken gebruik van externe dienstverleners (zoals hostingproviders, betalingsverwerkers en mailingsystemen) die in onze opdracht gegevens verwerken. Met deze partijen sluiten wij verwerkersovereenkomsten om de veiligheid en privacy van uw gegevens te garanderen.'
    ]
  },
  {
    id: 'artikel-6',
    title: 'Artikel 6: Cookies',
    content: [
      '1. IlluminOracle.nl maakt gebruik van functionele, analytische en trackingcookies.',
      '2. Functionele cookies zijn noodzakelijk voor de technische werking van de website (bijvoorbeeld om ingelogd te blijven of uw taalkeuze te onthouden). hiervoor is geen voorafgaande toestemming vereist.',
      '3. Analytische cookies gebruiken we om het websitegebruik te meten en te verbeteren. Deze zijn privacyvriendelijk ingesteld conform de richtlijnen van de Autoriteit Persoonsgegevens.',
      '4. Voor tracking- en advertentiecookies vragen wij vooraf uw uitdrukkelijke toestemming via onze cookiebanner.'
    ]
  },
  {
    id: 'artikel-7',
    title: 'Artikel 7: Beveiliging van persoonsgegevens',
    content: [
      '1. DCAPZ neemt de bescherming van uw gegevens serieus en neemt passende technische en organisatorische maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan.',
      '2. Onze website maakt gebruik van een betrouwbaar SSL-certificaat om te zorgen dat uw persoonlijke gegevens niet in verkeerde handen vallen tijdens verzending.',
      '3. Wachtwoorden worden via moderne cryptografische hashingmethoden versleuteld opgeslagen.'
    ]
  },
  {
    id: 'artikel-8',
    title: 'Artikel 8: Uw rechten',
    content: [
      'Onder de AVG heeft u de volgende rechten met betrekking tot uw persoonsgegevens:',
      '• Recht op inzage: U kunt ons vragen welke gegevens we van u hebben geregistreerd.',
      '• Recht op rectificatie en aanvulling: U kunt onjuiste gegevens laten corrigeren of aanvullen.',
      '• Recht op verwijdering ("vergetelheid"): U kunt verzoeken uw gegevens te wissen.',
      '• Recht op beperking van de verwerking: U kunt tijdelijk de verwerking van uw gegevens laten stopzetten.',
      '• Recht op dataportabiliteit: U kunt verzoeken om overdracht van uw gegevens aan een andere partij.',
      '• Recht van bezwaar: U kunt bezwaar maken tegen de verwerking van uw gegevens op basis van gerechtvaardigd belang.',
      'Verzoeken hiertoe kunt u indienen via info@netwerkmediums.nl. Wij reageren zo snel mogelijk, maar in ieder geval binnen vier weken.'
    ]
  },
  {
    id: 'artikel-9',
    title: 'Artikel 9: Wijzigingen in dit privacybeleid',
    content: [
      '1. DCAPZ behoudt zich het recht voor om dit privacybeleid op ieder gewenst moment aan te passen.',
      '2. Wijzigingen worden op de website gepubliceerd. Wij raden u aan dit privacybeleid regelmatig te raadplegen, zodat u van eventuele wijzigingen op de hoogte bent.',
      '3. Indien wijzigingen van ingrijpende aard zijn, zullen wij u hierover via e-mail of een duidelijke melding op het platform informeren.'
    ]
  },
  {
    id: 'artikel-10',
    title: 'Artikel 10: Contact en Klachten',
    content: [
      '1. Heeft u vragen of opmerkingen over dit privacybeleid, neem dan contact met ons op via info@netwerkmediums.nl of per post via de hieronder vermelde bedrijfsgegevens.',
      '2. Mocht u er met ons niet uitkomen, dan heeft u tevens het recht om een klacht in te dienen bij de nationale toezichthouder, de Autoriteit Persoonsgegevens. Dit kan via de website: www.autoriteitpersoonsgegevens.nl.'
    ]
  }
];

const PrivacyPolicy = () => {
  useSEO({
    title: 'Privacybeleid - IlluminOracle',
    description: 'Privacybeleid en bescherming van persoonsgegevens door DCAPZ voor het IlluminOracle platform.',
    keywords: ['privacy', 'privacybeleid', 'cookies', 'AVG', 'persoonsgegevens', 'IlluminOracle', 'DCAPZ'],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(privacySections[0].id);
  const contentRefs = useRef({});

  // Setup refs dynamically
  privacySections.forEach((sec) => {
    if (!contentRefs.current[sec.id]) {
      contentRefs.current[sec.id] = React.createRef();
    }
  });

  // Handle intersection observer to highlight current section in sidebar while scrolling
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0.2],
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    privacySections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // offset for sticky nav/header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter sections based on search query
  const filteredSections = privacySections.filter(sec => {
    const titleMatch = sec.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = sec.content.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()));
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased pt-24 pb-16">
      
      {/* Background Gradient Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-[380px] bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Hero Header */}
      <div className="container mx-auto px-4 max-w-7xl mb-12 relative z-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl/10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gray-50 rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-purple-100/50">
              <ShieldAlert size={14} className="text-purple-600" />
              <span>Privacy & AVG</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Privacybeleid
            </h1>
            <p className="text-gray-500 font-medium">
              IlluminOracle.nl – DCAPZ &bull; Laatst bijgewerkt: juni 2026
            </p>
          </div>

          <div className="flex gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              <Printer size={16} />
              <span>Printen</span>
            </button>
            <a
              href="mailto:info@netwerkmediums.nl"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-600/20"
            >
              <Mail size={16} />
              <span>Stel een vraag</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Search Bar */}
        <div className="mb-8 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Zoek in het privacybeleid..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium"
            />
          </div>
          {searchQuery && (
            <p className="mt-2.5 text-sm text-gray-500">
              {filteredSections.length} {filteredSections.length === 1 ? 'sectie gevonden' : 'secties gevonden'} voor "{searchQuery}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 scrollbar-thin">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Inhoudsopgave
              </h3>
              <nav className="space-y-1">
                {privacySections.map((sec) => {
                  const isFilteredOut = !filteredSections.some(f => f.id === sec.id);
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      disabled={isFilteredOut}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between text-sm font-semibold group ${
                        activeSection === sec.id
                          ? 'bg-purple-50 text-purple-700'
                          : isFilteredOut
                            ? 'opacity-40 cursor-not-allowed text-gray-400'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="truncate">{sec.title.replace('Artikel ', 'Art. ')}</span>
                      <ArrowRight 
                        size={14} 
                        className={`transition-transform duration-300 ${
                          activeSection === sec.id 
                            ? 'translate-x-0 opacity-100 text-purple-600' 
                            : 'translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-gray-400'
                        }`} 
                      />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden hidden lg:block">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
              <Info className="mb-4 text-purple-300" size={24} />
              <h4 className="font-bold text-lg mb-2">Vragen over uw privacy?</h4>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Neem contact op met DCAPZ voor al uw vragen over de AVG en hoe we uw persoonsgegevens beveiligen.
              </p>
              <a 
                href="mailto:info@netwerkmediums.nl"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-purple-900 px-4 py-2.5 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <span>info@netwerkmediums.nl</span>
              </a>
            </div>
          </aside>

          {/* Articles Content Area */}
          <main className="lg:col-span-8 space-y-6">
            {filteredSections.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-1">Geen resultaten gevonden</h3>
                <p className="text-gray-500">Probeer een andere zoekterm om specifieke artikelen te vinden.</p>
              </div>
            ) : (
              filteredSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 p-8 shadow-sm ${
                      isActive 
                        ? 'border-purple-600/30 ring-1 ring-purple-600/30' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
                      <span className="w-1.5 h-6 rounded-full bg-purple-600 block" />
                      {sec.title}
                    </h2>
                    <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 font-medium">
                      {sec.content.map((paragraph, index) => {
                        const isBullet = paragraph.trim().startsWith('•') || paragraph.trim().startsWith('*');
                        return (
                          <p 
                            key={index}
                            className={`${isBullet ? 'pl-4 -indent-4 text-gray-600' : 'text-gray-700'}`}
                          >
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </article>
                );
              })
            )}

            {/* Final Contact Details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Bedrijfsgegevens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold text-gray-600">
                <div className="space-y-1">
                  <p className="text-gray-900 font-bold">DCAPZ B.V.</p>
                  <p>Wijnstraat 75</p>
                  <p>3311 BT Dordrecht</p>
                </div>
                <div className="space-y-1">
                  <p>KvK-nummer: 42039361</p>
                  <p>BTW-nummer: NL005448711B24</p>
                  <p>E-mail: <a href="mailto:info@netwerkmediums.nl" className="text-purple-600 hover:underline">info@netwerkmediums.nl</a></p>
                </div>
              </div>
            </div>
          </main>

        </div>

      </div>

    </div>
  );
};

export default PrivacyPolicy;
