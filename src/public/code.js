//#region //////////////////////////// INITIALIZATION ///////////////////////////

/******* variables *******/
const devMode = false;
let permissionControlBots = true;
let cond1 = true;
let cond2 = true;
let oldlistConnection = [true, true, true, true, true];
let listConnection = [true, true, true, true, true];
let spectatorMode = false;
let eventButtonsStatus = false;
let myPlayerIndex;
let permissionButtons = false;
const tab = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
const dataPositions = {
    Area0 : {
        div : {
            left : '310',
            top : '340'
        },
        currentStatus : {
            left : '-7',
            top : '61'
        },
        dealerToken : {
            left : '280',
            top : '330'
        },
    },
    Area1 : {
        div : {
            left : '40',
            top : '280',
        },
        currentStatus : {
            left : '51',
            top : '43',
        },
        dealerToken : {
            left : '170',
            top : '320'
        },
    },
    Area2 : {
        div : {
            left : '70',
            top : '30',
        },
        currentStatus : {
            left : '51',
            top : '43',
        },
        dealerToken : {
            left : '200',
            top : '110'
        },
    },
    Area3 : {
        div : {
            left : '723',
            top : '30',
        },
        currentStatus : {
            left : '-3',
            top : '43',
        },
        dealerToken : {
            left : '660',
            top : '110'
        },
    },
    Area4 : {
        div : {
            left : '753',
            top : '280',
        },
        currentStatus : {
            left : '-3',
            top : '43',
        },
        dealerToken : {
            left : '700',
            top : '320'
        },
    },
};
const allCardsPosition = {
    '2s' : {left : '6', top : '6', bgSize : '792'}, '3s' : {left : '67', top : '6', bgSize : '792'}, '4s' : {left : '127', top : '5', bgSize : '792'}, '5s' : {left : '188', top : '4', bgSize : '792'}, '6s' : {left : '251', top : '5', bgSize : '792'}, '7s' : {left : '312', top : '5', bgSize : '798'}, '8s' : {left : '370', top : '6', bgSize : '796'}, '9s' : {left : '425', top : '6', bgSize : '792'}, '10s' : {left : '487', top : '5', bgSize : '792'}, 'Js' : {left : '550', top : '6', bgSize : '792'}, 'Qs' : {left : '610', top : '6', bgSize : '792'}, 'Ks' : {left : '677', top : '6', bgSize : '800'}, 'As' : {left : '732', top : '5', bgSize : '792'},
    '2c' : {left : '7', top : '92', bgSize : '792'}, '3c' : {left : '65', top : '91', bgSize : '792'}, '4c' : {left : '127', top : '91', bgSize : '792'}, '5c' : {left : '188', top : '90', bgSize : '792'}, '6c' : {left : '250', top : '90', bgSize : '792'}, '7c' : {left : '310', top : '92', bgSize : '792'}, '8c' : {left : '367', top : '92', bgSize : '792'}, '9c' : {left : '425', top : '91', bgSize : '792'}, '10c' : {left : '486', top : '91', bgSize : '792'},'Jc' : {left : '550', top : '91', bgSize : '792'}, 'Qc' : {left : '611', top : '93',bgSize : '792'}, 'Kc' : {left : '670', top : '93', bgSize : '792'}, 'Ac' : {left : '732', top : '93', bgSize : '792'}, 
    '2d' : {left : '8', top : '178', bgSize : '792'}, '3d' : {left : '65', top : '178', bgSize : '792'}, '4d' : {left : '127', top : '178', bgSize : '792'}, '5d' : {left : '188', top : '179', bgSize : '792'}, '6d' : {left : '250', top : '176', bgSize : '792'}, '7d' : {left : '310', top : '176', bgSize : '792'}, '8d' : {left : '367', top : '176', bgSize : '792'}, '9d' : {left : '425', top : '176', bgSize : '792'}, '10d' : {left : '487', top : '178', bgSize : '792'}, 'Jd' : {left : '550', top : '178', bgSize : '792'}, 'Qd' : {left : '611', top : '178',bgSize : '792'}, 'Kd' : {left : '672', top : '179', bgSize : '792'}, 'Ad' : {left : '732', top : '180', bgSize : '792'}, 
    '2h' : {left : '8', top : '261', bgSize : '792'},'3h' : {left : '65', top : '261', bgSize : '792'}, '4h' : {left : '127', top : '263', bgSize : '792'}, '5h' : {left : '188', top : '263', bgSize : '792'}, '6h' : {left : '250', top : '264', bgSize : '792'}, '7h' : {left : '311', top : '265', bgSize : '794'}, '8h' : {left : '368', top : '264', bgSize : '792'}, '9h' : {left : '427', top : '263', bgSize : '792'}, '10h' : {left : '487', top : '263', bgSize : '792'}, 'Jh' : {left : '550', top : '264', bgSize : '792'}, 'Qh' : {left : '611', top : '265', bgSize : '792'}, 'Kh' : {left : '672', top : '264', bgSize : '792'}, 'Ah' : {left : '740', top : '268', bgSize : '800'},
};
const playersPlacements = {
    0 : null,
    1 : null,
    2 : null,
    3 : null,
    4 : null
};


