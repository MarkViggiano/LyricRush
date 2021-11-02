let team1;
let team2;
let questionKey; //TODO: put the json here for the questions 
let songs = []; //TODO: put the songs here and do the magic parsing with atom to get them nice and clean

class Team {

  #songElement; //The physical element on the html page that represents the song. 
  #song; //The list of lyrics of the song the team has to complete
  #score; //The amount of lines in the song the group has completed
  #percentComplete; //The score over the total number of lines 
  
  constructor(name) {
    this.#songElement = document.getElementById(`${name}Song`);
    this.#song;
    this.#score = 0;
    this.#percentComplete;
    this.#assignSong();
  }
  
  #assignSong() {
    this.#song = songs[Math.floor(Math.random() * songs.length)];
  }
  
  getSong() {
    return this.#song;
  }
  
  getScore() {
    return this.#score;
  }
  
  getPercentComplete() {
    return this.#percentComplete;
  }
  
  isDone() {
    return this.getPercentComplete == 1;
  }
}

//Start the game 
function start() {
  team1 = new Team("team1");
  team2 = new Team("team2");
  
}

//Stop the game
function stop() {

}
