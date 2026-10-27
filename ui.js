"use strict";

const log = document.getElementById("log");
const answer = document.getElementById("answer");
const quick = document.getElementById("quick");
const sendButton = document.getElementById("send");

let pending = null;
let recent = [];

function write(message = "", className = "") {
  const line = document.createElement("div");
  line.textContent = className === "command" ? String(message) : String(message).replace(/\$([0-9][0-9,]*(?:\.[0-9]+)?)([KMBT]?)/g, (original, amount, suffix) => suffix ? original : formatMoney(Number(amount.replaceAll(",", ""))));
  line.className = className;
  log.appendChild(line);

  while (log.childElementCount > 600) {
    log.firstElementChild.remove();
  }

  log.scrollTop = log.scrollHeight;
  recent.push(String(message));
  recent = recent.slice(-8);
}

function submit(value) {
  if (!pending) return;

  const resolve = pending;
  pending = null;

  write("> " + value, "command");
  answer.value = "";
  quick.replaceChildren();
  sendButton.disabled = true;
  answer.disabled = true;
  recent = [];

  resolve(value);
}

function suggest() {
  const last = recent[recent.length - 1] || "";
  const context = recent.slice(-3).join(" ").toLowerCase();
  let options = [];

  if (/ready to begin/i.test(last)) {
    options = ["Ready"];
  } else if (/type next/i.test(last)) {
    options = /or repair/i.test(last) ? ["next", "repair"] : ["next"];
  } else if (/heads or tails/i.test(last)) {
    options = ["heads", "tails"];
  } else if (/rock, paper, or scissors/i.test(last)) {
    options = ["rock", "paper", "scissors"];
  } else if (/yes.*no|sell the car\?|buy a lawyer\?/i.test(last)) {
    options = ["yes", "no"];
  } else {
    const range = last.match(/\[(\d+)-(\d+)\]:?\s*$/);

    if (range) {
      const low = Number(range[1]);
      const high = Number(range[2]);

      if (high - low <= 8) {
        options = Array.from(
          { length: high - low + 1 },
          (_, index) => String(low + index)
        );
      }
    } else if (/mind-reading helmet/.test(context)) {
      options = ["1", "2", "3"];
    }
  }

  quick.replaceChildren();

  for (const value of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = value;
    button.addEventListener("click", () => submit(value));
    quick.appendChild(button);
  }
}

const io = {
  read() {
    sendButton.disabled = false;
    answer.disabled = false;
    suggest();
    answer.focus({ preventScroll: true });

    return new Promise(resolve => {
      pending = resolve;
    });
  }
};

document.getElementById("command").addEventListener("submit", event => {
  event.preventDefault();
  submit(answer.value);
});

document.getElementById("restart").addEventListener("click", () => {
  location.reload();
});

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function dollars(value) {
  return formatMoney(value);
}

function updateStats(money, state) {
  setText("era", state.era === "medieval" ? "1347 — Medieval" : "Present day");
  setText("relic", state.kingsFork ? "King’s fork" : "None");
  setText("machine", state.era === "medieval" ? state.machineParts.length + "/3 parts · " + state.medievalTurns + "/5 days" : "—");
  if (state.era === "medieval") {
    setText("cash", money.toLocaleString("en-US") + " coins");
    setText("turn", state.turn);
    setText("rep", state.reputation + " / 100 (paused)");
    setText("home", state.houseValue ? "Paused" : "None");
    setText("business", state.hasStartup ? "Paused" : "None");
    setText("peak", dollars(state.peakCash));
    return;
  }
  setText("cash", dollars(money));
  setText("turn", state.turn);
  setText("rep", state.reputation + " / 100");
  setText("home", state.houseValue ? dollars(state.houseValue) : "None");
  setText(
    "business",
    state.hasStartup ? dollars(state.startupValue) : "None"
  );
  setText("peak", dollars(state.peakCash));
}

