import { EN, ABILITY_EN } from "./i18n";
export const T: Record<string, string[]> = {
  title: ["Duelo de Facciones", "Двобій фракцій"],
  play: ["Nueva partida", "Нова гра"],
  codex: ["Códice", "Кодекс"],
  codexSub: [
    "Todas las cartas y facciones, con sus habilidades. Renderizado en el servidor.",
    "Усі карти й фракції з їхніми здібностями. Відрендерено на сервері.",
  ],
  openCodex: ["Abrir el códice", "Відкрити кодекс"],
  playFaction: ["Jugar con esta facción", "Грати за цю фракцію"],
  neutralCards: ["Cartas neutrales", "Нейтральні карти"],
  backToGame: ["Volver al juego", "Повернутися до гри"],
  copies: ["copias", "копії"],
  help: ["Cómo jugar", "Як грати"],
  menu: ["Menú principal", "Головне меню"],
  back: ["Volver", "Назад"],
  prototype: ["PROTOTIPO JUGABLE · 01", "ІГРОВИЙ ПРОТОТИП · 01"],
  solo: ["UN JUEGO DE CARTAS Y DECISIONES", "ГРА КАРТ І РІШЕНЬ"],
  intro: [
    "El bosque susurra. La montaña responde. Elige tu bando y convierte una buena mano en una gran estrategia.",
    "Ліс шепоче. Гора відповідає. Обери свій бік і перетвори добру руку на велику стратегію.",
  ],
  tagline: [
    "Dos facciones. Tres filas. Una última carta.",
    "Дві фракції. Три ряди. Остання карта.",
  ],
  local: [
    "SINGLE PLAYER · IA LOCAL · SIN CUENTAS",
    "ОДИН ГРАВЕЦЬ · ЛОКАЛЬНИЙ ШІ · БЕЗ АКАУНТІВ",
  ],
  experiment: ["UN EXPERIMENTO INDEPENDIENTE", "НЕЗАЛЕЖНИЙ ЕКСПЕРИМЕНТ"],
  forest: ["Pacto del Bosque", "Лісовий Пакт"],
  granite: ["Clanes de Granito", "Гранітні Клани"],
  choose: ["Elige tu lealtad", "Обери свій бік"],
  chooseSub: [
    "Dos formas de luchar. Las mismas reglas del duelo.",
    "Два способи битися. Спільні правила двобою.",
  ],
  forestDesc: [
    "Bajo las copas del bosque, la paciencia es un arma. Arqueros precisos, exploradores astutos y antiguos guardianes.",
    "Під кронами дерев терпіння — це зброя. Влучні лучники, хитрі розвідники та давні вартові.",
  ],
  graniteDesc: [
    "Forjados en las cumbres, unidos por el hierro. Guerreros resistentes y máquinas que hacen temblar el valle.",
    "Загартовані на вершинах, об’єднані залізом. Стійкі воїни й машини, що змушують долину тремтіти.",
  ],
  forestTrait: [
    "DISTANCIA · ESPIONAJE · RECUPERACIÓN",
    "ДАЛЬНІЙ БІЙ · ШПИГУНСТВО · ВІДНОВЛЕННЯ",
  ],
  graniteTrait: [
    "CUERPO A CUERPO · ASEDIO · FORMACIÓN",
    "БЛИЖНІЙ БІЙ · ОБЛОГА · СТРІЙ",
  ],
  selectFaction: ["Elegir facción", "Обрати фракцію"],
  factionStep: ["01 Facción", "01 Фракція"],
  deckStep: ["02 Mazo", "02 Колода"],
  duelStep: ["03 Duelo", "03 Двобій"],
  build: ["Prepara tu baraja", "Підготуй колоду"],
  buildSub: [
    "Inspecciona las cartas y usa + / − para ajustar tu mazo.",
    "Оглянь карти та налаштуй колоду кнопками + / −.",
  ],
  all: ["Todas", "Усі"],
  units: ["Unidades", "Бійці"],
  special: ["Especiales", "Спеціальні"],
  neutral: ["Neutrales", "Нейтральні"],
  melee: ["Cuerpo a cuerpo", "Ближній бій"],
  ranged: ["Distancia", "Дальній бій"],
  siege: ["Asedio", "Облога"],
  leader: ["Líder", "Лідер"],
  forestLeader: ["Alder · Señor del Robledal", "Альдер · Володар діброви"],
  graniteLeader: ["Bram · Rey de las Cumbres", "Брам · Король вершин"],
  forestLeaderDesc: [
    "Una vez por partida: elimina todo el clima. Consume tu turno.",
    "Раз за гру: прибери всю погоду. Витрачає хід.",
  ],
  graniteLeaderDesc: [
    "Una vez por partida: duplica tu fila de asedio. No se acumula con otro cuerno. Consume tu turno.",
    "Раз за гру: подвой силу свого облогового ряду. Не додається до іншого рогу. Витрачає хід.",
  ],
  cards: ["Cartas", "Карти"],
  unitMin: ["Unidades · mín. 22", "Бійці · мін. 22"],
  specialMax: ["Especiales · máx. 10", "Спеціальні · макс. 10"],
  valid: [
    "Mazo válido. Tu líder no cuenta como carta.",
    "Колода коректна. Лідер не рахується як карта.",
  ],
  invalid: [
    "Necesitas al menos 22 unidades y un máximo de 10 especiales.",
    "Потрібно щонайменше 22 бійці та не більше 10 спеціальних карт.",
  ],
  start: ["Jugar", "Грати"],
  restore: ["Restaurar mazo recomendado", "Відновити рекомендовану колоду"],
  restoreToast: [
    "Mazo recomendado restaurado.",
    "Рекомендовану колоду відновлено.",
    "Recommended deck restored.",
  ],
  preview: ["INSPECCIÓN DE CARTA", "ОГЛЯД КАРТИ"],
  inspect: [
    "Pasa el cursor o selecciona una carta para ver su habilidad.",
    "Наведи курсор або обери карту, щоб побачити здібність.",
  ],
  prepare: ["Una buena mano es el comienzo", "Добра рука — це початок"],
  prepareSub: [
    "Puedes cambiar hasta dos cartas. Haz clic en una para sustituirla.",
    "Можна замінити до двох карт. Натисни карту для заміни.",
  ],
  exchanges: ["Cambios restantes", "Залишилося замін"],
  begin: ["Comenzar partida", "Почати двобій"],
  changed: ["Sustituida", "Замінено"],
  you: ["Tú", "Ти"],
  rival: ["Rival", "Суперник"],
  normal: ["Dificultad normal", "Звичайна складність"],
  round: ["Ronda", "Раунд"],
  yourTurn: ["Tu turno", "Твій хід"],
  thinking: ["El rival está pensando…", "Суперник обмірковує хід…"],
  pass: ["Pasar", "Пас"],
  passed: ["HA PASADO", "ПАС"],
  hand: ["Tu mano", "Твоя рука"],
  deck: ["Mazo", "Колода"],
  grave: ["Descarte", "Відбій"],
  weather: ["CLIMA COMPARTIDO", "СПІЛЬНА ПОГОДА"],
  noWeather: ["Cielo despejado", "Ясне небо"],
  leaderUse: ["Usar líder", "Використати лідера"],
  used: ["Líder utilizado", "Лідера використано"],
  selectHint: [
    "Selecciona una carta de tu mano. Después, elige una fila marcada.",
    "Обери карту з руки. Потім натисни позначений ряд.",
  ],
  placeHint: [
    "Elige la fila marcada para jugar esta carta.",
    "Натисни позначений ряд, щоб зіграти карту.",
  ],
  decoyHint: [
    "Selecciona una unidad propia que no sea héroe para devolverla a tu mano.",
    "Обери свого бійця, крім героя, щоб повернути його в руку.",
  ],
  specialHint: [
    "Esta carta afecta a todo el tablero. Pulsa «Jugar carta».",
    "Ця карта впливає на все поле. Натисни «Зіграти карту».",
  ],
  playCard: ["Jugar carta", "Зіграти карту"],
  cancel: ["Cancelar selección", "Скасувати вибір"],
  emptyRow: ["El campo espera…", "Поле чекає…"],
  events: ["ÚLTIMOS MOVIMIENTOS", "ОСТАННІ ДІЇ"],
  played: ["jugó", "зіграв"],
  revived: ["recuperó", "повернув"],
  leaderUsed: ["activó su líder", "використав лідера"],
  passedLog: ["pasó", "спасував"],
  roundEnd: ["Fin de ronda", "Кінець раунду"],
  revive: ["Elige a quién recuperar", "Обери, кого повернути"],
  reviveSub: [
    "El médico devuelve al campo una unidad de tu descarte y activa su habilidad. Los héroes no pueden recuperarse.",
    "Медик повертає бійця з відбою на поле та активує його здібність. Героїв повернути не можна.",
  ],
  skip: ["No recuperar", "Не повертати"],
  continue: ["Siguiente ronda", "Наступний раунд"],
  wonRound: ["Has ganado la ronda", "Ти виграв раунд"],
  lostRound: ["El rival gana la ronda", "Суперник виграв раунд"],
  tieRound: ["Ronda empatada", "Нічия в раунді"],
  tieExplain: [
    "Ambos bandos ganan una ronda.",
    "Обидві сторони отримують перемогу в раунді.",
  ],
  nextExplain: [
    "La mano se conserva. El campo y el clima se limpian. No se roban cartas.",
    "Рука зберігається. Поле й погода очищуються. Нових карт немає.",
  ],
  victory: ["Victoria", "Перемога"],
  defeat: ["Derrota", "Поразка"],
  draw: ["Empate", "Нічия"],
  finished: ["EL DUELO HA TERMINADO", "ДВОБІЙ ЗАВЕРШЕНО"],
  victorySub: [
    "La última carta estaba de tu lado.",
    "Остання карта була на твоєму боці.",
  ],
  defeatSub: [
    "Hoy la gloria pertenece al otro bando. Siempre queda otra partida.",
    "Сьогодні слава на іншому боці. Попереду ще один двобій.",
  ],
  drawSub: ["Dos rivales. La misma gloria.", "Двоє суперників. Спільна слава."],
  rematch: ["Revancha", "Реванш"],
  changeDeck: ["Cambiar mazo", "Змінити колоду"],
  roundsWon: ["Rondas ganadas", "Виграні раунди"],
  quitTitle: ["¿Volver al menú?", "Повернутися в меню?"],
  quitBody: [
    "La partida actual no se guardará. Tu mazo y tu idioma sí se conservan.",
    "Поточна гра не збережеться. Колода й мова залишаться.",
  ],
  stay: ["Seguir jugando", "Грати далі"],
  close: ["Cerrar", "Закрити"],
  rules1: ["Gana dos rondas", "Виграй два раунди"],
  rules1b: [
    "Cada bando empieza con 10 cartas. Conservas tu mano entre rondas: no hay robo automático. El total de tus tres filas decide quién gana. En un empate, ambos ganan una ronda; si ambos alcanzan dos, la partida empata.",
    "Кожен починає з 10 карт. Рука зберігається між раундами без автоматичного добору. Сума трьох рядів визначає переможця. За нічиєї обидва виграють раунд; якщо обидва отримали дві перемоги, гра закінчується нічиєю.",
  ],
  rules2: ["Una carta o pasar", "Карта або пас"],
  rules2b: [
    "Selecciona una carta y después su fila. Algunas especiales se confirman con «Jugar carta». Pasar es definitivo en esa ronda: tu rival puede seguir jugando. Un líder también consume el turno.",
    "Обери карту, потім її ряд. Деякі спеціальні карти підтверджуються кнопкою «Зіграти карту». Пас діє до кінця раунду: суперник може грати далі. Лідер також витрачає хід.",
  ],
  rules3: ["Lee tus habilidades", "Читай здібності"],
  rules3b: [
    "Los espías dan fuerza al rival y te permiten robar dos cartas. Los médicos recuperan descartes. El vínculo multiplica las copias iguales; la agrupación convoca a su grupo desde tu mano y mazo.",
    "Шпигуни дають силу супернику й дозволяють тобі добрати дві карти. Медики повертають відбій. Зв’язок підсилює однакові карти; збір викликає групу з руки й колоди.",
  ],
  rules4: ["Domina el clima", "Керуй погодою"],
  rules4b: [
    "El clima fija la fuerza base de una fila de ambos bandos en 1. Después se aplica vínculo y cuerno (×2, sin acumular). Los héroes son inmunes. Quemadura elimina simultáneamente las unidades no héroes de mayor fuerza efectiva de ambos lados.",
    "Погода встановлює базову силу ряду обох сторін на 1. Потім діють зв’язок і ріг (×2, без додавання). Герої мають імунітет. Спопелення одночасно знищує всіх бійців, крім героїв, з найбільшою поточною силою з обох боків.",
  ],
  rulesNote: [
    "Prototipo independiente con arte original. Sin poderes pasivos de facción: solo la habilidad del líder.",
    "Незалежний прототип з оригінальним мистецтвом. Без пасивних здібностей фракцій: лише здібність лідера.",
  ],
  confirmPass: [
    "¿Terminar tus acciones en esta ronda?",
    "Завершити свої дії в цьому раунді?",
  ],
  confirmPassBody: [
    "El rival podrá seguir jugando cartas hasta que también pase. No podrás volver a jugar en esta ronda.",
    "Суперник зможе грати карти, доки теж не спасує. Ти більше не зможеш діяти в цьому раунді.",
  ],
  emptyGrave: ["No hay cartas en el descarte.", "У відбої немає карт."],
  cancelButton: ["Cancelar", "Скасувати"],
  inspectTitle: ["Detalle de carta", "Деталі карти"],
  roundLabel: ["AL MEJOR DE TRES", "ДО ДВОХ ПЕРЕМОГ"],
  noCards: [
    "No quedan cartas en tu mano. Puedes usar tu líder o pasar.",
    "У руці немає карт. Можна використати лідера або спасувати.",
  ],
  swapAgain: [
    "Las cartas nuevas no se pueden volver a sustituir.",
    "Нові карти не можна замінювати повторно.",
  ],
};
Object.assign(T, {
  initialHand: ["Tu mano inicial", "Твоя початкова рука", "Your starting hand"],
  exchangeCard: [
    "Cambiar esta carta",
    "Замінити цю карту",
    "Exchange this card",
  ],
  deckInfo: ["Ayuda del mazo", "Довідка про колоду", "Deck help"],
  moreInfo: ["Ver detalles", "Переглянути деталі", "View details"],
  nextDifficulty: [
    "Se aplica a la próxima partida.",
    "Для наступної гри.",
    "Applies to the next match.",
  ],
  shortSwap: [
    "Puedes cambiar hasta 2 cartas.",
    "Можна замінити до 2 карт.",
    "You may exchange up to 2 cards.",
  ],
  filterCards: ["Filtrar cartas", "Фільтр карт", "Filter cards"],

  settings: ["Ajustes", "Налаштування"],
  language: ["Idioma", "Мова"],
  music: ["Música ambiental", "Фонова музика"],
  effects: ["Sonidos de acciones", "Звуки дій"],
  volume: ["Volumen", "Гучність"],
  on: ["Activado", "Увімкнено"],
  off: ["Desactivado", "Вимкнено"],
  fullscreen: ["Pantalla completa", "На весь екран"],
  exitFullscreen: ["Salir de pantalla completa", "Вийти з повного екрана"],
  resume: ["Volver al juego", "Повернутися до гри"],
  settingsHint: [
    "La música comienza al interactuar. Tus ajustes se guardan automáticamente.",
    "Музика починається після взаємодії. Налаштування зберігаються автоматично.",
  ],
  deckGuide: [
    "Ya tienes un mazo listo. Puedes jugar ahora o personalizarlo: + añade una copia y − la retira. El contador indica copias incluidas / disponibles.",
    "Колода вже готова. Грай одразу або налаштуй її: + додає копію, − прибирає. Лічильник показує копії в колоді / доступні.",
  ],
  apply: ["Aplicar", "Застосувати"],
  dropHint: [
    "Arrastra una carta a una zona iluminada, o selecciónala con un clic.",
    "Перетягни карту в підсвічену зону або обери натисканням.",
  ],
  chooseTarget: ["Elige un objetivo iluminado", "Обери підсвічену ціль"],
  previousCards: ["Cartas anteriores", "Попередні карти"],
  nextCards: ["Siguientes cartas", "Наступні карти"],
  collection: ["Colección disponible", "Доступна колекція"],
  deckReady: ["Tu baraja está preparada", "Твоя колода готова"],
  backFactions: ["Cambiar facción", "Змінити фракцію"],
  audioTest: ["Probar sonido", "Перевірити звук"],
});
Object.assign(T, {
  tides: ["Hermandad de las Mareas", "Братство Припливів"],
  sun: ["Corte del Sol", "Сонячний Двір"],
  tidesDesc: [
    "Del puerto tranquilo a la costa tormentosa. Marineros, espías y sanadores convierten cada retirada en un regreso.",
    "Від тихої гавані до штормового берега. Моряки, шпигуни й цілителі перетворюють кожен відступ на повернення.",
  ],
  sunDesc: [
    "Bajo el cielo dorado avanzan las caravanas. Exploradores veloces y formaciones leales golpean como uno solo.",
    "Під золотим небом рухаються каравани. Спритні розвідники й вірні загони б’ють як один.",
  ],
  tidesTrait: [
    "RECUPERACIÓN · ESPIONAJE · RESERVAS",
    "ВІДНОВЛЕННЯ · ШПИГУНСТВО · РЕЗЕРВИ",
  ],
  sunTrait: [
    "AGRUPACIÓN · CUERPO A CUERPO · VÍNCULO",
    "ЗБІР · БЛИЖНІЙ БІЙ · ЗВ’ЯЗОК",
  ],
  tidesLeader: ["Mira · Almirante de las Mareas", "Міра · Адміралка Припливів"],
  sunLeader: ["Sahir · Rey de la Aurora", "Сахір · Король Світанку"],
  tidesLeaderDesc: [
    "Una vez por partida: roba una carta de tu mazo, si queda alguna. Consume tu turno.",
    "Раз за гру: добери одну карту зі своєї колоди, якщо вона не порожня. Витрачає хід.",
  ],
  sunLeaderDesc: [
    "Una vez por partida: duplica tu fila cuerpo a cuerpo. No se acumula con otro cuerno. Consume tu turno.",
    "Раз за гру: подвой силу свого ряду ближнього бою. Не додається до іншого рогу. Витрачає хід.",
  ],
  previousFactions: ["Facciones anteriores", "Попередні фракції"],
  nextFactions: ["Siguientes facciones", "Наступні фракції"],
});
T.tagline = [
  "Cuatro facciones. Tres filas. Una última carta.",
  "Чотири фракції. Три ряди. Остання карта.",
];
T.chooseSub = [
  "Cuatro formas de luchar. Las mismas reglas del duelo.",
  "Чотири способи битися. Спільні правила двобою.",
];
T.intro = [
  "El bosque susurra. La montaña responde. Más allá, sube la marea y despierta el desierto. Elige tu bando.",
  "Ліс шепоче. Гора відповідає. Далі здіймається приплив і прокидається пустеля. Обери свій бік.",
];
T.rules2b = [
  "Selecciona una carta y después su fila. Confirma las especiales globales con «Aplicar» o arrástralas a la zona central iluminada. Pasar es definitivo en esa ronda: tu rival puede seguir jugando. Un líder también consume el turno.",
  "Обери карту, потім її ряд. Підтверди глобальні спеціальні карти кнопкою «Застосувати» або перетягни їх у підсвічену центральну зону. Пас діє до кінця раунду: суперник може грати далі. Лідер також витрачає хід.",
];
for (const [key, value] of Object.entries(EN)) {
  if (!T[key]) throw new Error("Unknown English key: " + key);
  T[key][2] = value;
}
for (const [key, value] of Object.entries(T))
  if (value.length !== 3) throw new Error("Incomplete translation: " + key);
