import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alle Nemme Opskrifter',
  description:
    'Udforsk vores samling af nemme opskrifter fra hele verden. Fra klassiske retter som carbonara og tiramisu til moderne fusion-køkken. Find nemme opskrifter efter kategori, sværhedsgrad eller tid.',
  keywords: ['alle nemme opskrifter', 'nemme opskrifter samling', 'pasta nemme opskrifter', 'fisk nemme opskrifter', 'dessert nemme opskrifter', 'vegetarisk nemme opskrifter', 'dansk mad'],
  openGraph: {
    title: 'Alle Nemme Opskrifter',
    description: 'Udforsk vores samling af nemme opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken.',
    type: 'website',
  },
}

// Sample recipe data - in a real app, this would come from a database
const recipes = [
  {
    slug: 'hjemmelavet-kebab',
    title: 'Hjemmelavet Kebab',
    category: 'Kød',
    time: '90 min',
    prepTime: '60 min',
    cookTime: '30 min',
    difficulty: 'Mellem',
    excerpt:
      'Autentisk hjemmelavet kebab med krydret kød, frisk salat og lækker dressing. Denne opskrift giver dig den perfekte smag og tekstur. Perfekt til en hyggelig aften.',
  },
  {
    slug: 'hjemmelavet-kodsovs',
    title: 'Hjemmelavet Kødsovs',
    category: 'Kød',
    time: '120 min',
    prepTime: '30 min',
    cookTime: '90 min',
    difficulty: 'Mellem',
    excerpt:
      'Klassisk hjemmelavet kødsovs med saftigt hakket kød, røde tomater og krydderier. Den perfekte sovs til pasta, kartofler eller ris. Simpel at lave, men smager fantastisk.',
  },
  {
    slug: 'hjemmelavet-pizza',
    title: 'Hjemmelavet Pizza',
    category: 'Hurtigt',
    time: '60 min',
    prepTime: '45 min',
    cookTime: '15 min',
    difficulty: 'Let',
    excerpt:
      'Lækker hjemmelavet pizza med sprød bund, saftig tomat-sauce og dit yndlingsfyld. Denne opskrift giver dig den perfekte pizza-bund der smager bedre end takeaway. Perfekt til en hyggelig aften.',
  },
  {
    slug: 'hjemmelavet-boller',
    title: 'Hjemmelavet Boller',
    category: 'Hurtigt',
    time: '90 min',
    prepTime: '60 min',
    cookTime: '30 min',
    difficulty: 'Let',
    excerpt:
      'Bløde og luftige hjemmelavet boller med guldbrun skorpe. Perfekte til morgenmad, frokost eller som tilbehør til måltider. Disse boller smager langt bedre end købte boller og er overraskende nemme at lave.',
  },
  {
    slug: 'hjemmelavet-glog',
    title: 'Hjemmelavet Gløg',
    category: 'Dessert',
    time: '45 min',
    prepTime: '15 min',
    cookTime: '30 min',
    difficulty: 'Let',
    excerpt:
      'Varm og krydret hjemmelavet gløg med rødvin, krydderier og appelsin. Den perfekte drik til vintermånederne og juletiden. Denne opskrift giver dig den autentiske gløg-smag der varmer hele kroppen.',
  },
  {
    slug: 'hjemmelavet-knaekbrod',
    title: 'Hjemmelavet Knækbrød',
    category: 'Hurtigt',
    time: '60 min',
    prepTime: '30 min',
    cookTime: '30 min',
    difficulty: 'Let',
    excerpt:
      'Sprødt og knasende hjemmelavet knækbrød med frø og krydderier. Perfekt til ost, pålæg eller bare som snack. Disse knækbrød er langt bedre end købte og kan tilpasses med dine yndlingsfrø og krydderier.',
  },
  {
    slug: 'hjemmelavet-pasta',
    title: 'Hjemmelavet Pasta',
    category: 'Pasta',
    time: '75 min',
    prepTime: '60 min',
    cookTime: '15 min',
    difficulty: 'Mellem',
    excerpt:
      'Frisk hjemmelavet pasta med æg og durummel. Den perfekte pasta til dine yndlingsretter. Denne opskrift giver dig den autentiske italienske pasta-smag og tekstur der er langt bedre end købt pasta.',
  },
  {
    slug: 'hjemmelavet-granola',
    title: 'Hjemmelavet Granola',
    category: 'Hurtigt',
    time: '45 min',
    prepTime: '10 min',
    cookTime: '35 min',
    difficulty: 'Let',
    excerpt:
      'Knasende og sødt hjemmelavet granola med havregryn, nødder og tørret frugt. Perfekt til morgenmad med yoghurt eller mælk. Denne opskrift giver dig den perfekte balance mellem sødt og nøddeagtigt, og kan tilpasses med dine yndlingsingredienser.',
  },
  {
    slug: 'hjemmelavet-is',
    title: 'Hjemmelavet Is',
    category: 'Dessert',
    time: '240 min',
    prepTime: '30 min',
    cookTime: '210 min',
    difficulty: 'Mellem',
    excerpt:
      'Cremet og lækker hjemmelavet is med kun få ingredienser. Den perfekte dessert til enhver lejlighed. Denne opskrift giver dig den cremede tekstur og rene smag der er langt bedre end købt is. Tilpas med dine yndlingssmage!',
  },
  {
    slug: 'hjemmelavet-brod',
    title: 'Hjemmelavet Brød',
    category: 'Hurtigt',
    time: '180 min',
    prepTime: '150 min',
    cookTime: '30 min',
    difficulty: 'Mellem',
    excerpt:
      'Luftigt og lækkert hjemmelavet brød med guldbrun skorpe. Den perfekte basis til alle måltider. Denne opskrift giver dig det klassiske hjemmebagte brød der smager langt bedre end købt brød. Varmt fra ovnen med smør - der er intet bedre!',
  },
  {
    slug: 'hjemmelavet-pandekager',
    title: 'Hjemmelavet Pandekager',
    category: 'Hurtigt',
    time: '30 min',
    prepTime: '10 min',
    cookTime: '20 min',
    difficulty: 'Let',
    excerpt:
      'Bløde og gyldne hjemmelavet pandekager med den perfekte tekstur. Perfekte til morgenmad, brunch eller dessert. Denne opskrift giver dig de klassiske danske pandekager der smager langt bedre end købte. Server med syltetøj, sukker og citron!',
  },
  {
    slug: 'hjemmelavet-cookies',
    title: 'Hjemmelavet Cookies',
    category: 'Dessert',
    time: '60 min',
    prepTime: '30 min',
    cookTime: '30 min',
    difficulty: 'Let',
    excerpt:
      'Klassiske hjemmelavet cookies med chokoladechips - bløde i midten og knasende udenpå. Den perfekte dessert eller snack. Denne opskrift giver dig de perfekte cookies der smager langt bedre end købte. Varme fra ovnen med en kop mælk - der er intet bedre!',
  },
  {
    slug: 'hjemmelavet-frikadeller',
    title: 'Hjemmelavet Frikadeller',
    category: 'Kød',
    time: '45 min',
    prepTime: '20 min',
    cookTime: '25 min',
    difficulty: 'Let',
    excerpt:
      'Klassiske danske hjemmelavet frikadeller med hakket kød, løg og krydderier. Den perfekte ret til hverdagen. Denne opskrift giver dig de autentiske danske frikadeller der smager langt bedre end købte. Server med kartofler og brun sovs!',
  },
  {
    slug: 'hjemmelavet-chokoladeskeer',
    title: 'Hjemmelavet Chokoladeskeer',
    category: 'Dessert',
    time: '90 min',
    prepTime: '30 min',
    cookTime: '60 min',
    difficulty: 'Mellem',
    excerpt:
      'Rige og cremede hjemmelavet chokoladeskeer med mørk chokolade og fløde. Den perfekte dessert til særlige lejligheder. Denne opskrift giver dig de lækreste chokoladeskeer der smager langt bedre end købte. Server med bær og flødeskum!',
  },
  {
    slug: 'hjemmelavet-braendtemandler',
    title: 'Hjemmelavet Brændtemandler',
    category: 'Dessert',
    time: '30 min',
    prepTime: '10 min',
    cookTime: '20 min',
    difficulty: 'Let',
    excerpt:
      'Søde og knasende hjemmelavet brændtemandler med karameliseret sukker og mandler. Den perfekte snack eller dessert. Denne opskrift giver dig de klassiske brændtemandler der smager langt bedre end købte. Perfekt til julehygge eller som gave!',
  },
  {
    slug: 'hjemmelavet-floedeboller',
    title: 'Hjemmelavet Flødeboller',
    category: 'Dessert',
    time: '120 min',
    prepTime: '60 min',
    cookTime: '60 min',
    difficulty: 'Svær',
    excerpt:
      'Luftige og søde hjemmelavet flødeboller med meringue-kern og chokoladeovertræk. Den perfekte danske klassiker. Denne opskrift giver dig de autentiske flødeboller der smager langt bedre end købte. Perfekt til fester, gaver eller bare til dig selv!',
  },
  {
    slug: 'hjemmelavet-smashburger',
    title: 'Hjemmelavet Smashburger',
    category: 'Kød',
    time: '30 min',
    prepTime: '15 min',
    cookTime: '15 min',
    difficulty: 'Let',
    excerpt:
      'Juicy og sprøde hjemmelavet smashburger med tynd, knasende burger og perfekt smeltet ost. Den perfekte burger til hverdagen. Denne opskrift giver dig den autentiske smashburger-smag der smager langt bedre end fastfood. Server med pommes frites!',
  },
  {
    slug: 'ribeye',
    title: 'Ribeye',
    category: 'Kød',
    time: '45 min',
    prepTime: '30 min',
    cookTime: '15 min',
    difficulty: 'Mellem',
    excerpt:
      'Perfekt stegt ribeye med saftig, mør kød og gyldenbrun skorpe. Den perfekte bøf til en særlig aften. Denne opskrift giver dig den perfekte ribeye der smager langt bedre end fra restauranten. Server med kartofler og grøntsager!',
  },
  {
    slug: 'entrecote',
    title: 'Entrecote',
    category: 'Kød',
    time: '45 min',
    prepTime: '30 min',
    cookTime: '15 min',
    difficulty: 'Mellem',
    excerpt:
      'Klassisk entrecote med saftig, mør kød og perfekt stegt skorpe. Den perfekte bøf til en særlig aften. Denne opskrift giver dig den autentiske entrecote der smager langt bedre end fra restauranten. Server med bearnaise sovs og pommes frites!',
  },
  {
    slug: 'hjemmelavet-chilicheesetops',
    title: 'Hjemmelavet Chilicheesetops',
    category: 'Hurtigt',
    time: '25 min',
    prepTime: '15 min',
    cookTime: '10 min',
    difficulty: 'Let',
    excerpt:
      'Sprøde og smagfulde chilicheesetops med smeltet ost og mild chili. Den perfekte snack eller forret til en hyggelig aften. Denne opskrift giver dig den autentiske chilicheesetops der smager langt bedre end fra butikken. Server med dip og grøntsager!',
  },
  {
    slug: 'hjemmelavet-cheeseburger',
    title: 'Hjemmelavet Cheeseburger',
    category: 'Kød',
    time: '30 min',
    prepTime: '20 min',
    cookTime: '10 min',
    difficulty: 'Let',
    excerpt:
      'Juicy og smagfuld hjemmelavet cheeseburger med saftig bøf, smeltet ost og friske tilbehør. Den perfekte burger til hverdagen. Denne opskrift giver dig den autentiske cheeseburger der smager langt bedre end fastfood. Server med pommes frites!',
  },
  {
    slug: 'hjemmelavet-vaniljekranse',
    title: 'Hjemmelavet Vaniljekranse',
    category: 'Dessert',
    time: '60 min',
    prepTime: '30 min',
    cookTime: '12 min',
    difficulty: 'Let',
    excerpt:
      'Klassiske hjemmelavet vaniljekranse med smørrig smag og sprød tekstur. Den perfekte kage til kaffen eller som dessert. Denne opskrift giver dig den autentiske vaniljekranse der smager langt bedre end fra butikken. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-rod-grod-med-flode',
    title: 'Hjemmelavet Rød Grød med Fløde',
    category: 'Dessert',
    time: '45 min',
    prepTime: '15 min',
    cookTime: '30 min',
    difficulty: 'Let',
    excerpt:
      'Klassisk dansk rød grød med fløde med frisk bær og cremet fløde. Den perfekte dessert til sommeren. Denne opskrift giver dig den autentiske rød grød der smager langt bedre end fra butikken. Server med kold fløde!',
  },
  {
    slug: 'hjemmelavet-flaeskesteg',
    title: 'Hjemmelavet Flæskesteg',
    category: 'Kød',
    time: '3 timer',
    prepTime: '30 min',
    cookTime: '2 timer 30 min',
    difficulty: 'Mellem',
    excerpt:
      'Klassisk dansk flæskesteg med sprødt svær og saftigt kød. Den perfekte hovedret til jul eller særlige lejligheder. Denne opskrift giver dig den autentiske flæskesteg der smager langt bedre end fra slagteren. Server med brun sovs, kartofler og rødkål!',
  },
  {
    slug: 'hjemmelavet-risengrod',
    title: 'Hjemmelavet Risengrød',
    category: 'Dessert',
    time: '45 min',
    prepTime: '10 min',
    cookTime: '35 min',
    difficulty: 'Let',
    excerpt:
      'Klassisk dansk risengrød med cremet konsistens og vaniljesmag. Den perfekte dessert til jul eller hverdagen. Denne opskrift giver dig den autentiske risengrød der smager langt bedre end fra butikken. Server med smør, kanel og sukker!',
  },
  {
    slug: 'hjemmelavet-aebleskiver',
    title: 'Hjemmelavet Æbleskiver',
    category: 'Dessert',
    time: '40 min',
    prepTime: '20 min',
    cookTime: '20 min',
    difficulty: 'Let',
    excerpt:
      'Klassiske dansk æbleskiver med luftig tekstur og guldbrun farve. Den perfekte dessert eller snack til jul eller hverdagen. Denne opskrift giver dig den autentiske æbleskiver der smager langt bedre end fra butikken. Server med flormelis og syltetøj!',
  },
  {
    slug: 'hjemmelavet-banankage',
    title: 'Hjemmelavet Banankage',
    category: 'Dessert',
    time: '75 min',
    prepTime: '20 min',
    cookTime: '55 min',
    difficulty: 'Let',
    excerpt:
      'Saftig og smagfuld hjemmelavet banankage med modne bananer og varm kanel. Den perfekte kage til kaffen eller som dessert. Denne opskrift giver dig den autentiske banankage der smager langt bedre end fra butikken. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-chokoladekage',
    title: 'Hjemmelavet Chokoladekage',
    category: 'Dessert',
    time: '70 min',
    prepTime: '20 min',
    cookTime: '50 min',
    difficulty: 'Let',
    excerpt:
      'Rig og smagfuld hjemmelavet chokoladekage med mørk chokolade og cremet tekstur. Den perfekte kage til kaffen eller som dessert. Denne opskrift giver dig den autentiske chokoladekage der smager langt bedre end fra butikken. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-nutella',
    title: 'Hjemmelavet Nutella',
    category: 'Dessert',
    time: '30 min',
    prepTime: '10 min',
    cookTime: '20 min',
    difficulty: 'Let',
    excerpt:
      'Cremet og smagfuld hjemmelavet nutella med hasselnødder og chokolade. Den perfekte pålæg eller ingrediens til kager. Denne opskrift giver dig den autentiske nutella der smager langt bedre end fra butikken. Server på brød, pandekager eller i kager!',
  },
  {
    slug: 'hjemmelavet-lagkage',
    title: 'Hjemmelavet Lagkage',
    category: 'Dessert',
    time: '90 min',
    prepTime: '30 min',
    cookTime: '60 min',
    difficulty: 'Mellem',
    excerpt:
      'Luftig og smagfuld hjemmelavet lagkage med cremet flødeskum og friske bær. Den perfekte kage til fødselsdage eller særlige lejligheder. Denne opskrift giver dig den autentiske lagkage der smager langt bedre end fra konditoriet. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-flutes',
    title: 'Hjemmelavet Flutes',
    category: 'Hurtigt',
    time: '3 timer',
    prepTime: '30 min',
    cookTime: '20 min',
    difficulty: 'Mellem',
    excerpt:
      'Sprøde og luftige hjemmelavet flutes med guldbrun skorpe og blød krumme. Den perfekte bagværk til morgenmad eller frokost. Denne opskrift giver dig den autentiske flutes der smager langt bedre end fra bageren. Server med smør og syltetøj!',
  },
  {
    slug: 'hjemmelavet-baguette',
    title: 'Hjemmelavet Baguette',
    category: 'Hurtigt',
    time: '4 timer',
    prepTime: '40 min',
    cookTime: '25 min',
    difficulty: 'Mellem',
    excerpt:
      'Autentisk fransk hjemmelavet baguette med sprød skorpe og luftig krumme. Den perfekte bagværk til morgenmad eller frokost. Denne opskrift giver dig den autentiske baguette der smager langt bedre end fra bageren. Server med smør, ost eller din yndlingspålæg!',
  },
  {
    slug: 'hjemmelavet-kanelsnegle',
    title: 'Hjemmelavet Kanelsnegle',
    category: 'Dessert',
    time: '3 timer',
    prepTime: '30 min',
    cookTime: '20 min',
    difficulty: 'Mellem',
    excerpt:
      'Søde og smagfulde hjemmelavet kanelsnegle med kanel, sukker og smør. Den perfekte kage til kaffen eller som dessert. Denne opskrift giver dig den autentiske kanelsnegle der smager langt bedre end fra bageren. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-aeggekage',
    title: 'Hjemmelavet Æggekage',
    category: 'Hurtigt',
    time: '20 min',
    prepTime: '5 min',
    cookTime: '15 min',
    difficulty: 'Let',
    excerpt:
      'Cremet og smagfuld hjemmelavet æggekage med æg, mælk og smør. Den perfekte ret til morgenmad eller brunch. Denne opskrift giver dig den autentiske æggekage der smager langt bedre end fra restauranten. Server med bacon, brød eller grøntsager!',
  },
  {
    slug: 'hjemmelavet-omelet',
    title: 'Hjemmelavet Omelet',
    category: 'Hurtigt',
    time: '15 min',
    prepTime: '5 min',
    cookTime: '10 min',
    difficulty: 'Let',
    excerpt:
      'Perfekt hjemmelavet omelet med gyldenbrun skorpe og cremet fyld. Den perfekte ret til morgenmad eller brunch. Denne opskrift giver dig den autentiske omelet der smager langt bedre end fra restauranten. Server med fyld, brød eller salat!',
  },
  {
    slug: 'hjemmelavet-schones',
    title: 'Hjemmelavet Schones',
    category: 'Dessert',
    time: '3 timer',
    prepTime: '30 min',
    cookTime: '20 min',
    difficulty: 'Mellem',
    excerpt:
      'Søde og smagfulde hjemmelavet schones med kanel, sukker og smør. Den perfekte kage til kaffen eller som dessert. Denne opskrift giver dig den autentiske schones der smager langt bedre end fra bageren. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-naan-brod',
    title: 'Hjemmelavet Naan Brød',
    category: 'Hurtigt',
    time: '2 timer',
    prepTime: '20 min',
    cookTime: '10 min',
    difficulty: 'Let',
    excerpt:
      'Blødt og smagfuldt hjemmelavet naan brød med hvidløg og smør. Den perfekte brød til indisk mad eller som snack. Denne opskrift giver dig den autentiske naan der smager langt bedre end fra restauranten. Server med curry, dip eller smør!',
  },
  {
    slug: 'hjemmelavet-bagels',
    title: 'Hjemmelavet Bagels',
    category: 'Hurtigt',
    time: '3 timer',
    prepTime: '30 min',
    cookTime: '20 min',
    difficulty: 'Mellem',
    excerpt:
      'Autentiske hjemmelavet bagels med sprød skorpe og blød krumme. Den perfekte bagværk til morgenmad eller frokost. Denne opskrift giver dig den autentiske bagels der smager langt bedre end fra bageren. Server med cream cheese, laks eller dit yndlingspålæg!',
  },
  {
    slug: 'hjemmelavet-polsehorn',
    title: 'Hjemmelavet Pølsehorn',
    category: 'Hurtigt',
    time: '45 min',
    prepTime: '20 min',
    cookTime: '25 min',
    difficulty: 'Let',
    excerpt:
      'Sprøde og smagfulde hjemmelavet pølsehorn med saftig pølse og blød dej. Den perfekte snack eller forret. Denne opskrift giver dig den autentiske pølsehorn der smager langt bedre end fra butikken. Server med ketchup, sennep eller din yndlingsdip!',
  },
  {
    slug: 'hjemmelavet-chunk-cookies',
    title: 'Hjemmelavet Chunk Cookies',
    category: 'Dessert',
    time: '35 min',
    prepTime: '15 min',
    cookTime: '12 min',
    difficulty: 'Let',
    excerpt:
      'Store og saftige hjemmelavet chunk cookies med store chokoladestykker og blød krumme. Den perfekte kage til kaffen eller som dessert. Denne opskrift giver dig den autentiske chunk cookies der smager langt bedre end fra butikken. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-chocolate-chip-cookies',
    title: 'Hjemmelavet Chocolate Chip Cookies',
    category: 'Dessert',
    time: '30 min',
    prepTime: '15 min',
    cookTime: '10 min',
    difficulty: 'Let',
    excerpt:
      'Klassiske hjemmelavet chocolate chip cookies med smeltet chokolade og blød krumme. Den perfekte kage til kaffen eller som dessert. Denne opskrift giver dig den autentiske chocolate chip cookies der smager langt bedre end fra butikken. Server med kaffe eller te!',
  },
  {
    slug: 'hjemmelavet-doner-boks',
    title: 'Hjemmelavet Doner Boks',
    category: 'Kød',
    time: '90 min',
    prepTime: '60 min',
    cookTime: '30 min',
    difficulty: 'Mellem',
    excerpt:
      'Autentisk hjemmelavet doner boks med krydret kød, frisk salat og lækker dressing. Den perfekte ret til en hyggelig aften. Denne opskrift giver dig den autentiske doner boks der smager langt bedre end fra biks. Server med pommes frites!',
  },
  {
    slug: 'hjemmelavet-gyros',
    title: 'Hjemmelavet Gyros',
    category: 'Kød',
    time: '120 min',
    prepTime: '90 min',
    cookTime: '30 min',
    difficulty: 'Mellem',
    excerpt:
      'Autentisk hjemmelavet gyros med krydret kød, frisk salat og cremet tzatziki. Den perfekte ret til en hyggelig aften. Denne opskrift giver dig den autentiske gyros der smager langt bedre end fra biks. Server med pita brød og pommes frites!',
  },
  {
    slug: 'hjemmelavet-taquitos',
    title: 'Hjemmelavet Taquitos',
    category: 'Kød',
    time: '45 min',
    prepTime: '25 min',
    cookTime: '20 min',
    difficulty: 'Let',
    excerpt:
      'Sprøde og smagfulde hjemmelavet taquitos med krydret kød og smeltet ost. Den perfekte snack eller forret. Denne opskrift giver dig den autentiske taquitos der smager langt bedre end fra butikken. Server med salsa, guacamole eller sour cream!',
  },
  {
    slug: 'hjemmelavet-shawarma',
    title: 'Hjemmelavet Shawarma',
    category: 'Kød',
    time: '120 min',
    prepTime: '90 min',
    cookTime: '30 min',
    difficulty: 'Mellem',
    excerpt:
      'Autentisk hjemmelavet shawarma med krydret kød, frisk salat og cremet dressing. Den perfekte ret til en hyggelig aften. Denne opskrift giver dig den autentiske shawarma der smager langt bedre end fra biks. Server med pita brød og pommes frites!',
  },
  {
    slug: 'hjemmelavet-chicken-tender',
    title: 'Hjemmelavet Chicken Tender',
    category: 'Kød',
    time: '40 min',
    prepTime: '20 min',
    cookTime: '20 min',
    difficulty: 'Let',
    excerpt:
      'Sprøde og saftige hjemmelavet chicken tender med gyldenbrun panering. Den perfekte snack eller hovedret. Denne opskrift giver dig den autentiske chicken tender der smager langt bedre end fra fastfood. Server med dip og pommes frites!',
  },
  {
    slug: 'hjemmelavet-pizza-slice',
    title: 'Hjemmelavet Pizza Slice',
    category: 'Hurtigt',
    time: '30 min',
    prepTime: '15 min',
    cookTime: '15 min',
    difficulty: 'Let',
    excerpt:
      'Lækre hjemmelavet pizza slice med saftig tomatsauce, smeltet ost og din yndlingstopning. Den perfekte snack eller hovedret. Denne opskrift giver dig den autentiske pizza slice der smager langt bedre end fra pizzeriaen. Server med salat!',
  },
  {
    slug: 'hjemmelavet-kylling-sandwich',
    title: 'Hjemmelavet Kylling Sandwich',
    category: 'Kød',
    time: '35 min',
    prepTime: '20 min',
    cookTime: '15 min',
    difficulty: 'Let',
    excerpt:
      'Juicy og smagfuld hjemmelavet kylling sandwich med saftig kylling, frisk salat og cremet dressing. Den perfekte sandwich til frokost eller middag. Denne opskrift giver dig den autentiske kylling sandwich der smager langt bedre end fra butikken. Server med pommes frites!',
  },
  {
    slug: 'hjemmelavet-flaeskestegssandwich',
    title: 'Hjemmelavet Flæskestegssandwich',
    category: 'Kød',
    time: '3 timer 30 min',
    prepTime: '30 min',
    cookTime: '3 timer',
    difficulty: 'Mellem',
    excerpt:
      'Klassisk dansk hjemmelavet flæskestegssandwich med sprødt svær, saftigt kød og rødkål. Den perfekte sandwich til frokost eller middag. Denne opskrift giver dig den autentiske flæskestegssandwich der smager langt bedre end fra butikken. Server med brun sovs!',
  },
  {
    slug: 'hjemmelavet-roastbeef-sandwich',
    title: 'Hjemmelavet Roastbeef Sandwich',
    category: 'Kød',
    time: '2 timer 30 min',
    prepTime: '30 min',
    cookTime: '2 timer',
    difficulty: 'Mellem',
    excerpt:
      'Saftig og smagfuld hjemmelavet roastbeef sandwich med perfekt stegt oksekød og cremet dressing. Den perfekte sandwich til frokost eller middag. Denne opskrift giver dig den autentiske roastbeef sandwich der smager langt bedre end fra butikken. Server med pommes frites!',
  },
  {
    slug: 'hjemmelavet-avocado-sandwich-a-la-joe-the-juice',
    title: 'Hjemmelavet Avocado Sandwich a la Joe & The Juice',
    category: 'Vegetarisk',
    time: '15 min',
    prepTime: '10 min',
    cookTime: '5 min',
    difficulty: 'Let',
    excerpt:
      'Frisk og sund hjemmelavet avocado sandwich a la Joe & The Juice med cremet avocado, frisk salat og lækker dressing. Den perfekte sandwich til frokost eller middag. Denne opskrift giver dig den autentiske avocado sandwich der smager langt bedre end fra butikken. Server med juice!',
  },
  {
    slug: 'hjemmelavet-tunacado-a-la-joe-the-juice',
    title: 'Hjemmelavet Tunacado a la Joe & The Juice',
    category: 'Fisk',
    time: '20 min',
    prepTime: '15 min',
    cookTime: '5 min',
    difficulty: 'Let',
    excerpt:
      'Frisk og smagfuld hjemmelavet tunacado a la Joe & The Juice med tun, cremet avocado, frisk salat og lækker dressing. Den perfekte sandwich til frokost eller middag. Denne opskrift giver dig den autentiske tunacado der smager langt bedre end fra butikken. Server med juice!',
  },
  {
    slug: 'hjemmelavet-mayo',
    title: 'Hjemmelavet Mayo',
    category: 'Hurtigt',
    time: '10 min',
    prepTime: '10 min',
    cookTime: '0 min',
    difficulty: 'Let',
    excerpt:
      'Cremet og smagfuld hjemmelavet mayo med æg og olie. Den perfekte pålæg eller ingrediens til dressinger. Denne opskrift giver dig den autentiske mayo der smager langt bedre end fra butikken. Brug på sandwich, i dressinger eller som dip!',
  },
  {
    slug: 'hjemmelavet-chilimayo',
    title: 'Hjemmelavet Chilimayo',
    category: 'Hurtigt',
    time: '15 min',
    prepTime: '15 min',
    cookTime: '0 min',
    difficulty: 'Let',
    excerpt:
      'Krydret og smagfuld hjemmelavet chilimayo med cremet mayo og stærk chili. Den perfekte pålæg eller ingrediens til dressinger. Denne opskrift giver dig den autentiske chilimayo der smager langt bedre end fra butikken. Brug på sandwich, burger eller som dip!',
  },
  {
    slug: 'hjemmelavet-pomfritter',
    title: 'Hjemmelavet Pomfritter',
    category: 'Hurtigt',
    time: '45 min',
    prepTime: '15 min',
    cookTime: '30 min',
    difficulty: 'Let',
    excerpt:
      'Sprøde og gyldne hjemmelavet pomfritter med perfekt struktur. Denne opskrift giver dig de autentiske pomfritter der smager langt bedre end fra butikken. Server med mayo, ketchup eller din yndlingsdip!',
  },
  {
    slug: 'hjemmelavet-nuggets',
    title: 'Hjemmelavet Nuggets',
    category: 'Kød',
    time: '40 min',
    prepTime: '20 min',
    cookTime: '20 min',
    difficulty: 'Let',
    excerpt:
      'Sprøde og saftige hjemmelavet nuggets med perfekt panering. Denne opskrift giver dig de autentiske nuggets der smager langt bedre end fra butikken. Server med mayo, ketchup eller din yndlingsdip!',
  },
  {
    slug: 'hjemmelavet-rejechips',
    title: 'Hjemmelavet Rejechips',
    category: 'Fisk',
    time: '30 min',
    prepTime: '20 min',
    cookTime: '10 min',
    difficulty: 'Let',
    excerpt:
      'Sprøde og luftige hjemmelavet rejechips med autentisk rejesmag. Denne opskrift giver dig de autentiske rejechips der smager langt bedre end fra butikken. Server som snack eller til forret!',
  },
  {
    slug: 'hjemmelavet-bagtkartofel',
    title: 'Hjemmelavet Bagtkartofel',
    category: 'Vegetarisk',
    time: '90 min',
    prepTime: '10 min',
    cookTime: '80 min',
    difficulty: 'Let',
    excerpt:
      'Bløde og smagfulde hjemmelavet bagtkartofler med sprød skræl. Denne opskrift giver dig de perfekte bagtkartofler der smager langt bedre end fra butikken. Server med smør, creme fraiche eller din yndlingsfyldning!',
  },
  {
    slug: 'hjemmelavet-lasagne',
    title: 'Hjemmelavet Lasagne',
    category: 'Pasta',
    time: '120 min',
    prepTime: '30 min',
    cookTime: '90 min',
    difficulty: 'Mellem',
    excerpt:
      'Klassisk og smagfuld hjemmelavet lasagne med kødsauce, bechamel og ost. Denne opskrift giver dig den autentiske lasagne der smager langt bedre end fra butikken. Perfekt til en hyggelig aften!',
  },
  {
    slug: 'hjemmelavet-margherita-pizza',
    title: 'Hjemmelavet Margherita Pizza',
    category: 'Hurtigt',
    time: '90 min',
    prepTime: '60 min',
    cookTime: '30 min',
    difficulty: 'Mellem',
    excerpt:
      'Klassisk og autentisk hjemmelavet Margherita pizza med tomatsauce, mozzarella og basilikum. Denne opskrift giver dig den perfekte pizza der smager langt bedre end fra pizzeriaen. Perfekt til en hyggelig aften!',
  },
  {
    slug: 'hjemmelavet-pasta-carbonara',
    title: 'Hjemmelavet Pasta Carbonara',
    category: 'Pasta',
    time: '25 min',
    prepTime: '10 min',
    cookTime: '15 min',
    difficulty: 'Mellem',
    excerpt:
      'Klassisk og cremet hjemmelavet pasta carbonara med bacon, æg og parmesan. Denne opskrift giver dig den autentiske carbonara der smager langt bedre end fra restauranten. Perfekt til en hurtig og lækker middag!',
  },
]