//#region /******* css functions *******/

//position
function change_posLeft(element, input) {
    document.getElementById(element).style.left = String(input) + 'px';
};
function change_posTop(element, input) {
    document.getElementById(element).style.top = String(input) + 'px';
};
function change_pos(element, leftInput, topInput) {
    change_posLeft(element, leftInput);
    change_posTop(element, topInput);
};

//background
function change_bg(element, input) {
    document.getElementById(element).style.background = input;
};

function change_bgPos(element, leftInput, topInput) {
    document.getElementById(element).style.backgroundPosition = String(leftInput) + 'px ' + String(topInput) + 'px';
};
function change_bgColor(element, input) {
    document.getElementById(element).style.backgroundColor = input;
};
function change_bgImage(element, input) {
    document.getElementById(element).style.backgroundImage = input;
};

//other
function change_color(element, input) {
    document.getElementById(element).style.color = input;
};
function change_zI(element, input) {
    document.getElementById(element).style.zIndex = String(input);
};
function change_text(element, input) {
    document.getElementById(element).innerHTML = String(input);
};

//#endregion


/******* functions *******/
function verifyUsername() {
    const username = document.getElementById('textarea').value;
    if(username == '') {
        change_color('usernameNotValid', '#B21515');
    } else {
        change_color('usernameNotValid', 'white');
        play(username);
    };
};
function increaseSpecIndex() {
    do {
        if(myPlayerIndex == 4) {
            myPlayerIndex = 0;
        } else {
            myPlayerIndex++;
        }
    } while(listConnection[myPlayerIndex] == false)
    for(let i=0 ; i<5 ; i++) {
        playersPlacements[i] = 'Area' + String(tab[5 + (i - myPlayerIndex)]);
    };
};
function decreaseSpecIndex() {
    do {
        if(myPlayerIndex == 0) {
            myPlayerIndex = 4;
        } else {
            myPlayerIndex--;
        }
    } while (listConnection[myPlayerIndex] == false)
    for(let i=0 ; i<5 ; i++) {
        playersPlacements[i] = 'Area' + String(tab[5 + (i - myPlayerIndex)]);
    };
};
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
};


/******* init *******/
document.getElementById('playButton').addEventListener('click', verifyUsername);
if(devMode) {
    play('dev');
};


//#endregion //////////////////////////////////////////////////////////////////
    





