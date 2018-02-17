(function(){
    const components = {
    gameBoard: document.getElementById('board'),
    startDiv: document.createElement('div'),
    userInput: document.createElement('input'),
    startButton: document.createElement('a'),
    endDiv: document.createElement('div'),
    gameBoxes: document.getElementsByClassName("boxes")[0],
    selected: document.getElementsByClassName('selected'),
    currentPlayer: null,
    players: {
      player1: {
        ref: document.getElementById('player1'),
        name: "Player 1",
        code: 'one',
        img: "url('img/o.svg')",
        plays: []
      },
      player2:{
        ref: document.getElementById('player2'),
        name: 'Player 2',
        code: 'two',
        img: "url('img/x.svg')",
        plays: []
      }
    },
    winningCombos: [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ]
    };

    //===============================================

    const computer = {
    //store computer gameplay
      getMove: function () {
        let possibleMoves = [];
        for(let i =0; i < components.gameBoxes.children.length; i++){
          if(components.gameBoxes.children[i].classList.contains('selected')){
          } else {
            possibleMoves.push(components.gameBoxes.children[i]);
          }
        }
        let random = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[random];
      },

      playTurn: async function () {
          await controller.delay(1200); //delay to simulate computer 'thinking'
          let compMove = this.getMove();
          view.renderTurn(null, components.currentPlayer, compMove);
          let continueGame = controller.updatePlayerChoices(null, compMove);
          if(continueGame){ //only continue game if no player has won or tied
            controller.changePlayer();
          }
      }
    };

  //================================================
    const controller = {
      createStartPage: function() {
        components.startDiv.className = "screen screen-start";
        components.startDiv.id = "start";
        const header = document.createElement("header");
        header.innerHTML = "<h1>Tic Tac Toe</h1>";
        header.append(this.createInput());
        header.append(this.createStartButton());
        components.startDiv.append(header);
        return components.startDiv;
      },

      createStartButton: function() {
        components.startButton.href = '#';
        components.startButton.id = 'start-button';
        components.startButton.className = "button";
        components.startButton.textContent = "Start Game";
        return components.startButton;
      },

      createInput: function() {
        components.userInput.type = "text";
        components.userInput.id = "userName";
        components.userInput.className = "button";
        components.userInput.placeholder = "Enter Name";
        return components.userInput;
      },

      createPlayerNames: function() {
        const player1Name = document.createElement('p');
        const player2Name = document.createElement('p');
        player1Name.textContent = components.players.player1.name;
        player1Name.style.color = 'white';
        player2Name.textContent = components.players.player2.name;
        player2Name.style.color = 'white';
        components.players.player1.ref.appendChild(player1Name);
        components.players.player2.ref.appendChild(player2Name);
      },

      playTurn: function (e) {
          view.renderTurn(e, components.currentPlayer, null);
          let continueGame = this.updatePlayerChoices(e);
          if(continueGame){ //only continue game if no player has won or tied
          this.changePlayer();
        }
      },

      changePlayer: function () {
        components.currentPlayer.ref.className = 'players';
        if(components.currentPlayer === components.players.player1){
          components.currentPlayer = components.players.player2;
        } else {
          components.currentPlayer = components.players.player1;
        }
        components.currentPlayer.ref.className += " active";
        if(components.currentPlayer === components.players.player2){
          computer.playTurn();
        }
      },

      updatePlayerChoices: function(e, compChoice){ //keep track of each player's moves
        for(let i = 0; i < components.gameBoxes.children.length; i++){
          if(components.currentPlayer === components.players.player1){
            if(components.gameBoxes.children[i] === e.target){
              components.currentPlayer.plays.push(i);
            }
          } else {
            if(components.gameBoxes.children[i] === compChoice){
              components.currentPlayer.plays.push(i);
            }
          }
        }
        let continueGame = this.checkForWin(); //check if game is won/tied
        return continueGame;
      },

      checkForWin: function() {
        let state = null;
        let continueGame = true;
        for(let i = 0; i < components.winningCombos.length; i++){
          //check if current player has 3 symbols in a row
          let win = components.winningCombos[i].every((val) => components.currentPlayer.plays.includes(val));
          if(win){
            state = 'Winner';
            view.displayEndScreen(state);
            continueGame = false;
            return;
          }
        } //check if game board is full with no winner
        if(components.selected.length === components.gameBoxes.children.length){
          state = "It's a Tie!";
          view.displayEndScreen(state);
          continueGame = false
        }
        return continueGame;
      },

      //-------------------------------------------------------------

      createEndScreen: function(state) {
        components.gameBoard.style.display = 'none';
        if(state === 'Winner'){
          components.endDiv.className = `screen screen-win screen-win-${components.currentPlayer.code}`;
          components.endDiv.innerHTML = `<header><h1>Tic Tac Toe</h1><p class="message">${components.currentPlayer.name} Wins!</p><a href="#" class="button">New Game</a></header>`;
        } else if(state === "It's a Tie!"){
          components.endDiv.className = `screen screen-win screen-win-tie`;
          components.endDiv.innerHTML = `<header><h1>Tic Tac Toe</h1><p class="message">${state}</p><a href="#" class="button">New Game</a></header>`;
        }
        components.endDiv.id = 'finish';
        return components.endDiv;
      },

      resetGame: function() {
        components.players.player1.ref.className = 'players';
        components.players.player2.ref.className = 'players';
        components.currentPlayer = null;
        components.players.player1.name = "Player 1";
        for(let i = 0; i < components.gameBoxes.children.length; i++){
          components.gameBoxes.children[i].className = 'box';
        }
        components.players.player1.plays = [];
        components.players.player2.plays = [];
        components.players.player1.ref.removeChild(components.players.player1.ref.lastChild);
        components.players.player2.ref.removeChild(components.players.player2.ref.lastChild);
        this.beginGame();
      },

      // create delay to simulate computer thinking
      delay: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },

      beginGame: function() {
        view.renderGameScreen();
      }
    };

    const view = {
      renderStartScreen: function() {
        document.body.appendChild(controller.createStartPage());
        document.body.className = "screen screen-start";
        components.gameBoard.style.display = "none";
        this.setEventListeners();
      },

      setEventListeners: function() {
        components.startButton.addEventListener('click', () => view.renderGameScreen());
        components.gameBoxes.addEventListener('mouseover', e => {
          if (e.target.classList.contains('selected')) {
            return;
          } else {
            if(components.currentPlayer === components.players.player1){
              e.target.style.backgroundImage = components.currentPlayer.img;
            }
          }
        });
        components.gameBoxes.addEventListener('mouseout', e => e.target.style.backgroundImage = "");
        components.gameBoxes.addEventListener("click", e => {
            if(components.currentPlayer === components.players.player1){
              if (e.target.classList.contains('selected')){
                return;
              } else {
                controller.playTurn(e);
              }
            }
            components.gameBoard.style.display = "";
        });
      },

      renderGameScreen: function () {
        document.body.className = '';
        if(document.body.children.length === 3){
          document.body.removeChild(document.body.children[2]);
        }
        components.gameBoard.style.display = '';
        components.currentPlayer = components.players.player1;
        components.currentPlayer.ref.className += " active";
        if(components.userInput.value){
          components.players.player1.name = components.userInput.value;
        }
        controller.createPlayerNames();
      },

      renderTurn: function (e, currentPlayer, computerMove) {
        if(currentPlayer === components.players.player1){
          e.target.className += " box-filled-1 selected";
        } else {
          computerMove.className += " box-filled-2 selected";
        }
      },

      displayEndScreen: function (state) {
        document.body.appendChild(controller.createEndScreen(state));
        components.endDiv.addEventListener('click', () => controller.resetGame());
        return;
      }
    };
    view.renderStartScreen();
})();
