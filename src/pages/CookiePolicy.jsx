import React, { useState, useEffect, useRef } from 'react';
import { useSEO } from '../hooks/useSEO';
import { FileText, Search, Printer, ArrowRight, ShieldCheck, Mail, Info } from 'lucide-react';

const cookieSections = [
  {
    id: 'artikel-1',
    title: 'Artikel 1: Inleiding en werkingssfeer',
    content: [
      'Dit cookiebeleid is van toepassing op alle cookies en vergelijkbare trackingtechnologieën die worden ingezet via de website IlluminOracle.nl en alle bijbehorende subdomeinen, pagina\'s en functionaliteiten die worden beheerd door DCAPZ, gevestigd te Dordrecht.',
      'Met dit beleid willen wij u op een begrijpelijke en transparante wijze informeren over:',
      '• welke cookies wij gebruiken;',
      '• met welk doel wij deze inzetten;',
      '• op welke juridische grondslag wij dit doen;',
      '• hoe u uw cookievoorkeuren kunt beheren en wijzigen.',
      'Dit cookiebeleid is een aanvulling op ons privacybeleid, waarin wij uitgebreid ingaan op de wijze waarop wij met persoonsgegevens omgaan. Beide beleidsstukken zijn onlosmakelijk met elkaar verbonden.'
    ]
  },
  {
    id: 'artikel-2',
    title: 'Artikel 2: Wat zijn cookies en vergelijkbare technieken?',
    content: [
      'Cookies zijn eenvoudige tekstbestanden die bij een bezoek aan een website op uw apparaat (computer, smartphone, tablet) worden geplaatst. Deze bestanden slaan informatie op die bij een volgend bezoek weer kan worden uitgelezen door de server van de website.',
      'Naast traditionele cookies kunnen wij ook gebruikmaken van:',
      '• JavaScript-tags en pixels (zichtbare en onzichtbare afbeeldingen);',
      '• Local storage en session storage (opslag in uw browser);',
      '• Device fingerprints of apparaat-ID\'s (bijvoorbeeld bij gebruik via mobiele apparaten).',
      'In dit beleid gebruiken wij voor al deze technieken gemakshalve de verzamelterm "cookies".',
      'Het is belangrijk om te weten dat cookies geen schadelijke programma\'s zijn. Zij kunnen geen virussen verspreiden of toegang krijgen tot bestanden op uw apparaat. Wel kunnen zij worden gebruikt om informatie te verzamelen over uw surfgedrag en apparaatgebruik.'
    ]
  },
  {
    id: 'artikel-3',
    title: 'Artikel 3: Categorieën cookies die wij kunnen plaatsen',
    content: [
      'Op IlluminOracle.nl maken wij gebruik van verschillende soorten cookies, die wij hieronder per categorie toelichten.',
      '3.1 Functionele en strikt noodzakelijke cookies',
      'Deze cookies zijn essentieel voor de basisfunctionaliteit van de website. Zonder deze cookies kan de website niet naar behoren werken en kunnen wij de door u gevraagde diensten niet leveren.',
      'Deze cookies worden onder meer gebruikt voor:',
      '• het onthouden van uw inlogsessie;',
      '• het correct verwerken van betalingen en beltegoedtransacties;',
      '• het opslaan van uw cookievoorkeuren, zodat de cookiebanner niet telkens opnieuw verschijnt;',
      '• het waarborgen van de basale veiligheid en stabiliteit van de website.',
      'Rechtsgrond: Voor deze cookies is geen toestemming vereist. De grondslag is het gerechtvaardigd belang van DCAPZ om een functionerende, veilige en betrouwbare website te kunnen aanbieden, zoals vastgelegd in artikel 6 lid 1 sub f van de Algemene Verordening Gegevensbescherming (AVG) en overeenkomstig de e-Privacyrichtlijn (2002/58/EG). Deze cookies kunnen niet via de cookiebanner worden uitgeschakeld.',
      '3.2 Analytische cookies',
      'Met analytische cookies verzamelen wij gegevens over het gebruik van onze website. Deze inzichten helpen ons om de website te verbeteren, de gebruiksvriendelijkheid te optimaliseren en eventuele technische problemen op te sporen.',
      'Denk hierbij aan informatie zoals:',
      '• welke pagina\'s het meest worden bezocht;',
      '• hoe bezoekers op de website terechtkomen (via zoekmachines, sociale media, direct verkeer);',
      '• welke apparaten en browsers worden gebruikt;',
      '• of en waar foutmeldingen optreden.',
      'Wij streven ernaar om analytische cookies zo privacy-vriendelijk mogelijk in te zetten. Waar mogelijk anonimiseren wij IP-adressen en beperken wij de verzameling van persoonsgegevens tot het strikt noodzakelijke.',
      'Rechtsgrond: Voor analytische cookies die geen of slechts een verwaarloosbare impact hebben op uw privacy, kunnen wij ons beroepen op ons gerechtvaardigd belang (artikel 6 lid 1 sub f AVG). Indien wij echter analytische cookies gebruiken die meer vergaande gevolgen hebben voor uw privacy, vragen wij hiervoor uw voorafgaande toestemming. De keuze is aan ons, en wij kunnen op basis van onze professionele afweging bepalen welke cookies wij onder welk regime plaatsen, zoals toegestaan onder het Europese kader voor elektronische communicatie (Richtlijn 2002/58/EG, zoals gewijzigd).',
      '3.3 Marketing- en trackingcookies',
      'Marketing- en trackingcookies worden gebruikt om bezoekers over verschillende websites heen te volgen. Het primaire doel is om u (meer) relevante advertenties te tonen, campagnes te optimaliseren en de effectiviteit van onze marketinginspanningen te meten.',
      'Deze cookies kunnen worden geplaatst door IlluminOracle zelf (first-party) of door derde partijen, zoals advertentienetwerken, waarmee wij samenwerken (third-party).',
      'Toepassingen zijn onder meer:',
      '• het tonen van gepersonaliseerde advertenties op basis van eerder websitegedrag;',
      '• het beperken van het aantal keren dat u een bepaalde advertentie ziet;',
      '• het meten van conversies en campagneresultaten;',
      '• het opbouwen van doelgroepsegmenten voor advertentieplatforms.',
      'Rechtsgrond: Voor marketing- en trackingcookies vragen wij uw uitdrukkelijke toestemming via de cookiebanner of via uw persoonlijke instellingen op de website. Dit gebeurt conform de vereisten van de AVG en de e-Privacyregelgeving. U kunt uw toestemming te allen tijde intrekken of wijzigen. Wij maken daarbij gebruik van de flexibiliteit die de Europese Unie biedt in de interpretatie van toestemming onder de AVG, waarbij wij streven naar een gebruiksvriendelijke invulling die recht doet aan zowel uw privacy als onze commerciële belangen.',
      '3.4 Social media cookies',
      'Social media cookies worden geplaatst door socialmediaplatforms zoals bijvoorbeeld Facebook, Instagram, YouTube, TikTok of andere vergelijkbare diensten. Dit gebeurt wanneer u content deelt via socialmediaknoppen of wanneer op de website ingebedde socialmediacontent wordt getoond.',
      'Deze platforms kunnen u herkennen wanneer u bent ingelogd op hun dienst en kunnen de verzamelde gegevens gebruiken voor hun eigen doeleinden, zoals gepersonaliseerde advertenties en contentoptimalisatie.',
      'Rechtsgrond: Voor social media cookies vragen wij uw toestemming. Het gebruik van deze cookies valt onder de verantwoordelijkheid van de desbetreffende socialmediapartijen. Voor hun gegevensverwerking verwijzen wij naar hun eigen privacy- en cookiebeleid. Wij maken hierbij gebruik van de Nederlandse en Europese wetgeving die ruimte biedt voor een pragmatische invulling van toestemming, waarbij wij ons kunnen beroepen op de richtlijnen van de Europese Commissie en de jurisprudentie van het Hof van Justitie van de Europese Unie die ons in staat stellen om cookies op een proportionele en evenwichtige wijze in te zetten.'
    ]
  },
  {
    id: 'artikel-4',
    title: 'Artikel 4: Overzicht van mogelijke cookies',
    content: [
      'Bij uw eerste bezoek aan IlluminOracle.nl tonen wij een duidelijke cookiebanner, waarin u uw voorkeuren kunt aangeven. Afhankelijk van uw keuzes kunnen de volgende typen cookies worden geplaatst:',
      '• Functioneel/noodzakelijk: Basisfuncties, beveiliging en technische stabiliteit',
      '• Analytisch: Statistische inzichten en prestatieverbetering',
      '• Marketing/tracking: Gepersonaliseerde advertenties en campagne-optimalisatie',
      '• Social media: Delen en embedden van socialmediacontent',
      'Een actueel en gedetailleerd overzicht van alle gebruikte cookies (inclusief naam, doel, bewaartermijn en verantwoordelijke partij) is te allen tijde beschikbaar op een daarvoor bestemde pagina op IlluminOracle.nl. Wij streven ernaar dit overzicht actueel te houden en aan te passen wanneer wij nieuwe cookies introduceren.'
    ]
  },
  {
    id: 'artikel-5',
    title: 'Artikel 5: Juridische grondslag voor cookiegebruik',
    content: [
      '• Functionele cookies – Geen toestemming vereist. Grondslag: gerechtvaardigd belang van DCAPZ (artikel 6 lid 1 sub f AVG), mede gebaseerd op de overwegingen van de e-Privacyrichtlijn die het mogelijk maken om strikt noodzakelijke cookies zonder toestemming te plaatsen.',
      '• Analytische cookies met beperkte privacy-impact – Eveneens gerechtvaardigd belang, tenzij wij bepalen dat toestemming wenselijk is. Wij maken hierbij gebruik van de Nederlandse beleidsvrijheid zoals geïnterpreteerd door de Autoriteit Persoonsgegevens en de Europese richtsnoeren die anonimisering en aggregatie als privacyvriendelijk beschouwen.',
      '• Marketing-, tracking- en social media cookies – Toestemming vereist, waarbij wij ons beroepen op de flexibele interpretatie van de AVG die ons in staat stelt om toestemming op een gebruiksvriendelijke en niet-bezwaarlijke wijze te verkrijgen. Wij maken hierbij gebruik van de mogelijkheden die Nederlands recht biedt, zoals de Uitvoeringswet AVG en de Telecommunicatiewet (voor zover van toepassing), om onze werkwijze af te stemmen op de wettelijke kaders.'
    ]
  },
  {
    id: 'artikel-6',
    title: 'Artikel 6: Cookie-instellingen en toestemming beheren',
    content: [
      'Bij uw eerste bezoek aan IlluminOracle.nl tonen wij een cookiebanner waarin u de volgende keuzes heeft:',
      '• Alleen noodzakelijke cookies accepteren;',
      '• Extra categorieën (zoals analytisch en marketing) naar wens aan- of uitzetten;',
      '• Optioneel alle cookies in één keer accepteren.',
      'Uw voorkeuren worden opgeslagen in een cookie-instelling. Hierdoor wordt de cookiebanner niet bij ieder bezoek opnieuw getoond, tenzij:',
      '• uw voorkeuren na een bepaalde periode verlopen (deze termijn bepalen wij naar eigen inzicht, met inachtneming van de wettelijke kaders);',
      '• wij ons cookiebeleid wezenlijk wijzigen;',
      '• u zelf uw cookies in uw browser heeft verwijderd.',
      'U kunt uw cookievoorkeuren te allen tijde wijzigen via de link "Cookie-instellingen" (of een vergelijkbare aanduiding) onderaan de website of via de daarvoor bestemde instellingenpagina.',
      'Wij behouden ons het recht voor om de technische uitvoering van de cookiebanner en de wijze waarop toestemming wordt gevraagd en vastgelegd, aan te passen op basis van technologische ontwikkelingen, jurisprudentie en beleidsaanpassingen op Europees en nationaal niveau.'
    ]
  },
  {
    id: 'artikel-7',
    title: 'Artikel 7: Cookies van derde partijen',
    content: [
      'Naast cookies die rechtstreeks door IlluminOracle worden geplaatst (zogenaamde first-party cookies), kunnen ook cookies worden geplaatst door externe partijen (third-party cookies). Dit gebeurt bijvoorbeeld bij:',
      '• het gebruik van webanalyse- en statistiektools;',
      '• het tonen van ingebedde socialmediacontent;',
      '• het inschakelen van advertentie- en remarketingdiensten.',
      'Deze derde partijen verwerken gegevens mogelijk voor eigen doeleinden, zoals het opbouwen van profielen of het personaliseren van advertenties buiten onze website. Op dat gebruik zijn de privacy- en cookieverklaringen van de betreffende partijen van toepassing. Wij adviseren u deze verklaringen te raadplegen voor meer informatie over hun werkwijze.',
      'Wij selecteren derde partijen met zorg en sluiten waar mogelijk verwerkersovereenkomsten af, maar wij zijn niet verantwoordelijk voor de verdere verwerking door deze partijen. Wij maken hierbij gebruik van de Europese regelgeving die ons in staat stelt om third-party cookies te plaatsen mits wij voldoende waarborgen bieden en u hierover transparant informeren.'
    ]
  },
  {
    id: 'artikel-8',
    title: 'Artikel 8: Bewaartermijnen van cookies',
    content: [
      'Cookies kunnen verschillende levensduren hebben:',
      '• Sessiecookies – worden automatisch verwijderd zodra u uw browser sluit.',
      '• Permanente cookies – blijven op uw apparaat staan totdat de ingestelde bewaartermijn is verstreken of totdat u ze zelf verwijdert.',
      'De exacte bewaartermijn verschilt per cookie en hangt af van het doel waarvoor deze wordt gebruikt. Wij hanteren de volgende richtlijnen:',
      '• Functionele cookies: maximaal tot het einde van uw browsersessie, of korter indien technisch mogelijk;',
      '• Analytische cookies: doorgaans maximaal 26 maanden, tenzij wij een langere termijn nodig achten voor trendanalyse en statistische doeleinden;',
      '• Marketing- en trackingcookies: maximaal 24 maanden, maar wij kunnen deze termijn verlengen indien dit noodzakelijk is voor campagne-optimalisatie en wij daarbij een gerechtvaardigd belang hebben, zoals toegestaan onder Nederlands en Europees recht.',
      'Wij bepalen de bewaartermijnen naar eigen inzicht, met inachtneming van de wettelijke kaders en de aanbevelingen van de Europese Commissie op het gebied van gegevensminimalisatie en opslagbeperking.'
    ]
  },
  {
    id: 'artikel-9',
    title: 'Artikel 9: Relatie met privacy en persoonsgegevens',
    content: [
      'Wanneer cookies gegevens verzamelen die direct of indirect naar u als persoon kunnen worden herleid – zoals een IP-adres, apparaat-ID of gebruikersnummer – dan worden deze gegevens aangemerkt als persoonsgegevens in de zin van de AVG.',
      'In dat geval is ook ons privacybeleid van toepassing. Daarin wordt uitgebreid toegelicht welke persoonsgegevens wij verwerken, voor welke doeleinden en op welke rechtsgronden dit gebeurt, hoe lang wij gegevens bewaren en welke rechten u heeft.',
      'Wij gebruiken cookiegegevens niet om bijzondere categorieën van persoonsgegevens af te leiden, zoals gezondheidsgegevens, religieuze of levensbeschouwelijke overtuigingen, ras of etnische afkomst, of politieke voorkeuren. Mocht hier toch sprake van zijn, dan zullen wij dit uitdrukkelijk aan u melden en u om ondubbelzinnige toestemming vragen, overeenkomstig de Nederlandse en Europese privacywetgeving.'
    ]
  },
  {
    id: 'artikel-10',
    title: 'Artikel 10: Cookies verwijderen of blokkeren via uw browser',
    content: [
      'Naast het aanpassen van uw cookievoorkeuren via onze website, kunt u te allen tijde uw browserinstellingen aanpassen om:',
      '• reeds geplaatste cookies te verwijderen;',
      '• het plaatsen van nieuwe cookies in het algemeen te blokkeren;',
      '• een waarschuwing te ontvangen voordat een cookie wordt geplaatst.',
      'De exacte werkwijze verschilt per browser. Voor veelgebruikte browsers zoals Google Chrome, Mozilla Firefox, Apple Safari en Microsoft Edge kunt u de helpfunctie van de browser raadplegen voor specifieke instructies.',
      'Let op: het blokkeren van bepaalde cookies kan ertoe leiden dat IlluminOracle.nl niet meer optimaal of volledig functioneert. Bepaalde functionaliteiten, zoals inloggen, beltegoedbeheer en consultafname, kunnen hierdoor worden belemmerd. Dit risico ligt bij de gebruiker.'
    ]
  },
  {
    id: 'artikel-11',
    title: 'Artikel 11: Wijzigingen in dit cookiebeleid',
    content: [
      'DCAPZ behoudt zich het recht voor om dit cookiebeleid te allen tijde te wijzigen, aan te vullen of te vervangen. Dit kan bijvoorbeeld nodig zijn bij:',
      '• introductie van nieuwe cookies of technieken;',
      '• wijzigingen in wet- of regelgeving;',
      '• aanpassingen in onze dienstverlening of bedrijfsvoering.',
      'De meest recente versie van dit cookiebeleid is altijd beschikbaar op IlluminOracle.nl. Wij raden u aan dit beleid periodiek te raadplegen.',
      'Bij wezenlijke wijzigingen die van invloed zijn op uw rechten of de wijze waarop wij cookies inzetten, zullen wij dit actief onder uw aandacht brengen, bijvoorbeeld via een melding op de website, via de cookiebanner of – indien wij over uw e-mailadres beschikken – via een e-mailbericht.'
    ]
  },
  {
    id: 'artikel-12',
    title: 'Artikel 12: Contactgegevens',
    content: [
      'Heeft u vragen, opmerkingen of klachten over dit cookiebeleid of over de wijze waarop wij cookies gebruiken op IlluminOracle.nl? Neem dan gerust contact met ons op:',
      'DCAPZ',
      'Wijnstraat 75',
      '3311 BT Dordrecht',
      'Nederland',
      'KvK-nummer: 42039361',
      'BTW-nummer: NL005448711B24',
      'E-mailadres: Info@netwerkmediums.nl',
      'Wij streven ernaar uw vragen zo snel en zorgvuldig mogelijk te beantwoorden. U heeft tevens het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens, de Nederlandse toezichthouder op het gebied van privacy. Wij verzoeken u echter vriendelijk om eerst contact met ons op te nemen, zodat wij samen naar een passende oplossing kunnen zoeken.',
      'Dit cookiebeleid is voor het laatst bijgewerkt op 20 juni 2026.'
    ]
  }
];