const categories = [
  'Alle',
  'Dessert',
  'Fisk',
  'Hurtigt',
  'Kød',
  'Pasta',
  'Vegetarisk',
]

function RecipeCard({
  slug,
  title,
  category,
  time,
  prepTime,
  cookTime,
  difficulty,
  excerpt,
}: (typeof recipes)[number]) {
  return (
    <Link
      href={`/opskrifter/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-shadow data-hover:shadow-lg"
    >
      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center gap-3 text-sm/5 text-gray-600 dark:text-gray-400">
          <span className="font-medium">{category}</span>
          <span>•</span>
          <span>{difficulty}</span>
        </div>
        <h3 className="mt-3 text-xl/7 font-medium text-gray-950 dark:text-gray-50">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm/6 text-gray-500 dark:text-gray-400">{excerpt}</p>
        <div className="mt-6 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">I alt:</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Forberedelse:</span>
            <span>{prepTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Tilberedning:</span>
            <span>{cookTime}</span>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-1 text-sm/5 font-medium text-gray-950 dark:text-gray-50">
          Se opskrift
          <ChevronRightIcon className="size-4 transition-transform group-data-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

function CategoryFilter({
  selectedCategory,
}: {
  selectedCategory: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected =
          (category === 'Alle' && !selectedCategory) ||
          category.toLowerCase() === selectedCategory
        return (
        <Button
          key={category}
            variant={isSelected ? 'primary' : 'outline'}
            href={
              category === 'Alle'
                ? '/opskrifter'
                : `/opskrifter?kategori=${category.toLowerCase()}`
            }
          className="text-sm"
        >
          {category}
        </Button>
        )
      })}
    </div>
  )
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const searchQuery = (params.q as string)?.toLowerCase() || ''
  const selectedCategory = (params.category as string)?.toLowerCase() || (params.kategori as string)?.toLowerCase() || ''
  const timeParam = (params.time as string) || ''

  // Filtrer opskrifter baseret på alle søgeparametre
  const filteredRecipes = recipes.filter((recipe) => {
    // Søg i titel og beskrivelse
    if (searchQuery) {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery) ||
        recipe.excerpt.toLowerCase().includes(searchQuery)
      if (!matchesSearch) return false
    }

    // Filtrer efter kategori
    if (selectedCategory) {
      const categoryLower = recipe.category.toLowerCase()

      // Håndter "Hurtigt" kategori (opskrifter under eller lig 30 min)
      if (selectedCategory === 'hurtigt') {
        const timeStr = recipe.time.toLowerCase()
        // Håndter "4 timer" osv.
        if (timeStr.includes('timer') || timeStr.includes('time')) {
          return false
        }
        const timeMinutes = parseInt(recipe.time)
        if (isNaN(timeMinutes) || timeMinutes > 30) {
          return false
        }
      }
      // Håndter "Vegetarisk" kategori
      else if (selectedCategory === 'vegetarisk') {
        if (
          categoryLower !== 'vegetarisk' &&
          !recipe.title.toLowerCase().includes('vegetarisk')
        ) {
          return false
        }
      }
      // Matcher kategori
      else if (categoryLower !== selectedCategory) {
        return false
      }
    }

    // Filtrer efter tid (max tid i minutter)
    if (timeParam) {
      const maxTime = parseInt(timeParam)
      if (!isNaN(maxTime)) {
        const timeStr = recipe.time.toLowerCase()
        // Håndter "4 timer" osv.
        if (timeStr.includes('timer') || timeStr.includes('time')) {
          return false
        }
        const recipeTime = parseInt(recipe.time)
        if (isNaN(recipeTime) || recipeTime > maxTime) {
          return false
        }
      }
    }

    return true
  })

  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-16 pb-24">
        <Subheading>Nemme Opskrifter</Subheading>
        <Heading as="h1" className="mt-2">
          Udforsk vores samling af nemme opskrifter.
        </Heading>
        <Lead className="mt-6 max-w-3xl">
          Fra klassiske retter til moderne fusion-køkken. Simpel Spis.
        </Lead>
        <div className="mt-12">
          <CategoryFilter selectedCategory={selectedCategory} />
        </div>
        {(searchQuery || timeParam) && (
          <div className="mt-6 flex flex-wrap gap-2 items-center text-sm">
            <span className="font-semibold text-gray-900 dark:text-gray-50">
              Aktive filtre:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Søg: &quot;{searchQuery}&quot;
              </span>
            )}
            {timeParam && (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Max tid: {timeParam} min
              </span>
            )}
            <Link
              href="/opskrifter"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 underline text-xs"
            >
              Ryd alle filtre
            </Link>
          </div>
        )}
        {filteredRecipes.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.slug} {...recipe} />
          ))}
        </div>
        ) : (
          <div className="mt-16 text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Ingen opskrifter fundet.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Prøv at ændre dine søgekriterier eller filtre.
            </p>
            <Button href="/opskrifter" className="mt-4">
              Se alle opskrifter
            </Button>
          </div>
        )}
      </Container>
    </main>
  )
}

