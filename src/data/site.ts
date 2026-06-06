// Centrale content voor de demo van Wijndomein De Boe.
// Feitelijke gegevens (adres, tijden, wijnen, prijzen, verhaal) zijn ontleend aan
// de bestaande site wijndomeindeboe.nl. Gastreacties zijn illustratief voor deze demo.

export const site = {
  name: "Wijndomein De Boe",
  tagline: "Wijn van zee en zon",
  city: "Koudekerke",
  region: "Walcheren, Zeeland",
  address: { street: "Jacoba van Beierenweg 2", zip: "4371 RK", city: "Koudekerke" },
  phone: "0118 23 60 90",
  phoneHref: "tel:+31118236090",
  email: "info@wijndomeindeboe.nl",
  maps: "https://www.google.com/maps?q=Jacoba+van+Beierenweg+2+Koudekerke",
  mapsEmbed:
    "https://www.google.com/maps?q=Jacoba%20van%20Beierenweg%202%20Koudekerke&output=embed",
  webshop: "https://wijndomeindeboe.nl/webshop/",
  social: {
    instagram: "https://www.instagram.com/wijndomeindeboe/",
    facebook: "https://www.facebook.com/wijndomeindeboe/",
  },
} as const;

// Eén lange pagina: navigatie zijn anker-links die soepel binnen de pagina scrollen.
export const nav = [
  { href: "#top", label: "Home" },
  { href: "#wijnen", label: "Wijnen" },
  { href: "#domein", label: "Het domein" },
  { href: "#bezoek", label: "Bezoek" },
  { href: "#contact", label: "Contact" },
];

// Openingstijden — index 0 = maandag. jsDay = Date.getDay() (0=zo..6=za) voor "vandaag".
export const hours = [
  { day: "Maandag", text: "Gesloten", closed: true, jsDay: 1 },
  { day: "Dinsdag", text: "Gesloten", closed: true, jsDay: 2 },
  { day: "Woensdag", text: "Gesloten", closed: true, jsDay: 3 },
  { day: "Donderdag", text: "Gesloten", closed: true, jsDay: 4 },
  { day: "Vrijdag", text: "Gesloten", closed: true, jsDay: 5 },
  { day: "Zaterdag", text: "10:00 – 12:00 · 13:00 – 17:00", closed: false, jsDay: 6 },
  { day: "Zondag", text: "Op afspraak", closed: true, jsDay: 0 },
];

// De scroll-reis op de homepage: van de druif tot de wijn.
export const journey = [
  {
    num: "01",
    rail: "Druif",
    title: "De druif",
    text: "Op de zilte grond van Walcheren wortelen de ranken in kalkrijke zeeklei en zeezand. Gevormd door de zeewind, badend in de volle zon.",
    img: "/photos/generated/journey-vine.png",
    alt: "Wijngaard van De Boe bij de Zeeuwse kust in het gouden ochtendlicht",
  },
  {
    num: "02",
    rail: "Oogst",
    title: "De oogst",
    text: "Druif voor druif rijpt de tros tot precies het juiste moment. Dan wordt er met de hand geoogst, kort bij de zee.",
    img: "/photos/generated/journey-cluster.png",
    alt: "Rijpe druiventros met dauwdruppels in tegenlicht",
  },
  {
    num: "03",
    rail: "Kelder",
    title: "De rijping",
    text: "In de stille koelte van de kelder rijpt de wijn op zijn gemak. Geduld op eikenhout, tot de tijd rijp is.",
    img: "/photos/generated/journey-cellar.png",
    alt: "Eikenhouten vaten in de wijnkelder",
  },
  {
    num: "04",
    rail: "Glas",
    title: "De wijn",
    text: "En zo wordt zon, zee en zilte grond uiteindelijk wijn. Zeeuwse wijn met een eigen, herkenbare ziel.",
    img: "/photos/generated/journey-pour.png",
    alt: "Rode wijn wordt in een kristallen glas geschonken",
  },
];

