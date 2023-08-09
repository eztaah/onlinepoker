//#region //////////////////////////// INITIALIZATION ///////////////////////////

/******* init *******/
const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 4000;
const socketio = require('socket.io');
const { stringify } = require('querystring');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, "public")));
server.listen(PORT);


/******* variables *******/
const sameUsernameCount = {
    case1 : {
        username : null,
        number : 2
    },
    case2 : {
        username : null,
        number : 2
    },
};
const devMode = {
    activated : false,
    controlBots : false,
    chooseCards : false
};
const connectionsArray = [null, null, null, null, null];
var gameover = false;
var continuePermission = true;

const data = {
    currentPeriod : 'lobby',
    currentPhase : null,

    indexDealer : Math.round(4*Math.random()),
    indexSB : null,
    indexBB : null,
    indexCurrentPlayer : null,

    callToFollow : null,
    pot : 0,
    buttonsStatus : null,

    cardsMiddle : [],

    player0 : {
        connected : false,
        status : null,
        name : '',
        type : null,
        hand : [],
        handRank : null,
        role : null,
        tokensAvailable : 10000,
        bet : 0,
    },
    player1 : {
        connected : false,
        status : null,
        name : '',
        type : null,
        hand : [],
        handRank : null,
        role : null,
        tokensAvailable : 10000,
        bet : 0,
    },
    player2 : {
        connected : false,
        status : null,
        name : '',
        type : null,
        hand : [],
        handRank : null,
        role : null,
        tokensAvailable : 10000,
        bet : 0,
    },
    player3 : {
        connected : false,
        status : null,
        name : '',
        type : null,
        hand : [],
        handRank : null,
        role : null,
        tokensAvailable : 10000,
        bet : 0,
    },
    player4 : {
        connected : false,
        status : null,
        name : '',
        type : null,
        hand : [],
        handRank : null,
        role : null,
        tokensAvailable : 10000,
        bet : 0,
    },
};


/******* functions *******/
function bet(who, amount) {
    data[who].bet += amount;
    data[who].tokensAvailable -= amount;
    data.pot += amount;
};
function countPlayersConnected() {
    let x = 0;
    for(let i=0 ; i<5 ; i++) {
        if(data[`player${i}`].connected) {
            x++;
        };
    };
    return x;
};
function countHumansConnected() {
    let x = 0;
    for(let i=0 ; i<5 ; i++) {
        if((data[`player${i}`].connected) && (data[`player${i}`].type == 'human')) {
            x++ ;
        };
    };
    return x;
};

//#endregion //////////////////////////////////////////////////////////////////