let bankruptcyTimer;
function flashBankruptcy() {
  const alert = document.getElementById("bankruptcy-alert");
  if (!alert) return;
  clearTimeout(bankruptcyTimer);
  alert.classList.remove("active");
  void alert.offsetWidth;
  alert.classList.add("active");
  bankruptcyTimer=setTimeout(()=>alert.classList.remove("active"),1800);
}
async function main() {
  const state = createState();

  write("Welcome to Idiotic Investing 2");
  write("Type Ready to Begin!");

  while ((await io.read()).trim().toLowerCase() !== "ready") {
    write("Type Ready to Begin!");
  }

  let name = "";
  while (!name) {
    write("Enter your name:");
    name = (await io.read()).trim();
  }

  write(`Hi ${name}, I think you will do well!`);
  write("Your friend gives you $100.");

  let money = 100;
  let repairRequested = false;
  let finishedAsWinner = false;

  setText("result", "game in progress");

  const events = [
    coinFlip,
    helpTim,
    carCrash,
    lotteryTicket,
    cryptoGamble,
    taxAudit,
    richUncle,
    casino,
    richGirl,
    shadyBusiness,
    bankRobbery,
    sharkTank,
    stockInsider,
    gameShow,
    mysteriousBox,
    timeMachine,
    alienInvestment,
    evilTwin,
    billionaireBet
  ];

  updateStats(money, state);

  while (money > 0 && !state.dead) {
    write(`── TURN ${state.turn + 1} ──`, "separator");

    if (state.era === "medieval") {
      if (repairRequested) {
        money = await repairTimeMachine(money, io, state);
      } else {
        const event = chooseMedievalEvent(state);
        write(event.name.toUpperCase(), "separator");
        money = await event.fn(money, io, state);
      }
      repairRequested = false;
    } else {
    const choice = chooseEvent(state);
    if (choice < 19) {
      money = await events[choice](money, io, state);
    } else if (choice < 39) {
      money = await play(choice - 19, money, io, state);
    } else {
      money = await EXTRA_EVENTS[choice - 39].fn(money, io, state);
    }

    }
    money = cashLimit(money);

    // Death is permanent: no salary, dividends or asset rescue.
    if (state.dead) {
      money = 0;
      updateStats(money, state);
      break;
    }

    if (state.era === "modern") state.peakCash = Math.max(state.peakCash, money);
    updateStats(money, state);

    // Resolve zero cash BEFORE any turn income.
    money = await rescueFromBankruptcy(money, io, state);
    if (money <= 0) break;

    money = advanceTurn(money, state);

    if (state.dead) {
      money = 0;
      updateStats(money, state);
      break;
    }

    updateStats(money, state);

    // Turn costs and relationship fallout can also cause bankruptcy.
    money = await rescueFromBankruptcy(money, io, state);

    if (state.era === "modern") state.peakCash = Math.max(state.peakCash, money);
    printStatus(money, state);
    updateStats(money, state);

    write(state.era === "medieval" ? `Thou hast ${money} silver coins.` : `You now have ${dollars(money)}.`);

    if (money <= 0) break;

    if (state.era === "modern" && await victoryDecision(money, io, state)) {
      finishedAsWinner = true;
      break;
    }

    if (state.era === "medieval") setText("result", "stranded in 1347 — seek the machine parts");
    else if (!state.endless) setText("result", "game in progress");
    if (state.endless && state.era === "modern") {
      setText("result", "beyond the billion — keep going");
    }

    if (state.era === "modern" && money === Number.MAX_SAFE_INTEGER) {
      write("You reached the exact-number limit: $9,007,199,254,740,991.");
      finishedAsWinner = true;
      break;
    }

    const prompt = state.era === "medieval"
      ? "Type next to journey onward, or repair to visit thy machine."
      : "type next to move on!";
    write(prompt);
    while (true) {
      const command = (await io.read()).trim().toLowerCase();
      if (command === "next") break;
      if (command === "repair" && state.era === "medieval") { repairRequested = true; break; }
      write(prompt);
    }
  }

  updateStats(money, state);

  if (state.dead) {
    write(state.deathReason || "Your character died.", "separator");
  } else {
    write(
      finishedAsWinner ? "Good work! You beat the game." : state.era === "medieval" ? "Thy journey hath ended in the year 1347." : "You lost bum.",
      "separator"
    );
  }

  write(`Highest cash balance: ${dollars(state.peakCash)}.`);
  setText("result", finishedAsWinner ? "you won!" : "game over");
  write("Press Restart to play again.");

  pending = null;
  quick.replaceChildren();
  answer.disabled = true;
  sendButton.disabled = true;
}

main().catch(error => {
  console.error(error);
  write("Something went wrong. Press Restart to try again.");
  setText("result", "error");

  pending = null;
  quick.replaceChildren();
  answer.disabled = true;
  sendButton.disabled = true;
});
function renderChessPosition(fen,color,title){
  const panel=document.getElementById('chess-panel'),board=document.getElementById('chess-board');
  if(!panel||!board)return;
  panel.hidden=false;document.getElementById('chess-heading').textContent=title;
  document.getElementById('chess-side').textContent='You play '+color+'. Coordinates are printed on every square. Type your move below.';
  const squares={};fen.split(' ')[0].split('/').forEach((row,r)=>{let file=0;for(const piece of row){if(/\d/.test(piece))file+=Number(piece);else squares['abcdefgh'[file++]+(8-r)]=piece;}});
  const symbols={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟',K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙'};
  const names={k:'king',q:'queen',r:'rook',b:'bishop',n:'knight',p:'pawn'};
  board.replaceChildren();
  const files=color==='black'?'hgfedcba':'abcdefgh',ranks=color==='black'?[1,2,3,4,5,6,7,8]:[8,7,6,5,4,3,2,1];
  for(const rank of ranks)for(const file of files){
    const square=file+rank,piece=squares[square],cell=document.createElement('div');
    cell.className='chess-square '+(('abcdefgh'.indexOf(file)+rank)%2===0?'light':'dark');
    cell.setAttribute('role','gridcell');
    cell.setAttribute('aria-label',square+(piece?': '+(piece===piece.toUpperCase()?'White ':'Black ')+names[piece.toLowerCase()]:': empty'));
    const coordinate=document.createElement('span');coordinate.className='chess-coordinate';coordinate.textContent=square;cell.appendChild(coordinate);
    if(piece){const glyph=document.createElement('span');glyph.className='chess-piece '+(piece===piece.toUpperCase()?'white-piece':'black-piece');glyph.textContent=symbols[piece];glyph.setAttribute('aria-hidden','true');cell.appendChild(glyph);}
    board.appendChild(cell);
  }
}
function hideChessPosition(){const panel=document.getElementById('chess-panel');if(panel)panel.hidden=true;}