Object.assign(T, {
  difficulty: ["Dificultad", "Складність", "Difficulty"],
  easy: ["Fácil", "Легко", "Easy"],
  hard: ["Difícil", "Складно", "Hard"],
  difficultyHint: [
    "Fácil: jugadas sencillas. Normal: táctica equilibrada. Difícil: combina habilidades y reserva recursos.",
    "Легко: прості ходи. Звичайно: збалансована тактика. Складно: комбінації й збереження ресурсів.",
    "Easy: simple plays. Normal: balanced tactics. Hard: ability combinations and resource management.",
  ],
  neutralUnit: [
    "Neutral · disponible para todas las facciones",
    "Нейтральна · для всіх фракцій",
    "Neutral · available to every faction",
  ],
});
T.normal = ["Normal", "Звичайно", "Normal"];
export const AB: Record<string, string[]> = {
  "": [
    "Unidad",
    "Боєць",
    "Aporta su fuerza a la fila indicada.",
    "Додає свою силу до вказаного ряду.",
  ],
  hero: [
    "Héroe",
    "Герой",
    "Inmune al clima, al cuerno y a quemadura. No puede ser objetivo de médico ni señuelo.",
    "Імунітет до погоди, рогу й спопелення. Не може бути ціллю медика або приманки.",
  ],
  bond: [
    "Vínculo",
    "Зв’язок",
    "Cada copia de esta misma unidad multiplica su fuerza por el número de copias en su fila.",
    "Сила кожної однакової карти множиться на кількість її копій у ряду.",
  ],
  muster: [
    "Agrupación",
    "Збір",
    "Convoca todas las unidades de su grupo desde tu mano y mazo a esta fila.",
    "Викликає всіх бійців своєї групи з руки та колоди до цього ряду.",
  ],
  spy: [
    "Espía",
    "Шпигун",
    "Se coloca en la fila enemiga. Roba hasta dos cartas de tu mazo.",
    "Потрапляє до ворожого ряду. Добери до двох карт зі своєї колоди.",
  ],
  medic: [
    "Médico",
    "Медик",
    "Recupera una unidad no héroe de tu descarte. Su habilidad se activa de nuevo.",
    "Поверни бійця, крім героя, зі свого відбою. Його здібність спрацьовує знову.",
  ],
  horn: [
    "Cuerno",
    "Ріг",
    "Duplica la fuerza de las unidades no héroes de una fila propia. Solo un cuerno por fila.",
    "Подвоює силу бійців, крім героїв, одного свого ряду. Лише один ріг на ряд.",
  ],
  scorch: [
    "Quemadura",
    "Спопелення",
    "Destruye simultáneamente todas las unidades no héroes con la mayor fuerza actual, de ambos bandos.",
    "Одночасно знищує всіх бійців, крім героїв, з найбільшою поточною силою на обох боках.",
  ],
  decoy: [
    "Señuelo",
    "Приманка",
    "Devuelve una unidad propia no héroe a tu mano. Deja un señuelo de fuerza 0 en su lugar.",
    "Поверни свого бійця, крім героя, в руку. Залиш приманку із силою 0 на його місці.",
  ],
  melee: [
    "Escarcha",
    "Мороз",
    "Reduce a 1 la fuerza base de las unidades no héroes cuerpo a cuerpo de ambos bandos.",
    "Зменшує до 1 базову силу бійців ближнього бою обох сторін, крім героїв.",
  ],
  ranged: [
    "Niebla",
    "Туман",
    "Reduce a 1 la fuerza base de las unidades no héroes a distancia de ambos bandos.",
    "Зменшує до 1 базову силу бійців дальнього бою обох сторін, крім героїв.",
  ],
  siege: [
    "Lluvia",
    "Злива",
    "Reduce a 1 la fuerza base de las unidades no héroes de asedio de ambos bandos.",
    "Зменшує до 1 базову силу облогових бійців обох сторін, крім героїв.",
  ],
  clear: [
    "Despejar clima",
    "Прибрати погоду",
    "Elimina todos los efectos de clima de ambos bandos.",
    "Прибирає всі погодні ефекти з обох сторін.",
  ],
};
for (const [key, value] of Object.entries(AB)) {
  const [label, description] = ABILITY_EN[key];
  AB[key] = [value[0], value[1], label, value[2], value[3], description];
}
export const symbols: Record<string, string> = {
  hero: "★",
  bond: "⌘",
  muster: "♧",
  spy: "◉",
  medic: "✚",
  horn: "⚑",
  scorch: "♨",
  decoy: "♙",
  melee: "❄",
  ranged: "≋",
  siege: "☂",
  clear: "☀",
  "": "·",
};
export const rowIcon: Record<string, string> = {
  melee: "⚔",
  ranged: "➶",
  siege: "♜",
};
