new Vue({
    el: "#app",
    data: {
        gamePlay: false,
        computerPlay: false,
        playerPlay: false,
        displaySquares: true,
        topLeft: false,
        topRight: false,
        downLeft: false,
        downRight: false,
        squareMapping: ["topLeft", "topRight", "downLeft", "downRight"],
        sequence: [],
        sequenceTmp: [],
        playerSequence: [],
        score: 0,
        bestScore: null
    },
    mounted() {
        if(localStorage.getItem('simon_game_best_score')){
            this.bestScore = localStorage.getItem('simon_game_best_score')
        }
    },
    computed: {
        writePoint(){
            return this.score > 1 ? 'points' : 'point';
        }
    },
    methods: {
        /**
         * Start a new game
         */
        newGame() {
            this.displaySquares = true;
            this.gamePlay = true;
            this.computerPlay = false;
            this.playerPlay = false;
            this.score = 0;
            this.sequence = [];
            this.nextTurn();
        },

        /**
         * Add a random new element to the sequence
         */
        addOneElementToSequence() {
            this.sequence.push(this.squareMapping[Math.floor(Math.random() * 4)]);
            this.sequenceTmp = [...this.sequence];
        },

        /**
         * Add element that the player click on to the player sequence
         * @param value (string)
         */
        addElementToPlayerSequence(value) {
            this.playerSequence.push(value);
            this.verifyClickPlayer(value);
        },

        /**
         * Verify if click player correspond to the sequence
         * @param value
         */
        verifyClickPlayer(value) {
            if(this.sequenceTmp[0] && this.sequenceTmp[0] === value){
                this.sequenceTmp.splice(0,1);
                if(!this.sequenceTmp.length){
                    this.playerPlay = false;
                    this.computerPlay = true;
                    this.score++;
                    setTimeout(() => {
                        this.nextTurn();
                    },1000)
                }
            } else {
                this.gameOver();
            }
        },
        /**
         * Start next turn
         */
        nextTurn() {
            this.computerPlay = true;
            this.playerSequence = [];
            this.resetSquaresToFalse();
            this.addOneElementToSequence();
            setTimeout(() => {
                this.switchOnSquares(this.sequenceTmp[0]);
            },1000);
        },
        /**
         * Switch on an element with his own color
         * @param element (string)
         */
        switchOnSquares(element) {
            this.switchOnOneSquare(element);
            setTimeout(() => {
                this.switchOffOneSquare(element);

                this.sequenceTmp.splice(0, 1);

                if (this.sequenceTmp[0]) {
                    setTimeout(() => {
                        this.switchOnSquares(this.sequenceTmp[0]);
                    }, 500);
                } else {
                    this.sequenceTmp = [...this.sequence];
                    this.computerPlay = false;
                    this.playerPlay = true;
                }
            }, 500);
        },

        /**
         * Switch on one square
         * @param element (string)
         */
        switchOnOneSquare(element){
            this[element] = true;
        },

        /**
         * Switch off one square
         * @param element
         */
        switchOffOneSquare(element){
            this[element] = false;
        },

        /**
         *  warn player that he lost
         */
        gameOver() {
            this.recordScoreInLocalStorage(this.score);
            this.displaySquares = false;
        },

        /**
         * record score in localStorage if it's the best one
         * @param score
         */
        recordScoreInLocalStorage(score){
            if(localStorage.getItem('simon_game_best_score')){
                if(localStorage.getItem('simon_game_best_score') < score){
                    localStorage.setItem('simon_game_best_score',score);
                    this.bestScore = score;
                }
            } else {
                localStorage.setItem('simon_game_best_score',score);
                this.bestScore = score;
            }
        },

        /**
         * Reset square colors to gray
         */
        resetSquaresToFalse() {
            this.topLeft = false;
            this.topRight = false;
            this.downLeft = false;
            this.downRight = false;
        },
    },
});
