"use strict";
const log = document.getElementById("log");
const answer = document.getElementById("answer");
const quick = document.getElementById("quick");
const sendButton = document.getElementById("send");
let pending = null;
let recent = [];
function write(message = "", className = "") {
  const line = document.createElement("div");
  line.textContent = String(message); // Player names are text, never HTML.
  line.className = className;
  log.appendChild(line);
  while (log.childElementCount > 600) log.firstElementChild.remove();
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
  recent = [];
  resolve(value);
}
function suggest() {
  const last = recent[recent.length - 1] || "";
  const context = recent.slice(-3).join(" ").toLowerCase();
  let options = [];
  if (/ready to begin/i.test(last)) options = ["Ready"];
  else if (/type next/i.test(last)) options = ["next"];
  else if (/heads or tails/i.test(last)) options = ["heads", "tails"];
  else if (/rock, paper, or scissors/i.test(last)) options = ["rock", "paper", "scissors"];
  else if (/yes.*no|sell the car\?|buy a lawyer\?/i.test(last)) options = ["yes", "no"];
  else if (/\[\d+-\d+\]$/.test(last)) {
    const [,lo,hi] = last.match(/\[(\d+)-(\d+)\]$/);
    if (+hi - +lo <= 5) options = Array.from({length:+hi-+lo+1},(_,i)=>String(+lo+i));
  } else if (/mind-reading helmet/.test(context)) options = ["1", "2", "3"];
  for (const value of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = value;
    button.addEventListener("click", () => submit(value));
    quick.appendChild(button);
  }
}
const io = {read() {
  sendButton.disabled = false;
  answer.disabled = false;
  suggest();
  answer.focus({preventScroll:true});
  return new Promise(resolve => { pending = resolve; });
}};
document.getElementById("command").addEventListener("submit", event => {
  event.preventDefault(); submit(answer.value);
});
document.getElementById("restart").addEventListener("click", () => location.reload());
function updateStats(money, state) {
  document.getElementById("cash").textContent = "$" + money.toLocaleString("en-US");
  document.getElementById("turn").textContent = state.turn;
  document.getElementById("rep").textContent = state.reputation + " / 100";
}
async function main() {
  const state = createState();
  write("Welcome to Idiotic Investing 2");
  write("Type Ready to Begin!");
  while ((await io.read()).trim().toLowerCase() !== "ready") write("Type Ready to Begin!");
  write("Good lets begin");
  write("What is your name?");
  let name = "";
  while (!name) { write("Enter your name:"); name = (await io.read()).trim(); }
  write("Hi " + name + " I think you will do well!");
  write("You have 0 dollars");
  write("Good thing your friend gives you 100!!");
  let money = 100;
  write("You now have 100 dollars");
  document.getElementById("result").textContent = "game in progress";
  const events = [coinFlip, helpTim, carCrash, lotteryTicket, cryptoGamble, taxAudit,
    richUncle, casino, richGirl, shadyBusiness, bankRobbery, sharkTank, stockInsider,
    gameShow, mysteriousBox, timeMachine, alienInvestment, evilTwin, billionaireBet];
  updateStats(money, state);
  while (money > 0 && money < 999999999) {
    write("── TURN " + (state.turn + 1) + " ──", "separator");
    const choice = chooseEvent(state);
    money = choice < 19 ? await events[choice](money, io, state) : await play(choice - 19, money, io, state);
    // Avoid Java's signed-int overflow on huge wins (especially Tim's square).
    money = Math.max(0, Math.min(2147483647, Math.trunc(money)));
    money = advanceTurn(money, state);
    updateStats(money, state);
    money = await rescueFromBankruptcy(money, io, state);
    printStatus(money, state);
    updateStats(money, state);
    write("You now have " + money + " dollars");
    if (money <= 0 || money >= 999999999) break;
    write("type next to move on!");
    while ((await io.read()).trim().toLowerCase() !== "next") write("type next to move on!");
  }
  write(money > 0 ? "Good work! You beat the game" : "You lost bum", "separator");
  document.getElementById("result").textContent = money > 0 ? "you won!" : "game over";
  write("Press Restart to play again.");
  answer.disabled = true; sendButton.disabled = true;
}
main().catch(error => {
  console.error(error);
  write("Something went wrong. Press Restart to try again.");
  document.getElementById("result").textContent = "error";
});
