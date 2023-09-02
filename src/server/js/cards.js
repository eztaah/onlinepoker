//#region //////////////////////////// HAND RANKING ///////////////////////////

let handRanking = {
    type : '',
    height : ''
};

//#region ////////// CHECK HAND RANK FUNCTIONS //////////
function checkSameHeights(cardsArray) {

    // init
    let heightPairArray = [];
    let heightThreeKindArray = [];
    let heighFullHouseArray = [];
    let consecutiveSameHeight = 1;
    let previousConsecutiveSameHeight = 1;
    let heightValue = 2;

    // create full house array function
    function createFullHouseArray() {
        heighFullHouseArray = []
        for(let i=0 ; i< heightPairArray.length ; i++) {
            heighFullHouseArray.push(heightPairArray[i]);
        };
        for(let i=0 ; i< heightThreeKindArray.length ; i++) {
            heighFullHouseArray.push(heightThreeKindArray[i]);
        };
        heighFullHouseArray.sort((a, b) => {return a - b});
    };

    // code
    for(let i=0 ; i<cardsArray.length-1 ; i++) {
        if(cardsArray[i].height == cardsArray[i+1].height) {
            consecutiveSameHeight++;
        } else {
            switch(consecutiveSameHeight) {
                case 2 : heightPairArray.push(cardsArray[i].height);  break;
                case 3 : heightThreeKindArray.push(cardsArray[i].height); 
            };
            consecutiveSameHeight = 1;
        };
        if(consecutiveSameHeight >= previousConsecutiveSameHeight) {
            previousConsecutiveSameHeight = consecutiveSameHeight;
            heightValue = cardsArray[i].height
        };
    };
    switch(consecutiveSameHeight) {
        case 2 : 
            heightPairArray.push(cardsArray[cardsArray.length-1].height); 
            break;
        case 3 : 
            heightThreeKindArray.push(cardsArray[cardsArray.length-1].height); 
    };
    switch(previousConsecutiveSameHeight) {
        case 2 : 
            switch(heightPairArray.length) {
                case 1 : 
                    handRanking.type = 'pair';
                    handRanking.height = heightPairArray[0]
                    break;
    
                default : 
                    handRanking.type = 'two pair';
                    handRanking.height = heightPairArray[heightPairArray.length-1]
                    break;
            };
            break;
        case 3 : 
            switch(heightThreeKindArray.length) {
                case 1 : 
                    if(heightPairArray.length >= 1) {
                        handRanking.type = 'full house';
                        createFullHouseArray()
                        handRanking.height = heighFullHouseArray[heighFullHouseArray.length-1]
                    } else {
                        handRanking.type = 'three of a kind';
                        handRanking.height = heightThreeKindArray[0]
                    };
                    break;
    
                default : 
                    handRanking.type = 'full house';
                    createFullHouseArray()
                    handRanking.height = heighFullHouseArray[heighFullHouseArray.length-1]
            };
            break;
    
        case 4 : 
            handRanking.type = 'four of a kind';
            handRanking.height = heightValue;
    };
};

function checkStraight(cardsArray) {

    //init 
    let straightCount = 1;
    let straightHeight = null;
    let saveIndexBeginningStraight = 0;
    let indexBeginningStraight = -1;
    let indexEndStraight = null;
    let saveStraightCount = 1;


    // check straight flush fonction
    function checkStraightFlush() {
        //init
        let clubsCount = 0;
        let spadesCount = 0;
        let heartsCount = 0;
        let diamondsCount = 0;
    
        //code
        if(indexEndStraight != null) {
            for(let i=saveIndexBeginningStraight ; i<=indexEndStraight ; i++) {
                switch(cardsArray[i].color) {
                    case 'clubs' :
                        clubsCount++;
                        break;
                    case 'spades' : 
                        spadesCount++;
                        break;
                    case 'hearts' : 
                        heartsCount++;
                        break;
                    case 'diamonds' :
                        diamondsCount++;
                };
            };
        };
        if((clubsCount >= 5) || (spadesCount >= 5) || (heartsCount >= 5) || (diamondsCount >= 5)) {
            handRanking.type = 'straight flush';
            handRanking.height = straightHeight;
        };
    };

    // code
    for(let i=0 ; i<cardsArray.length-1 ; i++) {
        if(Number(cardsArray[i+1].height) - Number(cardsArray[i].height) == 1) {
            straightCount++;
            if(straightCount >= 5) {
                straightHeight = cardsArray[i+1].height;
                indexEndStraight = i+1;
                indexBeginningStraight++;
                saveIndexBeginningStraight = indexBeginningStraight;
                saveStraightCount = straightCount;
            };
        }
        else if (Number(cardsArray[i+1].height) - Number(cardsArray[i].height) > 1) {
            straightCount = 1;
            indexBeginningStraight++;
        };
    };
    if(saveStraightCount >= 5) {
        if((handRanking.type != 'full house') && (handRanking.type != 'four of a kind')) {
            handRanking.type = 'straight';
            handRanking.height = straightHeight;
        };
    };
    checkStraightFlush();
};