io.on('connection', socket => {

    //#region //////////////////////// CONNECTION INITIALIZATION ///////////////////////

    /******* require *******/
    const getHandRank = require('./js/cards').f1;
    const findWinner = require('./js/cards').f2;
    const descisionMakingBot = require('./js/bots');


    /******* functions *******/
    function playersCanPlayEvent() {
        if(data.currentPeriod == 'game') {
            let amountToSpend2 = data.callToFollow - data[`player${data.indexCurrentPlayer}`].bet;
            if (data[`player${data.indexCurrentPlayer}`].tokensAvailable - amountToSpend2 <= 0) {
                data.buttonsStatus = 'fold-allIn';
            }
            else if(amountToSpend2 == 0) {
                data.buttonsStatus = 'fold-check-bet';
            }
            else if((data[`player${data.indexCurrentPlayer}`].tokensAvailable - amountToSpend2 - 1000  < 0) && (data[`player${data.indexCurrentPlayer}`].tokensAvailable - amountToSpend2 > 0)) {
                data.buttonsStatus = 'fold-call-allIn';
            }        
            else {
                data.buttonsStatus = 'fold-call-raise';
            };
            if(data[`player${data.indexCurrentPlayer}`].type == 'human') {
                socket.broadcast.emit('players-can-play', data);
                socket.emit('players-can-play', data);
            } else {
                if((devMode.activated) && (devMode.controlBots)) {
                    socket.broadcast.emit('control-bots', data);
                    socket.emit('control-bots', data);
                } else {
                    setTimeout(function() {
                        let choice = descisionMakingBot(data);
                        pressButton(choice, 1000);
                    }, 2000);
                };
            };
        };
        
    };
    function pressButton(choice, value) {

        if(choice == 'fold') {
            data[`player${data.indexCurrentPlayer}`].status = 'fold';
        }

        else if(choice == 'callcheck') {
            let amountToSpend = data.callToFollow - data[`player${data.indexCurrentPlayer}`].bet;

            // check if the player can bet
            if(data[`player${data.indexCurrentPlayer}`].tokensAvailable - amountToSpend <= 0) {
                bet(`player${data.indexCurrentPlayer}`, data[`player${data.indexCurrentPlayer}`].tokensAvailable);
                data[`player${data.indexCurrentPlayer}`].status = 'allIn';

            } else {
                // update data
                if((data.buttonsStatus == 'fold-call-raise') || (data.buttonsStatus == 'fold-call-allIn')) {
                    data[`player${data.indexCurrentPlayer}`].status = 'call';
                } 
                else if(data.buttonsStatus == 'fold-allIn') {
                    data[`player${data.indexCurrentPlayer}`].status = 'allIn';
                } else {
                    data[`player${data.indexCurrentPlayer}`].status = 'check';
                };
                
                // bet
                bet(`player${data.indexCurrentPlayer}`, amountToSpend);
            };
        }

        else if(choice == 'raisebet') {

            // clear all the status
            for(let i=0 ; i<5 ; i++) {
                if(((data[`player${i}`].status != 'fold') && (data[`player${i}`].status != 'allIn')) && (data[`player${i}`].connected)) {
                    data[`player${i}`].status = null;
                };
            };

            // update data
            if((data.buttonsStatus == 'fold-call-allIn') || (data.buttonsStatus == 'fold-allIn')) {
                data[`player${data.indexCurrentPlayer}`].status = 'allIn';
            } 
            else if(data.buttonsStatus == 'fold-check-bet') {
                data[`player${data.indexCurrentPlayer}`].status = 'bet';
            } else {
                data[`player${data.indexCurrentPlayer}`].status = 'raise';
            };

            // manage the case 'all-in with the range bar'
            if(data[`player${data.indexCurrentPlayer}`].tokensAvailable - value <= 0) {
                data[`player${data.indexCurrentPlayer}`].status = 'allIn';
            };

            // check if the player can bet
            ///////////// remove that when descisionmaking bot will check that
            if(data[`player${data.indexCurrentPlayer}`].type == 'bot') {
                let amountToSpend = data.callToFollow + 1500 - data[`player${data.indexCurrentPlayer}`].bet;

                // check if the player can bet
                if(data[`player${data.indexCurrentPlayer}`].tokensAvailable - amountToSpend <= 0) {
                    bet(`player${data.indexCurrentPlayer}`, data[`player${data.indexCurrentPlayer}`].tokensAvailable);
                    data[`player${data.indexCurrentPlayer}`].status = 'allIn';
                    data.callToFollow = data[`player${data.indexCurrentPlayer}`].bet;

                } else {
                    // update data
                    if((data.buttonsStatus == 'fold-call-raise') || (data.buttonsStatus == 'fold-call-allIn')) {
                        data[`player${data.indexCurrentPlayer}`].status = 'raise';
                    } 
                    else if(data.buttonsStatus == 'fold-allIn') {
                        data[`player${data.indexCurrentPlayer}`].status = 'allIn';
                    } else {
                        data[`player${data.indexCurrentPlayer}`].status = 'bet';
                    };
                    
                    // bet
                    bet(`player${data.indexCurrentPlayer}`, amountToSpend);
                    data.callToFollow = data[`player${data.indexCurrentPlayer}`].bet;
                };
            } else {
                // bet
                bet(`player${data.indexCurrentPlayer}`, value);
                data.callToFollow = data[`player${data.indexCurrentPlayer}`].bet;
            };
        };

        // check if the turn is finished
        checkEndPhase();

        // Emit the event to continue
        if(data.currentPhase != 'end') {
            playersCanPlayEvent();
        };
    };

    //#endregion //////////////////////////////////////////////////////////////////





    //#region //////////////////////// GAME LOGIC ///////////////////////

    /******* start the game *******/
    function startGame() {
        // populate the connection list with bots
        let x = 1
        for(let i=0 ; i<5 ; i++) {
            if(data[`player${i}`].connected == false) {
                connectionsArray[i] = false
                data[`player${i}`].connected = true
                data[`player${i}`].type = 'bot'
                data[`player${i}`].name = 'bot ' + String(x)
                x += 1
            }
        }

        // change the current period
        data.currentPeriod = 'game'
        gameover = false

        // init new round
        initNewRound()

    }


    /******* init a new round *******/
    function initNewRound() {

        /******** card management ********/

        // all cards
        const allCards = ['2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', 'Js', 'Qs', 'Ks', 'As', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'Jc', 'Qc', 'Kc', 'Ac', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', 'Jd', 'Qd', 'Kd', 'Ad', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'Jh', 'Qh', 'Kh', 'Ah']

        // random sort
        allCards.sort(() => 0.5 - Math.random())


        // distribution
        if(devMode.chooseCards) {
            data.cardsMiddle = ['2c', '2s', '2h', 'Jd', 'Jd']
            data.player0.hand = ['Jd', 'Jd']
            data.player1.hand = ['Jd', 'Jd']
            data.player2.hand = ['Jd', 'Jd']
            data.player3.hand = ['4h', '5h']
            data.player4.hand = ['4c', '5c']
        } else {
            let x = 0
            for(let i=0 ; i<5 ; i++) {
                data[`player${i}`].hand.push(allCards[x], allCards[x+1])
                x += 2
                data.cardsMiddle.push(allCards[10+i])
            }
        }


        /******** define roles ********/

        const tabIndex = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]

        // count the number of players connected
        let numberPlayersConnected = countPlayersConnected()

        // increase the indexDealer
        if(data.indexDealer == 4) {
            data.indexDealer = 0
        } else {
            data.indexDealer++
        }
        while(data[`player${data.indexDealer}`].connected == false) {
            if(data.indexDealer == 4) {
                data.indexDealer = 0
            } else {
                data.indexDealer ++
            }
        }
        data[`player${data.indexDealer}`].role = 'dealer'

        // define SB
        data.indexSB = tabIndex[data.indexDealer + 1]
        while(data[`player${data.indexSB}`].connected == false) {
            if(data.indexSB == 4) {
                data.indexSB = 0
            } else {
                data.indexSB ++
            }
        }
        data[`player${data.indexSB}`].role = 'SB'

        // define BB
        if(numberPlayersConnected <= 2) {
            data.indexBB = null
        } else {
            data.indexBB = tabIndex[data.indexSB + 1]
            while(data[`player${data.indexBB}`].connected == false) {
                if(data.indexBB == 4) {
                    data.indexBB = 0
                } else {
                    data.indexBB ++
                }
            }
            data[`player${data.indexBB}`].role = 'BB'
        }

        // define current player
        if(numberPlayersConnected <= 3) {
            data.indexCurrentPlayer = data.indexDealer
        } else {
            data.indexCurrentPlayer = tabIndex[data.indexBB + 1]
            while(data[`player${data.indexCurrentPlayer}`].connected == false) {
                if(data.indexCurrentPlayer == 4) {
                    data.indexCurrentPlayer = 0
                } else {
                    data.indexCurrentPlayer ++
                }
            }
        }
        data[`player${data.indexCurrentPlayer}`].status = 'currentPlayer'
        


        /******** bet management ********/

        // bet required SB
        if(data[`player${data.indexSB}`].tokensAvailable - 500 <= 0) {
            data[`player${data.indexSB}`].status = 'allIn'
            bet(`player${data.indexSB}`, data[`player${data.indexSB}`].tokensAvailable)
        } else {
            bet(`player${data.indexSB}`, 500)
        }

        // bet required BB
        if(data.indexBB != null) {
            if(data[`player${data.indexBB}`].tokensAvailable - 1000 <= 0) {
                data[`player${data.indexBB}`].status = 'allIn'
                bet(`player${data.indexBB}`, data[`player${data.indexBB}`].tokensAvailable)
            } else {
                bet(`player${data.indexBB}`, 1000)
            }
        }

        // set up call to follow
        if(data.indexBB == null) {
            data.callToFollow = 500
        } else {
            data.callToFollow = 1000
        }
        

        /******** change actual period and send event ********/
        data.currentPhase = 'preflop'
        data.buttonsStatus = 'fold-call-raise'


        // update hand ranking
        for(let i=0 ; i<5; i++) {
            if(data[`player${i}`].connected) {
                data[`player${i}`].handRank = getHandRank(data, i);
            };
        };

        playersCanPlayEvent()
    }

    
    /******* finish the round *******/
    function finishRound() {

        // find out who are the winners
        let indexWinner = findWinner(data)

        // set 'winner' as current status
        for(let i=0 ; i<indexWinner.length ; i++) {
            data[`player${indexWinner[i]}`].status = 'winner'
        }

        // check if the game is finished
        checkEndGame()

        // if not, start a new round
        if(gameover == false) {


            // Start an new round
            setTimeout( function() {
                // clean data
                for(let i=0 ; i<5 ; i++) {
                    data[`player${i}`].status = null
                    data[`player${i}`].role = null
                    data[`player${i}`].hand = []
                }
                data.cardsMiddle = []

                // give all the pot to the winners

                for(let i=0 ; i<indexWinner.length ; i++) {
                data[`player${indexWinner[i]}`].tokensAvailable += Math.round(data.pot/indexWinner.length)
                }
                data.pot = 0


                // verifiy if the personn who have 0 token is not the last connected player
                if(countHumansConnected() == 1) {
                    for(let i=0 ; i<5 ; i++) {
                        if((data[`player${i}`].connected) && (data[`player${i}`].tokensAvailable == 0) && (data[`player${i}`].type == 'human')) {
                            continuePermission = false
                            setTimeout(function() {
                                endTheGame()
                            }, 3000)
                        }
                    }
                }

                if(continuePermission) {
                    // remove people if they have 0 token
                    for(let i=0 ; i<5 ; i++) {
                        if((data[`player${i}`].tokensAvailable == 0) && (data[`player${i}`].connected)) {
                            data[`player${i}`].connected = false
                            data[`player${i}`].type = null
                            data[`player${i}`].hand = []
                            data[`player${i}`].role = null
                            data[`player${i}`].tokensAvailable = 0
                            data[`player${i}`].status = null
                            data[`player${i}`].handRank = null
                            socket.emit('spectator-mode', [i, data])
                            socket.broadcast.emit('spectator-mode', [i, data])
                        }
                    }

                    // manage if the last player disconnect
                    let GoToLobby = true;
                    for(let i=0 ; i<5 ; i++) {
                        if((data[`player${i}`].connected) && (data[`player${i}`].type == 'human')) {
                            GoToLobby = false;
                        };
                    };
                    if(GoToLobby) {
                        endTheGame()
                    };


                    // manage if the game is full of players and the last one disconnects
                    if(countPlayersConnected() == 1) {
                        endTheGame()
                    }

                    // init new round
                    initNewRound()
                }

            }, 3000)
        }

    }


    /******* check end phase *******/
    function checkEndPhase() {

        // count the number of players connected and folding
        let numberPlayersDisconnected = 5 - countPlayersConnected()
        let numberPlayersFold = 0
        for(let i=0 ; i<5 ; i++) {
            if(data[`player${i}`].status == 'fold') {
                numberPlayersFold++
            }
        }
        // Check if the phase is finished
        let goToTheNextPhase = true
        for(let i=0 ; i<5 ; i++) {
            if((data[`player${i}`].status == null) && (data[`player${i}`].connected)) {
                goToTheNextPhase = false
            }
        }
        if((countPlayersConnected() >=3)) {
            // finsih the round if all of the other players are folding or allIn
            if(numberPlayersFold == 4-numberPlayersDisconnected) {
                data.currentPhase = 'river'
                goToTheNextPhase = true
            };
        } else {

            // manage the case (2 players remaining and one of them fold)
            for(let i=0 ; i<5 ; i++) {
                if((data[`player${i}`].status == 'fold')) {
                    data.currentPhase = 'river'
                    goToTheNextPhase = true 
                }
            }
        }

        /***************** if finished *****************/

        if(goToTheNextPhase) {

            // reset bet 
            for(let i=0 ; i<5 ; i++) {
                data[`player${i}`].bet = 0
            }

            // manage bug with 5 allIn, fold, disconnected
            let numberAllInFoldDisconnectedPlayers = 0;
            for(let i=0 ; i<5 ; i++) {
                if((data[`player${i}`].status == 'allIn') || (data[`player${i}`].status == 'fold') || (data[`player${i}`].connected == false)) {
                    numberAllInFoldDisconnectedPlayers++
                }
            }
            if(numberAllInFoldDisconnectedPlayers >= countPlayersConnected()) {
                data.currentPhase = 'river'
                goToTheNextPhase = true 
            }


            // manage bug with allIn end game
            if(countPlayersConnected() <= 2) {
                for(let i=0 ; i<5 ; i++) {
                    if((data[`player${i}`].status == 'allIn') && (data[`player${i}`].bet == 0)) {
                        data.currentPhase = 'river'
                        goToTheNextPhase = true 
                    }
                }
            }

            // Remove all status data without fold
            for(let i=0 ; i<5 ; i++) {
                if(((data[`player${i}`].status != 'fold') && (data[`player${i}`].status != 'allIn')) && (data[`player${i}`].connected)) {
                    data[`player${i}`].status = null
                }
            }

            // Reset callToFollow
            data.callToFollow = 0

            // Change the current phase
            if(data.currentPhase == 'preflop') {
                data.currentPhase = 'flop'
            } 
            else if(data.currentPhase == 'flop') {
                data.currentPhase = 'turn'
            }
            else if(data.currentPhase == 'turn') {
                data.currentPhase = 'river'
            }
            else if(data.currentPhase == 'river') {
                data.currentPhase = 'end'
                finishRound()
            }


            // define SB as the current player
            if((data.currentPhase != 'end') && (data.currentPeriod != 'lobby')) {
                data.indexCurrentPlayer = data.indexSB
                while(((data[`player${data.indexCurrentPlayer}`].status == 'fold') || (data[`player${data.indexCurrentPlayer}`].status == 'allIn')) || (data[`player${data.indexCurrentPlayer}`].connected == false) ) {
                    if(data.indexCurrentPlayer == 4) {
                        data.indexCurrentPlayer = 0
                    } else {
                        data.indexCurrentPlayer += 1
                    }
                }
                data[`player${data.indexCurrentPlayer}`].status = 'currentPlayer'
            }

            // update hand ranking
            if((data.currentPhase != 'end') && (data.currentPeriod != 'lobby')) {
                for(let i=0 ; i<5; i++) {
                    if(data[`player${i}`].connected) {
                        data[`player${i}`].handRank = getHandRank(data, i);
                    };
                };
            }

        }




        /***************** if not finished *****************/

        else {
            // change index current player
            if(data.indexCurrentPlayer == 4) {
                data.indexCurrentPlayer = 0
            } else {
                data.indexCurrentPlayer += 1
            }
            while(((data[`player${data.indexCurrentPlayer}`].status == 'fold') || (data[`player${data.indexCurrentPlayer}`].status == 'allIn')) || (data[`player${data.indexCurrentPlayer}`].connected == false)) {
                if(data.indexCurrentPlayer == 4) {
                    data.indexCurrentPlayer = 0
                } else {
                    data.indexCurrentPlayer += 1
                }
            }
            data[`player${data.indexCurrentPlayer}`].status = 'currentPlayer'
        }
    }


    /******* chheck end game *******/
    function checkEndGame() {

        countAllInLosers = 0;
        for(let i=0 ; i<5 ; i++) {
            if((data[`player${i}`].tokensAvailable == 0) && (data[`player${i}`].connected)) {
                countAllInLosers++
            }
        }

        let gameAlreadyFinished = false


        // check 
        let numberPlayersConnected = countPlayersConnected()

        if(numberPlayersConnected - countAllInLosers < 1) {
            gameover = true
            setTimeout(function() {
                gameAlreadyFinished = true
                endTheGame()
            }, 3000)
            //endTheGame()
        }


        //check if only bots
        if(!gameAlreadyFinished) {
            let onlyBots = true
            for(let i=0 ; i<5 ; i++) {
                if(data[`player${i}`].type == 'human') {
                    onlyBots = false
                }
            }
            if(onlyBots) {
                endTheGame()
            }
        }



    }


    /******* end the game *******/
    function endTheGame() {

        // reset data
        data.currentPeriod = 'lobby'
        data.currentPhase = null
        data.indexDealer = Math.round(4*Math.random())
        data.indexSB = null
        data.indexBB = null
        data.callToFollow = null
        data.pot = 0
        data.cardsMiddle = []
        data.buttonsStatus = 'fold-call-raise'
        continuePermission = true


        // reset players data
        for(let i=0 ; i<5 ; i++) {
            data[`player${i}`].hand = []
            data[`player${i}`].handRank = null
            data[`player${i}`].role = null
            data[`player${i}`].tokensAvailable = 10000
            data[`player${i}`].bet = 0

            if(data[`player${i}`].type == 'bot') {

                data[`player${i}`].connected = false
                data[`player${i}`].status = null
                data[`player${i}`].name = ''
                data[`player${i}`].type = null
                connectionsArray[i] = null
            }

            if(data[`player${i}`].connected) {
                data[`player${i}`].status = 'unready'
            } else {
                data[`player${i}`].status = null
            }
        }

        // send event to reload the page
        socket.emit('reload-page')
        socket.broadcast.emit('reload-page')
    }

    //#endregion //////////////////////////////////////////////////////////////////





    //#region ///////////////////////////// EVENTS ////////////////////////////

    //#region ////////// CONNECTION //////////

    // Assign a number to the player
    let playerIndex = -1;

    //check if the game is in progress
    if(data.currentPeriod == 'lobby') {
        for (let i in connectionsArray) {
            if (connectionsArray[i] === null) {
            playerIndex = i;
            break;
            };
        };
        connectionsArray[playerIndex] = false;
    };

    if(playerIndex != -1) {
        // Add 'connected' and 'human' to the data
        data[`player${playerIndex}`].connected = true;
        data[`player${playerIndex}`].status = 'unready';
        data[`player${playerIndex}`].type = 'human';
    };

    // Send the player his number
    socket.emit('player-number', [playerIndex, data]);
    //#endregion



    //#region ////////// DECONNECTION //////////
    socket.on('disconnect', () => {

        if(playerIndex != -1) {
            // Remove the player from the box
            connectionsArray[playerIndex] = null;

            // name
            if(data[`player${playerIndex}`].name.includes(sameUsernameCount.case1.username)) {
                sameUsernameCount.case1.number -= 1;
            };
            if(data[`player${playerIndex}`].name.includes(sameUsernameCount.case2.username)) {
                sameUsernameCount.case2.number -= 1;
            };

            // Remove informations from the data
            data[`player${playerIndex}`].connected = false;
            data[`player${playerIndex}`].type = null;
            data[`player${playerIndex}`].hand = [];
            data[`player${playerIndex}`].role = null;
            data[`player${playerIndex}`].tokensAvailable = 10000;
            data[`player${playerIndex}`].status = null;
            data[`player${playerIndex}`].name = null;
            data[`player${playerIndex}`].handRank = null;

            // CheckEndGame
            checkEndGame();

            // manage if the current player disconnect
            if((playerIndex == data.indexCurrentPlayer) && (gameover == false)) {
                if(data.currentPeriod != 'lobby') {
                    checkEndPhase();
                };
            
                // Emit the event to continue
                if(data.currentPhase != 'end') {
                    playersCanPlayEvent();
                };
            };

            // manage if the last player disconnect
            let GoToLobby = true;
            for(let i=0 ; i<5 ; i++) {
                if((data[`player${i}`].connected) && (data[`player${i}`].type == 'human')) {
                    GoToLobby = false;
                };
            };
            if(GoToLobby) {
                endTheGame()
            };

            // manage if the game is full of players and the last one disconnects
            if(countPlayersConnected() == 1) {
                endTheGame();
            };
        };
    });
    //#endregion



    //#region ////////// USERNAME LISTENING //////////
    socket.on('transfer-username', array => {
        let playerIndex = array[0];
        let username = array[1];

        // check if the username already exist
        for(let i=0 ; i<5 ; i++) {
            if(data[`player${i}`].name == username) {
                if((sameUsernameCount.case1.username == null) || (sameUsernameCount.case1.username == username)) {
                    sameUsernameCount.case1.username = username;
                    username += ' ' + String(sameUsernameCount.case1.number);
                    sameUsernameCount.case1.number += 1;
                }
                else if((sameUsernameCount.case2.username == null) || (sameUsernameCount.case2.username == username)) {
                    sameUsernameCount.case2.username = username;
                    username += ' ' + String(sameUsernameCount.case2.number);
                    sameUsernameCount.case2.number += 1;
                };
            };
        };
        data[`player${playerIndex}`].name = username;
    });
    //#endregion



    //#region ////////// READY LISTENING //////////
    socket.on('player-ready', indexPlayerReady => {
        if(data.currentPeriod == 'lobby') {
            // update data
            if(data[`player${indexPlayerReady}`].status == 'unready') {
                data[`player${indexPlayerReady}`].status = 'ready';
            } else {
                data[`player${indexPlayerReady}`].status = 'unready';
            };
            
            // Check if all players are ready
            var okForStart = true;
            for(let i=0 ; i<5 ; i++) {
                if((data[`player${i}`].connected == true) && (data[`player${i}`].status != 'ready')) {
                    okForStart = false;
                };
            };
            if(okForStart == true) {
                // reset status
                for(let i=0 ; i<5 ; i++) {
                    data[`player${i}`].status = null;
                };
                startGame();
            };
        };
    });
    //#endregion



    //#region ////////// PLAYER DESCISION LISTENING //////////
    socket.on('currentPlayer-descision', array => {
        choice = array[0];
        let value;

        if((array[1] == 'bot') && (choice == 'raisebet')) {

            amountToSpend = data.callToFollow - data[`player${data.indexCurrentPlayer}`].bet;

            if(data[`player${data.indexCurrentPlayer}`].tokensAvailable - amountToSpend - 1000 <= 0) {
                value = data[`player${data.indexCurrentPlayer}`].tokensAvailable;
                data[`player${data.indexCurrentPlayer}`].status = 'allIn';
            } else {
                // bet
                value = amountToSpend + 1000;
            };
        } else {
            value = array[1];
        };

        pressButton(choice, value);
    });
    //#endregion



    //#region ////////// DATA LOG LISTENING //////////
    socket.on('log-data', () => {
        console.log('.');
        console.log('.');
        console.log('///////////////////////////////////////');
        console.log(data);
    });
    //#endregion

    //#endregion //////////////////////////////////////////////////////////////////



    /******* send data to the players *******/
    setInterval(function() {
        socket.emit('transfer-data', data);
    },50);
});