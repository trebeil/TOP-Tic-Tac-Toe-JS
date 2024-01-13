function createPlayer (name, mark) {
  return { name, mark };
}

function createGame() {
  let board = ['', '', '', '', '', '', '', '', ''];
  let player = playerOne;
  return { player, board };
}

const interfaceController = (function() {
  // Sets a click listener to the 'Start new game' button
  const setupStart = () => {
    const btn = document.querySelector('button');
    btn.addEventListener('click', gameController.startNewGame);
  };

  // Updates the interface as a hole based on the current state of the game
  const updateInterface = (message) => {
    alert(message);
    updateBoard();
  };

  // Displays a message on the alert div
  const alert = (message) => {
    const div = document.querySelector('.alert');
    div.textContent = message;
  };

  // Updates the board on screen based on the current state of the game
  const updateBoard = () => {
    let divs = Array.from(document.querySelectorAll('.position'));
    for (const div of divs) {
      div.classList.remove('filled');
      const index = div.getAttribute('data-position') * 1;
      if (game.board[index] == '') {
        if (game.player.mark == 'X') {
          div.classList.remove('green');
          div.classList.add('red');
        } else {
          div.classList.remove('red');
          div.classList.add('green');
        }
      } else {
        let mark = game.board[index];
        div.classList.add('filled');
        if (mark == 'X') {
          div.classList.add('red');
        } else {
          div.classList.add('green');
        }
      }
    }
  };

  // Adds to all board divs a click listener that starts the process of playing
  // a round
  const setupTurnInputs = () => {
    let divs = Array.from(document.querySelectorAll('.position'));
    for (const div of divs) {
      div.position = div.getAttribute('data-position') * 1;
      div.addEventListener('click', gameController.choosePosition);
    }
  }

  // Updates the interface with end game messages and remove listeners from
  // board divs
  const setupEnd = (result) => {
    announceResult(result);
    removeListeners();
    removeClasses();
  };

  // Announces a draw or a winner
  const announceResult = (result) => {
    if (result === 'draw') {
      alert("It's a draw.");
    } else {
      if (game.player.mark === 'O') {
        alert('Red wins!');
      } else {
        alert('Green wins!');
      }
    }
  };

  // Remove click listeners from all clickable squares on the board
  const removeListeners = () => {
    let divs = Array.from(document.querySelectorAll('.position'));
    for (const div of divs) {
      div.removeEventListener('click', gameController.choosePosition);
    }
  };

  const removeClasses = () => {
    let divs = Array.from(document.querySelectorAll('.position'));
    for (const div of divs) {
      if (!div.classList.contains('filled')) {
        div.classList.remove('red');
        div.classList.remove('green');
      }
    }
  };

  return { setupStart, updateInterface, setupTurnInputs, setupEnd };
})();

const gameController = (function() {
  // Resets the board and the current player, updates the interface based on
  // the current state of the game and sets up turn inputs
  const startNewGame = () => {
    game = createGame();
    interfaceController.updateInterface('');
    interfaceController.setupTurnInputs();
  };

  // Checks if the chosen position is valid. If so, plays a round. If not,
  // displays error message.
  const choosePosition = () => {
    const position = event.currentTarget.position;
    if (validInput(position)) {
      playRound(position);
    }
  };

  // Checks if the position input by user is a valid one. Returns true or
  // false.
  const validInput = (position) => {
    if (game.board[position] == '') {
      return true;
    } else {
      return false;
    }
  };

  // Plays a complete round by:
  //  - Setting the mark of the player to a position on the board array
  //  - Toggling the active player
  //  - Updating the board and messages on screen
  //  - Announcing the result and clearing turn info if game ended
  const playRound = (position) => {
    setPositionOnBoard(position);
    togglePlayer();
    interfaceController.updateInterface('');
    if (gameEnded()) {
      interfaceController.setupEnd(gameEnded());
    }
  };

  // Sets the mark of a given player to a position on the board array
  const setPositionOnBoard = (position) => {
    game.board[position] = game.player.mark;
  };

  // Toggles the player stored on the 'player' variable
  const togglePlayer = () => {
    game.player = game.player === playerOne ? playerTwo : playerOne;
  };

  // Returns the winning mark if a win pattern is found or 'draw' if a draw 
  // pattern is found.
  const gameEnded = () => {
    return winPattern() || drawPattern();
  };

  // Returns the winning mark if a winning row, column or diagonal is found.
  const winPattern = () => {
    const row = winningRow(0) || winningRow(3) || winningRow(6);
    const col = winningCol(0) || winningCol(1) || winningCol(2);
    const dia = winningDia();
    return row || col || dia;
  };

  // Receives the index of the first element of a row. Returns the winning mark
  // if all elements on that row are equal.
  const winningRow = (i) => {
    if (game.board[i] == game.board[i + 1] && game.board[i] == game.board[i + 2]) {
      return game.board[i];
    }
  };

  // Receives the index of the first element of a column. Returns the winning mark
  // if all elements on that column are equal.
  const winningCol = (i) => {
    if (game.board[i] == game.board[i + 3] && game.board[i] == game.board[i + 6]) {
      return game.board[i];
    }
  };

  // Returns the winning mark if all elements on either diagonal are equal.
  const winningDia = () => {
    if (game.board[0] == game.board[4] && game.board[0] == game.board[8] ||
        game.board[2] == game.board[4] && game.board[2] == game.board[6]) {
      return game.board[4];
    }
  };

  // Checks if all elements are filled. If there is at least one integer
  // on the board returns false, else returns true.
  const drawPattern = () => {
    let draw = 'draw';
    checkBoard:
      for (let i = 0; i < 9; i++) {
        if (game.board[i] == '') {
          draw = false;
          break checkBoard;
        }
      }
    return draw;
  };

  return { startNewGame, choosePosition };
})();

const playerOne = createPlayer('Foo', 'X');
const playerTwo = createPlayer('Bar', 'O');
let game;
interfaceController.setupStart();
gameController.startNewGame();