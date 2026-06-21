import React, { useState, useEffect, useRef } from 'react';
import { useSEO } from '../hooks/useSEO';
import { FileText, Search, Printer, ArrowRight, ShieldCheck, Mail, Info } from 'lucide-react';

const articles = [
  {
    id: 'artikel-1',
    title: 'Artikel 1: Begripsbepalingen',
    content: [
      '• IlluminOracle.nl: de website en het online platform, geëxploiteerd door DCAPZ, gevestigd te Dordrecht, dat gebruikers in staat stelt contact te leggen met zelfstandige consulenten voor spirituele en persoonlijke ondersteuning.',
      '• DCAPZ: de besloten vennootschap die de website beheert, de technische infrastructuur levert en de beltegoedadministratie voert. DCAPZ is tevens de verwerkingsverantwoordelijke voor persoonsgegevens.',
      '• Website: de domeinnaam IlluminOracle.nl en alle bijbehorende subdomeinen, pagina\'s en functionaliteiten.',
      '• Gebruiker: iedere natuurlijke persoon die de website bezoekt, een account registreert en/of gebruikmaakt van de aangeboden diensten.',
      '• Consulent: een zelfstandige dienstverlener die via het platform zijn of haar diensten aanbeveelt, waaronder telefonische en chatconsulten. De consulent is geen werknemer van DCAPZ.',
      '• Account: het persoonlijke profiel van de gebruiker, waarmee toegang wordt verkregen tot het platform, beltegoed en persoonlijke instellingen.',
      '• Beltegoed: het door de gebruiker aangeschafte tegoed dat als betaalmiddel dient voor consulten met consulenten.',
      '• Diensten: alle door IlluminOracle en consulenten aangeboden functionaliteiten, waaronder consulten, content en informatieve ondersteuning.'
    ]
  },
  {
    id: 'artikel-2',
    title: 'Artikel 2: Toepasselijkheid',
    content: [
      '1. Deze algemene voorwaarden zijn van toepassing op elk gebruik van IlluminOracle.nl, op alle aangeboden diensten en op alle rechtsverhoudingen tussen DCAPZ en de gebruiker.',
      '2. Door de website te bezoeken, een account aan te maken of gebruik te maken van de diensten, aanvaardt de gebruiker uitdrukkelijk de inhoud en toepasselijkheid van deze voorwaarden.',
      '3. Voor specifieke diensten of acties kunnen aanvullende voorwaarden gelden. Bij strijdigheid tussen deze algemene voorwaarden en de specifieke voorwaarden, prevaleert hetgeen uitdrukkelijk als zodanig is aangemerkt.',
      '4. Mocht een bepaling uit deze voorwaarden nietig of vernietigbaar zijn, dan blijven de overige bepalingen volledig van kracht. De nietige bepaling wordt vervangen door een bepaling die zoveel mogelijk aansluit bij het oorspronkelijke doel.'
    ]
  },
  {
    id: 'artikel-3',
    title: 'Artikel 3: Het platform en de rol van DCAPZ',
    content: [
      '1. IlluminOracle fungeert als een online ontmoetingsplaats waar gebruikers en consulenten elkaar kunnen vinden. Het platform brengt vraag en aanbod bij elkaar, maar is geen partij bij de inhoudelijke overeenkomst tussen gebruiker en consulent.',
      '2. De rechtstreekse overeenkomst tussen gebruiker en consulent komt tot stand op het moment dat een consult feitelijk aanvangt, bijvoorbeeld door het starten van een telefoongesprek of een chat. DCAPZ is hierbij geen contractspartij.',
      '3. DCAPZ levert uitsluitend:',
      '  • de technische infrastructuur en de website;',
      '  • de mogelijkheid om beltegoed aan te schaffen en te beheren;',
      '  • een koppeling tussen gebruiker, beltegoed en consulent;',
      '  • klantenservice met betrekking tot het platform en beltegoed.',
      '4. De inhoud, kwaliteit en duur van de consulten vallen onder de volledige verantwoordelijkheid van de consulent. DCAPZ oefent geen invloed uit op de inhoudelijke invulling van consulten.',
      '5. Consulten via IlluminOracle zijn bedoeld voor persoonlijke inspiratie en ondersteuning. Zij vormen geen vervanging voor:',
      '  • medische, psychologische of psychiatrische hulp;',
      '  • juridisch, fiscaal of financieel advies;',
      '  • andere professionele diensten die wettelijk zijn voorbehouden aan erkende beroepsbeoefenaren.',
      '6. De gebruiker blijft te allen tijde zelf verantwoordelijk voor zijn of haar keuzes en handelingen, ook wanneer deze zijn gebaseerd op informatie uit een consult of van de website.'
    ]
  },
  {
    id: 'artikel-4',
    title: 'Artikel 4: Account, leeftijd en gebruiksvoorwaarden',
    content: [
      '1. De diensten van IlluminOracle zijn primair bestemd voor personen van 16 jaar of ouder. Gebruikers jonger dan 16 jaar mogen alleen gebruikmaken van de diensten met uitdrukkelijke toestemming van hun ouder(s) of wettelijke voogd.',
      '2. De gebruiker garandeert jegens DCAPZ dat:',
      '  • de bij registratie verstrekte gegevens juist, volledig en actueel zijn;',
      '  • er geen misbruik wordt gemaakt van andermans identiteit of betaalmiddelen;',
      '  • wijzigingen in persoonlijke gegevens tijdig worden doorgegeven.',
      '3. De gebruiker is verantwoordelijk voor de vertrouwelijkheid en veiligheid van zijn of haar inloggegevens. Alle handelingen die via het account plaatsvinden, worden geacht te zijn verricht door of met toestemming van de gebruiker.',
      '4. Bij vermoeden van ongeautoriseerd gebruik dient de gebruiker dit onmiddellijk te melden aan DCAPZ.',
      '5. Het is niet toegestaan om het account of beltegoed te verhandelen, te verkopen of aan derden ter beschikking te stellen, behoudens incidenteel persoonlijk gebruik.',
      '6. Het omzeilen van beveiligingsmaatregelen of het ongeautoriseerd binnendringen van systemen is verboden. Bij geconstateerd misbruik kan DCAPZ het account blokkeren en passende maatregelen nemen, waaronder strafrechtelijke aangifte.'
    ]
  },
  {
    id: 'artikel-5',
    title: 'Artikel 5: Beltegoed, tarieven en betaling',
    content: [
      '1. Gebruiker kan via IlluminOracle beltegoed aanschaffen, dat uitsluitend kan worden ingezet als betaalmiddel voor consulten op het platform.',
      '2. De op de website vermelde tarieven zijn bindend. Voorafgaand aan elk consult wordt de gebruiker duidelijk geïnformeerd over het toepasselijke tarief per minuut of andere rekeneenheid.',
      '3. Door na de tariefinformatie het consult niet te beëindigen, stemt de gebruiker in met de kosten en komt de overeenkomst tussen gebruiker en consulent tot stand.',
      '4. Na afloop van een consult wordt het verschuldigde bedrag automatisch van het beltegoed afgeschreven. De gebruiker verleent DCAPZ hierbij uitdrukkelijk toestemming voor deze afschrijving.',
      '5. Het beltegoed wordt door DCAPZ beheerd ten behoeve van de gebruiker. Over het tegoed wordt geen rente vergoed.',
      '6. Gebruiker kan te allen tijde zijn actuele beltegoed inzien via zijn account. Op verzoek en onder de voorwaarden zoals vermeld op de website, kan het resterende beltegoed worden teruggestort op een bankrekening op naam van de gebruiker, tegen de op de website vermelde kosten.',
      '7. Gestelde onjuistheden in de beltegoedadministratie dienen uiterlijk binnen 3 maanden na constatering te worden gemeld. De administratie van DCAPZ geldt als uitgangspunt, tenzij de gebruiker het tegendeel aantoont.'
    ]
  },
  {
    id: 'artikel-6',
    title: 'Artikel 6: Gedragsregels voor gebruikers',
    content: [
      '1. Gebruiker dient zich te allen tijde respectvol en correct te gedragen tegenover consulenten, andere gebruikers en medewerkers van DCAPZ.',
      '2. Het is de gebruiker niet toegestaan om:',
      '  • bedreigende, beledigende, discriminerende of anderszins onbehoorlijke uitlatingen te doen;',
      '  • inhoud te verspreiden die in strijd is met de wet, de openbare orde of de goede zeden;',
      '  • inbreuk te maken op intellectuele eigendomsrechten of privacyrechten van derden;',
      '  • ongevraagde commerciële uitingen te plaatsen die geen verband houden met de diensten;',
      '  • persoonsgegevens van derden openbaar te maken zonder toestemming;',
      '  • consulenten te benaderen buiten het platform om, teneinde IlluminOracle te omzeilen.',
      '3. DCAPZ behoudt zich het recht voor om, zonder voorafgaande waarschuwing:',
      '  • door de gebruiker geplaatste inhoud te verwijderen of aan te passen indien deze in strijd is met deze voorwaarden;',
      '  • accounts van gebruikers die deze voorwaarden overtreden (tijdelijk) te blokkeren of definitief te verwijderen.',
      '4. Klachten dienen te worden ingediend via de daartoe bestemde kanalen en mogen niet openbaar op de website worden geplaatst.'
    ]
  },
  {
    id: 'artikel-7',
    title: 'Artikel 7: Intellectuele eigendom',
    content: [
      '1. Alle intellectuele eigendomsrechten op de website, waaronder maar niet beperkt tot ontwerp, tekst, beeld, logo\'s, geluid, databases en software, berusten bij DCAPZ of haar licentiegevers, dan wel bij de consulent voor zover het zijn eigen profiel- of consultinhoud betreft.',
      '2. Gebruiker verkrijgt uitsluitend een persoonlijk, niet-exclusief en niet-overdraagbaar recht om de website en content voor eigen, niet-commercieel gebruik te raadplegen.',
      '3. Het is niet toegestaan om zonder voorafgaande schriftelijke toestemming van DCAPZ:',
      '  • de website of delen daarvan openbaar te maken, te verveelvoudigen of te verspreiden;',
      '  • consultinhoud op te nemen of elders te publiceren, behoudens strikt eigen gebruik.',
      '4. Indien gebruiker vrijwillig bijdragen levert (zoals reviews of testimonials), garandeert hij/zij daartoe gerechtigd te zijn en verleent hij/zij aan DCAPZ een niet-exclusief, kosteloos en overdraagbaar recht om deze bijdragen te gebruiken, te publiceren en te verveelvoudigen in het kader van de diensten.'
    ]
  },
  {
    id: 'artikel-8',
    title: 'Artikel 8: Aansprakelijkheid en disclaimer',
    content: [
      '1. De diensten van IlluminOracle beperken zich tot:',
      '  • het technisch beheren van de website en het platform;',
      '  • het faciliteren van contact tussen gebruiker en consulent;',
      '  • het beheren van beltegoed en de technische afhandeling van consulten.',
      '2. DCAPZ spant zich in om de website zorgvuldig en actueel te houden, maar kan niet instaan voor de volledigheid, juistheid of actualiteit van alle informatie op de website.',
      '3. Consulten vinden plaats buiten de directe invloedssfeer van DCAPZ. DCAPZ is niet verantwoordelijk voor en geeft geen garanties omtrent:',
      '  • de inhoud en kwaliteit van de consulten;',
      '  • de juistheid, volledigheid of toepasbaarheid van de gegeven adviezen;',
      '  • de gevolgen van beslissingen die de gebruiker neemt naar aanleiding van een consult.',
      '4. IlluminOracle en de consulten vormen geen vervanging voor professionele medische, psychologische, juridische, fiscale of financiële dienstverlening. Gebruiker wordt nadrukkelijk geadviseerd om bij dergelijke vragen een erkende professional te raadplegen.',
      '5. DCAPZ is niet aansprakelijk voor:',
      '  • indirecte schade, gevolgschade, gederfde winst, gemiste besparingen of immateriële schade;',
      '  • schade als gevolg van (tijdelijke) onbeschikbaarheid van de website, storingen in de verbinding of technische onderbrekingen;',
      '  • schade als gevolg van wegvallen van een telefoon- of internetverbinding tijdens een consult;',
      '  • schade als gevolg van ongeautoriseerd gebruik van het account of beltegoed.',
      '6. De aansprakelijkheid van DCAPZ voor directe schade is te allen tijde beperkt tot het bedrag dat in het betreffende geval feitelijk door de aansprakelijkheidsverzekering van DCAPZ wordt uitgekeerd, vermeerderd met het eigen risico. Indien geen uitkering plaatsvindt, is de aansprakelijkheid beperkt tot het bedrag aan beltegoed dat de gebruiker in de drie maanden voorafgaand aan het schadevoorval heeft aangeschaft, met een absoluut maximum van EUR 500 per gebeurtenis.',
      '7. De hiervoor genoemde beperkingen gelden niet indien de schade het gevolg is van opzet of bewuste roekeloosheid van het management van DCAPZ.'
    ]
  },
  {
    id: 'artikel-9',
    title: 'Artikel 9: Overmacht',
    content: [
      '1. Onder overmacht wordt verstaan elke omstandigheid, voorzien of onvoorzien, die onafhankelijk is van de wil van DCAPZ en die nakoming van de verplichtingen jegens de gebruiker geheel of gedeeltelijk onmogelijk maakt of waardoor nakoming redelijkerwijs niet kan worden verlangd.',
      '2. Hieronder wordt in ieder geval begrepen: storingen bij hosting- of telecomproviders, internetstoringen, cyberaanvallen, stroomuitval, pandemieën, overheidsmaatregelen, stakingen, brand, overstromingen, natuurrampen, en alle andere buitengewone gebeurtenissen die het functioneren van de website beïnvloeden.',
      '3. In geval van overmacht is DCAPZ niet gehouden tot enige schadevergoeding. Gebruiker heeft in dat geval geen recht op restitutie, behoudens een naar redelijkheid vast te stellen terugbetaling van ongebruikt beltegoed indien de diensten structureel niet meer kunnen worden aangeboden.'
    ]
  },
  {
    id: 'artikel-10',
    title: 'Artikel 10: Persoonsgegevens en privacy',
    content: [
      '1. DCAPZ verwerkt persoonsgegevens van gebruikers met zorgvuldigheid en in overeenstemming met de toepasselijke wetgeving, waaronder de Algemene Verordening Gegevensbescherming (AVG).',
      '2. De wijze waarop persoonsgegevens worden verzameld, gebruikt en beveiligd, is vastgelegd in het afzonderlijke privacybeleid, dat te allen tijde beschikbaar is op de website.',
      '3. Door gebruik te maken van de diensten verklaart de gebruiker kennis te hebben genomen van het privacybeleid en daarmee in te stemmen.'
    ]
  },
  {
    id: 'artikel-11',
    title: 'Artikel 11: Cookies',
    content: [
      '1. IlluminOracle maakt gebruik van cookies en vergelijkbare technieken om de website optimaal te laten functioneren, inzicht te krijgen in gebruikersgedrag en – waar van toepassing – content te personaliseren.',
      '2. In het afzonderlijke cookiebeleid op de website wordt gedetailleerd toegelicht welke cookies worden gebruikt, met welk doel en hoe gebruikers hun voorkeuren kunnen beheren.'
    ]
  },
  {
    id: 'artikel-12',
    title: 'Artikel 12: Wijzigingen van diensten en voorwaarden',
    content: [
      '1. DCAPZ behoudt zich het recht voor om:',
      '  • de inhoud en functionaliteiten van de website te wijzigen, uit te breiden, te beperken of te beëindigen;',
      '  • tarieven, beltegoedstructuren of betalingsmethoden aan te passen;',
      '  • deze algemene voorwaarden te wijzigen of aan te vullen.',
      '2. De meest recente versie van de algemene voorwaarden is altijd beschikbaar op IlluminOracle.nl. Gebruikers wordt geadviseerd deze periodiek te raadplegen.',
      '3. Bij wezenlijke wijzigingen die de rechten of belangen van gebruikers aanmerkelijk raken, zal DCAPZ gebruikers vooraf informeren, bijvoorbeeld via de website of per e-mail.',
      '4. Indien de gebruiker na de inwerkingtreding van gewijzigde voorwaarden gebruik blijft maken van de diensten, wordt hij/zij geacht de gewijzigde voorwaarden te hebben aanvaard.'
    ]
  },
  {
    id: 'artikel-13',
    title: 'Artikel 13: Toepasselijk recht en bevoegde rechter',
    content: [
      '1. Op deze algemene voorwaarden, op het gebruik van de website en op alle daaruit voortvloeiende rechtsverhoudingen tussen gebruiker en DCAPZ is uitsluitend Nederlands recht van toepassing.',
      '2. Bevoegde rechter: Alle geschillen tussen gebruiker en DCAPZ worden, voor zover de wet dit toelaat, uitsluitend voorgelegd aan de bevoegde rechter in het arrondissement Rotterdam, met uitdrukkelijke voorkeur voor de rechtbank van Dordrecht. Dit biedt DCAPZ het voordeel van een lokale, bekende rechtsgang en beperkt de proceskosten bij eventuele procedures.'
    ]
  },
  {
    id: 'artikel-14',
    title: 'Artikel 14: Slotbepalingen',
    content: [
      '1. Indien een bepaling in deze algemene voorwaarden nietig is of wordt vernietigd, blijven de overige bepalingen onverminderd van kracht. DCAPZ zal in dat geval een nieuwe bepaling vaststellen die de strekking van de oorspronkelijke bepaling zoveel mogelijk benadert.',
      '2. Het feit dat DCAPZ op enig moment nalaat strikte naleving van een bepaling te verlangen, houdt geen afstand in van het recht om dit op een later tijdstip alsnog te doen.'
    ]
  }
];