// Alle wijnen van het domein, met de echte fles-shots en webshop-links.
const SHOP = "https://wijndomeindeboe.nl/product";
export const wines = [
  // Stille witte wijnen — jaargang 2025
  { name: "Moestuin", cat: "wit", swatch: "wit", grape: "Auxerrois & Chardonnay", year: "2025", note: "Wit fruit, vol en rond.", price: "17,50", img: "/echt/wijnen/moestuin.png", url: `${SHOP}/moestuin-2025/` },
  { name: "De Twi Gemete", cat: "wit", swatch: "wit", grape: "Pinot Gris", year: "2025", note: "Rijp, met citroen en perzik.", price: "17,50", img: "/echt/wijnen/de-twi-gemete.png", url: `${SHOP}/de-twi-gemete-2025-2/` },
  { name: "Tuin van Zeeland", cat: "wit", swatch: "wit", grape: "Muscaris", year: "2025", note: "Stuivend fruitig en bloemig, een zomerse wijn.", price: "17,50", img: "/echt/wijnen/tuin-van-zeeland.png", url: `${SHOP}/tuin-van-zeeland-2025/` },
  { name: "'t Hof Triton", cat: "wit", swatch: "wit", grape: "Souvignier Gris", year: "2025", note: "Krachtig, met dille en buxus.", price: "17,50", img: "/echt/wijnen/hof-triton.png", url: `${SHOP}/t-hof-triton-2025/` },
  { name: "De Zes Oxhoofden", cat: "wit", swatch: "wit", grape: "Chardonnay, op hout", year: "2025", note: "Wit fruit met een subtiele toets eikenhout.", price: "20,00", img: "/echt/wijnen/de-zes-oxhoofden.png", url: `${SHOP}/de-zes-oxhoofden-2025/` },
  { name: "De Bogerd", cat: "wit", swatch: "wit", grape: "Savagnin & Chardonnay", year: "2025", note: "Tropisch fruit, strak en gelaagd.", price: "22,50", img: "/echt/wijnen/de-bogerd.png", url: `${SHOP}/de-bogerd-2025/` },
  // Rode wijn — jaargang 2025
  { name: "Clos & Driehoek", cat: "rood", swatch: "rood", grape: "Frühburgunder & Trousseau", year: "2025", note: "Fruitig, kruidig en mooi gestructureerd.", price: "26,00", img: "/echt/wijnen/clos-driehoek.png", url: `${SHOP}/clos-driehoek-2025/` },
  // Dessertwijn — jaargang 2025
  { name: "Tritons Hofjuweel", cat: "dessert", swatch: "dessert", grape: "Souvignier Gris, edelzoet", year: "2025", note: "Edelzoet, geconcentreerd en rijk. Per 0,375 liter.", price: "25,00", img: "/echt/wijnen/tritons-hofjuweel.png", url: `${SHOP}/tritons-hofjuweel-2025/` },
  // Mousserend (traditionele methode) — jaargang 2024
  { name: "Blanc de Blancs Brut", cat: "mousserend", swatch: "mous", grape: "Chardonnay", year: "2024", note: "Mineraal, strak en elegant. Zeeuws alternatief voor champagne.", price: "30,00", img: "/echt/wijnen/blanc-de-blancs.jpg", url: `${SHOP}/blanc-de-blancs-2024/` },
  { name: "Rosé Brut", cat: "mousserend", swatch: "rose", grape: "Pinot Noir & Pinot Noir précoce", year: "2024", note: "Rood fruit, met een zachte maar krachtige mousse.", price: "28,00", img: "/echt/wijnen/rose-brut.jpg", url: `${SHOP}/rose-brut-2024/` },
  { name: "Tuin van Zeeland Brut", cat: "mousserend", swatch: "mous", grape: "Muscaris & Souvignier Gris", year: "2024", note: "Stuivend, bloemig en feestelijk.", price: "24,00", img: "/echt/wijnen/tuin-van-zeeland-brut.jpg", url: `${SHOP}/tuin-van-zeeland-brut-2024/` },
];

// Cadeaus en extra's uit de webshop.
export const shop = [
  { name: "Wijnkist", price: "5,00", img: "/echt/wijnen/wijnkist.png", icon: "bottle", note: "Houten geschenkkist voor één fles.", url: `${SHOP}/wijnkist/` },
  { name: "Podcastpakket", price: null, img: "/echt/wijnen/podcast-pakket.jpg", icon: "bottle", note: "Wijn met de podcast over het domein.", url: `${SHOP}/podcast-pakket/` },
  { name: "Cadeaubon", price: "10,00 – 100,00", img: null, icon: "gift", note: "Kies zelf het bedrag, te besteden in de webshop.", url: `${SHOP}/cadeaubon/` },
  { name: "Adopteer een wijnrank", price: "20,00", img: null, icon: "grape", note: "Word peetouder van een rank in de wijngaard.", url: `${SHOP}/wijnrank/` },
  { name: "Rondleiding & proeverij", price: "20,00", img: null, icon: "calendar", note: "Cadeaubon voor een bezoek met proeverij.", url: `${SHOP}/cadeaubon-rondleiding-proeverij/` },
];

