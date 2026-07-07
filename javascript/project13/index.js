// x   x    x
// 0   1    2
// x   x    x
// 3   4    5
// x   x    x
// 6   7    8

// winner konse case me hoga:-
// row = 012 345 678   equal ho toh
// colm  = 036 147 258
// diagnoal = 048 246

// iske liye hum empty array banayenge
// us array me value dalunga jo bhi btn pe content hoga
// 0-8 wise mene btn ko mene id di usi index p unki id ke behalf p X and O ko daal dunga fir
// cindition check krunga

const arr = ["", "", "", "", "", "", "", "", ""];
let totalInsert = 0;
let winnerDecide = false;
console.log(arr);
function checkWineer(player) {
  //                   row = 012 345 678   equal ho toh
  if (arr[0] == player && arr[1] == player && arr[2] == player) {
    return true;
  } else if (arr[3] == player && arr[4] == player && arr[5] == player) {
    return true;
  } else if (arr[6] == player && arr[7] == player && arr[8] == player) {
    return true;
  }
  //                        colm  = 036 147 258
  else if (arr[0] == player && arr[3] == player && arr[6] == player) {
    return true;
  } else if (arr[1] == player && arr[4] == player && arr[7] == player) {
    return true;
  } else if (arr[2] == player && arr[5] == player && arr[8] == player) {
    return true;
  }
  // diagnoal = 048 246
  else if (arr[0] == player && arr[4] == player && arr[8] == player) {
    return true;
  } else if (arr[2] == player && arr[4] == player && arr[6] == player) {
    return true;
  } else {
    false;
  }
}

const btn = document.getElementById("board");
const winner = document.getElementById("status");
const reset = document.getElementById("resetBtn");

let turn = "X";

btn.addEventListener("click", (e) => {
  if (winnerDecide || totalInsert == 9 || arr[e.target.id] != "") {
    return;
  }
  const btn = e.target;
  btn.textContent = turn;

  const index = btn.id;
  arr[index] = turn;
  totalInsert++;

  if (checkWineer(turn)) {
    winner.textContent = `player ${turn} won the game`;
    winnerDecide = true;
    return;
  }

  if (totalInsert == 9) {
    winner.textContent = `Game is Draw`;
    return;
  }
  if (turn == "X") {
    turn = "O";
  } else {
    turn = "X";
  }

  winner.textContent = `player ${turn} turn `;
});

reset.addEventListener("click", () => {
  for (let i = 0; i < 9; i++) {
    document.getElementById(i).textContent = "";
    arr[i] = "";
  }
  totalInsert = 0;
  winnerDecide = false;
});
