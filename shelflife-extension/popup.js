// ShelfLife — Popup Logic
// Inventory tracking, expiry alerts, smart recipe matching

// ==================== STATE ====================
let inventory = [];
let recipes = [];
let currentFilter = 'all';
let currentRecipeFilter = 'smart';
let stats = { wastePrevented: 0, recipesMade: 0 };
let isLoadingRecipes = false;

const CATEGORY_ICONS = {
  produce: '🥬', dairy: '🥛', meat: '🍗', pantry: '🥖',
  frozen: '🧊', beverages: '🥤'
};

const ITEM_EMOJIS = {
  milk: '🥛', eggs: '🥚', bread: '🍞', 'chicken breast': '🍗',
  spinach: '🥬', yogurt: '🥣', tomatoes: '🍅', cheese: '🧀',
  'ground beef': '🥩', bananas: '🍌', pasta: '🍝', rice: '🍚',
  butter: '🧈', flour: '🌾', sugar: '🍬', 'baking powder': '🧁',
  garlic: '🧄', onion: '🧅', 'olive oil': '🫒', basil: '🌿',
  carrots: '🥕', broccoli: '🥦', 'bell peppers': '🫑', potatoes: '🥔',
  mushrooms: '🍄', shrimp: '🍤', lettuce: '🥬', celery: '🌿',
  cream: '🥛', 'soy sauce': '🍶', 'green onions': '🌿', 'chocolate chips': '🍫',
  salsa: '🍅', tortillas: '🌮', cinnamon: '🍂',
  vanilla: '🧁', ginger: '🫚', parsley: '🌿', 'lemon juice': '🍋',
  'balsamic vinegar': '🍇', 'red pepper flakes': '🌶️', mustard: '🟡',
  mayonnaise: '🥚', honey: '🍯', cumin: '🟤', apple: '🍎',
  peas: '🟢', corn: '🌽', oats: '🌾', 'baking soda': '🧁',
  chocolate: '🍫', avocado: '🥑', lemon: '🍋', lime: '🍈',
  orange: '🍊', strawberry: '🍓', blueberry: '🫐', watermelon: '🍉',
  pineapple: '🍍', peach: '🍑', pear: '🍐', grape: '🍇',
  cherry: '🍒', kiwi: '🥝', mango: '🥭', coconut: '🥥',
  cucumber: '🥒', eggplant: '🍆', pumpkin: '🎃', squash: '🎃',
  zucchini: '🥒', asparagus: '🌿', cauliflower: '🥦', cabbage: '🥬',
  radish: '🔴', beet: '🟣', 'sweet potato': '🍠',
  jalapeno: '🌶️', chili: '🌶️', cilantro: '🌿', dill: '🌿',
  mint: '🌿', oregano: '🌿', rosemary: '🌿', thyme: '🌿',
  sage: '🌿', chives: '🌿', tarragon: '🌿', 'bay leaf': '🍃',
  nutmeg: '🟤', paprika: '🔴', turmeric: '🟡', curry: '🟡',
  saffron: '🟡', cardamom: '🟢', cloves: '🟤', allspice: '🟤',
  coriander: '🟢', fennel: '🟢', anise: '⭐', caraway: '🟤',
  poppy: '⚫', sesame: '⚪', peanut: '🥜', almond: '🌰',
  walnut: '🌰', cashew: '🌰', pistachio: '🌰', hazelnut: '🌰',
  pecan: '🌰', macadamia: '🌰',
  tofu: '⬜', tempeh: '🟫', lentils: '🟤',
  chickpeas: '🟤', beans: '🟤', 'black beans': '⚫', 'kidney beans': '🔴',
  'white beans': '⚪', 'pinto beans': '🟤', 'split peas': '🟢',
  quinoa: '🌾', couscous: '🌾', barley: '🌾', bulgur: '🌾',
  farro: '🌾', millet: '🌾', buckwheat: '🌾',
  cornmeal: '🌽', polenta: '🌽', grits: '🌽',
  tapioca: '⚪', arrowroot: '⚪', gelatin: '🟣',
  agar: '⚪', pectin: '🟡', yeast: '🟡',
  bagel: '🥯', pretzel: '🥨', muffin: '🧁', scone: '🧁',
  biscuit: '🍪', cracker: '🍘',
  pita: '🥙', naan: '🫓', flatbread: '🫓', lavash: '🫓',
  dosa: '🫓', roti: '🫓', chapati: '🫓', paratha: '🫓',
  arepa: '🫓', tamale: '🫔', empanada: '🥟', pierogi: '🥟',
  dumpling: '🥟', wonton: '🥟', gyoza: '🥟', ravioli: '🥟',
  gnocchi: '🍝', noodle: '🍜', ramen: '🍜', udon: '🍜',
  soba: '🍜', pho: '🍜', laksa: '🍜', 'pad thai': '🍜',
  'lo mein': '🍜', 'chow mein': '🍜', yakisoba: '🍜', vermicelli: '🍜',
  orzo: '🍝', rotini: '🍝', fusilli: '🍝', penne: '🍝',
  rigatoni: '🍝', ziti: '🍝', lasagna: '🍝', pappardelle: '🍝',
  tagliatelle: '🍝', fettuccine: '🍝', linguine: '🍝', bucatini: '🍝',
  spaghetti: '🍝', 'angel hair': '🍝', farfalle: '🍝',
  pizza: '🍕', focaccia: '🍞', quiche: '🥧', tart: '🥧',
  flan: '🍮', custard: '🍮', pudding: '🍮', mousse: '🍮',
  parfait: '🍨', trifle: '🍮', 'panna cotta': '🍮',
  tea: '🍵', coffee: '☕', juice: '🧃', smoothie: '🥤',
  milkshake: '🥤', soda: '🥤', water: '💧', beer: '🍺',
  wine: '🍷', cocktail: '🍸', whiskey: '🥃', vodka: '🥃',
  rum: '🥃', tequila: '🥃', gin: '🥃', brandy: '🥃',
  champagne: '🍾', sake: '🍶', soju: '🍶', mead: '🍯',
  cider: '🍎', kombucha: '🍵', kefir: '🥛', buttermilk: '🥛',
  'almond milk': '🥛', 'soy milk': '🥛', 'oat milk': '🥛', 'coconut milk': '🥛',
  'rice milk': '🥛',
  syrup: '🍯', molasses: '🍯', honey: '🍯', agave: '🍯',
  maple: '🍯', date: '🍯', 'brown sugar': '🍯', jaggery: '🍯',
  stevia: '🍃', erythritol: '⚪', xylitol: '⚪',
  aspartame: '⚪', sucralose: '⚪',
  egg: '🥚', chicken: '🍗', beef: '🥩',
  pork: '🥓', lamb: '🍖', turkey: '🦃', duck: '🦆',
  goose: '🦢', quail: '🐦', venison: '🦌',
  bison: '🦬', rabbit: '🐇', boar: '🐗',
  elk: '🦌', moose: '🦌', reindeer: '🦌',
  antelope: '🦌', buffalo: '🐃', ostrich: '🐦', emu: '🐦',
  alligator: '🐊', frog: '🐸', snail: '🐌',
  fish: '🐟', salmon: '🐟', tuna: '🐟', cod: '🐟',
  haddock: '🐟', halibut: '🐟', snapper: '🐟',
  'sea bass': '🐟', bass: '🐟', trout: '🐟', mackerel: '🐟',
  sardine: '🐟', anchovy: '🐟', herring: '🐟', eel: '🐍',
  swordfish: '🐟', marlin: '🐟',
  tilapia: '🐟', catfish: '🐟',
  caviar: '⚫', roe: '⚫',
  sturgeon: '🐟', carp: '🐟', bream: '🐟',
  'lion mane': '🍄', maitake: '🍄', shiitake: '🍄',
  enoki: '🍄', oyster: '🍄', portobello: '🍄',
  'button mushroom': '🍄', 'oyster mushroom': '🍄',
  chanterelle: '🍄', morel: '🍄', porcini: '🍄',
  truffle: '🍄', reishi: '🍄', chaga: '🍄',
  pepperoni: '🍕', salami: '🍖',
  ham: '🍖', bacon: '🥓', sausage: '🌭', bratwurst: '🌭',
  kielbasa: '🌭', chorizo: '🌭',
  prosciutto: '🍖', 'corned beef': '🍖',
  oxtail: '🍖', shank: '🍖', hock: '🍖',
  wing: '🍗', drumstick: '🍗', thigh: '🍗', breast: '🍗',
  tenderloin: '🍗', sirloin: '🥩', ribeye: '🥩',
  't-bone': '🥩', porterhouse: '🥩', filet: '🥩',
  'prime rib': '🥩', tomahawk: '🥩',
  hanger: '🥩', skirt: '🥩', flank: '🥩',
  brisket: '🥩', 'short rib': '🥩', chuck: '🥩',
  roast: '🍖', stew: '🍲',
  ground: '🥩', minced: '🥩',
  terrine: '🍖', pate: '🍖',
  sashimi: '🍣', nigiri: '🍣', maki: '🍣',
  poke: '🍣',
  katsu: '🍗', karaage: '🍗', tempura: '🍤', tonkatsu: '🍗',
  sukiyaki: '🍲', shabu: '🍲', yakiniku: '🍖', teppanyaki: '🍖',
  yakitori: '🍗',
  meatball: '🍖', burger: '🍔', 'hot dog': '🌭', sandwich: '🥪',
  sub: '🥪', taco: '🌮', burrito: '🌯', quesadilla: '🌮',
  nachos: '🌮', enchilada: '🌮', fajita: '🌮',
  sushi: '🍣', roll: '🍣', 'spring roll': '🍣',
  bao: '🥟', dimsum: '🥟', bun: '🥟',
  steak: '🥩', chop: '🍖', cutlet: '🍖', schnitzel: '🍖',
  cordon: '🍗', kiev: '🍗', roulade: '🍖', braciola: '🍖',
  involtini: '🍖', saltimbocca: '🍖', piccata: '🍖', marsala: '🍖',
  scaloppine: '🍖', parmigiana: '🍖', milanese: '🍖', cacciatore: '🍖',
  carpaccio: '🍖', tartare: '🍖',
  kebab: '🍢', skewer: '🍢', satay: '🍢',
  falafel: '🧆', hummus: '🧆', tabbouleh: '🥗',
  baba: '🍆', ganoush: '🍆', muhammara: '🌶️',
  tzatziki: '🥒', taramasalata: '🐟', skordalia: '🥔',
  aioli: '🧄', pesto: '🌿', chimichurri: '🌿',
  harissa: '🌶️', sambal: '🌶️', gochujang: '🌶️',
  miso: '🍲', dashi: '🍲', mirin: '🍶', 'rice vinegar': '🍶',
  'black vinegar': '🍶', balsamic: '🍇',
  'wine vinegar': '🍷', vinegar: '🍶',
  worcestershire: '🍶', 'fish sauce': '🐟', 'oyster sauce': '🦪',
  hoisin: '🍶', teriyaki: '🍶', ponzu: '🍋',
  kombu: '🍲', bonito: '🐟', katsuobushi: '🐟',
  nori: '🍣', wakame: '🍲', hijiki: '🍲', arame: '🍲',
  dulse: '🍲', kelp: '🍲', spirulina: '🍲', chlorella: '🍲',
  matcha: '🍵', sencha: '🍵', gyokuro: '🍵', hojicha: '🍵',
  genmaicha: '🍵', bancha: '🍵', kukicha: '🍵',
  oolong: '🍵', 'pu-erh': '🍵', 'white tea': '⚪',
  'yellow tea': '🟡', 'jasmine tea': '🍵', 'earl grey': '⚪',
  'english breakfast': '🍵', darjeeling: '🍵', assam: '🍵',
  'herbal tea': '🍵', rooibos: '🍵', 'yerba mate': '🍵',
  chamomile: '🍵', peppermint: '🍵', 'green tea': '🍵',
  'black tea': '🍵',
  flour: '🌾', 'all-purpose flour': '🌾', 'bread flour': '🌾', 'cake flour': '🌾',
  'whole wheat flour': '🌾', 'rye flour': '🌾', 'spelt flour': '🌾', 'rice flour': '🍚',
  'tapioca flour': '⚪', 'potato starch': '🥔', 'corn starch': '🌽',
  'cocoa powder': '🍫', 'baking cocoa': '🍫', 'dark chocolate': '🍫',
  'white chocolate': '⚪', 'milk chocolate': '🥛', 'semisweet chocolate': '🍫',
  'bittersweet chocolate': '🍫', 'unsweetened chocolate': '🍫',
  'cooking chocolate': '🍫', 'chocolate bar': '🍫', sprinkles: '✨',
  'cake mix': '🧁', 'brownie mix': '🍫', 'muffin mix': '🧁',
  'pancake mix': '🥞', 'waffle mix': '🧇', 'crepe mix': '🥞',
  'pizza dough': '🍕', 'bread dough': '🍞', 'phyllo dough': '🥧',
  'puff pastry': '🥐', 'pie crust': '🥧', 'shortcrust': '🥧',
  'cookie dough': '🍪', 'pasta dough': '🍝',
  'hot sauce': '🌶️', 'bbq sauce': '🍖', ketchup: '🍅', mustard: '🟡',
  relish: '🥒', 'sour cream': '🥛', 'creme fraiche': '🥛',
  'cottage cheese': '🧀', 'cream cheese': '🧀', 'ricotta': '🧀',
  'mascarpone': '🧀', 'burrata': '🧀', 'mozzarella': '🧀',
  'feta': '🧀', 'goat cheese': '🧀', 'blue cheese': '🧀',
  'brie': '🧀', 'camembert': '🧀', 'gouda': '🧀',
  'cheddar': '🧀', 'provolone': '🧀', 'swiss cheese': '🧀',
  'gruyere': '🧀', 'havarti': '🧀', 'pepper jack': '🧀',
  'monterey jack': '🧀', 'colby': '🧀', 'american cheese': '🧀',
  'velveeta': '🧀', 'queso': '🧀', 'queso fresco': '🧀',
  'cotija': '🧀', 'panela': '🧀', 'mano': '🧀',
  'chihuahua cheese': '🧀', 'oaxaca': '🧀', 'asadero': '🧀',
  'manchego': '🧀', 'pecorino': '🧀', 'parmesan': '🧀',
  'romano': '🧀', 'asiago': '🧀', 'fontina': '🧀',
  'taleggio': '🧀', 'toma': '🧀', 'robiole': '🧀',
  'stracchino': '🧀', 'gorgonzola': '🧀', 'roquefort': '🧀',
  stilton: '🧀', cambozola: '🧀', 'fourme': '🧀',
  reblochon: '🧀', munster: '🧀', 'port salut': '🧀',
  'limburger': '🧀', 'epoisses': '🧀', 'soumaintrain': '🧀',
  'langres': '🧀', 'maroilles': '🧀', 'munster': '🧀',
  'chaource': '🧀', 'boursin': '🧀', 'port du salut': '🧀',
  'bel paese': '🧀', 'danish blue': '🧀', 'cambozola': '🧀',
  'castello': '🧀', 'double cream': '🥛', 'clotted cream': '🥛',
  'devon cream': '🥛', 'creme anglaise': '🥛', 'zabaglione': '🥛',
  'sabayon': '🥛', 'pastry cream': '🥛', 'diplomat cream': '🥛',
  'chantilly': '🥛', 'whipped cream': '🥛', 'ice cream': '🍨',
  gelato: '🍨', sorbet: '🍧', 'frozen yogurt': '🍦',
  sherbet: '🍧', granita: '🍧', semifreddo: '🍨',
  semifreddo: '🍨', parfait: '🍨', bombe: '🍨', tortoni: '🍨',
  spumoni: '🍨', kulfi: '🍨', 'mochi ice cream': '🍡',
  'ice pop': '🍦', popsicle: '🍦', 'fudgesicle': '🍫',
  'creamsicle': '🍦', 'ice cream sandwich': '🍪', 'ice cream cone': '🍦',
  'ice cream cake': '🎂', 'tiramisu': '🍮', 'cannoli': '🥐',
  'panna cotta': '🍮', 'creme brulee': '🍮', 'pot de creme': '🍮',
  'pots de creme': '🍮', 'mousse au chocolat': '🍫', 'chocolate mousse': '🍫',
  'lemon mousse': '🍋', 'raspberry mousse': '🍒', 'white chocolate mousse': '⚪',
  'coffee mousse': '☕', 'caramel mousse': '🍯', 'passion fruit mousse': '🍈',
  'mango mousse': '🥭', 'coconut mousse': '🥥', 'strawberry mousse': '🍓',
  'blueberry mousse': '🫐', 'peach mousse': '🍑', 'apricot mousse': '🍑',
  'cherry mousse': '🍒', 'black forest cake': '🍫', 'red velvet cake': '🔴',
  'carrot cake': '🥕', 'cheesecake': '🧀', 'pound cake': '🍞',
  'bundt cake': '🍞', 'layer cake': '🎂', 'sponge cake': '🍞',
  'angel food cake': '🍞', 'chiffon cake': '🍞', 'genoise': '🍞',
  'biscuit cake': '🍪', 'jelly roll': '🍇', 'swiss roll': '🍇',
  'buche de noel': '🎄', 'opera cake': '🍫', 'mille feuille': '🥐',
  'napoleon': '🥐', 'eclair': '🥐', 'profiterole': '🥐',
  'religieuse': '🥐', 'croquembouche': '🥐', 'st honore': '🥐',
  'paris brest': '🥐', 'saint honore': '🥐', 'fraisier': '🍓',
  'charlotte': '🍓', 'vacherin': '🍓', 'dacquoise': '🍓',
  'souffle': '🍮', 'chocolate souffle': '🍫', 'cheese souffle': '🧀',
  'lemon souffle': '🍋', 'grand marnier souffle': '🍊', 'souffle pancake': '🥞',
  'japanese cheesecake': '🧀', 'cotton cheesecake': '🧀', 'basque cheesecake': '🧀',
  'new york cheesecake': '🧀', 'no bake cheesecake': '🧀', 'ricotta cheesecake': '🧀',
  'chocolate cheesecake': '🍫', 'pumpkin cheesecake': '🎃', 'pecan pie': '🥧',
  'apple pie': '🥧', 'pumpkin pie': '🎃', 'cherry pie': '🍒',
  'blueberry pie': '🫐', 'peach pie': '🍑', 'key lime pie': '🍋',
  'lemon meringue pie': '🍋', 'coconut cream pie': '🥥', 'banana cream pie': '🍌',
  'chocolate cream pie': '🍫', 'butterscotch pie': '🍯', 'mincemeat pie': '🍖',
  'shepherds pie': '🍖', 'cottage pie': '🍖', 'steak pie': '🥩',
  'chicken pot pie': '🍗', 'tourtiere': '🍖', 'pork pie': '🥓',
  'pasty': '🍖', 'cornish pasty': '🍖', 'bridie': '🍖',
  'scotch pie': '🍖', 'melton mowbray': '🍖', 'pork knuckle': '🥓',
  'pork belly': '🥓', 'pork shoulder': '🥓', 'pork loin': '🥓',
  'pork chop': '🥓', 'pork tenderloin': '🥓', 'pork ribs': '🥓',
  'baby back ribs': '🥓', 'spare ribs': '🥓', 'country style ribs': '🥓',
  'pulled pork': '🥓', 'carnitas': '🥓', 'al pastor': '🥓',
  'chicharron': '🥓', 'bacon bits': '🥓', 'canadian bacon': '🥓',
  'guanciale': '🥓', 'pancetta': '🥓', 'speck': '🥓',
  'lardo': '🥓', 'soppressata': '🥓', 'capocollo': '🥓',
  'coppa': '🥓', 'lonza': '🥓', 'nduja': '🥓',
  'sobrasada': '🥓', 'saucisson': '🥓', 'saucisse': '🥓',
  'boudin': '🥓', 'andouille': '🥓', 'chaurice': '🥓',
  'longaniza': '🥓', 'linguica': '🥓', 'morcilla': '🥓',
  'blood sausage': '🥓', 'black pudding': '🥓', 'white pudding': '⚪',
  'haggis': '🥓', 'neeps': '🟣', 'tatties': '🥔',
  'bangers': '🥓', 'mash': '🥔', 'toad in the hole': '🥓',
  'faggots': '🍖', 'peas pudding': '🟢', 'parkin': '🍞',
  'gingerbread': '🫚', 'lebkuchen': '🫚', 'speculaas': '🍪',
  'pfeffernusse': '🍪', 'spritz': '🍪', 'shortbread': '🍪',
  'biscotti': '🍪', 'cantucci': '🍪', 'amaretti': '🍪',
  'pizzelle': '🍪', 'stroopwafel': '🍪', 'speculoos': '🍪',
  'kruidnoten': '🍪', 'pepernoten': '🍪', 'taai taai': '🍪',
  'ontbijtkoek': '🍞', 'gevulde speculaas': '🍪', 'banketstaaf': '🍞',
  'boterkoek': '🍞', 'tompouce': '🍰', 'tompoes': '🍰',
  'moorkop': '🍩', 'bossche bol': '🍩', 'vlaai': '🥧',
  'gevulde koek': '🍪', 'bitterballen': '🍖', 'kroket': '🍖',
  'frikandel': '🍖', 'bamischijf': '🍜', 'nasischijf': '🍜',
  'kaassouffle': '🧀', 'garnalen kroket': '🍤', 'sate': '🍢',
  'babi pangang': '🍖', 'spek koek': '🍖', 'ontbijt': '🍳',
  'uitsmijter': '🍳', 'bammetje': '🍞', 'tosti': '🥪',
  'croque monsieur': '🥪', 'croque madame': '🥪', 'tartine': '🥪',
  'bruschetta': '🥪', 'crostini': '🥪', 'carpaccio': '🍖',
  'vitello tonnato': '🍖', 'bresaola': '🍖', 'crudo': '🐟',
  'tartare': '🍖', 'carpione': '🐟', 'in saor': '🐟',
  'sarde': '🐟', 'acciughe': '🐟', 'baccala': '🐟',
  'stoccafisso': '🐟', 'brandade': '🐟', 'zuppa': '🍲',
  'minestrone': '🍲', 'ribollita': '🍲', 'pappa': '🍲',
  'pomodoro': '🍅', 'acquacotta': '🍲', 'caciucco': '🍲',
  'cioppino': '🍲', 'bouillabaisse': '🍲', 'caldo': '🍲',
  'sancocho': '🍲', 'cazuela': '🍲', 'puchero': '🍲',
  'cocido': '🍲', 'fabada': '🍲', 'cassoulet': '🍲',
  'choucroute': '🍲', 'bigos': '🍲', 'goulash': '🍲',
  'paprikash': '🍲', 'perkelt': '🍲', 'tokany': '🍲',
  'bogracs': '🍲', 'halaszle': '🍲', 'fozelek': '🍲',
  'lecso': '🍲', 'porkolt': '🍲', 'toltott kaposzta': '🥬',
  'rakott krumpli': '🥔', 'rakott tészta': '🍝', 'csirke paprikash': '🍗',
  'marha porkolt': '🥩', 'tokany': '🍲', 'hortobagyi': '🍗',
  'palacsinta': '🥞', 'langos': '🍞', 'kurtos kalacs': '🍞',
  'dobos torta': '🎂', 'sacher torte': '🎂', 'esterhazy torta': '🎂',
  'rigojanci': '🎂', 'turos': '🧀', 'turo': '🧀',
  'kakaos csiga': '🐌', 'pogacsa': '🍞', 'kalacs': '🍞',
  'bejgli': '🍞', 'zserbo': '🍰', 'isler': '🍰',
  'linzer': '🍪', 'negresa': '🍰', 'amandina': '🍰',
  'savarina': '🍰', 'cornulete': '🍪', 'cozonac': '🍞',
  'pasca': '🍞', 'mucenici': '🍪', 'coliva': '🍚',
  'kollyva': '🍚', 'fanouropita': '🍰', 'vasilopita': '🍰',
  'kourabiedes': '🍪', 'melomakarona': '🍪', 'kourabiethes': '🍪',
  'diples': '🍯', 'loukoumades': '🍩', 'loukoumas': '🍩',
  'tiganites': '🥞', 'saragli': '🍯', 'baklava': '🍯',
  'galaktoboureko': '🍰', 'bougatsa': '🍰', 'spanakopita': '🥬',
  'tyropita': '🧀', 'kolokithopita': '🎃', 'kreatopita': '🍖',
  'hortopita': '🥬', 'ladopita': '🍞', 'karydopita': '🌰',
  'kormos': '🍫', 'mosaiko': '🍫', 'sokolatina': '🍫',
  'patsavouropita': '🍰', 'loukoumi': '🍬', 'submarine': '🍬',
  'pasteli': '🍯', 'mantolato': '🍬', 'mavrodaphne': '🍷',
  'retsina': '🍷', 'tsipouro': '🥃', 'ouzo': '🥃',
  'raki': '🥃', 'tsikoudia': '🥃', 'zivania': '🥃',
  'komovos': '🍷', 'mavro': '🍷', 'xinomavro': '🍷',
  'agiorgitiko': '🍷', 'assyrtiko': '🍷', 'moschofilero': '🍷',
  'roditis': '🍷', 'savvatiano': '🍷', 'debina': '🍷',
  'limniona': '🍷', 'krassato': '🍷', 'xinomavro': '🍷'
};