const TermsConditions = () => {
  useSEO({
    title: 'Algemene Voorwaarden - IlluminOracle',
    description: 'Algemene voorwaarden voor het gebruik van het IlluminOracle platform door DCAPZ.',
    keywords: ['algemene voorwaarden', 'voorwaarden', 'terms', 'conditions', 'IlluminOracle', 'DCAPZ'],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(articles[0].id);
  const contentRefs = useRef({});

  // Setup refs dynamically
  articles.forEach((art) => {
    if (!contentRefs.current[art.id]) {
      contentRefs.current[art.id] = React.createRef();
    }
  });

  // Handle intersection observer to highlight current article in sidebar while scrolling
  useEffect(() => {
    const observers = [];
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setActiveArticle(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0.2],
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    articles.forEach((art) => {
      const el = document.getElementById(art.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToArticle = (id) => {
    setActiveArticle(id);
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

  // Filter articles based on search query
  const filteredArticles = articles.filter(art => {
    const titleMatch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = art.content.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()));
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
              <ShieldCheck size={14} />
              <span>Juridische Documentatie</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Algemene Voorwaarden
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
              placeholder="Zoek in de algemene voorwaarden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-medium"
            />
          </div>
          {searchQuery && (
            <p className="mt-2.5 text-sm text-gray-500">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'artikel gevonden' : 'artikelen gevonden'} voor "{searchQuery}"
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
                {articles.map((art) => {
                  const isFilteredOut = !filteredArticles.some(f => f.id === art.id);
                  return (
                    <button
                      key={art.id}
                      onClick={() => scrollToArticle(art.id)}
                      disabled={isFilteredOut}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between text-sm font-semibold group ${
                        activeArticle === art.id
                          ? 'bg-purple-50 text-purple-700'
                          : isFilteredOut
                            ? 'opacity-40 cursor-not-allowed text-gray-400'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="truncate">{art.title.replace('Artikel ', 'Art. ')}</span>
                      <ArrowRight 
                        size={14} 
                        className={`transition-transform duration-300 ${
                          activeArticle === art.id 
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
              <h4 className="font-bold text-lg mb-2">Vragen over deze voorwaarden?</h4>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Neem contact op met DCAPZ voor meer informatie over het platform en het beheer van uw beltegoed.
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
            {filteredArticles.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-1">Geen resultaten gevonden</h3>
                <p className="text-gray-500">Probeer een andere zoekterm om specifieke artikelen te vinden.</p>
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isActive = activeArticle === art.id;
                return (
                  <article
                    key={art.id}
                    id={art.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 p-8 shadow-sm ${
                      isActive 
                        ? 'border-purple-600/30 ring-1 ring-purple-600/30' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
                      <span className="w-1.5 h-6 rounded-full bg-purple-600 block" />
                      {art.title}
                    </h2>
                    <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 font-medium">
                      {art.content.map((paragraph, index) => {
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

export default TermsConditions;
