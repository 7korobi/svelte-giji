export type StyleType = 'text' | 'head' | 'mono'

export type MoodType = 'teller'

export type WinType = 'WIN_NONE' | 'WIN_HUMAN'

export type OptionType =
  | 'aiming-talk'
  | 'entrust'
  | 'random-target'
  | 'select-role'
  | 'seq-event'
  | 'undead-talk'

export type LiveType = 'live' | 'victim' | 'executed' | 'suddendead'

export type RoleTableType =
  | 'custom'
  | 'default'
  | 'hamster'
  | 'lover'
  | 'mistery'
  | 'random'
  | 'test1st'
  | 'test2nd'
  | 'ultimate'
  | 'wbbs_c'
  | 'wbbs_f'
  | 'wbbs_g'

export enum RoleType {
  Alchemist = 'alchemist',
  Aprilfool = 'aprilfool',
  Aura = 'aura',
  Aurawolf = 'aurawolf',
  Bat = 'bat',
  Bitch = 'bitch',
  Childwolf = 'childwolf',
  Clamor = 'clamor',
  Cointoss = 'cointoss',
  Cpossess = 'cpossess',
  Curse = 'curse',
  Cursewolf = 'cursewolf',
  Cwolf = 'cwolf',
  Decide = 'decide',
  Dipsy = 'dipsy',
  Dish = 'dish',
  Doctor = 'doctor',
  Dying = 'dying',
  Dyingpixi = 'dyingpixi',
  Dyingwolf = 'dyingwolf',
  Eclipse = 'eclipse',
  Elder = 'elder',
  Fairy = 'fairy',
  Fan = 'fan',
  Fanatic = 'fanatic',
  Fink = 'fink',
  Fire = 'fire',
  Fm = 'fm',
  Follow = 'follow',
  Force = 'force',
  Ghost = 'ghost',
  Girl = 'girl',
  Glass = 'glass',
  Guard = 'guard',
  Guru = 'guru',
  Hamster = 'hamster',
  Hatedevil = 'hatedevil',
  Headless = 'headless',
  Hunter = 'hunter',
  Intwolf = 'intwolf',
  Invalid = 'invalid',
  Jammer = 'jammer',
  Lonewolf = 'lonewolf',
  Loveangel = 'loveangel',
  Lover = 'lover',
  Medium = 'medium',
  Mediumrole = 'mediumrole',
  Mediumwin = 'mediumwin',
  Memo = 'memo',
  Mimicry = 'mimicry',
  Miracle = 'miracle',
  Mob = 'mob',
  Muppeting = 'muppeting',
  Necromancer = 'necromancer',
  Nightmare = 'nightmare',
  Nothing = 'nothing',
  Ogre = 'ogre',
  Oracle = 'oracle',
  Passion = 'passion',
  Possess = 'possess',
  Prince = 'prince',
  Prophecy = 'prophecy',
  Rightwolf = 'rightwolf',
  Robber = 'robber',
  Scapegoat = 'scapegoat',
  Seance = 'seance',
  Seer = 'seer',
  Seeronce = 'seeronce',
  Seerrole = 'seerrole',
  Seerwin = 'seerwin',
  Semiwolf = 'semiwolf',
  Shield = 'shield',
  Silentwolf = 'silentwolf',
  Snatch = 'snatch',
  Sorcerer = 'sorcerer',
  Stigma = 'stigma',
  Sympathy = 'sympathy',
  Tangle = 'tangle',
  Trickster = 'trickster',
  Turnfairy = 'turnfairy',
  Turnfink = 'turnfink',
  Villager = 'villager',
  Walpurgis = 'walpurgis',
  Werebat = 'werebat',
  Weredog = 'weredog',
  Whitewolf = 'whitewolf',
  Wisper = 'wisper',
  Witch = 'witch',
  Wolf = 'wolf'
}

export enum EventType {}

export type MesType =
  | 'CAST'
  | 'ADMIN'
  | 'MAKER'
  | 'INFOSP'
  | 'INFONOM'
  | 'AIM'
  | 'TSAY'
  | 'WSAY'
  | 'GSAY'
  | 'SAY'
  | 'DELETED'

export enum LogType {
  CAST = 'c',
  ADMIN = 'a',
  MAKER = 'm',
  INFOSP = 'i',
  INFONOM = 'I',
  AIM = 'T',
  TSAY = 'T',
  WSAY = 'W',
  SSAY = 'S',
  DELETED = 'D'
}

export type SubType = 'A' | 'I' | 'M' | 'S'

export enum SayType {
  Euro = 'euro',
  Infinity = 'infinity',
  Juna = 'juna',
  Lobby = 'lobby',
  Saving = 'saving',
  Say1 = 'say1',
  Say5 = 'say5',
  Say5X200 = 'say5x200',
  Say5X300 = 'say5x300',
  Sow = 'sow',
  Tiny = 'tiny',
  Vulcan = 'vulcan',
  Wbbs = 'wbbs',
  Weak = 'weak'
}

export enum VoteType {
  Anonymity = 'anonymity',
  Sign = 'sign'
}

export enum MobType {
  Alive = 'alive',
  Gamemaster = 'gamemaster',
  Grave = 'grave',
  Juror = 'juror',
  Visiter = 'visiter'
}

export enum GameType {
  LiveTabula = 'LIVE_TABULA',
  Millerhollow = 'MILLERHOLLOW',
  Mistery = 'MISTERY',
  Secret = 'SECRET',
  Tabula = 'TABULA',
  Trouble = 'TROUBLE'
}