function checkFlush(cardsArray) {

    //init
    let clubsCount = 0;
    let spadesCount = 0;
    let heartsCount = 0;
    let diamondsCount = 0;
    let flushHeight = 0;

    //code
    for(let i=0 ; i<cardsArray.length ; i++) {
        switch(cardsArray[i].color) {
            case 'clubs' :
                clubsCount++;
                break;
            case 'spades' : 
                spadesCount++;
                break;
            case 'hearts' : 
                heartsCount++;
                break;
            case 'diamonds' :
                diamondsCount++;
        };
        if((clubsCount >= 5) || (spadesCount >= 5) || (heartsCount >= 5) || (diamondsCount >= 5)) {
            flushHeight = cardsArray[i].height;
        };
    };
    if((clubsCount >= 5) || (spadesCount >= 5) || (heartsCount >= 5) || (diamondsCount >= 5)) {
        if((handRanking.type != 'full house') && (handRanking.type != 'four of a kind') && (handRanking.type != 'straight flush')) {
            handRanking.type = 'flush';
            handRanking.height = flushHeight;
        };
    };
};
//#endregion



//#region ////////// GET HAND RANK //////////
function setCardsArray(cardsArray) {

    // set the array
    let newCardsArray = [];
    for(let i=0 ; i<cardsArray.length ; i++) {
        if(cardsArray[i].length == 3) {
            newCardsArray.push({height : cardsArray[i][0] + cardsArray[i][1], color : cardsArray[i][2]});
        } else {
            newCardsArray.push({height : cardsArray[i][0], color : cardsArray[i][1]});
        }
    };

    // improve the array
    for(let i=0 ; i<cardsArray.length ; i++) {
        // convert to number
        switch(newCardsArray[i].height) {
            case 'J' : 
                newCardsArray[i].height = 11;
                break;
            case 'Q' : 
                newCardsArray[i].height = 12;
                break;
            case 'K' : 
                newCardsArray[i].height = 13;
                break;
            case 'A' : 
                newCardsArray[i].height = 14;
                break;
            default : 
                newCardsArray[i].height = Number(newCardsArray[i].height);
        };
        // detail colors
        switch(newCardsArray[i].color) {
            case 'c' :
                newCardsArray[i].color = 'clubs';
                break;
            case 's' :
                newCardsArray[i].color = 'spades';
                break;
            case 'h' : 
                newCardsArray[i].color = 'hearts';
                break
            case 'd' :
                newCardsArray[i].color = 'diamonds'
        };
    };
    return newCardsArray;
};

function getHandRank(data, playerIndex) {

    //init
    let amountMiddleCardsAvailable;
    let availableCards = []
    handRanking = {
        type : '',
        height : ''
    };

    //get the available cards array
    switch(data.currentPhase) {
        case 'flop' :
            amountMiddleCardsAvailable = 3;
            break;
        case 'turn' :
            amountMiddleCardsAvailable = 4;
            break;
        case 'river' :
            amountMiddleCardsAvailable = 5;
            break;
        default : 
            amountMiddleCardsAvailable = 0
    };
    for(let i=0 ; i<2 ; i++) {
        availableCards.push(data[`player${playerIndex}`].hand[i]);
    };
    for(let i=0 ; i<amountMiddleCardsAvailable ; i++) {
        availableCards.push(data.cardsMiddle[i])
    }

    // set cardsArray
    availableCards = setCardsArray(availableCards);

    // sort the array
    for(let i=0 ; i<availableCards.length-1 ; i++) {
        let key = i+1;
        let heightValue = availableCards[key].height;
        let colorValue = availableCards[key].color;
        while((key > 0) && (heightValue < availableCards[key-1].height)) {
            availableCards[key].height = availableCards[key-1].height;
            availableCards[key].color = availableCards[key-1].color;
            key = key-1;
        };
        availableCards[key].height = heightValue;
        availableCards[key].color = colorValue;
    };

    // check for pairs, three of a kind, four of a kind and full house
    checkSameHeights(availableCards);

    // check for straight and straight flush
    checkStraight(availableCards);

    // check for flush
    checkFlush(availableCards);

    // check for high cards
    if(handRanking.type == '') {
        handRanking.type = 'high card';
        handRanking.height = availableCards[availableCards.length-1].height;
    };

    return handRanking;
};
//#endregion



