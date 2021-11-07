let team1;
let team2;
let songs = [];


//We use a song class in here instead of raw json data from songs.js file to so we can have less redundant logic in our recursive game-function loop
class Song {

  #name; //name of the song
  #author; //peron or persons who wrote the song
  #lyrics; //a list of strings where each string is a line of the song.
  #revealedLines; //number of lines that are revealed

  constructor(name, author, lyrics) {
    this.#name = name;
    this.#author = author;
    this.#lyrics = lyrics;
    this.#revealedLines = 0;
  }

  getName() {
    return this.#name;
  }

  getAuthor() {
    return this.#author;
  }

  getLyrics() {
    return this.#lyrics;
  }

  getRevealedLineCount() {
    return this.#revealedLines;
  }

  revealNewLine() {
    this.#revealedLines++;
  }

  isSongShown() {
    return this.getRevealedLineCount() / this.getLyrics().length == 1;
  }

}

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

function generateTeamQuestions() {

}

function parseSongs() {
  //songData is variable from songs.js which is referenced before this file in index.html
  for (const song of songData) songs.push(new Song(song.name, song.author, song.lyrics));
}

//Start the game
function start() {
  parseSongs();
  team1 = new Team("team1");
  team2 = new Team("team2");
  generateTeamQuestions();

}

//Stop the game
function stop() {

}

start();