function getItemEmoji(name) {
  const key = name.toLowerCase();
  if (ITEM_EMOJIS[key]) return ITEM_EMOJIS[key];
  for (const [k, v] of Object.entries(ITEM_EMOJIS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return CATEGORY_ICONS[inventory.find(i => i.name === name)?.category] || '📦';
}

// ==================== STORAGE ====================
function loadData() {
  chrome.storage?.local.get(['sl_inventory', 'sl_stats'], (res) => {
    inventory = res.sl_inventory || [];
    stats = res.sl_stats || { wastePrevented: 0, recipesMade: 0 };
    renderAll();
  });
  // Fallback for non-extension testing
  if (typeof chrome === 'undefined' || !chrome.storage) {
    inventory = JSON.parse(localStorage.getItem('sl_inventory') || '[]');
    stats = JSON.parse(localStorage.getItem('sl_stats') || '{"wastePrevented":0,"recipesMade":0}');
    renderAll();
  }
}

function saveData() {
  if (chrome.storage?.local) {
    chrome.storage.local.set({ sl_inventory: inventory, sl_stats: stats });
    try {
      chrome.runtime?.sendMessage({ type: 'refresh-badge' });
    } catch (e) {
      // ignore if background not available
    }
  } else {
    localStorage.setItem('sl_inventory', JSON.stringify(inventory));
    localStorage.setItem('sl_stats', JSON.stringify(stats));
  }
}

// ==================== DATE UTILS ====================
function getDaysLeft(expiry) {
  const diff = new Date(expiry) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getExpiryClass(days) {
  if (days < 0) return 'expired';
  if (days <= 3) return 'expiring';
  return 'fresh';
}

function getExpiryBadge(days) {
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, class: 'badge-expired' };
  if (days === 0) return { text: 'Today', class: 'badge-expiring' };
  if (days <= 3) return { text: `${days}d left`, class: 'badge-expiring' };
  if (days <= 7) return { text: `${days}d left`, class: 'badge-fresh' };
  return { text: `${days}d left`, class: 'badge-fresh' };
}

// ==================== RENDERING ====================
function renderAll() {
  renderInventory();
  renderRecipes();
  renderDashboard();
  updateHeaderBadge();
}

function renderInventory() {
  const list = document.getElementById('inventory-list');
  const empty = document.getElementById('inventory-empty');
  const searchVal = document.getElementById('inventory-search')?.value.toLowerCase() || '';

  let items = inventory;
  if (currentFilter !== 'all') items = items.filter(i => i.category === currentFilter);
  if (searchVal) items = items.filter(i => i.name.toLowerCase().includes(searchVal));

  // Sort: expiring first, then alphabetical
  items.sort((a, b) => {
    const da = getDaysLeft(a.expiry);
    const db = getDaysLeft(b.expiry);
    if (da !== db) return da - db;
    return a.name.localeCompare(b.name);
  });

  if (items.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  list.innerHTML = items.map(item => {
    const days = getDaysLeft(item.expiry);
    const status = getExpiryClass(days);
    const badge = getExpiryBadge(days);
    const pct = Math.max(0, Math.min(100, (days / 14) * 100));
    const ringColor = days < 0 ? 'var(--danger)' : days <= 3 ? 'var(--warning)' : 'var(--accent)';
    const dashArray = 2 * Math.PI * 14; // r=14
    const dashOffset = dashArray * (1 - pct / 100);

    return `
      <div class="item-card ${status}">
        <div class="expiry-ring">
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle class="expiry-ring-bg" cx="18" cy="18" r="14"/>
            <circle class="expiry-ring-fill" cx="18" cy="18" r="14"
              stroke="${ringColor}"
              stroke-dasharray="${dashArray}"
              stroke-dashoffset="${dashOffset}"/>
          </svg>
          <span class="ring-label" style="color:${ringColor}">${days < 0 ? '!' : days}</span>
        </div>
        <div class="item-icon">${getItemEmoji(item.name)}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-meta">${item.quantity || ''} · Exp: ${formatDate(item.expiry)}</div>
        </div>
        <div class="item-badge ${badge.class}">${badge.text}</div>
        <div class="item-actions">
          <button class="action-btn" data-del="${item.id}" title="Remove">🗑️</button>
        </div>
      </div>
    `;
  }).join('');

  // Bind delete buttons
  list.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.del;
      inventory = inventory.filter(i => i.id !== id);
      saveData();
      renderAll();
      showToast('Item removed', 'warning');
    });
  });
}