//#endregion ///////////////////////////////////////////////////////////////////





//#region //////////////////////////// FIND WINNER ///////////////////////////

function findWinner(data) {

    // set the handRankings array
    const handsRankings1 = [];
    for(let i=0 ; i<5 ; i++) {
        if((!data[`player${i}`].connected) || (data[`player${i}`].status == 'fold')) {
            handsRankings1.push({type : 'high card', indexAndHeight : [i, 1]});
        } else {
            handsRankings1.push({type : data[`player${i}`].handRank.type, indexAndHeight : [i, data[`player${i}`].handRank.height]});
        };

    };
    for(let i=0 ; i<5 ; i++) {
        switch(handsRankings1[i].type) {
            case 'high card' : handsRankings1[i].type = 1; break;
            case 'pair' : handsRankings1[i].type = 2; break;
            case 'two pair' : handsRankings1[i].type = 3; break;
            case 'three of a kind' : handsRankings1[i].type = 4; break;
            case 'straight' : handsRankings1[i].type = 5; break;
            case 'flush' : handsRankings1[i].type = 6; break;
            case 'full house' : handsRankings1[i].type = 7; break;
            case 'four of a kind' : handsRankings1[i].type = 8; break;
            case 'straight flush' : handsRankings1[i].type = 9; break;     
        };
    };

    // sort the handsRankings1
    for(let i=0 ; i<4 ; i++) {
        let key = i+1;
        let typeValue = handsRankings1[key].type;
        let indexAndHeightValue = handsRankings1[key].indexAndHeight;
        while((key > 0) && (typeValue < handsRankings1[key-1].type)) {
            handsRankings1[key].type = handsRankings1[key-1].type;
            handsRankings1[key].indexAndHeight = handsRankings1[key-1].indexAndHeight;
            key = key-1;
        };
        handsRankings1[key].type = typeValue;
        handsRankings1[key].indexAndHeight = indexAndHeightValue;
    };

    // find the best type and it occurence
    const bestType = handsRankings1[handsRankings1.length-1].type;
    let bestTypeOccurence = 1;
    for(let i=handsRankings1.length-2 ; i>=0 ; i--) {
        if(handsRankings1[i].type != bestType) {
            break;
        };
        bestTypeOccurence++;
    };

    // sorting the best type between them
    let handsRankings2 = [];
    for(let i=5-bestTypeOccurence ; i<5; i++) {
        handsRankings2.push(handsRankings1[i]);
    };
    if(handsRankings2.length >= 2) {
        for(let i=0 ; i<handsRankings2.length-1 ; i++) {
            let key = i+1;
            let indexAndHeightValue = handsRankings2[key].indexAndHeight;
            while((key > 0) && (handsRankings2[key].indexAndHeight[1] < handsRankings2[key-1].indexAndHeight[1])) {
                handsRankings2[key].indexAndHeight = handsRankings2[key-1].indexAndHeight;
                key = key-1;
            };
            handsRankings2[key].indexAndHeight = indexAndHeightValue;
        };
    };

    // get the number of winners
    const bestHeight = handsRankings2[handsRankings2.length-1].indexAndHeight[1];
    let bestHeightOccurence = 1;
    for(let i=handsRankings2.length-2 ; i>=0 ; i--) {
        if(handsRankings2[i].indexAndHeight[1] != bestHeight) {
            break;
        };
        bestHeightOccurence++;
    };

    // create the winner's array
    const indexWinners = [];
    for(let i=handsRankings2.length-1 ; i>=handsRankings2.length - bestHeightOccurence ; i--) {
        indexWinners.push(handsRankings2[i].indexAndHeight[0]);
    };

    return indexWinners;
};

//#endregion ///////////////////////////////////////////////////////////////////





///// EXPORT
exports.f1 = getHandRank
exports.f2 = findWinner