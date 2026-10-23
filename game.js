// Idiotic Investing 2 — browser conversion of Game.java and GameEvents.java.
// All game state stays in memory. No libraries, server, or saved data.
"use strict";
function parseInteger(value) {
  if (!/^[+-]?\d+$/.test(value)) throw new Error("Not a whole number");
  const n = Number(value);
  if (!Number.isInteger(n) || !Number.isSafeInteger(n)) throw new Error("Out of range");
  return n;
}
function createState() { return {
  reputation: 50,
  pokerSkill: 0,
  stockPrice: 100,
  shares: 0,
  cars: 0,
  houseValue: 0,
  houseName: "", houseCost: 0, houseShield: false,
  efficiency: 1, products: 0,
  campaigning: false, campaignFunds: 0, campaignSpend: 0, support: 0,
  campaignTurns: 0, office: 0, targetOffice: 0, officeTurns: 0, heat: 0,
  won: false, endless: false, peakCash: 100,
  hasStartup: false,
  startupName: "",
  startupValue: 2000,
  ownership: 100,
  employees: 0,
  productQuality: 0,
  patent: false,
  insured: false,
  evidence: false,
  lawsuitRisk: 0,
  debt: 0,
  investorTrust: 0,
  publicity: 0,
  angelStakes: 0,
  angelPrice: 100,
  turn: 0
}; }
    async function askYesNo(scanner) {
        while (true) {
            let answer = (await scanner.read()).trim().toLowerCase();

            if ((answer === "yes")) {
                return true;
            }
            if ((answer === "no")) {
                return false;
            }

            write("Please type yes or no:");
        }
    }


    async function coinFlip(money){
        write("Coin Flip!");
        write("heads or tails?");
        const dis = io;
        let flip = (await dis.read());

        if ((flip === "heads") || (flip === "tails")) {
            if (Math.random() * 2 < 1) {
                write("Lose!");
                return Math.trunc(money / 2);
            } else {
                write("Win!");
                return money * 2;
            }
        } else {
            write("Not a choice, you lose");
            return 0;
        }
    }

    async function helpTim(money){
        write("Do you want to help Tim?");
        write("It will only cost you half of your money!");
        write("Type yes or no");

        const dis = io;
        if (((await dis.read()) === "yes")){
            if (Math.random()*20 < 2){

                write("Tim invests your money into the fartcoin and makes BANK!");
                write("He pays you back very nicely!");

                return money *money;
            } else {
                write("Tim invests in a safe ETF and loses it all");
                return Math.trunc(money / 2);
            }

        }
        write("Tim does not like you.");
        write("this could come back to haunt you.....");
        return money;
    }

    function carCrash(money){
        write("You got into a car crash!!");
        write("Car is going to cost you "+Math.trunc(money / 4));
        return money - Math.trunc(money / 4);
    }

    function lotteryTicket(money) {
        write("You find a suspicious lottery ticket!");
        write("It costs $20 to scratch.");

        if (money < 20) {
            write("You're too broke to afford it.");
            return money;
        }

        money -= 20;

        if (Math.random() < 0.1) {
            write("JACKPOT! You won LOTS!");
            return money * 10;
        } else {
            write("You won absolutely nothing.");
            return money;
        }
    }

    function cryptoGamble(money) {
        write("You invest in a cryptocurrency called FartCoin!");

        let outcome = Math.trunc(Math.random() * 4);

        if (outcome == 0) {
            write("FartCoin goes to the moon! 5x your money!");
            return money * 5;
        } else if (outcome == 1) {
            write("The developer rug-pulls everyone!");
            return 0;
        } else {
            write("FartCoin crashes 50%!");
            return Math.trunc(money / 2);
        }
    }

    function taxAudit(money) {
        write("The IRS has discovered your suspicious income!");

        let tax = Math.trunc(money / 3);
        write("You owe $" + tax + " in back taxes.");

        return money - tax;
    }

    function richUncle(money) {
        write("Your long-lost billionaire uncle remembers you exist!");

        if (Math.random() < 0.2) {
            write("He leaves you his entire fortune! +$50,000!");
            return money + 50000;
        } else {
            write("He leaves you $5 and a coupon for expired yogurt.");
            return money + 5;
        }
    }

    function casino(money) {
        write("You walk into a casino and put everything on red!");

        let spin = Math.trunc(Math.random() * 37);

        if (spin >= 1 && spin <= 18) {
            write("RED! You double your money!");
            return money * 2;
        } else {
            write("BLACK OR ZERO! You lose everything!");
            return 0;
        }
    }
    async function richGirl(money, scan, s){
        write("You start dating a girl who is rich AF");
        write("She has helly red flags");
        write("Stay? yes or no");
        let dis = (await askYesNo(scan));
        if (dis){
            write("She gets you a car!");
            write("Sell the car?");
            if((await askYesNo(scan))){
                write("You get money but she does not like you");
                return money +10000;
            } else {
                write("She likes a loyal dude");
                s.cars++;
                write("You keep the car. You can sell it for $10,000 if you run out of cash.");
                return money;
            }
        } else {
            write("Her father sues you!");
            write("Buy a lawyer?");
            if((await askYesNo(scan))){
                write("you still loose");
                return money - Math.trunc(money / 5);
            } else {
                write("you loose");
                return money - Math.trunc(money / 10);
            }
        }

    }

    async function shadyBusiness(money, scan) {
        write("A man in a trench coat offers you a business opportunity.");
        write("He promises to TRIPLE your money.");
        write("Invest? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You walk away. The man calls you a coward.");
            return money;
        }

        write("He wants HALF your money upfront.");
        write("Demand a contract? (yes/no)");

        let contract = (await askYesNo(scan));
        let outcome = Math.trunc(Math.random() * 4);

        if (outcome == 0) {
            write("The business actually succeeds! Your money triples!");
            return money * 3;
        } else if (contract && outcome == 1) {
            write("It was a scam, but your contract saves you!");
            return money;
        } else {
            write("He disappears into an alley. Goodbye savings.");
            return Math.trunc(money / 2);
        }
    }


    async function bankRobbery(money, scan) {
        write("You accidentally walk into a bank robbery!");
        write("The robber offers you $50,000 to help him escape.");
        write("Help him? (yes/no)");

        if ((await askYesNo(scan))) {
            write("The police are approaching!");
            write("Abandon the robber? (yes/no)");

            if ((await askYesNo(scan))) {
                if (Math.random() < 0.7) {
                    write("You escape unnoticed!");
                    return money;
                } else {
                    write("The robber identifies you!");
                    return Math.trunc(money / 2);
                }
            } else {
                if (Math.random() < 0.25) {
                    write("You escape together! +$50,000!");
                    return money + 50000;
                } else {
                    write("YOU GOT CAUGHT! Legal fees destroy your savings.");
                    return Math.trunc(money / 4);
                }
            }
        } else {
            write("Do you try to stop the robber? (yes/no)");

            if ((await askYesNo(scan))) {
                if (Math.random() < 0.5) {
                    write("You're a HERO! The bank gives you $10,000!");
                    return money + 10000;
                } else {
                    write("You get injured. Medical bills cost 20%!");
                    return money - Math.trunc(money / 5);
                }
            }

            write("You leave the bank safely.");
            return money;
        }
    }


    async function sharkTank(money, scan) {
        write("You're invited onto SHARK TANK!");
        write("Your invention is a toaster that mines Bitcoin.");
        write("Pitch your invention? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You get stage fright and leave.");
            return money;
        }

        write("Mark Cuban offers $100,000 for your entire company.");
        write("Accept? (yes/no)");

        if ((await askYesNo(scan))) {
            write("DEAL! You get $100,000!");
            return money + 100000;
        }

        write("You reject the offer!");
        write("Kevin O'Leary offers to invest if you risk half your savings.");
        write("Accept Kevin's deal? (yes/no)");

        if ((await askYesNo(scan))) {
            if (Math.random() < 0.4) {
                write("Your company goes VIRAL! Money multiplied by 8!");
                return money * 8;
            } else {
                write("Your toaster catches fire. The business fails.");
                return Math.trunc(money / 2);
            }
        }

        write("You leave without a deal.");
        return money;
    }


    async function stockInsider(money, scan) {
        write("Your friend claims he knows a stock will skyrocket.");
        write("He refuses to explain where the information came from.");
        write("Invest your money? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You ignore him.");
            return money;
        }

        write("Invest EVERYTHING instead of just 25%? (yes/no)");
        let allIn = (await askYesNo(scan));

        if (Math.random() < 0.35) {
            write("THE STOCK EXPLODES UPWARD!");
            if (allIn) {
                return money * 5;
            }
            return money + money;
        } else {
            write("The company announces terrible earnings!");
            if (allIn) {
                write("YOUR PORTFOLIO IS DESTROYED!");
                return Math.trunc(money / 10);
            }
            write("Luckily you only invested a little.");
            return money - Math.trunc(money / 5);
        }
    }


    async function gameShow(money, scan) {
        write("WELCOME TO WHO WANTS TO BE A MILLIONAIRE!");
        write("Answer correctly to win $10,000!");
        write("What is 12 * 13?");

        let answer = (await scan.read()).trim();

        if (!(answer === "156")) {
            write("WRONG! You lose $100 for embarrassing yourself.");
            return money - Math.min(100, money);
        }

        write("CORRECT! You won $10,000!");
        write("Take the money or risk it for $100,000?");
        write("Risk it? (yes/no)");

        if (!(await askYesNo(scan))) {
            return money + 10000;
        }

        write("FINAL QUESTION:");
        write("How many sides does a dodecagon have?");

        let finalAnswer = (await scan.read()).trim();

        if ((finalAnswer === "12")) {
            write("YOU WIN $100,000!");
            return money + 100000;
        }

        write("WRONG! You lose your game-show winnings.");
        return money;
    }


    async function mysteriousBox(money, scan) {
        write("A mysterious box appears on your doorstep.");
        write("A note says: PAY $500 TO OPEN.");
        write("Open it? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You throw it away.");
            return money;
        }

        if (money < 500) {
            write("You can't afford the mystery box.");
            return money;
        }

        money -= 500;

        write("Inside is ANOTHER BOX!");
        write("Open the second box? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You sell the unopened box to a collector for $750.");
            return money + 750;
        }

        let outcome = Math.trunc(Math.random() * 5);

        if (outcome == 0) {
            write("DIAMONDS! YOU GET $100,000!");
            return money + 100000;
        } else if (outcome == 1) {
            write("A rare gold coin! +$5,000!");
            return money + 5000;
        } else if (outcome == 2) {
            write("A live raccoon steals $200!");
            return money - Math.min(money, 200);
        } else {
            write("It's empty. You paid $500 for cardboard.");
            return money;
        }
    }


    async function timeMachine(money, scan) {
        write("A scientist offers to send you back to 2010.");
        write("You could buy Bitcoin for almost nothing.");
        write("Travel back? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You decide time travel is too dangerous.");
            return money;
        }

        write("The machine costs HALF your money to operate.");
        write("Proceed? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You change your mind.");
            return money;
        }

        if (Math.random() < 0.5) {
            write("SUCCESS! You buy Bitcoin and return RICH!");
            return money * 10;
        } else {
            write("ERROR! You accidentally travel to the year 1347.");
            write("Try to repair the machine? (yes/no)");

            if ((await askYesNo(scan)) && Math.random() < 0.5) {
                write("You escape back to the present!");
                return Math.trunc(money / 2);
            }

            write("You get stuck in the past. Your investments are worthless.");
            return 0;
        }
    }


    async function alienInvestment(money, scan) {
        write("ALIENS LAND IN YOUR BACKYARD!");
        write("They offer to trade advanced technology for your savings.");
        write("Accept? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("The aliens leave disappointed.");
            return money;
        }

        write("Choose your alien technology:");
        write("1 - Infinite energy machine");
        write("2 - Gold-producing machine");
        write("3 - Mind-reading helmet");

        let choice = (await scan.read()).trim();

        switch (choice) {
            case "1":
                if (Math.random() < 0.6) {
                    write("You revolutionize energy! 6x MONEY!");
                    return money * 6;
                }
                write("The government confiscates your machine!");
                return Math.trunc(money / 2);

            case "2":
                if (Math.random() < 0.3) {
                    write("INFINITE GOLD! 12x MONEY!");
                    return money * 12;
                }
                write("The machine produces chocolate coins.");
                return Math.trunc(money / 4);

            case "3":
                if (Math.random() < 0.8) {
                    write("You predict the stock market! 3x MONEY!");
                    return money * 3;
                }
                write("You accidentally read your own thoughts.");
                return Math.trunc(money / 2);

            default:
                write("The aliens don't understand your answer and leave.");
                return money;
        }
    }


    async function evilTwin(money, scan) {
        write("YOUR EVIL TWIN STEALS YOUR IDENTITY!");
        write("He has access to all your bank accounts.");
        write("Confront him? (yes/no)");

        if ((await askYesNo(scan))) {
            write("He challenges you to rock-paper-scissors!");
            write("Type rock, paper, or scissors:");

            let player = (await scan.read()).trim().toLowerCase();
            const options = ["rock", "paper", "scissors"];
            let twin = options[Math.trunc(Math.random() * 3)];

            write("Your twin chose " + twin);

            if (!(player === "rock") && !(player === "paper")
                    && !(player === "scissors")) {
                write("Invalid move! Your twin laughs.");
                return Math.trunc(money / 2);
            }

            if ((player === twin)) {
                write("TIE! Your twin gives your money back.");
                return money;
            }

            if (((player === "rock") && (twin === "scissors"))
                    || ((player === "paper") && (twin === "rock"))
                    || ((player === "scissors") && (twin === "paper"))) {
                write("YOU WIN! You steal HIS savings!");
                return money * 2;
            }

            write("YOUR TWIN WINS! He steals half your savings.");
            return Math.trunc(money / 2);
        }

        write("You report him to the police.");
        if (Math.random() < 0.7) {
            write("They catch him! You recover your money.");
            return money;
        }

        write("He escapes with 75% of your money!");
        return Math.trunc(money / 4);
    }


    async function billionaireBet(money, scan) {
        write("A billionaire challenges you to a guessing game!");
        write("He secretly chooses a number from 1 to 5.");
        write("If you guess correctly, your money QUADRUPLES.");
        write("If wrong, you lose HALF.");
        write("Play? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You refuse the challenge.");
            return money;
        }

        let secret = Math.trunc(Math.random() * 5) + 1;

        write("Guess a number between 1 and 5:");

        let guess;
        try {
            guess = parseInteger((await scan.read()).trim());
        } catch (e) {
            write("That's not a number!");
            return money;
        }

        if (guess < 1 || guess > 5) {
            write("Invalid guess. The bet is canceled.");
            return money;
        }

        if (guess == secret) {
            write("CORRECT! Your money quadruples!");
            return money * 4;
        }

        write("WRONG! The number was " + secret);
        write("The billionaire offers ONE LAST CHANCE.");
        write("Double or nothing? (yes/no)");

        if (!(await askYesNo(scan))) {
            write("You lose half your money.");
            return Math.trunc(money / 2);
        }

        write("HEADS OR TAILS?");
        let call = (await scan.read()).trim().toLowerCase();

        if (!(call === "heads") && !(call === "tails")) {
            write("Invalid choice. You lose your bet.");
            return Math.trunc(money / 2);
        }

        let result = Math.random() < 0.5 ? "heads" : "tails";
        write("The coin landed on " + result);

        if ((call === result)) {
            write("INCREDIBLE! You win back your money and double it!");
            return money * 2;
        }

        write("YOU LOSE EVERYTHING!");
        return 0;
    }





    
    function advanceTurn(money, s) {
        s.turn++;
        let change = Math.trunc(Math.random() * 41) - 20;
        s.stockPrice = Math.max(5, Math.min(5000, s.stockPrice + change));
        s.angelPrice = Math.max(5, Math.min(5000, s.angelPrice + Math.trunc(Math.random() * 41) - 20));
        if (s.hasStartup) money = companyIncome(money, s);
        if (s.debt > 0 && s.turn % 3 == 0) {
            let interest = Math.max(1, Math.trunc(s.debt / 20));
            s.debt = safeAdd(s.debt, interest);
            write("Bank interest accrued: +$" + interest + " debt.");
        }
        return extendedTurn(money, s);
    }

    function printStatus(money, s) {
        write("\n===== PORTFOLIO / REPUTATION =====");
        write("Cash: $" + money + " | Reputation: " + s.reputation + "/100 | Debt: $" + s.debt);
        write("FART: " + s.shares + " shares @ $" + s.stockPrice + " | Angel shares: " + s.angelStakes + " @ $" + s.angelPrice);
        if (s.hasStartup) write(s.startupName + ": " + s.ownership + "% ownership | value $" + s.startupValue
                + " | employees " + s.employees + " | quality " + s.productQuality + " | patent " + s.patent);
        else write("Startup: none");
        extendedStatus(s);
        write("Cars: " + s.cars + " ($10,000 each) | House value: $" + s.houseValue);
        write("Insurance: " + s.insured + " | Evidence: " + s.evidence + " | Lawsuit risk: " + s.lawsuitRisk);
        write("==================================\n");
    }

    
    async function play(eventId, money, input, s) {
        switch (eventId) {
            case 0: return (await poker(money, input, s));
            case 1: return (await tradeStocks(money, input, s));
            case 2: return (await marketCrash(money, input, s));
            case 3: return (await startCompany(money, input, s));
            case 4: return (await ventureCapital(money, input, s));
            case 5: return (await hireEmployees(money, input, s));
            case 6: return (await launchProduct(money, input, s));
            case 7: return (await patentOffice(money, input, s));
            case 8: return (await competitor(money, input, s));
            case 9: return (await ipo(money, input, s));
            case 10: return (await angelInvest(money, input, s));
            case 11: return (await acquisitionOffer(money, input, s));
            case 12: return (await journalist(money, input, s));
            case 13: return (await lawsuit(money, input, s));
            case 14: return (await insurance(money, input, s));
            case 15: return (await disaster(money, input, s));
            case 16: return (await bankLoan(money, input, s));
            case 17: return (await debtCollector(money, input, s));
            case 18: return (await influencer(money, input, s));
            case 19: return (await hacker(money, input, s));
            default: throw new Error("Expected eventId 0..19");
        }
    }

    
    async function yes(input, message) {
        while (true) {
            write(message + " (yes/no): ");
            let a = (await input.read()).trim().toLowerCase();
            if ((a === "yes") || (a === "y")) return true;
            if ((a === "no") || (a === "n")) return false;
            write("Please enter yes or no.");
        }
    }
    async function pick(input, prompt, low, high) {
        while (true) {
            write(prompt + " [" + low + "-" + high + "]: ");
            try {
                let v = parseInteger((await input.read()).trim());
                if (v >= low && v <= high) return v;
            } catch (ignored) { }
            write("Please enter a whole number in range.");
        }
    }
    async function wager(input, money) {
        if (money <= 0) return 0;
        return (await pick(input, "How much cash? (max $" + money + ")", 0, money));
    }
    function safeAdd(a, b) { return Math.trunc(Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, a + b))); }
    function take(a, b) { return Math.trunc(Math.max(0, a - Math.max(0, b))); }
    function reputation(s, delta) { s.reputation = Math.max(0, Math.min(100, s.reputation + delta)); }
    function chance(probability) { return Math.random() < probability; }
    function ownershipPayout(s) { return Math.trunc(s.startupValue * s.ownership / 100); }

    
    async function poker(money, input, s) {
        write("\nPOKER NIGHT: You get pocket queens. Your opponent shoves.");
        let bet = (await wager(input, money));
        if (bet == 0) return money;
        write("1 Fold (lose 10% of bet) | 2 Call | 3 Raise (higher risk, double payout)");
        let action = (await pick(input, "Choose", 1, 3));
        if (action == 1) { write("You fold. You save most of your stack."); return take(money, Math.max(1, Math.trunc(bet / 10))); }
        let win = action == 2 ? .48 + s.pokerSkill * .03 : .32 + s.pokerSkill * .03;
        if (chance(win)) {
            s.pokerSkill = Math.min(5, s.pokerSkill + 1);
            write("You win the hand! Poker skill improves.");
            return safeAdd(money, action == 3 ? bet * 2 : bet);
        }
        write("Villain shows aces. You lose your bet.");
        return take(money, bet);
    }

    
    async function tradeStocks(money, input, s) {
        write("\nFART STOCK EXCHANGE: price $" + s.stockPrice + ", you own " + s.shares + " shares.");
        let action = (await pick(input, "1 Buy | 2 Sell | 3 Hold", 1, 3));
        if (action == 3) return money;
        if (action == 1) {
            let amount = (await pick(input, "Buy how many shares?", 0, Math.trunc(money / s.stockPrice)));
            s.shares += amount;
            write("Bought " + amount + " shares.");
            return take(money, amount * s.stockPrice);
        }
        let amount = (await pick(input, "Sell how many shares?", 0, s.shares));
        s.shares -= amount;
        write("Sold " + amount + " shares.");
        return safeAdd(money, amount * s.stockPrice);
    }

    
    async function marketCrash(money, input, s) {
        write("\nBREAKING: the FART stock CEO might be a raccoon in a suit.");
        write("Your shares: " + s.shares + ". Current price: $" + s.stockPrice);
        if ((await yes(input, "Sell all shares at the CURRENT price before the press conference?"))) {
            money = safeAdd(money, s.shares * s.stockPrice);
            s.shares = 0;
        }
        let trueStory = chance(.65);
        if (trueStory) {
            s.stockPrice = Math.max(5, Math.trunc(s.stockPrice / 2));
            write("It's real! Price halves to $" + s.stockPrice);
        } else {
            s.stockPrice = Math.min(5000, s.stockPrice * 2);
            write("It's fake! Price doubles to $" + s.stockPrice);
        }
        return money;
    }

    
    async function startCompany(money, input, s) {
        if (s.hasStartup) { write("\nYou already run " + s.startupName + ". Focus on that first."); return money; }
        write("\nYou meet a coder with an idea for AI-powered socks.");
        if (!(await yes(input, "Start a company for $500?"))) return money;
        if (money < 500) { write("Not enough cash."); return money; }
        write("Name your startup: ");
        let name = (await input.read()).trim();
        s.startupName = (name.length === 0) ? "SockGPT" : name;
        s.hasStartup = true; s.startupValue = 15000; s.efficiency = 1; s.products = 0; s.ownership = 100;
        s.employees = 0; s.productQuality = 1; s.patent = false;
        write(s.startupName + " is incorporated! You own 100%.");
        return take(money, 500);
    }

    
    async function ventureCapital(money, input, s) {
        if (!s.hasStartup) { write("\nVC says: 'Bring me a company first.'"); return money; }
        write("\nA VC wants to invest in " + s.startupName + ".");
        write("Your reputation " + s.reputation + ", employees " + s.employees + ", patent " + s.patent);
        let offer = Math.floor(s.startupValue * .2) + s.reputation * 100 + s.employees * 500 + (s.patent ? 15000 : 0);
        let equity = s.reputation >= 70 ? 15 : 30;
        write("Offer: $" + offer + " for " + equity + "% of YOUR current stake.");
        if (!(await yes(input, "Accept?"))) { s.investorTrust--; return money; }
        s.ownership = Math.max(1, Math.trunc(s.ownership * (100 - equity) / 100));
        s.startupValue = safeAdd(s.startupValue, offer);
        s.investorTrust += 2;
        write("Deal! Your personal ownership is now " + s.ownership + "%.");
        return safeAdd(money, offer); 
    }

    
    async function hireEmployees(money, input, s) {
        if (!s.hasStartup) { write("\nNo company, no employees."); return money; }
        write("\nYour startup has " + s.employees + " employees. Each costs $30 per turn.");
        let choice = (await pick(input, "1 Hire (+2 employees, $300) | 2 Fire one | 3 Keep team", 1, 3));
        if (choice == 1) {
            if (money < 300) { write("Insufficient cash."); return money; }
            s.employees += 2; s.productQuality++; reputation(s, 3);
            return take(money, 300);
        }
        if (choice == 2 && s.employees > 0) { s.employees--; reputation(s, -8); write("Remaining staff are furious."); }
        return money;
    }

    
    async function launchProduct(money, input, s) {
        if (!s.hasStartup) { write("\nYou need a startup to launch a product."); return money; }
        write("\n" + s.startupName + " prepares its big launch.");
        let choice = (await pick(input, "1 Ship now ($100) | 2 Test carefully ($500) | 3 Delay", 1, 3));
        if (choice == 3) { s.productQuality++; return money; }
        let cost = choice == 1 ? 100 : 500;
        if (money < cost) { write("Not enough cash."); return money; }
        money = take(money, cost);
        let success = .25 + s.productQuality * .10 + s.employees * .03 + (choice == 2 ? .20 : 0);
        if (chance(Math.min(.95, success))) {
            s.products++;
            let revenue = Math.floor((5000 + s.employees * 1500 + s.publicity * 2000) * s.productQuality * s.efficiency);
            write("SELLS OUT! Revenue: $" + revenue);
            s.startupValue = safeAdd(s.startupValue, revenue * 3);
            reputation(s, 12);
            return safeAdd(money, revenue);
        }
        write("Product fails. Angry customers threaten to sue.");
        s.lawsuitRisk += 2; reputation(s, -12); s.startupValue = Math.max(100, Math.trunc(s.startupValue / 2));
        return money;
    }

    
    async function patentOffice(money, input, s) {
        if (!s.hasStartup) { write("\nNo invention to patent."); return money; }
        if (s.patent) { write("\nYour company already owns its patent."); return money; }
        write("\nYour rival might copy your AI socks.");
        if (!(await yes(input, "Spend $600 filing a patent?"))) return money;
        if (money < 600) { write("Not enough cash."); return money; }
        money = take(money, 600);
        if (chance(.75 + s.productQuality * .04)) {
            s.patent = true; s.startupValue = safeAdd(s.startupValue, 3000);
            write("Patent granted! Company valuation +$3000.");
        } else write("Application rejected. Work on your invention.");
        return money;
    }

    
    async function competitor(money, input, s) {
        if (!s.hasStartup) { write("\nYou have no startup for your rival to copy."); return money; }
        write("\nA rival releases a suspicious clone of " + s.startupName + "!");
        let choice = (await pick(input, "1 Sue for copying ($300) | 2 Undercut prices ($200) | 3 Ignore", 1, 3));
        if (choice == 1) {
            if (money < 300) return money;
            money = take(money, 300);
            if (s.patent || s.evidence) {
                write("You win! The court awards $5000."); reputation(s, 10);
                return safeAdd(money, 5000);
            }
            write("No patent or evidence. You lose in court."); reputation(s, -10);
            return money;
        }
        if (choice == 2 && money >= 200) {
            money = take(money, 200);
            if (chance(.5 + s.productQuality * .06)) { write("Customers choose you! +$2000."); return safeAdd(money, 2000); }
        }
        write("The rival takes market share."); s.startupValue = Math.max(100, Math.trunc(s.startupValue * 3 / 4));
        return money;
    }

    
    async function ipo(money, input, s) {
        if (!s.hasStartup) { write("\nCan't IPO without a company."); return money; }
        write("\nNASDAQ invites " + s.startupName + " to go public!");
        if (s.reputation < 40 || s.employees == 0) { write("Rejected: need >=40 reputation and at least one employee."); return money; }
        let value = ownershipPayout(s);
        write("Your stake's paper valuation: $" + value);
        if (!(await yes(input, "Sell half of your personal stake at this valuation?"))) { reputation(s, 5); return money; }
        if (s.ownership <= 0) { write("You have no shares left to sell."); return money; }
        let soldPercentage = Math.max(1, Math.trunc(s.ownership / 2));
        let proceeds = Math.trunc(s.startupValue * soldPercentage / 100);
        s.ownership -= soldPercentage;
        write("Sold " + soldPercentage + "% of company; still own " + s.ownership + "%.");
        return safeAdd(money, proceeds);
    }

    
    async function angelInvest(money, input, s) {
        write("\nAn entrepreneur pitches their app: Uber for rocks.");
        write("Angel share: $" + s.angelPrice + " | you own " + s.angelStakes);
        let choice = (await pick(input, "1 Buy | 2 Sell | 3 Pass", 1, 3));
        if (choice == 1) {
            let qty = (await pick(input, "How many shares?", 0, Math.trunc(money / s.angelPrice)));
            s.angelStakes += qty; return take(money, qty * s.angelPrice);
        }
        if (choice == 2) {
            let qty = (await pick(input, "Sell how many?", 0, s.angelStakes));
            s.angelStakes -= qty; return safeAdd(money, qty * s.angelPrice);
        }
        return money;
    }

    
    async function acquisitionOffer(money, input, s) {
        if (!s.hasStartup) { write("\nNobody can acquire a company you haven't founded."); return money; }
        let offer = Math.max(100, ownershipPayout(s));
        write("\nMegaCorp offers $" + offer + " to buy your entire stake in " + s.startupName + ".");
        if (!(await yes(input, "Accept?"))) { s.investorTrust++; write("You hold out for more."); return money; }
        money = safeAdd(money, offer);
        s.hasStartup = false; s.startupName = ""; s.startupValue = 2000; s.ownership = 100;
        s.employees = 0; s.productQuality = 0; s.patent = false; s.publicity = 0; s.products = 0; s.efficiency = 1;
        reputation(s, 8);
        write("EXIT COMPLETE! You can found another startup later.");
        return money;
    }

    
    async function journalist(money, input, s) {
        write("\nA reporter investigates your financial empire.");
        let choice = (await pick(input, "1 Give interview | 2 Pay $200 for PR help | 3 Refuse", 1, 3));
        if (choice == 3) { reputation(s, -3); return money; }
        if (choice == 2) {
            if (money < 200) return money;
            money = take(money, 200);
        }
        let goodPress = (choice == 2 ? .75 : .45) + s.pokerSkill * .02;
        if (chance(goodPress)) {
            write("Viral positive article! Reputation grows.");
            reputation(s, 15); s.publicity = Math.min(5, s.publicity + 2); s.investorTrust++;
            s.angelPrice = Math.min(5000, s.angelPrice + 60);
        } else {
            write("You accidentally describe FartCoin as a currency backed by vibes.");
            reputation(s, -15); s.lawsuitRisk++; s.angelPrice = Math.max(5, s.angelPrice - 40);
        }
        return money;
    }

    
    async function lawsuit(money, input, s) {
        write("\nYou've been served legal papers.");
        let exposure = 500 + s.lawsuitRisk * 500;
        write("Damages demanded: $" + exposure + ". Evidence available: " + s.evidence);
        let choice = (await pick(input, "1 Settle for half | 2 Fight in court | 3 Ignore", 1, 3));
        s.lawsuitRisk = Math.max(0, s.lawsuitRisk - 1);
        if (choice == 1) { reputation(s, -2); return take(money, Math.trunc(exposure / 2)); }
        if (choice == 3) { reputation(s, -20); return take(money, exposure * 2); }
        let win = s.evidence ? .9 : (s.patent ? .6 : .3);
        if (chance(win)) { write("You win your case!"); reputation(s, 8); return money; }
        write("You lose in court."); reputation(s, -10); return take(money, exposure);
    }

    
    async function insurance(money, input, s) {
        write("\nAn insurer offers one-use business disaster coverage for $400.");
        if (s.insured) { write("You already have active coverage."); return money; }
        if (!(await yes(input, "Buy?"))) return money;
        if (money < 400) { write("Not enough cash."); return money; }
        s.insured = true;
        return take(money, 400);
    }

    
    async function disaster(money, input, s) {
        write("\nA meteor strikes your investment headquarters!");
        let loss = Math.max(100, Math.trunc(money / 2));
        if (s.insured) {
            write("INSURANCE PAYS! Your coverage is now used up."); s.insured = false; reputation(s, 2);
            return money;
        }
        if ((await yes(input, "Spend $200 hiring emergency crews to limit damage?"))) {
            if (money >= 200) { money = take(money, 200); loss = Math.trunc(loss / 2); }
            else write("You can't afford emergency crews.");
        }
        write("Uninsured loss: $" + loss);
        if (s.hasStartup) s.startupValue = Math.max(100, Math.trunc(s.startupValue * 3 / 4));
        return take(money, loss);
    }

    
    async function bankLoan(money, input, s) {
        write("\nThe bank considers your loan application. Outstanding debt: $" + s.debt);
        if (s.reputation < 25) { write("Denied: reputation too low."); return money; }
        let choice = (await pick(input, "Borrow $1000 (1), $5000 (2), or cancel (3)?", 1, 3));
        if (choice == 3) return money;
        let amount = choice == 1 ? 1000 : 5000;
        s.debt = safeAdd(s.debt, amount);
        write("Loan granted. Interest adds 5% to outstanding debt every third turn.");
        return safeAdd(money, amount);
    }

    
    async function debtCollector(money, input, s) {
        if (s.debt == 0) { write("\nDebt collector knocks, realizes you owe nothing, and apologizes."); return money; }
        write("\nDEBT COLLECTOR! You owe $" + s.debt + ".");
        let choice = (await pick(input, "1 Pay as much as you can | 2 Negotiate | 3 Hide", 1, 3));
        if (choice == 1) {
            let payment = (await pick(input, "Payment", 0, Math.min(s.debt, money)));
            s.debt -= payment; money = take(money, payment); reputation(s, 4);
        } else if (choice == 2) {
            if (chance(.2 + s.reputation / 200.0)) {
                write("Bank forgives 25% of your debt!"); s.debt -= Math.trunc(s.debt / 4);
            } else { write("Negotiations fail. $100 fee added."); s.debt = safeAdd(s.debt, 100); }
        } else { write("Collector finds you anyway. Reputation drops."); reputation(s, -15); s.debt = safeAdd(s.debt, 200); }
        return money;
    }

    
    async function influencer(money, input, s) {
        write("\nA streamer offers to promote your business or investment advice.");
        let choice = (await pick(input, "1 Pay $300 sponsorship | 2 Challenge streamer to poker | 3 Ignore", 1, 3));
        if (choice == 3) return money;
        if (choice == 2) {
            if (chance(.30 + s.pokerSkill * .10)) { write("You win a public poker challenge! +$1000."); reputation(s, 12); return safeAdd(money, 1000); }
            write("You lose embarrassingly. Reputation -10."); reputation(s, -10); return take(money, 200);
        }
        if (money < 300) { write("Not enough money."); return money; }
        money = take(money, 300);
        if (chance(.6)) { s.publicity = Math.min(5, s.publicity + 2); reputation(s, 10); write("Your brand trends! Future product launches earn more."); }
        else { reputation(s, -15); write("The influencer exposes your cringe DMs."); }
        return money;
    }

    
    async function hacker(money, input, s) {
        write("\nA hacker gets into your trading account!");
        let choice = (await pick(input, "1 Pay $250 security consultant | 2 Negotiate | 3 Ignore", 1, 3));
        if (choice == 1) {
            if (money < 250) { write("Cannot afford consultant."); return money; }
            money = take(money, 250);
            if (chance(.8)) { s.evidence = true; write("Hacker blocked; forensic evidence saved for court!"); return money; }
            write("Too late. Hacker steals 25% of cash."); return take(money, Math.trunc(money / 4));
        }
        if (choice == 2 && chance(.4)) {
            write("Hacker reveals corporate espionage proof! You save the messages."); s.evidence = true; return money;
        }
        if (s.insured) { write("Insurance covers the cyberattack (policy consumed)."); s.insured = false; return money; }
        write("Hacker drains half your cash and dumps your messages online.");
        reputation(s, -10); s.lawsuitRisk++;
        return take(money, Math.trunc(money / 2));
    }