// ==================== RECIPES ====================
async function renderRecipes(forceRefresh = false) {
  const list = document.getElementById('recipes-list');
  const empty = document.getElementById('recipes-empty');

  if (inventory.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  // Show loading state
  if (isLoadingRecipes) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="animation: float 1.5s ease-in-out infinite">🍳</div>
        <p>Finding recipes for you...</p>
      </div>`;
    empty.classList.add('hidden');
    return;
  }

  // Get recipes
  let allRecipes = [];
  const useApi = true; // Always try API first

  if (useApi && window.RecipeAPI && inventory.length > 0) {
    isLoadingRecipes = true;
    renderRecipes(); // show loader
    try {
      const apiRecipes = await window.RecipeAPI.getRecipes(inventory, 24);
      allRecipes = window.RecipeAPI.mergeRecipes(apiRecipes, RECIPE_DB);
    } catch (e) {
      console.error('API fetch failed:', e);
      allRecipes = [...RECIPE_DB];
    }
    isLoadingRecipes = false;
  } else {
    allRecipes = [...RECIPE_DB];
  }

  // Apply recipe filter
  let filtered = allRecipes;
  if (currentRecipeFilter === 'expiring') {
    filtered = allRecipes.filter(r => r.expiringMatches > 0);
  } else if (currentRecipeFilter === 'smart') {
    // Already sorted by smart match in API; local ones need scoring
    filtered = allRecipes.filter(r => r.matchScore > 0 || !r.matchScore);
  }

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  list.innerHTML = filtered.slice(0, 20).map(recipe => {
    const score = recipe.matchScore || 0;
    const expMatch = recipe.expiringMatches || 0;
    const matchLabel = score >= 80 ? 'Perfect Match' : score >= 50 ? 'Great Match' : score > 0 ? 'Partial Match' : 'Browse';
    const tags = [];
    if (expMatch > 0) tags.push(`<span class="tag tag-expiring">⏰ Uses expiring items</span>`);
    if (score > 0) tags.push(`<span class="tag tag-match">${matchLabel}</span>`);
    if (recipe.tags) recipe.tags.slice(0, 2).forEach(t => tags.push(`<span class="tag">${t}</span>`));

    return `
      <div class="recipe-card" data-recipe-id="${recipe.id}">
        <div class="recipe-header">
          <div class="recipe-emoji">${recipe.emoji}</div>
          <div class="recipe-info">
            <div class="recipe-title">${recipe.name}</div>
            <div class="recipe-tags">${tags.join('')}</div>
            <div class="recipe-match-bar">
              <div class="match-track">
                <div class="match-fill" style="width: ${score}%"></div>
              </div>
              <span class="match-text">${score}% match</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Bind click
  list.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.recipeId;
      const recipe = allRecipes.find(r => r.id === id);
      if (recipe) openRecipeModal(recipe);
    });
  });
}