function play(username) {


    //#region ////////////////////////// PLAY INITIALIZATION /////////////////////////

    /******* set the game page *******/
    document.getElementById('playButton').removeEventListener('click', verifyUsername);
    change_zI('homepageDiv', 0);
    document.getElementById('foldButton').addEventListener('click', fold);
    document.getElementById('callcheckButton').addEventListener('click', callcheck);
    document.getElementById('raisebetButton').addEventListener('click', raisebet);
    document.getElementById('gameDiv').addEventListener('click', sendReadyEvent);


    /******* send an event to the server *******/
    const socket = io();


    /******* buttons functions *******/
    function fold() {
        if(permissionButtons) {
            socket.emit('currentPlayer-descision', ['fold', null]);
            permissionButtons = false;
            change_zI('raiseDiv','0');
            change_text('raisebetButton', 'raise');
            change_pos('raiseDiv', 380, 150);
            eventButtonsStatus = false;
        };
    };
    function callcheck() {
        if(permissionButtons) {
            socket.emit('currentPlayer-descision', ['callcheck', null]);
            permissionButtons = false;
            change_zI('raiseDiv','0');
            change_text('raisebetButton', 'raise');
            change_text('callcheckButton', 'call');
            change_pos('raiseDiv', 380, 150);
            eventButtonsStatus = false;
        };
    };
    function raisebet() {
        if(permissionButtons) {
            if(cond1) {
                change_zI('raiseDiv','4');
                change_text('raisebetButton', 'confirm');
                if(getDeviceType() == 'mobile') {
                    change_pos('raiseDiv', 775, 315);
                    document.getElementById('raiseDiv').style.border = '2px solid black';
                } else {
                    change_pos('raiseDiv', 775, 400);  
                    document.getElementById('raiseDiv').style.border = 'none';
                };
                eventButtonsStatus = true;
            } else {
                change_zI('raiseDiv','0');
                change_text('raisebetButton', 'raise');
                change_pos('raiseDiv', 380, 150);
                eventButtonsStatus = false;
                let value;
                if((dataServer.buttonsStatus == 'fold-call-allIn') || (dataServer.buttonsStatus == 'fold-allIn')) {
                    value = dataServer[`player${dataServer.indexCurrentPlayer}`].tokensAvailable;
                } else {
                    value = Number(document.getElementById('amountDiv').innerHTML);
                };
                socket.emit('currentPlayer-descision', ['raisebet', value]);
                permissionButtons = false;
            };
        };
    };
    function sendReadyEvent() {
        if(!spectatorMode) {
            socket.emit('player-ready', myPlayerIndex);
            document.getElementById('gameDiv').removeEventListener('click', sendReadyEvent);
        };
    };

    //#endregion //////////////////////////////////////////////////////////////////////





    //#region ////////////////////////// EVENTS /////////////////////////
    
    /******* get my player number *******/
    socket.on('player-number', array => {
        // get data
        myPlayerIndex = array[0];
        dataServer = array[1];

        // manage case 'game full'
        if(myPlayerIndex == -1) {
            do {
                myPlayerIndex = Math.round(4*Math.random());
            } while (dataServer['player' + myPlayerIndex].connected == false)
            spectatorMode = true;
        } else {
            spectatorMode = false;
            // send username
            socket.emit('transfer-username', [myPlayerIndex, username]);
        };
        
        // setup placement area
        for(let i=0 ; i<5 ; i++) {
            playersPlacements[i] = 'Area' + String(tab[5 + (i - myPlayerIndex)]);
        };
    });

    /******* specatator mode *******/
    socket.on('spectator-mode', array => {
        //get data
        index = array[0];
        dataServer = array[1];

        //code
        if(myPlayerIndex == index) {
            do {
                myPlayerIndex = Math.round(4*Math.random());
            } while (dataServer['player' + myPlayerIndex].connected == false)
            myPlayerIndex = Math.round(4*Math.random());
            spectatorMode = true;
        };
        
        // setup placement area
        for(let i=0 ; i<5 ; i++) {
            playersPlacements[i] = 'Area' + String(tab[5 + (i - myPlayerIndex)]);
        };
    });
    
    /******* manage devMode-controlbots *******/
    document.addEventListener('keydown', function(event) {
        if(permissionControlBots) {
            if(event.keyCode == 65) {
                socket.emit('currentPlayer-descision', ['fold', null]);
                permissionControlBots = false;
            };
            if(event.keyCode == 90) {
                socket.emit('currentPlayer-descision', ['callcheck', null]);
                permissionControlBots = false;
            };
            if(event.keyCode == 69) {
                socket.emit('currentPlayer-descision', ['raisebet', 'bot']);
                permissionControlBots = false;
            };
        };
    });

    /******* listen for player-can-play event *******/
    socket.on('players-can-play', data => {
        if(data.indexCurrentPlayer == myPlayerIndex) {
            permissionButtons = true;
        };
    });

    /******* listen for reload page event *******/
    socket.on('reload-page', () => {
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        };
    });

    /******* permission control bots *******/
    socket.on('control-bots', data => {
        permissionControlBots = true;
    });

    //******* send the event log-data *******/
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 68) {
            socket.emit('log-data');
        };
    });


    //#endregion //////////////////////////////////////////////////////////////////////
    
    
    
    
    
    //#region ////////////////////////// RECEIVE DATA /////////////////////////
    socket.on('transfer-data', dataServer => {
    

        //#region ////////// FUNCTIONS //////////
        function showCurrentStatus(index) {
            document.getElementById('profilePicture' + playersPlacements[index]).style.backgroundColor = 'white';
            change_zI('currentStatus' + playersPlacements[index], 3);
            change_pos('currentStatus' + playersPlacements[index], dataPositions[playersPlacements[index]].currentStatus.left, dataPositions[playersPlacements[index]].currentStatus.top);
            if(dataServer[`player${index}`].status == 'unready') {
                if(index == myPlayerIndex) {
                    document.getElementById('currentStatus' + playersPlacements[index]).style.width = '70px';
                } else {
                    document.getElementById('currentStatus' + playersPlacements[index]).style.width = '48px';
                };
            } else {
                if(index == myPlayerIndex) {
                    document.getElementById('currentStatus' + playersPlacements[index]).style.width = '65px';
                } else {
                    document.getElementById('currentStatus' + playersPlacements[index]).style.width = '43px';
                };
            };
        };
        function hideCurrentStatus(index) {
            change_bg('currentStatus' + playersPlacements[index], 'white');
            change_zI('currentStatus' + playersPlacements[index], 0);
            change_pos('currentStatus' + playersPlacements[index], '13', '38');
        };

        function allInFunction() {
            document.getElementById('bar').value = dataServer[`player${dataServer.indexCurrentPlayer}`].tokensAvailable;
        };
        function potFunction() {
            document.getElementById('bar').value = String(dataServer.pot);
        };
        function halfPotFunction() {
            document.getElementById('bar').value = String(dataServer.pot / 2);
        };
        //#endregion /////////////////////////////



        //#region ////////// DISPLAY PLAYERS //////////
        for(let i=0; i<5 ; i++) {
            if(dataServer[`player${i}`].connected) {
                change_pos('player' + playersPlacements[i], dataPositions[playersPlacements[i]].div.left, dataPositions[playersPlacements[i]].div.top);
                if(dataServer[`player${i}`].name != null) {  
                    change_text('name' + playersPlacements[i], dataServer[`player${i}`].name);
                }
                change_text('tokensInventory' + playersPlacements[i], dataServer[`player${i}`].tokensAvailable);
                change_zI('profilePicture' + playersPlacements[i], 2);
                change_zI('name' + playersPlacements[i], 3);
                change_zI('tokensInventory' + playersPlacements[i], 2);
            } else {
                change_pos('player' + playersPlacements[i], '397', '150');
                change_text('name' + playersPlacements[i], '');
                change_text('tokensInventory' + playersPlacements[i], '');
                change_zI('profilePicture' + playersPlacements[i], 0);
                change_zI('name' + playersPlacements[i], 0);
                change_zI('tokensInventory' + playersPlacements[i], 0);
            };
        };
        //#endregion ////////////////////////////////////
    
    

        //#region ////////// DISPLAY CURRENTS STATUS //////////
        for(let i=0; i<5 ; i++) {
            switch(dataServer[`player${i}`].status) {
                case 'unready':
                    change_bg('currentStatus' + playersPlacements[i], '#CD0000');
                    change_text('currentStatus' + playersPlacements[i], 'unready');
                    showCurrentStatus(i);
                    break;
                case 'ready':
                    change_bg('currentStatus' + playersPlacements[i], '#0B8405');
                    change_text('currentStatus' + playersPlacements[i], 'ready');
                    showCurrentStatus(i);
                    break;
    
                case 'fold':
                    change_bg('currentStatus' + playersPlacements[i], '#555555');
                    change_text('currentStatus' + playersPlacements[i], 'fold');
                    showCurrentStatus(i);
                    break;
                case 'allIn':
                    change_bg('currentStatus' + playersPlacements[i], '#CD0000');
                    change_text('currentStatus' + playersPlacements[i], 'all-in');
                    showCurrentStatus(i);
                    break;
                case 'raise':
                    change_bg('currentStatus' + playersPlacements[i], '#CD0000');
                    change_text('currentStatus' + playersPlacements[i], 'raise');
                    showCurrentStatus(i);
                    break
                case 'bet':
                    change_bg('currentStatus' + playersPlacements[i], '#CD0000');
                    change_text('currentStatus' + playersPlacements[i], 'bet');
                    showCurrentStatus(i);
                    break
                case 'call':
                    change_bg('currentStatus' + playersPlacements[i], '#EB6E00');
                    change_text('currentStatus' + playersPlacements[i], 'call');
                    showCurrentStatus(i);
                    break;
                case 'check':
                    change_bg('currentStatus' + playersPlacements[i], '#006CA2');
                    change_text('currentStatus' + playersPlacements[i], 'check');
                    showCurrentStatus(i);
                    break;
                case 'winner' : 
                    change_bg('currentStatus' + playersPlacements[i], '#78671B');
                    change_text('currentStatus' + playersPlacements[i], 'winner');
                    showCurrentStatus(i);
                    break;
    
                case 'currentPlayer' : 
                    document.getElementById('profilePicture' + playersPlacements[i]).style.backgroundColor = '#B4ECC5';
                    hideCurrentStatus(i);
                    break;
    
                default : 
                    document.getElementById('profilePicture' + playersPlacements[i]).style.backgroundColor = 'white';
                    hideCurrentStatus(i);
            };
        };
        //#endregion ////////////////////////////////////////////

    

        //#region ////////// DISPLAY BETS //////////
        for(let i=0; i<5 ; i++) {
            if(dataServer[`player${i}`].bet != 0) {
                change_zI('bet' + playersPlacements[i], 3);
                change_zI('tokenPicture' + playersPlacements[i], 3);
                change_text('bet' + playersPlacements[i], dataServer[`player${i}`].bet);
    
            } else {
                change_zI('bet' + playersPlacements[i], 0);
                change_zI('tokenPicture' + playersPlacements[i], 0);
                change_text('bet' + playersPlacements[i], '');
            };
        };
        //#endregion ///////////////////////////////
    


        //#region ////////// DISPLAY OTHER PLAYERS CARDS //////////
        for(let i=0; i<5 ; i++) {
            if(dataServer.currentPeriod == 'game') {
                for(let j=0 ; j<2 ; j++) {
                    if(dataServer[`player${i}`].connected) {
                        change_zI('card' + String(j) + playersPlacements[i], 2);
                        if((spectatorMode) || (dataServer.currentPhase == 'end')) {
                            if(dataServer[`player${i}`].hand.length == 0) {
                                change_bg('card' + String(j) + playersPlacements[i], "black");
                            } else {
                                change_bg('card' + String(j) + playersPlacements[i], "url('./assets/cards_panel.png')");
                
                                change_bgPos('card' + String(j) + playersPlacements[i],
                                String(-0.46 * Number(allCardsPosition[String(dataServer[`player${i}`].hand[j])].left)),
                                String(-0.46 * Number(allCardsPosition[String(dataServer[`player${i}`].hand[j])].top)));
                                
                                document.getElementById('card' + String(j) + playersPlacements[i]).style.backgroundSize = String(0.46 * Number(allCardsPosition[String(dataServer[`player${i}`].hand[j])].bgSize)) + 'px';
                            }
                        } else {
                            change_bg('card' + String(j) + playersPlacements[i], "black");
                        };
                    } else {
                        for(let j=0 ; j<2 ; j++) {
                            change_zI('card' + String(j) + playersPlacements[i], 0);
                            change_bg('card' + String(j) + playersPlacements[i], "black");
                        };
                    };
                };
            } else {
                for(let j=0 ; j<2 ; j++) {
                    change_zI('card' + String(j) + playersPlacements[i], 0)
                    change_bg('card' + String(j) + playersPlacements[i], "black")
                    change_zI('card' + String(j) + playersPlacements[i], 0)
                };
            };
        };
        //#endregion ///////////////////////////////////////



        //#region ////////// DISPLAY PROFILE PICTURES //////////
        for(let i=0; i<5 ; i++) {
             if(dataServer[`player${i}`].type == 'human') {
                document.getElementById('profilePicture' + playersPlacements[i]).style.backgroundImage = "url(./assets/profile_pictures/player.png)";
                document.getElementById('profilePicture' + playersPlacements[i]).style.backgroundSize = "100%";

            }
            else if(dataServer[`player${i}`].type == 'bot') {
                document.getElementById('profilePicture' + playersPlacements[i]).style.backgroundImage = "url(./assets/profile_pictures/bot.png)";
                document.getElementById('profilePicture' + playersPlacements[i]).style.backgroundSize = "100%";
            } else {
                document.getElementById('profilePicture' + playersPlacements[i]).style.backgroundColor = "white";
            };
        };
        //#endregion ///////////////////////////////////////
        


        //#region ////////// DISPLAY HINT MESSAGE //////////
        if((dataServer.currentPeriod == 'lobby') && (spectatorMode == false)) {
            change_zI('hintMessage', 2);
        } else {
            change_zI('hintMessage', 0);
        };
        //#endregion ///////////////////////////////////////


        //#region ////////// DISPLAY SPECTATOR MESSAGE //////////
        if(spectatorMode) {
            change_color('spectatorMessage', 'black');
        } else {
            change_color('spectatorMessage', 'white');
        };
        //#endregion ///////////////////////////////////////

    
    
        //#region ////////// DISPLAY MY CARDS //////////
        if((dataServer.currentPeriod == 'game') && (dataServer[`player${myPlayerIndex}`].connected)) {
            for(let i=0 ; i<2 ; i++) {
                change_zI('card' + String(i) + 'Area0', 2);
                if(dataServer[`player${myPlayerIndex}`].hand.length == 0) {
                    change_bg('card' + String(i) + 'Area0', "black");
                } else {
                    change_bg('card' + String(i) + 'Area0', "url('./assets/cards_panel.png')");
                    change_bgPos('card' + String(i) + 'Area0',
                    -allCardsPosition[String(dataServer[`player${myPlayerIndex}`].hand[i])].left,
                    -allCardsPosition[String(dataServer[`player${myPlayerIndex}`].hand[i])].top);
                    
                    document.getElementById('card' + String(i) + 'Area0').style.backgroundSize = String( allCardsPosition[String(dataServer[`player${myPlayerIndex}`].hand[i])].bgSize) + 'px';
                };
            };
        } else {
            for(let i=0 ; i<2 ; i++) {
                change_bg('card' + String(i) + 'Area0', "black");
                change_zI('card' + String(i) + 'Area0', 0);
            };
        };
        //#endregion ///////////////////////////////////////
    


        //#region ////////// DISPLAY BUTTONS //////////
        if((dataServer.currentPeriod == 'game') && (dataServer[`player${myPlayerIndex}`].connected) && (!spectatorMode)) {
            //display buttons
            change_bg('foldButton', 'black');
            change_bg('callcheckButton', 'black');
            change_bg('raisebetButton', 'black');
            document.getElementById('foldButton').style.cursor = 'pointer';
            document.getElementById('callcheckButton').style.cursor = 'pointer';
            document.getElementById('raisebetButton').style.cursor = 'pointer';
            if(getDeviceType() == 'mobile') {
                change_posTop('buttonsDiv', 470);
            } else {
                change_posTop('buttonsDiv', 555);
            };
    
            //button status
            if(dataServer.indexCurrentPlayer == myPlayerIndex) {
                if((dataServer.buttonsStatus == 'fold-call-raise') || (dataServer.buttonsStatus == 'fold-check-bet')) {
                    document.getElementById('foldButton').style.fontSize = "0.8rem";
                    document.getElementById('callcheckButton').style.fontSize = "0.8rem";
                    document.getElementById('raisebetButton').style.fontSize = "0.8rem";
                    document.getElementById('foldButton').style.cursor = 'cursor';
                    document.getElementById('callcheckButton').style.cursor = 'cursor';
                    document.getElementById('raisebetButton').style.cursor = 'cursor';
                };
                if(dataServer.buttonsStatus == 'fold-call-raise') {
                    change_text('callcheckButton', 'call');
                    if(document.getElementById('raisebetButton').innerHTML != 'confirm') {
                        change_text('raisebetButton', 'raise');
                    };
                };
                if(dataServer.buttonsStatus == 'fold-check-bet') {
                    change_text('callcheckButton', 'check');
                    if(document.getElementById('raisebetButton').innerHTML != 'confirm') {
                        change_text('raisebetButton', 'bet');
                    };
                };
                if(dataServer.buttonsStatus == 'fold-call-allIn') {
                    change_text('callcheckButton', 'call');
                    change_text('raisebetButton', 'all-in');
                };
                if(dataServer.buttonsStatus == 'fold-allIn') {
                    change_text('callcheckButton', 'all-in');
                    change_text('raisebetButton', '');
                };
            } else {
                document.getElementById('foldButton').style.fontSize = "0.7rem";
                document.getElementById('callcheckButton').style.fontSize = "0.7rem";
                document.getElementById('raisebetButton').style.fontSize = "0.7rem";
                document.getElementById('foldButton').style.cursor = 'default';
                document.getElementById('callcheckButton').style.cursor = 'default';
                document.getElementById('raisebetButton').style.cursor = 'default';
            };
        } else {
            change_bg('foldButton', 'white');
            change_bg('callcheckButton', 'white');
            change_bg('raisebetButton', 'white');
            document.getElementById('foldButton').style.cursor = 'default';
            document.getElementById('callcheckButton').style.cursor = 'default';
            document.getElementById('raisebetButton').style.cursor = 'default';
        };
        if(dataServer.buttonsStatus == 'fold-allIn') {
            document.getElementById('raisebetButton').removeEventListener('click', raisebet);
        } else {
            document.getElementById('raisebetButton').addEventListener('click', raisebet);
        };
        //#endregion ///////////////////////////////////////

    
    
        //#region ////////// DISPLAY MIDDLE CARDS //////////
        if(dataServer.currentPeriod == 'game') {
            for(let i=0 ; i<5 ; i++) {
                change_zI('middleCard' + String(i), 2);
            };
            switch(dataServer.currentPhase) {
                case 'preflop':
                    for(let i=0 ; i<5 ; i++) {
                        change_bg('middleCard' + String(i), "black");
                    };
                    break;
    
                case 'flop' :
                    for(let i=0 ; i<3 ; i++) {
                        change_bg('middleCard' + String(i), "url('./assets/cards_panel.png')");
                        change_bgPos('middleCard' + String(i), 
                        -0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].left), 
                        -0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].top));
                        document.getElementById('middleCard' + String(i)).style.backgroundSize = String(0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].bgSize)) + 'px';
                    };
                    break;
    
                case 'turn' :
                    for(let i=0 ; i<4 ; i++) {
                        change_bg('middleCard' + String(i), "url('./assets/cards_panel.png')");
                        change_bgPos('middleCard' + String(i), 
                        -0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].left), 
                        -0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].top));
                        document.getElementById('middleCard' + String(i)).style.backgroundSize = String(0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].bgSize)) + 'px';
                    };
                    break;
    
                case 'river' :
                case 'end':
                    for(let i=0 ; i<5 ; i++) {
                        change_bg('middleCard' + String(i), "url('./assets/cards_panel.png')");
                        change_bgPos('middleCard' + String(i), 
                        -0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].left), 
                        -0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].top));
                        document.getElementById('middleCard' + String(i)).style.backgroundSize = String(0.84 * Number(allCardsPosition[String(dataServer.cardsMiddle[i])].bgSize)) + 'px';
                    };
                    break;
            };
        } else {
            for(let i=0 ; i<5 ; i++) {
                change_zI('middleCard' + String(i), 0);
            };
        };
        //#endregion ///////////////////////////////////////
    
    
    
        //#region ////////// DISPLAY POT //////////
        if(dataServer.pot != 0) {
            change_zI('pot', 2);
            change_zI('tokensPilePicture', 2);
            change_text('pot', dataServer.pot);
        } else {
            change_zI('pot', 0);
            change_zI('tokensPilePicture', 0);
            change_text('pot', '');
        };
        //#endregion ///////////////////////////////////////
    

    
        //#region ////////// DISPLAY DEALER TOKEN //////////
        if(dataServer.currentPeriod == 'game') {
            change_zI('dealerToken', 2);
            change_pos('dealerToken', dataPositions[playersPlacements[dataServer.indexDealer]].dealerToken.left, dataPositions[playersPlacements[dataServer.indexDealer]].dealerToken.top);
        } else {
            change_zI('dealerToken', 0);
            change_pos('dealerToken', '435', '210');
        };
        //#endregion ///////////////////////////////////////
    
    
    
        //#region ////////// DISPLAY INFO HAND //////////
        if((dataServer.currentPeriod == 'game') && (dataServer[`player${myPlayerIndex}`].connected)) {
            if((dataServer[`player${myPlayerIndex}`].handRank.type == 'three of a kind') || (dataServer[`player${myPlayerIndex}`].handRank.type == 'four of a kind')) {
                document.getElementById('infoHand').style.fontSize = '0.44rem';
            } else {
                document.getElementById('infoHand').style.fontSize = '0.5rem';
            };
            change_text('infoHand', dataServer[`player${myPlayerIndex}`].handRank.type);
            change_zI('infoHand', 2);
            change_posTop('infoHand', '403');
        } else {
            change_zI('infoHand', 0);
            change_posTop('infoHand', '390');
            change_text('infoHand', '');
        };
        //#endregion ///////////////////////////////////////



        //#region ////////// DISPLAY INFO HAND WINNER //////////
        if(dataServer.currentPhase == 'end') {

            //get winner index
            let indexWinner;
            for(let i=0 ; i<5 ; i++) {
                if(dataServer[`player${i}`].status == 'winner') {
                    indexWinner = i;
                    break;
                };
            };
            change_zI('infoHandWinner', 2);
            change_text('infoHandWinner', dataServer[`player${indexWinner}`].handRank.type);
        } else {
            change_zI('infoHandWinner', 0);
            change_text('infoHandWinner', '');
        }


        //#endregion ///////////////////////////////////////



        //#region ////////// SPECTATOR MODE //////////
        if(spectatorMode) {
            let changeIndex = false;
            for(let i=0 ; i<5 ; i++) {
                if (oldlistConnection[i] != listConnection[i]) {
                    changeIndex = true;
                };
            };
            if(changeIndex) {
                decreaseSpecIndex();
                oldlistConnection = listConnection;
            };
            document.getElementById('rightSpectatorArrow').addEventListener('click', decreaseSpecIndex);
            document.getElementById('leftSpectatorArrow').addEventListener('click', increaseSpecIndex);
            change_bgImage('rightSpectatorArrow', "url(./assets/spectator_arrow.png)");   
            change_bgImage('leftSpectatorArrow', "url(./assets/spectator_arrow.png)"); 
        } else {
            document.getElementById('rightSpectatorArrow').removeEventListener('click', decreaseSpecIndex);
            document.getElementById('leftSpectatorArrow').removeEventListener('click', increaseSpecIndex);
            change_bgImage('rightSpectatorArrow', "");
            change_bgImage('leftSpectatorArrow', "");  
        };
        //#endregion ///////////////////////////////////////



        //#region ////////// DISPLAY RAISE BUTTON //////////
        if(dataServer.currentPeriod == 'game') {
            document.getElementById('bar').setAttribute('max', dataServer[`player${dataServer.indexCurrentPlayer}`].tokensAvailable);
            
            if(dataServer[`player${dataServer.indexCurrentPlayer}`].tokensAvailable -     (dataServer.callToFollow - dataServer[`player${dataServer.indexCurrentPlayer}`].bet + 1000) < 0) {
                document.getElementById('bar').setAttribute('min', dataServer[`player${dataServer.indexCurrentPlayer}`].tokensAvailable);     
            } else {
                document.getElementById('bar').setAttribute('min',
                dataServer.callToFollow - dataServer[`player${dataServer.indexCurrentPlayer}`].bet + 1000);
            }
            change_text('amountDiv', document.getElementById('bar').value);
        };
        //#endregion ///////////////////////////////////////



        //#region ////////////// OTHER //////////////

        /******* events listener *******/
        if(eventButtonsStatus) {
            document.getElementById('allInButton').addEventListener('click', allInFunction);
            document.getElementById('potButton').addEventListener('click', potFunction);
            document.getElementById('halfPotButton').addEventListener('click', halfPotFunction);
            document.getElementById('allInButton').style.cursor = 'pointer';
            document.getElementById('potButton').style.cursor = 'pointer';
            document.getElementById('halfPotButton').style.cursor = 'pointer';
        } else {
            document.getElementById('allInButton').removeEventListener('click', allInFunction);
            document.getElementById('potButton').removeEventListener('click', potFunction);
            document.getElementById('halfPotButton').removeEventListener('click', halfPotFunction);
            document.getElementById('allInButton').style.cursor = 'default';
            document.getElementById('potButton').style.cursor = 'default';
            document.getElementById('halfPotButton').style.cursor = 'default';
        };

        /******* update conditions *******/
        cond1 = ((document.getElementById('raisebetButton').innerHTML == 'raise') || (document.getElementById('raisebetButton').innerHTML == 'bet')) && ((dataServer.buttonsStatus == 'fold-call-raise') || (dataServer.buttonsStatus == 'fold-check-bet'));

        cond2 = (dataServer.indexCurrentPlayer == myPlayerIndex);


        /******* manage listConnection *******/
        for(let i=0 ; i<5 ; i++) {
            if(dataServer['player' + i].connected) {
                listConnection[i] = true;
            } else {
                listConnection[i] = false;
            };
        };
        //#endregion ///////////////////////////////////////
    });
    //#endregion //////////////////////////////////////////////////////////////////////
};