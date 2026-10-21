"use strict";
// Loaded after game.js: a separate, self-contained medieval event pool.
const MACHINE_PARTS = ["brass gear", "copper coil", "quartz crystal"];
function medievalChoice(input, text, max) { return pick(input, text, 1, max); }
function medievalGainPart(s, part) {
  if (s.machineParts.includes(part)) { write(`Thou already possessest a ${part}. Keep thy spare for another traveller.`); return; }
  s.machineParts.push(part);
  write(`FOUND: ${part}! Thy machine hath ${s.machineParts.length}/3 required parts.`);
}
function medievalFavour(s, amount) { s.medievalFavour = Math.max(0, Math.min(100, s.medievalFavour + amount)); }
function enterMedieval(money, s) {
  s.modernCash = cashLimit(money);
  s.era = "medieval"; s.eraTransition = true;
  s.medievalTurns = 0; s.machineParts = []; s.medievalDeck = [];
  s.medievalFavour = 50; s.repairAttempts = 0; s.repairKnowledge = false;
  s.medievalDebt = 0;
  write("YEAR 1347 — THOU ART STRANDED!");
  write("Thy broken machine spits thee beside a muddy village. A startled merchant trades thy useless phone for 100 silver coins.");
  write("Thy modern cash and holdings await thy return. No modern income, costs, politics or relationship events pass whilst thou art here.");
  write("Seek a brass gear, a copper coil and a quartz crystal. Explore for at least five turns, then bring 75 coins to mend the machine.");
  write("At each turn's end, type repair to visit thy machine, or next to explore.");
  return 100;
}
async function repairTimeMachine(money, input, s) {
  write("THE BROKEN CHARIOT OF TIME");
  const missing = MACHINE_PARTS.filter(p => !s.machineParts.includes(p));
  if (missing.length) { write("Thou still lackest: " + missing.join(", ") + "."); return money; }
  if (s.medievalTurns < 5) { write("Thy engine must cool. Explore until five medieval turns have passed."); return money; }
  if (money < 75) { write("Thou needest 75 coins for fuel and tools. Seek honest labour or trade."); return money; }
  const odds = s.repairAttempts >= 2 ? 1 : s.repairKnowledge ? .9 : .7;
  write(`Repair success: ${Math.round(odds * 100)}%. Success costs 75 coins; failure costs 25. Thy parts remain safe after failure.`);
  if (!await yes(input, "Wilt thou attempt the repair?")) return money;
  s.repairAttempts++;
  if (!chance(odds)) { write("A spark! A puff! Alas, thy machine remaineth broken. Thou losest 25 coins. Try again when ready."); return take(money, 25); }
  money = take(money, 75);
  s.era = "modern"; s.eraTransition = true;
  const restored = safeAdd(s.modernCash, Math.max(0, money - s.medievalDebt));
  write("THE PORTAL OPENS! Thou hast escaped the Middle Ages!");
  write(`Your modern cash is restored. Remaining coins, less medieval debts, add $${Math.max(0, money - s.medievalDebt)}. Your original assets and career resume.`);
  s.modernCash = 0; s.medievalDebt = 0;
  return restored;
}
const MEDIEVAL_EVENTS = [
  {name:"Accused of witchcraft", fn:async(m,i,s)=>{
    write("'A WITCH!' crieth a villager. Thy glowing watch hath caused great alarm.");
    const c=await medievalChoice(i,"1 Explain thy craft | 2 Offer 30 coins | 3 Flee into the mud",3);
    if(c===2&&m>=30){write("The reeve accepteth thy 'fine'.");return take(m,30);}
    if(c===1&&chance(.35+s.medievalFavour/200)){medievalFavour(s,8);write("They deem thee a harmless fool. Thou art free.");return m;}
    medievalFavour(s,-12);write("Thou escapeth the stocks, but the mob taketh half thy purse.");return Math.floor(m/2);
  }},
  {name:"The blacksmith's bargain",fn:async(m,i,s)=>{
    write("A smith hath fashioned a brass gear of uncommon precision.");
    const c=await medievalChoice(i,"1 Buy it for 40 coins | 2 Work the bellows | 3 Depart",3);
    if(c===3)return m;
    if(c===1){if(m<40){write("Thy purse is too light.");return m;}medievalGainPart(s,"brass gear");return take(m,40);}
    write("A full day's toil earneth thee the gear and 15 coins.");medievalGainPart(s,"brass gear");return safeAdd(m,15);
  }},
  {name:"The alchemist's coil",fn:async(m,i,s)=>{
    write("An alchemist offereth a copper coil. His last apprentice is now green.");
    const c=await medievalChoice(i,"1 Pay 45 coins | 2 Help with his experiment | 3 Refuse",3);
    if(c===3)return m;
    if(c===1){if(m<45){write("Thou hast insufficient coin.");return m;}medievalGainPart(s,"copper coil");return take(m,45);}
    if(chance(.65)){write("The potion fizzeth harmlessly. The coil is thine!");medievalGainPart(s,"copper coil");return m;}
    write("Thy eyebrows vanish. Ointment costeth 15 coins.");return take(m,15);
  }},
  {name:"Crystal in the quarry",fn:async(m,i,s)=>{
    write("A quarryman showeth thee a vein of clear quartz.");
    const c=await medievalChoice(i,"1 Pay 35 coins for a crystal | 2 Dig carefully | 3 Leave",3);
    if(c===3)return m;
    if(c===1){if(m<35){write("Thou canst not afford it.");return m;}medievalGainPart(s,"quartz crystal");return take(m,35);}
    if(chance(.7)){medievalGainPart(s,"quartz crystal");write("Thou findest a crystal beneath the stone.");return m;}
    write("Thy shovel breaketh. Repairs cost 10 coins.");return take(m,10);
  }},
  {name:"The lord's tithe",fn:async(m,i,s)=>{
    write("The lord demandeth a tithe, for his third banquet will not pay for itself.");
    const c=await medievalChoice(i,"1 Pay one fifth | 2 Hide thy purse",2);
    if(c===2&&chance(.45)){write("The collector overlooketh thee.");return m;}
    const loss=Math.floor(m*(c===1?.2:.4));write(`The collector taketh ${loss} coins.`);return take(m,loss);
  }},
  {name:"The harvest",fn:async(m,i,s)=>{
    write("The harvest awaiteth, and the village needeth strong hands.");
    const c=await medievalChoice(i,"1 Labour for 35 coins | 2 Gamble on a share of the crop | 3 Rest",3);
    if(c===1){medievalFavour(s,5);write("Thy honest work earneth 35 coins.");return safeAdd(m,35);}
    if(c===2){const pay=chance(.5)?90:5;write(`Thy share bringeth ${pay} coins.`);return safeAdd(m,pay);}return m;
  }},
  {name:"The highwaymen",fn:async(m,i,s)=>{
    write("Three rogues block thy road. One holdeth a turnip as though it were a dagger.");
    const c=await medievalChoice(i,"1 Surrender 25 coins | 2 Bluff | 3 Run",3);
    if(c===1)return take(m,25);
    if(chance(c===2?.45:.6)){write("Thou escapeth with thy purse intact.");return m;}
    write("The rogues seize half thy silver.");return Math.floor(m/2);
  }},
  {name:"A knight's wager",fn:async(m,i,s)=>{
    write("A knight wagereth 20 coins that thou canst not strike a wooden target.");
    if(!await yes(i,"Wilt thou wager 20 coins?"))return m;
    if(m<20){write("Thou lackest the stake.");return m;}
    if(chance(.5)){write("A fine shot! Thou winnest 60 coins in profit.");return safeAdd(m,60);}
    write("Thou strikest the herald's lunch instead.");return take(m,20);
  }},
  {name:"The tavern dice",fn:async(m,i,s)=>{
    write("A tavern keeper inviteth thee to dice. His smile hath too many teeth.");
    const bet=await pick(i,"Thy wager; 0 to decline",0,Math.min(50,m));if(!bet)return m;
    if(chance(.45)){write("Fortune smileth upon thee!");return safeAdd(m,bet*2);}
    write("The dice favour the keeper, as ever.");return take(m,bet);
  }},
  {name:"The monastery scribe",fn:async(m,i,s)=>{
    write("A monk requireth copies of a manuscript. Thy handwriting can scarce be worse than his.");
    const c=await medievalChoice(i,"1 Copy for 25 coins | 2 Study diagrams of ancient machinery | 3 Leave",3);
    if(c===1){write("Thou earnest 25 coins.");return safeAdd(m,25);}
    if(c===2){s.repairKnowledge=true;write("Thou learnest the art of calibration. Repair success riseth to 90%!");}return m;
  }},
  {name:"The wandering peddler",fn:async(m,i,s)=>{
    write("A peddler's cart overfloweth with strange metal and glittering stones.");
    MACHINE_PARTS.forEach((p,n)=>write(`${n+1} - ${p}: 55 coins`));
    const c=await pick(i,"Choose thy purchase; 0 to depart",0,3);if(!c)return m;
    if(s.machineParts.includes(MACHINE_PARTS[c-1])){write("Thou already hast that part. Keep thy coins.");return m;}
    if(m<55){write("Thy purse cannot meet his price.");return m;}
    medievalGainPart(s,MACHINE_PARTS[c-1]);return take(m,55);
  }},
  {name:"The village healer",fn:async(m,i,s)=>{
    write("A healer asketh thee to fetch herbs from the marsh.");
    if(!await yes(i,"Wilt thou fetch the herbs?"))return m;
    if(chance(.7)){medievalFavour(s,10);write("Thou earnest 40 coins and the village's gratitude.");return safeAdd(m,40);}
    write("Thou returnest covered in leeches. Treatment costeth 10 coins.");return take(m,10);
  }},
  {name:"The royal goose",fn:async(m,i,s)=>{
    write("The king's goose stealeth thy hat. A royal decree forbiddeth insulting it.");
    const c=await medievalChoice(i,"1 Bow politely | 2 Chase the goose | 3 Offer bread for 5 coins",3);
    if(c===1){write("The court delighteth in thy manners. A reward of 20 coins!");return safeAdd(m,20);}
    if(c===3)return take(m,5);
    medievalFavour(s,-5);write("The goose honketh treason. Thou art fined 25 coins.");return take(m,25);
  }},
  {name:"The bridge keeper",fn:async(m,i,s)=>{
    write("A keeper demandeth 12 coins, or the answer to a riddle: what hath teeth but cannot bite?");
    const c=await medievalChoice(i,"1 A comb | 2 A wolf | 3 Pay the toll",3);
    if(c===1){write("'Well answered!' He granteth passage and 10 coins.");return safeAdd(m,10);}
    write("The keeper collecteth his toll.");return take(m,12);
  }},
  {name:"The castle kitchen",fn:async(m,i,s)=>{
    write("The royal cook hath mistaken salt for sugar. Thou art offered employment immediately.");
    const c=await medievalChoice(i,"1 Wash pots for 30 coins | 2 Invent a new pie | 3 Leave",3);
    if(c===1)return safeAdd(m,30);
    if(c===2){if(chance(.5)){write("The lord adoreth thy pie! Reward: 80 coins.");return safeAdd(m,80);}write("Thy pie is declared a siege weapon. Fine: 15 coins.");return take(m,15);}return m;
  }},
  {name:"The ruined watchtower",fn:async(m,i,s)=>{
    write("An abandoned watchtower containeth broken instruments and much suspicious creaking.");
    if(!await yes(i,"Wilt thou search the ruins?"))return m;
    if(chance(.65)){const missing=MACHINE_PARTS.filter(p=>!s.machineParts.includes(p));if(missing.length)medievalGainPart(s,missing[Math.floor(Math.random()*missing.length)]);else{write("Thou findest a purse of 35 coins.");return safeAdd(m,35);}return m;}
    write("Rotten stairs give way. Thy bruises cost 20 coins to tend.");return take(m,20);
  }},
  {name:"The counterfeit relic",fn:async(m,i,s)=>{
    write("A merchant selleth 'the very spoon of a legendary king' for 15 coins.");
    if(!await yes(i,"Wilt thou buy the relic?"))return m;
    if(m<15){write("Thou lackest the coin.");return m;}
    if(chance(.25)){write("A collector payeth 75 coins for thy spoon!");return safeAdd(take(m,15),75);}
    write("The spoon beareth yesterday's maker's mark. Thou hast been swindled.");return take(m,15);
  }},
  {name:"The wool fair",fn:async(m,i,s)=>{
    write("The wool fair is crowded. A flock of sheep hath formed an orderly queue.");
    const c=await medievalChoice(i,"1 Carry bales for 20 coins | 2 Trade wool for 30 coins | 3 Leave",3);
    if(c===1)return safeAdd(m,20);
    if(c===2){if(m<30){write("Thou canst not afford the wool.");return m;}const sale=chance(.6)?75:10;write(`Thy wool selleth for ${sale} coins.`);return safeAdd(take(m,30),sale);}return m;
  }},
  {name:"The town crier",fn:async(m,i,s)=>{
    write("The town crier hath lost his voice. Thou must announce the duke's new tax upon hats.");
    const c=await medievalChoice(i,"1 Read the proclamation | 2 Mock the duke | 3 Decline",3);
    if(c===1){write("Thou earnest 25 coins, though nobody liketh the news.");return safeAdd(m,25);}
    if(c===2){if(chance(.4)){write("The crowd passeth a hat. Thou collectest 60 coins!");return safeAdd(m,60);}medievalFavour(s,-10);write("The duke's guards fine thee 35 coins.");return take(m,35);}return m;
  }},
  {name:"The clockmaker's workshop",fn:async(m,i,s)=>{
    write("A clockmaker recognizeth thy broken engine as 'a most impertinent clock'.");
    const c=await medievalChoice(i,"1 Help him for a missing part | 2 Study his repair plans | 3 Attempt thy machine's repair",3);
    if(c===3)return repairTimeMachine(m,i,s);
    if(c===2){s.repairKnowledge=true;write("His plans raise thy repair chance to 90%.");return m;}
    const missing=MACHINE_PARTS.filter(p=>!s.machineParts.includes(p));
    if(missing.length)medievalGainPart(s,missing[0]);else write("All thy parts are ready. He payeth thee for thy labour instead.");
    return safeAdd(m,20);
  }}
];
function chooseMedievalEvent(s) {
  if(!s.medievalDeck.length){s.medievalDeck=MEDIEVAL_EVENTS.map((_,i)=>i);for(let j=s.medievalDeck.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[s.medievalDeck[j],s.medievalDeck[k]]=[s.medievalDeck[k],s.medievalDeck[j]];}}
  return MEDIEVAL_EVENTS[s.medievalDeck.pop()];
}
(() => {
  const originalState=createState, modernTurn=advanceTurn, modernRescue=rescueFromBankruptcy, modernStatus=printStatus;
  createState=function(){return {...originalState(),era:"modern",eraTransition:false,modernCash:0,medievalTurns:0,machineParts:[],medievalDeck:[],medievalFavour:50,repairAttempts:0,repairKnowledge:false,medievalDebt:0};};
  timeMachine=async function(money,input,s){
    write("A scientist offers to send you back to 2010 to buy Bitcoin.");
    if(!await yes(input,"Travel back?"))return money;
    if(!await yes(input,"The trip costs half your money. Proceed?"))return money;
    if(chance(.5)){write("SUCCESS! You return rich from early Bitcoin investments!");return cashLimit(money*10);}
    write("ERROR! You arrive in 1347. The machine is breaking down!");
    if(await yes(input,"Try an emergency repair?")){
      if(chance(.5)){write("You repair it just in time and return with half your cash.");return Math.floor(money/2);}
      write("The emergency repair fails.");
    }
    return enterMedieval(Math.floor(money/2),s);
  };
  advanceTurn=function(money,s){
    if(s.eraTransition){s.eraTransition=false;s.turn++;return money;}
    if(s.era!=="medieval")return modernTurn(money,s);
    s.turn++;s.medievalTurns++;
    if(s.medievalDebt>0&&money>10){const payment=Math.min(10,s.medievalDebt,money-1);s.medievalDebt-=payment;money-=payment;write(`Thou repayest ${payment} coins to the abbey.`);}
    return cashLimit(money);
  };
  rescueFromBankruptcy=async function(money,input,s){
    if(s.era!=="medieval")return modernRescue(money,input,s);
    if(s.dead)return 0;if(money>0)return money;
    write("Thy purse is empty. Thy modern holdings lie beyond thy reach.");
    if(!await yes(input,"Accept the abbey's work and a 40-coin advance, owing 50 coins?")){write("Thy journey endeth here.");return 0;}
    s.medievalDebt=safeAdd(s.medievalDebt,50);write("The abbey sheltereth thee. Small repayments shall follow on future turns.");return 40;
  };
  printStatus=function(money,s){
    if(s.era!=="medieval")return modernStatus(money,s);
    write(`THY PURSE: ${money} silver coins | Days in the past: ${s.medievalTurns} | Village favour: ${s.medievalFavour}/100`);
    write(`Machine parts: ${s.machineParts.join(", ")||"none"} (${s.machineParts.length}/3)`);
    write(`Still needed: ${MACHINE_PARTS.filter(p=>!s.machineParts.includes(p)).join(", ")||"all parts gathered"}. Repair: 75 coins; at least 5 medieval turns.`);
    if(s.medievalDebt)write(`Debt to the abbey: ${s.medievalDebt} coins.`);
  };
})();