function openRecipeModal(recipe) {
  const modal = document.getElementById('recipe-modal');
  const detail = document.getElementById('recipe-detail');

  const haveNames = inventory.map(i => i.name.toLowerCase());
  const ingRows = recipe.ingredients.map(ing => {
    const inPantry = haveNames.some(h => {
      const haveItem = inventory.find(i => i.name.toLowerCase() === h);
      return window.RecipeAPI?.ingredientMatches(haveItem?.name || h, ing.name) ||
             h.includes(ing.name) || ing.name.includes(h);
    });
    return `
      <div class="ingredient-row">
        <span class="${inPantry ? 'ingredient-have' : 'ingredient-missing'}">${ing.name}</span>
        <span class="ingredient-tag ${inPantry ? 'in-pantry' : 'need-to-buy'}">${inPantry ? 'In Pantry' : 'Need'}</span>
      </div>
    `;
  }).join('');

  const steps = recipe.instructions.map((step, i) =>
    `<li>${step}</li>`
  ).join('');

  detail.innerHTML = `
    <div class="recipe-detail-header">
      <div class="recipe-detail-emoji">${recipe.emoji}</div>
      <div class="recipe-detail-title">${recipe.name}</div>
      <div class="recipe-detail-meta">${recipe.time || ''} · ${recipe.difficulty || ''} · ${recipe.tags?.join(' · ') || ''}</div>
    </div>
    <div class="recipe-section">
      <h4>Ingredients</h4>
      ${ingRows}
    </div>
    <div class="recipe-section">
      <h4>Instructions</h4>
      <ol class="instructions-list">
        ${steps}
      </ol>
    </div>
    <button class="btn-cook" id="btn-cook">👨‍🍳 I Made This!</button>
  `;

  modal.classList.remove('hidden');

  document.getElementById('btn-cook').addEventListener('click', () => {
    stats.recipesMade++;
    // Estimate waste prevented based on recipe ingredients used
    const usedValue = recipe.ingredients.filter(ing => {
      return haveNames.some(h => h.includes(ing.name) || ing.name.includes(h));
    }).length * 3;
    stats.wastePrevented += usedValue;
    saveData();
    renderDashboard();
    fireConfetti();
    showToast(`Great job! You used up ingredients and saved ~$${usedValue}.`, 'success');
    modal.classList.add('hidden');
  });
}