const CookiePolicy = () => {
  useSEO({
    title: 'Cookiebeleid - IlluminOracle',
    description: 'Cookiebeleid voor IlluminOracle.nl door DCAPZ. Informatie over het gebruik van cookies en vergelijkbare trackingtechnologieën.',
    keywords: ['cookies', 'cookiebeleid', 'tracking', 'privacy', 'IlluminOracle', 'DCAPZ'],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(cookieSections[0].id);
  const contentRefs = useRef({});

  // Setup refs dynamically
  cookieSections.forEach((sec) => {
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

    cookieSections.forEach((sec) => {
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
  const filteredSections = cookieSections.filter(sec => {
    const titleMatch = sec.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = sec.content.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()));
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased pt-16 pb-16">
      
      {/* Background Gradient Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-[380px] bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Hero Header */}
      <div className="container mx-auto px-4 max-w-7xl mb-12 relative z-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl/10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gray-50 rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-purple-100/50">
              <ShieldCheck size={14} className="text-purple-600" />
              <span>Cookie-instellingen</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Cookiebeleid
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
              placeholder="Zoek in het cookiebeleid..."
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
                {cookieSections.map((sec) => {
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
              <h4 className="font-bold text-lg mb-2">Vragen over cookies?</h4>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Neem contact op met DCAPZ voor al uw vragen over het gebruik van cookies en vergelijkbare technieken op IlluminOracle.
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

export default CookiePolicy;