// Events that need an existing company, using GameEvents.play's event IDs.
// Interviews and investment-advice sponsorships remain available to everyone.
const COMPANY_EVENT_IDS = new Set([4, 5, 6, 7, 8, 9, 11, 14, 15]);
function eventPool(s) {
    const pool = [];
    for (let choice = 0; choice < 39; choice++) {
        const eventId = choice - 19;
        if (!s.hasStartup && COMPANY_EVENT_IDS.has(eventId)) continue;
        if (s.hasStartup && eventId === 3) continue;
        // Four tickets for founding; one ticket for every other eligible event.
        const weight = eventId === 3 ? 4 : 1;
        for (let ticket = 0; ticket < weight; ticket++) pool.push(choice);
    }
    EXTRA_EVENTS.forEach((event, i) => {
        if (event.eligible(s)) for (let j = 0; j < (event.weight || 1); j++) pool.push(39 + i);
    });
    return pool;
}
function chooseEvent(s) {
    const pool = eventPool(s);
    return pool[Math.floor(Math.random() * pool.length)];
}
function sellableAssets(s) {
    const assets = [];
    if (s.shares > 0 && s.stockPrice > 0) assets.push({kind: "stock", label: "FART shares (" + s.shares + " at $" + s.stockPrice + " each)"});
    if (s.angelStakes > 0 && s.angelPrice > 0) assets.push({kind: "angel", label: "Angel shares (" + s.angelStakes + " at $" + s.angelPrice + " each)"});
    if (s.cars > 0) assets.push({kind: "car", label: "One car ($10,000; you own " + s.cars + ")"});
    if (s.houseValue > 0) assets.push({kind: "house", label: "House ($" + s.houseValue + ")"});
    return assets;
}
async function rescueFromBankruptcy(money, input, s) {
    if (money > 0) return money;
    money = 0;
    while (money === 0) {
        const assets = sellableAssets(s);
        if (!assets.length) {
            write("You're out of cash and have no stocks, cars, or house to sell.");
            return 0;
        }
        write("OUT OF CASH — you can sell an asset to stay in the game!");
        assets.forEach((asset, i) => write((i + 1) + " - Sell " + asset.label));
        write("0 - Give up");
        const choice = await pick(input, "Choose an asset to sell", 0, assets.length);
        if (choice === 0) {
            if (await yes(input, "Give up and end this game?")) return 0;
            continue;
        }
        const asset = assets[choice - 1];
        if (asset.kind === "stock" || asset.kind === "angel") {
            const holdings = asset.kind === "stock" ? "shares" : "angelStakes";
            const price = asset.kind === "stock" ? s.stockPrice : s.angelPrice;
            const qty = await pick(input, "How many shares? (0 to choose another asset)", 0, s[holdings]);
            if (qty === 0) continue;
            s[holdings] -= qty;
            money = safeAdd(money, qty * price);
            write("Sold " + qty + " shares for $" + money + ".");
        } else if (asset.kind === "car") {
            s.cars--;
            money = safeAdd(money, 10000);
            write("Sold one car for $10,000.");
        } else if (asset.kind === "house") {
            money = safeAdd(money, s.houseValue);
            clearHouse(s);
            write("Sold your house for $" + money + ".");
        }
        write("You have cash again — you're still in the game!");
    }
    return money;
}