// ==================== DASHBOARD ====================
function renderDashboard() {
  const total = inventory.length;
  const expiring = inventory.filter(i => getDaysLeft(i.expiry) <= 3).length;
  document.getElementById('dash-total').textContent = total;
  document.getElementById('dash-expiring').textContent = expiring;
  document.getElementById('dash-waste').textContent = `$${stats.wastePrevented}`;
  document.getElementById('dash-recipes').textContent = stats.recipesMade;

  // Timeline
  const timeline = document.getElementById('expiry-timeline');
  const buckets = [
    { label: 'Expired', days: -999, color: 'var(--danger)', count: 0 },
    { label: 'Today', days: 0, color: 'var(--danger)', count: 0 },
    { label: 'Tomorrow', days: 1, color: 'var(--warning)', count: 0 },
    { label: '2-3 days', days: 3, color: 'var(--warning)', count: 0 },
    { label: '4-7 days', days: 7, color: 'var(--accent)', count: 0 },
    { label: '1-2 weeks', days: 14, color: 'var(--info)', count: 0 },
    { label: '2+ weeks', days: 999, color: 'var(--text-muted)', count: 0 }
  ];

  for (const item of inventory) {
    const d = getDaysLeft(item.expiry);
    if (d < 0) buckets[0].count++;
    else if (d === 0) buckets[1].count++;
    else if (d === 1) buckets[2].count++;
    else if (d <= 3) buckets[3].count++;
    else if (d <= 7) buckets[4].count++;
    else if (d <= 14) buckets[5].count++;
    else buckets[6].count++;
  }

  timeline.innerHTML = buckets.filter(b => b.count > 0).map(b => `
    <div class="timeline-item">
      <div class="timeline-dot" style="background:${b.color};box-shadow:0 0 8px ${b.color}"></div>
      <span class="timeline-label">${b.label}</span>
      <span class="timeline-count">${b.count} item${b.count > 1 ? 's' : ''}</span>
    </div>
  `).join('');

  // Smart suggestions
  const suggestions = document.getElementById('smart-suggestions');
  const ideas = [];

  // Find items expiring in 2 days
  const urgent = inventory.filter(i => {
    const d = getDaysLeft(i.expiry);
    return d >= 0 && d <= 2;
  });

  if (urgent.length > 0) {
    const names = urgent.map(i => i.name).join(', ');
    ideas.push({
      emoji: '⏰',
      text: `<strong>${names}</strong> ${urgent.length === 1 ? 'is' : 'are'} expiring soon. Check the <strong>Recipes</strong> tab for dishes that use ${urgent.length === 1 ? 'it' : 'them'} up!`
    });
  }

  // Suggest recipe if many items
  if (inventory.length >= 5) {
    ideas.push({
      emoji: '💡',
      text: `You have <strong>${inventory.length} items</strong> in your pantry. The recipe engine found matches — try the <strong>Smart Match</strong> filter!`
    });
  }

  // Waste milestone
  if (stats.wastePrevented >= 10) {
    ideas.push({
      emoji: '🎉',
      text: `You've prevented <strong>$${stats.wastePrevented}</strong> of food waste so far. Keep cooking!`
    });
  }

  // Fresh items reminder
  const fresh = inventory.filter(i => getDaysLeft(i.expiry) > 7);
  if (fresh.length > 3) {
    ideas.push({
      emoji: '📦',
      text: `You have <strong>${fresh.length} fresh items</strong> with plenty of time. Great inventory management!`
    });
  }

  suggestions.innerHTML = ideas.map(s => `
    <div class="suggestion-card">
      <span class="emoji">${s.emoji}</span>
      <p>${s.text}</p>
    </div>
  `).join('');
}

