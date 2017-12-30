//returns a random number between 1 and 100
function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
    var m = array.length, t, index;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        index = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[index];
        array[index] = t;
    }
    return array;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
};


Game.prototype.playersGuessSubmission = function(num) {
    if (num > 100 || num < 1 || typeof num !== 'number'){
        return 'That is an invalid guess.';
    }
    this.playersGuess =  num;
    return this.checkGuess();
};

function toBeReset(){
    $('#hint, #submit').prop('disabled', true);
    $('#subtitle').text('Press Reset button to play again!');
}

Game.prototype.checkGuess = function() {
    //alert(typeof parseInt(this.playersGuess));
    if(this.playersGuess === this.winningNumber) {
        toBeReset();
        return 'You Win!';
    } else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                toBeReset();
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()){
                    $('#subtitle').text('Guess Higher!');
                } else {
                    $('#subtitle').text('Guess Lower!');
                }
                if(diff < 10) return 'You\'re burning up!';
                else if(diff < 25) return 'You\'re lukewarm.';
                else if(diff < 50) return 'You\'re a bit chilly.';
                else return 'You\'re ice cold!';
            }
        }
    }
};

Game.prototype.provideHint = function() {
    var hintArr = [this.winningNumber,generateWinningNumber(),generateWinningNumber()];
    return shuffle(hintArr);

};

function newGame() {
    return new Game();
}

function makeAguess(game) {
    var value = $('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(parseInt(value, 10));
   $('#title').text(output);
}


$(document).ready(function(){

    var game = new Game();

   $('#submit').on('click', function(){
        makeAguess(game);

   });

   $('#player-input').on('keypress', function(event) {
       if(event.which === 13){
           makeAguess(game);
       }
   });

   $('#reset').on('click', function(){
      game = new Game();
       $('#hint, #submit').prop('disabled', false);
       $('#title').text('Play the Guessing Game!');
       $('#subtitle').text('Guess a number between 1-100!');
       $('#guess-list li').text('-');
   });

   $('#hint').on('click', function() {
       var hint = game.provideHint();
        $('#title').text('The winning number is ' + hint[0] + ', ' + hint[1] + ', ' + hint[2]);
   });

});