export const wineCats = [
  { key: "alle", label: "Alle" },
  { key: "wit", label: "Wit" },
  { key: "rood", label: "Rood" },
  { key: "mousserend", label: "Mousserend" },
  { key: "dessert", label: "Dessert" },
];

// Beleving — rondleiding, proeverij, fotoshoot
export const experiences = [
  {
    icon: "grape",
    kicker: "Het hele jaar op afspraak",
    title: "Rondleiding & wijnproeverij",
    price: "€20 p.p.",
    body: "In anderhalf uur loop je mee over het domein en maak je kennis met alle facetten van de wijnbouw. Daarna proef je een selectie van onze wijnen, geserveerd met Zeeuwse kazen.",
    meta: "± 1,5 uur · zaterdagmiddag in het seizoen · vanaf 4 personen",
  },
  {
    icon: "calendar",
    kicker: "Mei tot en met september",
    title: "Terras tussen de ranken",
    price: "Vrije inloop",
    body: "Op zaterdagmiddag is ons terras geopend. Schuif aan met een glas wijn van eigen grond en een plankje lokale kaas, met uitzicht over de wijngaard.",
    meta: "Zaterdag 13:00 – 17:00 · op beschikbaarheid",
  },
  {
    icon: "sparkle",
    kicker: "Jouw decor",
    title: "Fotoshoot in de wijngaard",
    price: "€75 per uur",
    body: "Gebruik de wijngaard als decor voor een fotoshoot of filmopname. Een standaard sessie van een uur kost 75 euro inclusief btw, elk uur extra 50 euro.",
    meta: "Op aanvraag via de mail",
  },
];

// Kerncijfers
export const stats = [
  { n: "2021", l: "Het jaar van de eerste aanplant" },
  { n: "5 ha", l: "Wijngaard op een oude kreekrug en jonge zeeklei" },
  { n: "9", l: "Druivenrassen, van Auxerrois tot Pinot Noir" },
  { n: "11", l: "Eigen wijnen, van stil tot mousserend" },
];

// Pijlers van het domein
export const features = [
  {
    icon: "droplet",
    title: "Zilte terroir",
    body: "Kalkrijke gronden van zeeklei en zeezand, vol schelpen tot op één meter diepte. Zand brengt elegantie en aroma, klei geeft body en kleur.",
  },
  {
    icon: "sun",
    title: "Zee en zon",
    body: "De zee zorgt voor veel wind, waardoor de ranken gezond blijven. De zon schijnt volop en het voorjaar is vroeg warm, voor een lang groeiseizoen.",
  },
  {
    icon: "leaf",
    title: "Pionieren op eigen bodem",
    body: "Wijnboer Bruno Suter studeerde in Wageningen en Bordeaux. Zijn overtuiging: mooie wijnen komen van de mooie plekken in de wereld.",
  },
];

// Illustratieve gastreacties voor de demo.
export const reviews = [
  {
    q: "Een verrassend mooie middag. De rondleiding was persoonlijk en de wijnen, geserveerd met Zeeuwse kaas, waren een echte ontdekking. Wie had dat hier aan zee verwacht.",
    name: "Marjon V.",
    src: "9,5",
    place: "Rondleiding & proeverij",
  },
  {
    q: "De Blanc de Blancs is ons vaste feestmoment geworden. Strak, mineraal en elegant, een Zeeuws alternatief voor champagne dat staat als een huis.",
    name: "Erik D.",
    src: "9,4",
    place: "Mousserend",
  },
  {
    q: "Je proeft de zeewind er bijna in terug. Het terras tussen de ranken op een zaterdagmiddag is echt een aanrader voor wie van wijn houdt.",
    name: "Annelies B.",
    src: "9,3",
    place: "Terras",
  },
];

export const galleryImages = [
  { src: "/photos/generated/wijngaard-rij.png", alt: "Een rij wijnranken richting de zee" },
  { src: "/photos/generated/terroir-bodem.png", alt: "Kalkrijke, schelprijke bodem onder de ranken" },
  { src: "/photos/generated/proeverij-tafel.png", alt: "Geserveerde proeverij met wijn en Zeeuwse kaas" },
  { src: "/photos/generated/oogst-mand.png", alt: "Mand met versgeoogste druiven" },
  { src: "/photos/generated/landgoed-boe.png", alt: "Het oude tuinmanshuisje De Boe" },
  { src: "/photos/generated/fles-duo.png", alt: "Twee flessen wijn in het kustzand" },
];