function updateHeaderBadge() {
  const expiring = inventory.filter(i => {
    const d = getDaysLeft(i.expiry);
    return d >= 0 && d <= 3;
  }).length;
  const badge = document.getElementById('expiring-count');
  if (badge) badge.textContent = expiring;
}

// ==================== TABS ====================
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === 'tab-' + tabName);
  });
  if (tabName === 'recipes') renderRecipes(true);
  if (tabName === 'dashboard') renderDashboard();
}

// ==================== ADD ITEM ====================
function addItem(name, category, quantity, expiry, value) {
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: name.trim(),
    category,
    quantity: quantity || '',
    expiry,
    value: parseFloat(value) || 0,
    added: new Date().toISOString()
  };
  inventory.push(item);
  saveData();
  renderAll();
  showToast(`${name} added to pantry!`, 'success');
}

// ==================== CONFETTI ====================
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 420;
  canvas.height = 580;

  const particles = [];
  const colors = ['#22c55e', '#4ade80', '#f59e0b', '#3b82f6', '#ef4444', '#a855f7'];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 4,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      life: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.life -= 0.015;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    if (alive) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  animate();
}

// ==================== TOAST ====================
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Inventory filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderInventory();
    });
  });

  // Search
  document.getElementById('inventory-search')?.addEventListener('input', () => {
    renderInventory();
  });

  // Recipe filters
  document.querySelectorAll('[data-recipe-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-recipe-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRecipeFilter = btn.dataset.recipeFilter;
      renderRecipes();
    });
  });

  // Quick add buttons
  document.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const days = parseInt(btn.dataset.days);
      const category = btn.dataset.category;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);
      addItem(name, category, '', expiry.toISOString().split('T')[0], 5);
    });
  });

  // Custom add form
  const form = document.getElementById('add-item-form');
  if (form) {
    // Set default expiry to 7 days from now
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 7);
    document.getElementById('item-expiry').value = defaultExpiry.toISOString().split('T')[0];

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('item-name').value;
      const category = document.getElementById('item-category').value;
      const quantity = document.getElementById('item-quantity').value;
      const expiry = document.getElementById('item-expiry').value;
      const value = document.getElementById('item-value').value;
      addItem(name, category, quantity, expiry, value);
      form.reset();
      document.getElementById('item-expiry').value = defaultExpiry.toISOString().split('T')[0];
      switchTab('inventory');
    });
  }

  // Modal close
  document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
    document.getElementById('recipe-modal').classList.add('hidden');
  });
  document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('recipe-modal').classList.add('hidden');
  });
});
