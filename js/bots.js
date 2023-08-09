//////////////////////////// DESCSION MAKING BOTS ///////////////////////////

/******* init *******/
let descision;
let handRankType;
let handRankHeight;
let currentPhase;
let callToFollow;
function semiRandomChoice(foldChance, callChance, raiseChance) {
    // check for mistakes
    if(foldChance + callChance + raiseChance != 100) {
        return 'error';
    };
    // create the array
    let chanceArray = []
    for(let i=0 ; i<foldChance ; i++) {
        chanceArray.push('fold');
    };
    for(let i=0 ; i<callChance ; i++) {
        chanceArray.push('callcheck');
    };
    for(let i=0 ; i<raiseChance ; i++) {
        chanceArray.push('raisebet');
    };
    return chanceArray[Math.round(99*Math.random())];
};


//#region ////////// DESCISION MAKING FUNCTIONS //////////
function highCardDescisionMaking() {
    if(currentPhase == 'preflop') {
        if(callToFollow < 3000) {
            if(handRankHeight < 8) {
                descision = semiRandomChoice(40, 50, 10);
            } else {
                descision = semiRandomChoice(20, 60, 20);
            };
        } else {
            descision = semiRandomChoice(90, 5, 5);
        };
    } else if(currentPhase == 'river'){
        descision = semiRandomChoice(80, 15, 5);
    } else {
        if(callToFollow < 3000) {
            descision = semiRandomChoice(20, 75, 5);
        } else {
            descision = semiRandomChoice(90, 5, 5);
        };
    };
};

function pairDescisionMaking() {
    if(currentPhase == 'preflop') { 
        if(callToFollow < 4000) {
            descision = semiRandomChoice(20, 70, 10);
        } else {
            descision = semiRandomChoice(70, 25, 5);
        };
    } else if(currentPhase == 'river'){
        if(handRankHeight > 10) {
            descision = semiRandomChoice(15, 75, 10);
        } else {
            descision = semiRandomChoice(40, 55, 5);
        }
    } else {
        if(callToFollow < 4000) {
            descision = semiRandomChoice(20, 70, 10);
        } else {
            descision = semiRandomChoice(70, 25, 5);
        }
    }
};

function twoPairDescisionMaking() {
    descision = semiRandomChoice(15, 65, 10);
};

function threeKindDescisionMaking() {
    descision = semiRandomChoice(10, 40, 50);
};

function straightDescisionMaking() {
    descision = semiRandomChoice(7, 25, 68);
};

function flushDescisionMaking() {
    descision = semiRandomChoice(5, 20, 75);
};

function fullHouseDescisionMaking() {
    descision = semiRandomChoice(0, 15, 85);
};

function fourKindDescisionMaking() {
    descision = semiRandomChoice(0, 10, 90);
};

function straightFlushDescisionMaking() {
    descision = semiRandomChoice(0, 0, 100);
};
//#endregion



//#region ////////// MAIN //////////
function descisionMakingBot(data) {

    if(data.currentPeriod == 'game') {
        // init
        handRankType = data[`player${data.indexCurrentPlayer}`].handRank.type;
        handRankHeight = data[`player${data.indexCurrentPlayer}`].handRank.height;
        currentPhase = data.currentPhase;
        callToFollow = data.callToFollow

        // code
        switch(handRankType) {
            case 'high card' : 
                highCardDescisionMaking();
                break;

            case 'pair' : 
                pairDescisionMaking();
                break;
            
            case 'two pair' : 
                twoPairDescisionMaking();
                break;

            case 'three of a kind' : 
                threeKindDescisionMaking();
                break;

            case 'straight' : 
                straightDescisionMaking();
                break;

            case 'flush' : 
                flushDescisionMaking();
                break;

            case 'full house' : 
                fullHouseDescisionMaking();
                break;

            case 'four of a kind' : 
                fourKindDescisionMaking();
                break;

            case 'straight flush' : 
                straightFlushDescisionMaking();
        };

        return descision;
    }

    
    
}
//#endregion





///// EXPORT
module.exports = descisionMakingBot