// Expansion: houses, fictional politics, company management and strange luck.
const HOUSE_CATALOG = [
    {name:"Suspicious shed", price:2500}, {name:"Tiny house on wheels", price:10000},
    {name:"Haunted starter cottage", price:35000}, {name:"Suburban family home", price:100000},
    {name:"Downtown penthouse", price:350000}, {name:"Mansion with a moat", price:1000000}
];
const OFFICES = [null, {name:"Town council", fee:500, salary:500, difficulty:.05},
    {name:"Mayor", fee:5000, salary:5000, difficulty:.15},
    {name:"Governor", fee:50000, salary:50000, difficulty:.25}];
function cashLimit(n) { return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(n))); }
function clearHouse(s) { s.houseValue = 0; s.houseCost = 0; s.houseName = ""; s.houseShield = false; }
function companyIncome(money, s) {
    const demand = Math.max(.1, s.reputation / 100);
    const revenue = Math.floor((80 + s.products * 400) * Math.max(1, s.employees) *
        s.productQuality * s.efficiency * demand * (1 + s.publicity * .15));
    const costs = s.employees * 30 + 50;
    const profit = revenue - costs;
    // Owner receives their share of profit; losses remain the player's responsibility.
    const dividend = Math.floor(Math.max(0, profit) * s.ownership / 100);
    money = profit >= 0 ? safeAdd(money, dividend) : take(money, -profit);
    s.startupValue = safeAdd(s.startupValue, Math.max(0, profit) * 4);
    write("Company: revenue $" + revenue + ", costs $" + costs + ", your payout $" + dividend +
        (profit < 0 ? "; you cover a $" + (-profit) + " loss." : "."));
    return money;
}
function extendedStatus(s) {
    if (s.houseValue) write("Home: " + s.houseName + " | market value $" + s.houseValue + " | disaster protection " + s.houseShield);
    if (s.hasStartup) write("Products: " + s.products + " | efficiency " + s.efficiency.toFixed(2));
    if (s.campaigning) write("Campaign: " + OFFICES[s.targetOffice].name + " | " + s.campaignTurns + " turns until election | funds $" + s.campaignFunds + " | spent $" + s.campaignSpend + " | support " + s.support);
    if (s.office) write("Office: " + OFFICES[s.office].name + " | term remaining " + s.officeTurns);
    if (s.heat) write("Corruption heat: " + s.heat + "/100 (investigations can happen after leaving office)");
}
function electionOdds(s) {
    const target = OFFICES[s.targetOffice];
    const funding = Math.min(.30, s.campaignSpend / (target.fee * 20) * .30);
    return Math.max(.05, Math.min(.95, .25 + s.reputation / 200 + s.support / 200 + funding - target.difficulty));
}
function extendedTurn(money, s) {
    if (s.houseValue > 0) {
        s.houseValue = Math.max(100, cashLimit(s.houseValue * (.95 + Math.random() * .10)));
        const upkeep = Math.max(1, Math.floor(s.houseCost * .001));
        money = take(money, upkeep);
        write("Home market value: $" + s.houseValue + ". Upkeep: $" + upkeep + ".");
    }
    if (s.office) {
        money = safeAdd(money, OFFICES[s.office].salary);
        write("Office salary: +$" + OFFICES[s.office].salary);
        if (--s.officeTurns <= 0) { write("Your term is over. The office chair misses you already."); s.office = 0; }
    }
    if (s.campaigning && --s.campaignTurns <= 0) {
        const odds = electionOdds(s);
        write("ELECTION NIGHT! Your win chance was " + Math.round(odds * 100) + "%.");
        if (chance(odds)) { s.office = s.targetOffice; s.officeTurns = 12; reputation(s, 10); write("YOU WIN! You are now " + OFFICES[s.office].name + " for 12 turns."); }
        else { reputation(s, -5); write("You lost. Your opponent's slogan was just a picture of a dog."); }
        s.campaigning = false; s.campaignFunds = 0; s.campaignSpend = 0; s.support = 0; s.targetOffice = 0;
        write("Campaign accounts are closed. Unspent donations do not become personal cash.");
    }
    if (s.heat > 0 && chance(s.heat / 250)) {
        const fine = Math.max(500, Math.floor(money * .35));
        money = take(money, fine); reputation(s, -25);
        s.office = 0; s.officeTurns = 0; s.campaigning = false;
        s.campaignFunds = 0; s.campaignSpend = 0; s.campaignTurns = 0; s.targetOffice = 0; s.support = 0;
        s.heat = Math.max(0, s.heat - 50);
        write("CORRUPTION INVESTIGATION! Fine: $" + fine + ". You lose any office or candidacy. Reputation -25.");
    } else s.heat = Math.max(0, s.heat - 1);
    return cashLimit(money);
}
function addHeat(s, amount) { s.heat = Math.min(100, s.heat + amount); }
async function buyHouse(money, input, s) {
    write("OPEN HOUSE DAY. The realtor insists all the ghosts are load-bearing.");
    HOUSE_CATALOG.forEach((h,i)=>write((i+1)+" - "+h.name+": $"+h.price+" (upkeep $"+Math.max(1,Math.floor(h.price*.001))+"/turn)"));
    const choice = await pick(input,"Choose a home; 0 to pass",0,HOUSE_CATALOG.length);
    if (!choice) return money;
    const h = HOUSE_CATALOG[choice-1];
    if (money < h.price) { write("You cannot afford that home. No purchase made."); return money; }
    s.houseName=h.name; s.houseValue=h.price; s.houseCost=h.price; s.houseShield=false;
    write("You bought "+h.name+"! Its value changes each turn. You can sell during a sale event or at zero cash.");
    return take(money,h.price);
}
async function sellHouse(money,input,s) {
    write("A buyer offers $"+s.houseValue+" for your "+s.houseName+". They ask whether the ghosts pay rent.");
    if (!await yes(input,"Sell your home?")) return money;
    money=safeAdd(money,s.houseValue);clearHouse(s);write("House sold. No more upkeep.");return money;
}
async function renovateHouse(money,input,s) {
    const scale=Math.max(250,Math.floor(s.houseValue*.10));
    const choices=[{name:"Paint and landscaping",cost:scale,boost:1.15},
        {name:"Kitchen remodel",cost:scale*3,boost:1.3},
        {name:"Extra room",cost:scale*6,boost:1.4}];
    write("RENOVATION TIME. A contractor promises to arrive sometime this century.");
    choices.forEach((x,i)=>write((i+1)+" - "+x.name+": $"+x.cost+"; value rises by $"+Math.floor(x.cost*x.boost)));
    const choice=await pick(input,"Choose; 0 to pass",0,3);if(!choice)return money;
    const x=choices[choice-1];if(money<x.cost){write("Not enough cash.");return money;}
    s.houseValue=safeAdd(s.houseValue,Math.floor(x.cost*x.boost));write("Renovation complete. New home value: $"+s.houseValue);
    return take(money,x.cost);
}
async function leakyPipes(money,input,s) {
    const repair=Math.max(100,Math.floor(s.houseValue*.03));
    write("Your pipes now identify as an indoor waterfall. Repair cost: $"+repair+".");
    if(await yes(input,"Pay for a plumber?")) {
        if(money>=repair){write("Fixed! The plumber also rescued a rubber duck.");return take(money,repair);}
        write("You cannot afford the repair.");
    }
    s.houseValue=Math.max(100,Math.floor(s.houseValue*.85));write("Water damage reduces your home's value by 15%.");return money;
}
async function homeDisaster(money,input,s) {
    const disasters=["A tornado relocates your roof to another postcode.","A flood turns your living room into an aquarium.","An earthquake rearranges your floor plan."];
    write(disasters[Math.floor(Math.random()*disasters.length)]);
    if(s.houseShield){s.houseShield=false;write("Your disaster coverage pays for repairs! Policy used up.");return money;}
    const repair=Math.max(250,Math.floor(s.houseValue*.12));
    if(await yes(input,"Spend $"+repair+" on emergency repairs to protect the home's value?")){
        if(money>=repair)return take(money,repair);write("You cannot afford it.");
    }
    s.houseValue=Math.max(100,Math.floor(s.houseValue*.60));write("Unrepaired damage cuts home value by 40%.");return money;
}
async function homeInsurance(money,input,s){
    const cost=Math.max(100,Math.floor(s.houseValue*.02));
    write("One-disaster home coverage: $"+cost+". Covers natural disasters, not leaky pipes.");
    if(await yes(input,"Buy coverage?")){if(money<cost){write("Not enough cash.");return money;}s.houseShield=true;return take(money,cost);}return money;
}
async function neighborhood(money,input,s){
    if(chance(.5)){s.houseValue=cashLimit(s.houseValue*1.25);write("A fancy coffee shop opens nearby. Your house is worth 25% more because of oat milk.");}
    else{s.houseValue=Math.max(100,Math.floor(s.houseValue*.8));write("A competitive bagpipe academy moves next door. Home value falls 20%.");}return money;
}
async function runForOffice(money,input,s){
    write("The ballot is open. All parties agree that your campaign poster is weird.");
    OFFICES.slice(1).forEach((o,i)=>write((i+1)+" - "+o.name+": filing $"+o.fee+", salary $"+o.salary+"/turn if elected"));
    const choice=await pick(input,"Choose office; 0 to pass",0,3);if(!choice)return money;
    if(money<OFFICES[choice].fee){write("You cannot afford the filing fee.");return money;}
    s.targetOffice=choice;s.campaigning=true;s.campaignTurns=7;s.support=0;s.campaignFunds=0;s.campaignSpend=0;
    write("You filed! Six more event turns after this one until election night. Raise donations, spend on campaigning, or win support in debates.");
    return take(money,OFFICES[choice].fee);
}
async function campaignFundraiser(money,input,s){
    write("CAMPAIGN FUNDRAISER: the finger sandwiches have their own lobbyist.");
    const choice=await pick(input,"1 Grassroots donations | 2 Shady mega-donor (corruption risk) | 3 Pass",1,3);
    if(choice===3)return money;
    const raised=choice===1?Math.floor(OFFICES[s.targetOffice].fee*(1+s.reputation/50)):OFFICES[s.targetOffice].fee*10;
    s.campaignFunds=safeAdd(s.campaignFunds,raised);if(choice===2)addHeat(s,20);else s.support=Math.min(100,s.support+5);
    write("Raised $"+raised+" in campaign-only funds. Spend them in the campaign event.");return money;
}
async function campaignSpending(money,input,s){
    write("CAMPAIGN HQ. Donations available: $"+s.campaignFunds+". Personal cash: $"+money);
    const choice=await pick(input,"1 Spend campaign donations | 2 Spend personal cash | 3 Pass",1,3);if(choice===3)return money;
    const available=choice===1?s.campaignFunds:money;
    const amount=await pick(input,"How much to spend on campaigning?",0,available);
    if(choice===1)s.campaignFunds-=amount;else money=take(money,amount);
    s.campaignSpend=safeAdd(s.campaignSpend,amount);
    write("Advertising purchased. Current estimated win chance: "+Math.round(electionOdds(s)*100)+"% (maximum 95%).");return money;
}
async function debateNight(money,input,s){
    write("DEBATE NIGHT: your opponent promises free Wi-Fi for pigeons.");
    const choice=await pick(input,"1 Thoughtful speech | 2 Insult the pigeons | 3 Dance",1,3);
    if(choice===1||chance(.4)){s.support=Math.min(100,s.support+15);write("The crowd loves you! Support +15.");}
    else{s.support=Math.max(0,s.support-10);reputation(s,-5);write("Your clip goes viral for the wrong reasons. Support -10.");}return money;
}
async function bribePolitician(money,input,s){
    const cost=Math.max(250,Math.floor(money*.05));
    write("A fictional politician offers a suspicious 'business grant' worth $"+(cost*4)+" for $"+cost+". 60% chance of payment; corruption heat +25 either way.");
    if(!await yes(input,"Offer the bribe?"))return money;if(money<cost){write("Not enough cash.");return money;}
    money=take(money,cost);addHeat(s,25);
    if(chance(.6)){write("Grant approved. Auditors may have questions later.");return safeAdd(money,cost*4);}
    write("The politician keeps your money and blocks your number.");return money;
}
async function acceptBribe(money,input,s){
    const offer=OFFICES[s.office].salary*20;
    write("A developer offers you $"+offer+" to overlook a suspicious project. Accepting adds 35 corruption heat.");
    if(await yes(input,"Accept the bribe?")){addHeat(s,35);reputation(s,-5);return safeAdd(money,offer);}
    reputation(s,8);write("You refuse. Voters are pleasantly confused by your integrity.");return money;
}
async function passPolicy(money,input,s){
    write("POLICY DAY. Your staff asks if 'make me richer' counts as a manifesto.");
    write("1 Public parks: reputation +10. 2 Self-serving property rezoning: home value +30%, heat +25.");
    write("3 Award yourself a consulting contract: +$"+(OFFICES[s.office].salary*12)+", heat +35. 4 Pass.");
    const choice=await pick(input,"Choose policy",1,4);
    if(choice===1)reputation(s,10);
    if(choice===2){if(!s.houseValue){write("You own no property to benefit. No policy passed.");return money;}s.houseValue=cashLimit(s.houseValue*1.3);addHeat(s,25);}
    if(choice===3){addHeat(s,35);return safeAdd(money,OFFICES[s.office].salary*12);}return money;
}
async function reinvestCompany(money,input,s){
    const cost=Math.max(500,Math.floor(s.startupValue*.03));
    write("Invest $"+cost+" in your company. Better quality and efficiency increase recurring profits.");
    const choice=await pick(input,"1 R&D: quality +2 | 2 Automation: efficiency +0.5 | 3 Pass",1,3);if(choice===3)return money;
    if(money<cost){write("Not enough cash.");return money;}
    if(choice===1)s.productQuality+=2;else s.efficiency+=.5;
    s.startupValue=safeAdd(s.startupValue,cost*2);return take(money,cost);
}
async function companyContract(money,input,s){
    const cost=Math.max(500,Math.floor(s.startupValue*.02));
    const odds=Math.min(.95,.25+s.productQuality*.06+s.employees*.025);
    write("A hotel wants 10,000 pairs of AI socks. Fulfilment costs $"+cost+"; your payout $"+Math.floor(cost*6*s.ownership/100)+"; success chance "+Math.round(odds*100)+"%.");
    if(!await yes(input,"Take the contract?"))return money;if(money<cost){write("Not enough cash.");return money;}money=take(money,cost);
    if(chance(odds)){s.startupValue=safeAdd(s.startupValue,cost*10);reputation(s,8);write("DELIVERED! The socks provide excellent room service.");return safeAdd(money,Math.floor(cost*6*s.ownership/100));}
    reputation(s,-8);write("The socks achieved sentience and went on strike.");return money;
}
async function staffTraining(money,input,s){
    const cost=200+s.employees*100;
    write("Staff training costs $"+cost+". The instructor has finally learned how to unmute.");
    if(await yes(input,"Train the team for quality +1 and efficiency +0.25?")){if(money<cost){write("Not enough cash.");return money;}s.productQuality++;s.efficiency+=.25;return take(money,cost);}return money;
}
async function gooseAudit(money,input,s){
    write("A goose in a tie audits your wallet. It accepts bread or violence.");
    const choice=await pick(input,"1 Buy bread ($20) | 2 Negotiate | 3 Run",1,3);
    if(choice===1)return take(money,20);
    if(choice===2&&chance(.5)){write("The goose hires you as CFO. Signing bonus: $500.");return safeAdd(money,500);}
    write("HONK. The goose confiscates 10% of your cash.");return take(money,Math.floor(money*.1));
}
async function memeRoyalty(money,input,s){write("Your confused face becomes a reaction meme. A brand pays $2,000 to put it on a mug.");return safeAdd(money,2000);}
async function cheeseVault(money,input,s){
    write("A cheese sommelier offers a mystery wheel for $100. Could be vintage. Could be soap.");
    if(!await yes(input,"Buy it?"))return money;if(money<100){write("Not enough cash.");return money;}
    if(chance(.3)){write("RARE CHEESE! A collector pays $3,000.");return safeAdd(take(money,100),3000);}
    write("It was soap. Your kitchen smells expensive.");return take(money,100);
}
async function robotAccountant(money,input,s){
    write("Your robot accountant finds an old refund, then asks for paid vacation.");
    const refund=Math.max(50,Math.floor(money*.05));write("Refund: $"+refund);return safeAdd(money,refund);
}
async function moonBillboard(money,input,s){
    write("Someone offers to project your face onto the moon for $200. Astronomers are furious.");
    if(!await yes(input,"Do it?"))return money;if(money<200){write("Not enough cash.");return money;}money=take(money,200);
    if(chance(.5)){write("You become a celebrity! +$5,000 and reputation +10.");reputation(s,10);return safeAdd(money,5000);}
    write("It was a flashlight pointed at a tortilla. Reputation -5.");reputation(s,-5);return money;
}
const EXTRA_EVENTS = [
    {fn:buyHouse,eligible:s=>!s.houseValue,weight:3},
    {fn:sellHouse,eligible:s=>s.houseValue>0,weight:2},
    {fn:renovateHouse,eligible:s=>s.houseValue>0,weight:2},
    {fn:leakyPipes,eligible:s=>s.houseValue>0},
    {fn:homeDisaster,eligible:s=>s.houseValue>0},
    {fn:homeInsurance,eligible:s=>s.houseValue>0&&!s.houseShield},
    {fn:neighborhood,eligible:s=>s.houseValue>0},
    {fn:runForOffice,eligible:s=>!s.campaigning&&!s.office,weight:2},
    {fn:campaignFundraiser,eligible:s=>s.campaigning,weight:5},
    {fn:campaignSpending,eligible:s=>s.campaigning,weight:6},
    {fn:debateNight,eligible:s=>s.campaigning,weight:3},
    {fn:bribePolitician,eligible:s=>!s.office},
    {fn:acceptBribe,eligible:s=>s.office>0,weight:3},
    {fn:passPolicy,eligible:s=>s.office>0,weight:3},
    {fn:reinvestCompany,eligible:s=>s.hasStartup,weight:2},
    {fn:companyContract,eligible:s=>s.hasStartup,weight:2},
    {fn:staffTraining,eligible:s=>s.hasStartup&&s.employees>0},
    {fn:gooseAudit,eligible:()=>true},{fn:memeRoyalty,eligible:()=>true},
    {fn:cheeseVault,eligible:()=>true},{fn:robotAccountant,eligible:()=>true},{fn:moonBillboard,eligible:()=>true}
];
async function victoryDecision(money,input,s) {
    s.peakCash=Math.max(s.peakCash,money);
    if(s.won||money<999999999)return false;
    s.won=true;write("YOU BEAT THE GAME! Cash: $"+money+". Your empire can keep growing.");
    s.endless=await yes(input,"Keep playing beyond the original target?");
    return !s.endless;
}
// ===== BALANCE UPDATE =====
// Keep this block after all the existing game.js code.
(() => {
  const originalCreateState = createState;
  const originalClearHouse = clearHouse;
  const originalExtendedStatus = extendedStatus;

  createState = function () {
    return {
      ...originalCreateState(),
      girlfriends: 0,
      dead: false,
      deathReason: "",
      salaryClock: 0,
      renting: false,
      rentClock: 0,
      quizDeck: [],
      lastQuiz: -1
    };
  };

  clearHouse = function (s) {
    originalClearHouse(s);
    s.renting = false;
    s.rentClock = 0;
  };

  // Keep existing event eligibility and weights, but give Tim
  // one-tenth of the weight he previously had.
  chooseEvent = function (s) {
    const pool = eventPool(s);
    const total = pool.reduce(
      (sum, id) => sum + (id === 1 ? 0.1 : 1),
      0
    );
    let roll = Math.random() * total;

    for (const id of pool) {
      roll -= id === 1 ? 0.1 : 1;
      if (roll < 0) return id;
    }
    return pool[pool.length - 1];
  };

  // Read errors should propagate rather than being swallowed
  // by the integer-validation loop.
  pick = async function (input, prompt, low, high) {
    while (true) {
      write(`${prompt} [${low}-${high}]: `);
      const raw = (await input.read()).trim();
      let value;
      try {
        value = parseInteger(raw);
      } catch {
        write("Please enter a whole number in range.");
        continue;
      }
      if (value >= low && value <= high) return value;
      write("Please enter a whole number in range.");
    }
  };

  // Bankruptcy is distinct from death.
  // Bankruptcy liquidates ALL public shares, angel shares and cars.
  // A house is sold only if those assets cannot raise any cash.
  rescueFromBankruptcy = async function (money, input, s) {
    if (s.dead) return 0;
    if (money > 0) return money;

    money = 0;
    write("BANKRUPTCY! Your stocks and cars must be liquidated.");

    if (s.shares > 0) {
      const count = s.shares;
      const proceeds = cashLimit(count * s.stockPrice);
      s.shares = 0;
      money = safeAdd(money, proceeds);
      write(`Sold ALL ${count} FART shares for $${proceeds}.`);
    }

    if (s.angelStakes > 0) {
      const count = s.angelStakes;
      const proceeds = cashLimit(count * s.angelPrice);
      s.angelStakes = 0;
      money = safeAdd(money, proceeds);
      write(`Sold ALL ${count} angel shares for $${proceeds}.`);
    }

    if (s.cars > 0) {
      const count = s.cars;
      const proceeds = cashLimit(count * 10000);
      s.cars = 0;
      money = safeAdd(money, proceeds);
      write(`Sold ALL ${count} cars for $${proceeds}.`);
    }

    if (money > 0) {
      write(`You survive with $${money}, but those holdings are gone.`);
      return money;
    }

    if (s.houseValue > 0) {
      const proceeds = s.houseValue;
      if (await yes(
        input,
        `Your house is your last sellable asset. Sell it for $${proceeds}?`
      )) {
        clearHouse(s);
        write("House sold. You are still in the game.");
        return proceeds;
      }
    }

    write("You cannot raise any cash. Your run is over.");
    return 0;
  };

  // Every accepted relationship remains active until a breakup
  // or discovery, whether its gift car is sold or retained.
  richGirl = async function (money, input, s) {
    write("You meet another wealthy girl.");
    write(`Current girlfriends: ${s.girlfriends}.`);

    if (s.girlfriends > 0) {
      write("Another relationship increases the chance they discover each other.");
    }

    if (!await yes(input, "Start dating her?")) {
      write("You politely decline. Your calendar breathes a sigh of relief.");
      return money;
    }

    s.girlfriends++;
    write("She gives you a car!");

    if (await yes(input, "Sell the car for $10,000?")) {
      money = safeAdd(money, 10000);
      write("Car sold. The relationship is still active.");
    } else {
      s.cars++;
      write("You keep the car.");
    }

    write(`You now have ${s.girlfriends} active relationship(s).`);
    return money;
  };

  function relationshipFallout(money, s) {
    if (s.girlfriends < 2) return money;

    const risk = Math.min(
      0.8,
      0.06 * s.girlfriends * (s.girlfriends - 1)
    );

    if (!chance(risk)) return money;

    const fraction = 0.5 + Math.random() * 0.3;
    const loss = Math.floor(money * fraction);

    write("YOUR GIRLFRIENDS FOUND THE GROUP CHAT.");
    write(`The fallout costs you $${loss} in settlements and expenses.`);

    if (s.cars > 0) {
      write("They also reclaim all your gift cars.");
      s.cars = 0;
    }

    reputation(s, -25);
    s.girlfriends = 0;
    write("All the relationships end. Reputation -25.");
    return take(money, loss);
  }

  async function relationshipDecision(money, input, s) {
    write(`You are juggling ${s.girlfriends} relationships.`);
    const choice = await pick(
      input,
      "1 Break up with one | 2 End all relationships | 3 Keep dating",
      1,
      3
    );

    if (choice === 3) return money;

    const ending = choice === 1 ? 1 : s.girlfriends;
    const cost = Math.min(money, ending * 250);
    s.girlfriends -= ending;

    write(`You end ${ending} relationship(s). Breakup expenses: $${cost}.`);
    return take(money, cost);
  }

  // Housing: offers range from 65% to 135% of current value.
  // A buyer's hidden maximum limits successful counteroffers.
  sellHouse = async function (money, input, s) {
    const value = s.houseValue;
    const offer = Math.max(
      1,
      cashLimit(value * (0.65 + Math.random() * 0.7))
    );
    const ceiling = cashLimit(offer * (1 + Math.random() * 0.2));

    write(`Your home's current market value is $${value}.`);
    write(`A buyer offers $${offer}.`);
    if (s.renting) write("A sale will also end your rental income.");

    const choice = await pick(
      input,
      "1 Accept | 2 Counteroffer | 3 Reject | 4 Rental management",
      1,
      4
    );

    if (choice === 4) return manageRental(money, input, s);
    if (choice === 3) {
      write("You reject the offer and keep your house.");
      return money;
    }

    let salePrice = offer;

    if (choice === 2) {
      const ask = await pick(
        input,
        "Your asking price; 0 to cancel",
        0,
        Number.MAX_SAFE_INTEGER
      );

      if (ask === 0) return money;

      if (ask > ceiling || !chance(0.85)) {
        write("The buyer walks away. You keep the house.");
        return money;
      }

      salePrice = ask;
      write(`The buyer accepts your counteroffer of $${salePrice}!`);
    }

    money = safeAdd(money, salePrice);
    clearHouse(s);
    write(`House sold for $${salePrice}.`);
    return money;
  };

  async function manageRental(money, input, s) {
    if (s.renting) {
      write("Your home is currently rented out.");
      if (await yes(input, "End the rental arrangement?")) {
        s.renting = false;
        s.rentClock = 0;
        write("Rental ended. The home remains yours.");
      }
      return money;
    }

    const fee = Math.max(50, Math.floor(s.houseValue * 0.005));
    const estimate = Math.max(25, Math.floor(s.houseValue * 0.025));

    write(`Listing and screening cost $${fee}.`);
    write(`Rent is 2.5% of current home value every five turns—about $${estimate} now.`);
    write("Upkeep continues. Tenants can miss payments or damage the property.");

    if (!await yes(input, "Put your house out for rent?")) return money;

    if (money < fee) {
      write("You cannot afford the listing fee.");
      return money;
    }

    s.renting = true;
    s.rentClock = 0;
    write("A tenant signs the lease.");
    return take(money, fee);
  }

  async function tenantTrouble(money, input, s) {
    write("Your tenant has converted the living room into a trampoline park.");
    const repair = Math.max(100, Math.floor(s.houseValue * 0.04));

    if (await yes(input, `Pay $${repair} for repairs?`)) {
      if (money >= repair) {
        write("Damage repaired. The tenant keeps renting.");
        return take(money, repair);
      }
      write("You cannot afford the repairs.");
    }

    s.houseValue = Math.max(100, Math.floor(s.houseValue * 0.9));
    s.renting = false;
    s.rentClock = 0;
    write("The tenant leaves. Property value falls 10% and rental income stops.");
    return money;
  }

  function endPoliticalCareer(s) {
    s.office = 0;
    s.officeTurns = 0;
    s.salaryClock = 0;
    s.campaigning = false;
    s.targetOffice = 0;
    s.campaignTurns = 0;
    s.campaignFunds = 0;
    s.campaignSpend = 0;
    s.support = 0;
  }

  function die(s, reason) {
    s.dead = true;
    s.deathReason = reason;
    write(reason);
    write("Your run ends. Income and asset sales cannot reverse a fatal event.");
    return 0;
  }

  runForOffice = async function (money, input, s) {
    write("The ballot is open.");

    OFFICES.slice(1).forEach((office, index) => {
      write(
        `${index + 1} - ${office.name}: filing $${office.fee}; ` +
        `salary $${office.salary} every SEVEN turns in office`
      );
    });

    write("Office lasts 12 turns. Unpaid partial salary periods are forfeited.");
    write("Public office also exposes you to threats, scandals and financial losses.");

    const choice = await pick(input, "Choose office; 0 to pass", 0, 3);
    if (!choice) return money;

    if (money < OFFICES[choice].fee) {
      write("You cannot afford the filing fee.");
      return money;
    }

    s.targetOffice = choice;
    s.campaigning = true;
    s.campaignTurns = 7;
    s.support = 0;
    s.campaignFunds = 0;
    s.campaignSpend = 0;

    write("You filed! Six further event turns until election night.");
    return take(money, OFFICES[choice].fee);
  };

  async function officeScandal(money, input, s) {
    write("Your office accidentally publishes its private group chat.");
    const cost = Math.max(250, Math.floor(money * 0.12));

    const choice = await pick(
      input,
      `1 Apologize | 2 Hire crisis PR ($${cost}) | 3 Blame the intern`,
      1,
      3
    );

    if (choice === 1) {
      reputation(s, -12);
      write("The apology helps, but voters are still angry. Reputation -12.");
    } else if (choice === 2 && money >= cost) {
      money = take(money, cost);
      const damage = chance(0.6) ? 4 : 18;
      reputation(s, -damage);
      write(`The campaign costs $${cost}. Reputation -${damage}.`);
    } else {
      reputation(s, -25);
      write("The response backfires. Reputation -25.");
    }

    return money;
  }

  async function officeKidnapping(money, input, s) {
    write("Your child has been kidnapped. The police are coordinating a rescue.");
    const ransom = Math.max(1000, Math.floor(money * 0.4));

    const choice = await pick(
      input,
      `1 Pay ransom ($${ransom}) | 2 Trust police rescue`,
      1,
      2
    );

    if (choice === 1 && money >= ransom) {
      write("Your child returns safely, but the ransom is gone.");
      return take(money, ransom);
    }

    if (choice === 1) write("You cannot afford the ransom.");

    if (chance(0.65)) {
      write("The police rescue your child safely.");
      return money;
    }

    const emergencyCost = Math.max(500, Math.floor(money * 0.6));
    write("The rescue succeeds after a prolonged emergency.");
    write(`Security, relocation and recovery expenses cost $${emergencyCost}.`);
    reputation(s, -8);
    return take(money, emergencyCost);
  }

  async function officeThreat(money, input, s) {
    write("Security reports a credible threat against you.");
    const cost = Math.max(500, Math.floor(money * 0.08));

    const choice = await pick(
      input,
      `1 Extra protection ($${cost}) | 2 Resign and relocate | 3 Ignore`,
      1,
      3
    );

    if (choice === 2) {
      endPoliticalCareer(s);
      const relocation = Math.max(250, Math.floor(money * 0.15));
      write(`You leave office and relocate. Cost: $${relocation}.`);
      return take(money, relocation);
    }

    let risk = s.reputation < 25 ? 0.4 : 0.12;

    if (choice === 1 && money >= cost) {
      money = take(money, cost);
      risk *= 0.2;
      write("Extra protection reduces the danger, but cannot eliminate it.");
    } else if (choice === 1) {
      write("You cannot afford extra protection.");
    }

    if (chance(risk)) {
      return die(s, "You are assassinated while holding office.");
    }

    write("You survive the threat.");
    return money;
  }

  async function officeRecall(money, input, s) {
    write("A recall petition is circulating. Even your campaign mascot signed it.");
    const cost = Math.max(500, Math.floor(money * 0.1));

    let chanceOfRemoval = Math.max(0.15, (100 - s.reputation) / 110);

    if (await yes(input, `Spend $${cost} responding to voters?`)) {
      if (money >= cost) {
        money = take(money, cost);
        chanceOfRemoval *= 0.6;
      } else {
        write("You cannot afford the response.");
      }
    }

    if (chance(chanceOfRemoval)) {
      endPoliticalCareer(s);
      reputation(s, -10);
      write("You are removed from office. Future salary is cancelled.");
    } else {
      reputation(s, -5);
      write("You survive the recall, but it damages your reputation.");
    }

    return money;
  }

  // Revised turn order:
  // 1. Market changes and costs/risks.
  // 2. Stop if cash is zero or the player dies.
  // 3. Pay eligible income only to a solvent, living player.
  // The UI also handles bankruptcy immediately after each event.
  advanceTurn = function (money, s) {
    if (s.dead) return 0;

    s.turn++;

    s.stockPrice = Math.max(
      5,
      Math.min(5000, s.stockPrice + Math.floor(Math.random() * 41) - 20)
    );
    s.angelPrice = Math.max(
      5,
      Math.min(5000, s.angelPrice + Math.floor(Math.random() * 41) - 20)
    );

    if (s.debt > 0 && s.turn % 3 === 0) {
      const interest = Math.max(1, Math.floor(s.debt / 20));
      s.debt = safeAdd(s.debt, interest);
      write(`Bank interest: +$${interest} debt.`);
    }

    money = extendedTurn(money, s);

    if (s.dead || money <= 0) return 0;

    if (s.hasStartup) money = companyIncome(money, s);
    return cashLimit(money);
  };

  extendedTurn = function (money, s) {
    if (s.dead) return 0;

    if (s.houseValue > 0) {
      s.houseValue = Math.max(
        100,
        cashLimit(s.houseValue * (0.95 + Math.random() * 0.1))
      );
      const upkeep = Math.max(1, Math.floor(s.houseCost * 0.001));
      money = take(money, upkeep);
      write(`Home value: $${s.houseValue}. Upkeep: $${upkeep}.`);
    }

    money = relationshipFallout(money, s);

    // Low reputation creates an additional danger even when
    // an office-specific event was not selected this turn.
    if (s.office && s.reputation < 25) {
      const risk = (25 - s.reputation) / 500;
      if (chance(risk)) {
        return die(s, "An attack ends your political career—and your run.");
      }
    }

    if (s.heat > 0 && chance(s.heat / 250)) {
      const fine = Math.max(500, Math.floor(money * 0.35));
      money = take(money, fine);
      reputation(s, -25);
      endPoliticalCareer(s);
      s.heat = Math.max(0, s.heat - 50);
      write(`CORRUPTION INVESTIGATION! Fine: $${fine}. You lose any office or candidacy.`);
    } else {
      s.heat = Math.max(0, s.heat - 1);
    }

    if (s.office) {
      s.salaryClock++;
      const payday = s.salaryClock >= 7;

      if (payday) {
        s.salaryClock = 0;

        if (money > 0) {
          const salary = OFFICES[s.office].salary;
          money = safeAdd(money, salary);
          write(`Seven-turn office payday: +$${salary}.`);
        } else {
          write("Your salary cannot rescue you from bankruptcy. This payday is forfeited.");
        }
      }

      s.officeTurns--;
      if (s.officeTurns <= 0) {
        s.office = 0;
        s.salaryClock = 0;
        write("Your term ends. Unpaid partial salary is forfeited.");
      }
    }

    if (s.campaigning && --s.campaignTurns <= 0) {
      const odds = electionOdds(s);
      write(`ELECTION NIGHT! Win chance: ${Math.round(odds * 100)}%.`);

      if (chance(odds)) {
        s.office = s.targetOffice;
        s.officeTurns = 12;
        s.salaryClock = 0;
        reputation(s, 10);
        write(`YOU WIN! You hold ${OFFICES[s.office].name} for 12 turns.`);
        write("Your first salary arrives after seven turns in office.");
      } else {
        reputation(s, -5);
        write("You lose the election.");
      }

      s.campaigning = false;
      s.campaignFunds = 0;
      s.campaignSpend = 0;
      s.support = 0;
      s.targetOffice = 0;
      s.campaignTurns = 0;
      write("Campaign accounts close. Unspent donations do not become personal cash.");
    }

    if (s.renting && s.houseValue > 0) {
      s.rentClock++;

      if (s.rentClock >= 5) {
        s.rentClock = 0;

        if (money <= 0) {
          write("Bankruptcy interrupts rent collection this turn.");
        } else if (chance(0.18)) {
          write("Your tenant misses this rent payment.");
        } else {
          const rent = Math.max(25, Math.floor(s.houseValue * 0.025));
          money = safeAdd(money, rent);
          write(`Rental payment received: +$${rent}.`);
        }
      }
    }

    return cashLimit(money);
  };

  extendedStatus = function (s) {
    originalExtendedStatus(s);

    write(`Active girlfriends: ${s.girlfriends}.`);

    if (s.girlfriends >= 2) {
      const risk = Math.min(
        0.8,
        0.06 * s.girlfriends * (s.girlfriends - 1)
      );
      write(`Relationship discovery chance next turn: ${Math.round(risk * 100)}%.`);
    }

    if (s.office) {
      write(`Next office payday in ${7 - s.salaryClock} turn(s).`);
      if (s.reputation < 25) write("LOW REPUTATION: increased assassination risk.");
    }

    if (s.renting) {
      write(`Home rented out. Next rent collection in ${5 - s.rentClock} turn(s).`);
    }
  };

  const questions = [
    ["What is 12 × 13?", ["156"]],
    ["How many sides does a dodecagon have?", ["12", "twelve"]],
    ["What is 17 × 6?", ["102"]],
    ["What is the square root of 144?", ["12", "twelve"]],
    ["What is 15% of 200?", ["30", "thirty"]],
    ["What is 2 to the power of 10?", ["1024", "1,024"]],
    ["What is 7 squared?", ["49"]],
    ["How many degrees are in a right angle?", ["90"]],
    ["What is the smallest prime number?", ["2", "two"]],
    ["How many sides does a hexagon have?", ["6", "six"]],
    ["What is 81 divided by 9?", ["9", "nine"]],
    ["How many minutes are in three hours?", ["180"]],
    ["What is the chemical symbol for gold?", ["au"]],
    ["What is the chemical symbol for oxygen?", ["o"]],
    ["What is H2O commonly called?", ["water"]],
    ["Which planet is called the Red Planet?", ["mars"]],
    ["Which planet is closest to the Sun?", ["mercury"]],
    ["Which planet is the largest in our solar system?", ["jupiter"]],
    ["What force keeps planets in orbit around the Sun?", ["gravity", "gravitation"]],
    ["What gas do plants absorb during photosynthesis?", ["carbon dioxide", "co2"]],
    ["Which organ pumps blood through the human body?", ["heart", "the heart"]],
    ["How many legs does an adult insect have?", ["6", "six"]],
    ["What is the capital of France?", ["paris"]],
    ["What is the capital of Japan?", ["tokyo"]],
    ["What is the capital of Italy?", ["rome"]],
    ["Which ocean is the largest?", ["pacific", "pacific ocean", "the pacific ocean"]],
    ["On which continent is Egypt?", ["africa"]],
    ["Which country contains the city of Barcelona?", ["spain"]],
    ["Who wrote Romeo and Juliet?", ["shakespeare", "william shakespeare"]],
    ["Who painted the Mona Lisa?", ["leonardo da vinci", "da vinci"]],
    ["How many strings does a standard violin have?", ["4", "four"]],
    ["How many keys does a standard full-size piano have?", ["88"]],
    ["In chess, which piece moves in an L shape?", ["knight", "the knight"]],
    ["How many bits are in a byte?", ["8", "eight"]],
    ["What does HTML stand for?", ["hypertext markup language", "hyper text markup language"]],
    ["What number is written as 1010 in binary?", ["10", "ten"]]
  ];

  function nextQuestion(s) {
    if (!s.quizDeck.length) {
      s.quizDeck = questions.map((_, index) => index);

      for (let i = s.quizDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [s.quizDeck[i], s.quizDeck[j]] =
          [s.quizDeck[j], s.quizDeck[i]];
      }

      // Avoid repeating the final question of the previous deck
      // as the first question of the next deck.
      const last = s.quizDeck.length - 1;
      if (s.quizDeck[last] === s.lastQuiz) {
        [s.quizDeck[0], s.quizDeck[last]] =
          [s.quizDeck[last], s.quizDeck[0]];
      }
    }

    s.lastQuiz = s.quizDeck.pop();
    return questions[s.lastQuiz];
  }

  async function askTrivia(input, s) {
    const [question, accepted] = nextQuestion(s);
    write(question);
    const answer = (await input.read())
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[.!?]+$/, "");

    if (accepted.includes(answer)) return true;

    write(`Correct answer: ${accepted[0]}.`);
    return false;
  }

  gameShow = async function (money, input, s) {
    write("WELCOME TO WHO WANTS TO BE A MILLIONAIRE!");
    write("Answer correctly for $10,000.");

    if (!await askTrivia(input, s)) {
      write("Wrong! You lose $100 for embarrassing yourself.");
      return take(money, 100);
    }

    write("Correct! You have won $10,000.");

    if (!await yes(input, "Risk those winnings for $100,000?")) {
      return safeAdd(money, 10000);
    }

    write("FINAL QUESTION:");

    if (await askTrivia(input, s)) {
      write("YOU WIN $100,000!");
      return safeAdd(money, 100000);
    }

    write("You lose the game-show winnings.");
    return money;
  };

  // Existing registry entries captured their old function references.
  // Update those references to the replacements above.
  for (const event of EXTRA_EVENTS) {
    if (event.fn.name === "sellHouse") event.fn = sellHouse;
    if (event.fn.name === "runForOffice") event.fn = runForOffice;
  }

  EXTRA_EVENTS.push(
    {
      fn: relationshipDecision,
      eligible: s => s.girlfriends > 0,
      weight: 2
    },
    {
      fn: manageRental,
      eligible: s => s.houseValue > 0,
      weight: 2
    },
    {
      fn: tenantTrouble,
      eligible: s => s.houseValue > 0 && s.renting
    },
    {
      fn: officeScandal,
      eligible: s => s.office > 0,
      weight: 3
    },
    {
      fn: officeKidnapping,
      eligible: s => s.office > 0
    },
    {
      fn: officeThreat,
      eligible: s => s.office > 0,
      weight: 2
    },
    {
      fn: officeRecall,
      eligible: s => s.office > 0,
      weight: 2
    }
  );
})();
// Economy revision: skill-driven company value, scaled costs and royal vault.
function formatMoney(n) {
  const sign=n<0?'-':''; n=Math.abs(n);
  for(const [unit,suffix] of [[1e12,'T'],[1e9,'B'],[1e6,'M'],[1e3,'K']]) {
    if(n>=unit) {
      const v=Math.floor(n/unit*100)/100;
      return sign+'$'+v.toLocaleString('en-US',{maximumFractionDigits:2})+suffix;
    }
  }
  return sign+'$'+Math.floor(n).toLocaleString('en-US');
}
function scaledCost(base,rate,minimum=1){return Math.max(minimum,cashLimit(base*rate));}
function companyChange(s,rate,reason){
  const before=s.startupValue;
  s.startupValue=Math.max(100,cashLimit(before*(1+rate)));
  write(reason+` Company value: $${before} → $${s.startupValue}.`);
}
function closeCompany(s){
  Object.assign(s,{hasStartup:false,startupName:'',startupValue:2000,ownership:100,employees:0,productQuality:0,products:0,efficiency:1,patent:false,insured:false,publicity:0,investorTrust:0,managementScore:0});
}
const MANAGEMENT_CASES=[
 ['Returns climbed after a faulty batch. Demand is strong; customers want replacements.','Recall the faulty batch and fix quality','Buy more ads','Increase production without fixing defects','Quality repairs retain customers; advertising defective goods destroys trust.'],
 ['Your factory is at 100% capacity with a backlog of paid orders. Defects are low.','Expand capacity to fulfill the backlog','Cut staff to save wages','Spend the budget on a new logo','Capacity is the bottleneck, so expand it.'],
 ['Sales are flat, warehouses are full and production exceeds orders.','Reduce production and clear inventory','Hire more factory workers','Double production to lower unit costs','Unsold stock ties up cash; more production makes it worse.'],
 ['One supplier is cheap but repeatedly misses deliveries. A reliable backup costs slightly more.','Split orders with the reliable supplier','Commit every order to the cheap supplier','Promise faster deliveries without changing suppliers','A backup reduces disruption and protects customer orders.'],
 ['A new market has uncertain demand. You have enough cash for a small trial, but not a full rollout.','Run a small paid pilot before expanding','Launch nationwide immediately','Sign a huge long-term warehouse lease','A pilot tests demand before locking up cash.'],
 ['Customers buy your product but cancel because setup is confusing. The product itself works.','Improve onboarding and support','Build unrelated features','Raise prices to offset cancellations','Fix the reason customers leave.'],
 ['An order earns $120 per unit but costs $135 per unit to fulfill.','Renegotiate the price or decline','Accept and make it up on volume','Borrow money to fulfill twice as many units','Each unit loses $15; volume increases the loss.'],
 ['A security audit finds exposed customer records. No breach has been reported yet.','Restrict access and patch the flaw immediately','Hide the audit and launch new ads','Wait for customers to complain','Fixing the known vulnerability protects trust and avoids a larger loss.'],
 ['Demand is rising, but customers pay after 90 days and suppliers demand payment now.','Negotiate deposits and supplier payment terms','Offer customers even longer payment terms','Spend working capital on an office fountain','Cash timing matters even when orders are profitable.'],
 ['A rival cuts prices below your costs. Customers praise your reliability and service.','Compete on reliability and retain profitable customers','Match the loss-making price on every order','Remove support while charging the same premium','Protect your profitable advantage instead of copying a loss-making price.']
];
async function companyDecision(m,input,s){
  if(!s.hasStartup)return m;
  if(!s.managementDeck?.length){s.managementDeck=MANAGEMENT_CASES.map((_,i)=>i);for(let j=s.managementDeck.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[s.managementDeck[j],s.managementDeck[k]]=[s.managementDeck[k],s.managementDeck[j]];}}
  const row=MANAGEMENT_CASES[s.managementDeck.pop()];
  write('MANAGEMENT BRIEF: '+row[0]);
  const options=[{text:row[1],good:true},{text:row[2]},{text:row[3]}];
  for(let j=2;j>0;j--){const k=Math.floor(Math.random()*(j+1));[options[j],options[k]]=[options[k],options[j]];}
  options.forEach((o,i)=>write(`${i+1} - ${o.text}`));
  const c=await pick(input,'Choose your response',1,3);
  const good=options[c-1].good;
  s.managementScore=Math.max(-3,Math.min(3,(s.managementScore||0)+(good?1:-2)));
  companyChange(s,good?.06:-.22,row[4]);
  reputation(s,good?2:-4);
  return m;
}
(() => {
  const oldState=createState;
  createState=function(){return {...oldState(),managementScore:0,managementDeck:[],kingsFork:false,vaultOpened:false,billionReached:false};};
  const oldStart=startCompany;
  startCompany=async function(m,i,s){const had=s.hasStartup;m=await oldStart(m,i,s);if(!had&&s.hasStartup){s.startupValue=1000;s.managementScore=0;s.managementDeck=[];write('Initial company valuation: $1000. Growth requires sound decisions.');}return m;};
  companyIncome=function(m,s){
    const value=s.startupValue;
    const margin=.001+Math.min(3,s.products)*.001+Math.min(5,s.productQuality)*.0003+(s.managementScore||0)*.001;
    const revenue=cashLimit(value*Math.max(0,margin)*Math.min(1.25,s.efficiency));
    const costs=scaledCost(value,.001+s.employees*.0005,10);
    const profit=revenue-costs;
    const dividend=cashLimit(Math.max(0,profit)*s.ownership/100);
    if(profit<0){companyChange(s,-.015,'Operating losses erode valuation.');m=take(m,-profit);}else m=safeAdd(m,dividend);
    write(`Company revenue $${revenue}; operating costs $${costs}; your dividend $${dividend}.`);
    return m;
  };
  launchProduct=async function(m,i,s){
    if(!s.hasStartup)return m;
    const ready=s.productQuality>=3&&s.employees>=2;
    write(`LAUNCH REVIEW: quality ${s.productQuality}/3 required; employees ${s.employees}/2 required. ${ready?'Testing and staffing are ready; customers are waiting.':'Launching now risks defective or unfulfilled orders.'}`);
    const cost=scaledCost(s.startupValue,.08,100);
    const c=await pick(i,`1 Launch ($${cost}) | 2 Delay and resolve readiness`,1,2);
    if(c===2){companyChange(s,ready?-.08:-.02,ready?'You miss a ready market window.':'A careful delay limits the damage. Train or hire before launching.');return m;}
    if(m<cost){write('Insufficient cash for launch.');return m;}
    m=take(m,cost);
    if(!ready){s.lawsuitRisk+=2;companyChange(s,-.30,'The launch fails its readiness requirements.');return m;}
    s.products=Math.min(10,s.products+1);const payout=cashLimit(s.startupValue*.10*s.ownership/100);
    companyChange(s,.10,'Prepared launch succeeds.');write(`Launch distribution: $${payout}.`);return safeAdd(m,payout);
  };
  hireEmployees=async function(m,i,s){
    if(!s.hasStartup)return m;
    const cost=scaledCost(s.startupValue,.04,100);
    write(`Team: ${s.employees}. Payroll per employee: 0.05% of company value each turn. Two employees satisfy launch staffing.`);
    const c=await pick(i,`1 Hire two ($${cost}) | 2 Fire one | 3 Keep team`,1,3);
    if(c===1){if(m<cost){write('Insufficient hiring cash.');return m;}s.employees+=2;return take(m,cost);}
    if(c===2&&s.employees>0){s.employees--;reputation(s,-3);}return m;
  };
  staffTraining=async function(m,i,s){
    if(!s.hasStartup||!s.employees)return m;
    const cost=scaledCost(s.startupValue,.03,100);
    if(!await yes(i,`Train staff for $${cost}? Quality +1 (maximum 5).`))return m;
    if(m<cost){write('Insufficient training cash.');return m;}
    s.productQuality=Math.min(5,s.productQuality+1);return take(m,cost);
  };
  reinvestCompany=async function(m,i,s){
    if(!s.hasStartup)return m;
    const cost=scaledCost(s.startupValue,.05,100);
    const c=await pick(i,`1 R&D: quality +1, cap 5 ($${cost}) | 2 Automation: efficiency +0.05, cap 1.25 ($${cost}) | 3 Pass`,1,3);
    if(c===3)return m;if(m<cost){write('Insufficient cash.');return m;}
    if(c===1)s.productQuality=Math.min(5,s.productQuality+1);else s.efficiency=Math.min(1.25,s.efficiency+.05);
    return take(m,cost);
  };
  companyContract=companyDecision;
  competitor=companyDecision;
  ventureCapital=async function(m,i,s){
    if(!s.hasStartup)return m;
    const sold=s.ownership*.2, proceeds=cashLimit(s.startupValue*sold/100);
    if(await yes(i,`Sell 20% of your remaining stake for $${proceeds}? Valuation does not change.`)){s.ownership-=sold;return safeAdd(m,proceeds);}return m;
  };
  bankLoan=async function(m,i,s){
    if(s.reputation<25){write('Loan denied: reputation below 25.');return m;}
    const small=scaledCost(m,.25,1000),large=scaledCost(m,1,5000);
    const c=await pick(i,`Borrow: 1 $${small} | 2 $${large} | 3 Cancel. Debt grows 5% every third turn`,1,3);
    if(c===3)return m;const amount=c===1?small:large;
    if(s.debt>Number.MAX_SAFE_INTEGER-amount){write('Loan exceeds the debt limit.');return m;}
    s.debt=safeAdd(s.debt,amount);return safeAdd(m,amount);
  };
  lawsuit=async function(m,i,s){
    const exposure=scaledCost(m,.20+Math.min(10,s.lawsuitRisk)*.03,500);
    write(`LEGAL PAPERS: damages $${exposure}. Evidence: ${s.evidence}; patent: ${s.patent}.`);
    const c=await pick(i,'1 Settle for half | 2 Fight | 3 Ignore (double damages)',1,3);
    s.lawsuitRisk=Math.max(0,s.lawsuitRisk-1);
    if(c===1)return take(m,Math.floor(exposure/2));
    if(c===2&&chance(s.evidence?.9:s.patent?.6:.3)){write('You win the case.');return m;}
    reputation(s,c===3?-20:-10);write('Damages awarded against you.');return take(m,exposure*(c===3?2:1));
  };
  insurance=async function(m,i,s){
    if(!s.hasStartup||s.insured)return m;const cost=scaledCost(m,.04,100);
    if(!await yes(i,`One-use company disaster coverage costs $${cost} (4% of cash, minimum $100). Buy?`))return m;
    if(m<cost){write('Not enough cash.');return m;}s.insured=true;return take(m,cost);
  };
  homeInsurance=async function(m,i,s){
    if(!s.houseValue||s.houseShield)return m;const cost=scaledCost(m,.03,100);
    if(!await yes(i,`One-disaster home coverage costs $${cost} (3% of cash, minimum $100). Buy?`))return m;
    if(m<cost){write('Not enough cash.');return m;}s.houseShield=true;return take(m,cost);
  };
  patentOffice=async function(m,i,s){
    if(!s.hasStartup||s.patent)return m;const cost=scaledCost(m,.05,100);
    if(!await yes(i,`File a patent for $${cost} (5% of cash, minimum $100)? Quality 3 required for approval.`))return m;
    if(m<cost){write('Not enough cash.');return m;}m=take(m,cost);
    if(s.productQuality>=3){s.patent=true;companyChange(s,.03,'Patent approved.');}else{write('Application rejected: insufficient product quality.');}return m;
  };
  // EXTRA_EVENTS stores function references; refresh those captured before overrides.
  const replacements={reinvestCompany,companyContract,staffTraining,homeInsurance};
  for(const event of EXTRA_EVENTS)if(replacements[event.fn.name])event.fn=replacements[event.fn.name];
  EXTRA_EVENTS.push({fn:companyDecision,eligible:s=>s.hasStartup,weight:12});
  // The medieval rescue wrapper delegates to this modern-only implementation.
  rescueFromBankruptcy=async function(m,i,s){
    if(s.dead)return 0;if(m>0)return m;
    if(typeof flashBankruptcy==='function')flashBankruptcy();
    write('BANKRUPTCY — FORCED ASSET SALE','bankruptcy-message');m=0;
    for(const [field,price,label] of [['shares',s.stockPrice,'FART shares'],['angelStakes',s.angelPrice,'angel shares'],['cars',10000,'cars']]){
      if(s[field]>0){const proceeds=cashLimit(s[field]*price);write(`Sold ALL ${s[field]} ${label} for $${proceeds}.`);s[field]=0;m=safeAdd(m,proceeds);}
    }
    if(m===0&&s.houseValue>0){m=cashLimit(s.houseValue);clearHouse(s);write(`House liquidated for $${m}.`);}
    if(m===0&&s.hasStartup){const proceeds=cashLimit(s.startupValue*(s.ownership/100)*.5);closeCompany(s);m=proceeds;write(`Company stake liquidated at 50% of its value: $${proceeds}.`);}
    write(m>0?`Liquidation complete. Cash: $${m}. Sold assets are gone.`:'No sellable assets remain. Your run is over.','bankruptcy-message');return m;
  };
  const originalVictory=victoryDecision;
  victoryDecision=async function(m,i,s){if(m>=1e9)s.billionReached=true;return originalVictory(m,i,s);};
  EXTRA_EVENTS.push({fn:royalVault,eligible:s=>s.era!=='medieval'&&(s.billionReached||s.peakCash>=1e9)&&!s.vaultOpened,weight:1});
  EXTRA_EVENTS.push({fn:islandInvestment,eligible:s=>s.vaultOpened&&s.era!=='medieval',weight:2});
})();
async function royalVault(m,i,s){
  write('A mysterious vault appears. Its lock reads: BRING THE KING’S FORK.');
  if(!s.kingsFork){write('You lack the ancient fork. The vault vanishes; it may return.');return m;}
  if(!await yes(i,'Use your royal fork to open the vault?'))return m;
  s.vaultOpened=true;
  write('The fork turns! A ferry carries you to fictional billionaire Baron Slipperton’s island, home of an absurdly profitable baby-oil factory. Island investments are now unlocked.');
  return islandInvestment(m,i,s);
}
async function islandInvestment(m,i,s){
  if(!s.vaultOpened)return m;
  write('SLIPPERTON ISLAND: invest in baby oil. 55% chance of 4× your stake returned; otherwise the shipment spills and your stake is lost. Maximum stake: 25% of cash.');
  const stake=await pick(i,'Investment; 0 to decline',0,Math.floor(m*.25));
  if(!stake)return m;m=take(m,stake);
  if(chance(.55)){write('The luxury baby-oil shipment sells out!');return safeAdd(m,cashLimit(stake*4));}
  write('The dock is slippery, the shipment is gone, and the gulls are moisturized.');return m;
}

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
  if(s.kingsFork)write("The king’s fork survived the journey. Somewhere, a vault awaits it.");
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
  {name:"The king's lost fork",fn:async(m,i,s)=>{
    write("A merchant offereth the lost fork of the king for 15 coins. Most such relics are false.");
    if(!await yes(i,"Wilt thou buy the relic?"))return m;
    if(m<15){write("Thou lackest the coin.");return m;}
    if(chance(.25)){s.kingsFork=true;write("The royal seal proveth true! Thou keepest THE KING’S FORK. It shall travel with thee through time.");return take(m,15);}
    write("The fork beareth yesterday's maker's mark. Thou hast been swindled.");return take(m,15);
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

// Accept compact inputs while retaining whole-dollar arithmetic.
parseInteger = function(value) {
  const match=String(value).trim().replaceAll(',', '').match(/^([+-]?\d+(?:\.\d+)?)\s*([KMBT]?)$/i);
  if(!match)throw new Error('Not a whole number');
  const n=Number(match[1])*({K:1e3,M:1e6,B:1e9,T:1e12}[match[2].toUpperCase()]||1);
  if(!Number.isSafeInteger(n))throw new Error('Out of range or fractional dollar');
  return n;
};
// Replace the old all-or-nothing Shark Tank multiplier with a management round.
sharkTank = companyDecision;
(() => {
  const previousPool=eventPool;
  eventPool=function(s){return previousPool(s).filter(id=>id!==11||s.hasStartup);};
})();
