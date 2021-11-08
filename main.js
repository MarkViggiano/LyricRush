let team1;
let team2;
let songs = [];
let answeredQuestions = 0; //max of 6
let questionModal = new bootstrap.Modal(document.getElementById("staticBackdropQuestion"));
let questionLabel = document.getElementById("staticBackdropLabelQuestion");
let solutionForm = document.getElementById("questionAnswers");

//We use a song class in here instead of raw json data from songs.js file to so we can have less redundant logic in our recursive game-function loop,
//and to avoid overloading the Team Class
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

  #name; //team name
  #songElement; //The physical element on the html page that represents the song.
  #song; //The list of lyrics of the song the team has to complete
  #score; //The amount of lines in the song the group has completed
  #percentComplete; //The score over the total number of lines
  #questions; //list of questions in json data form

  constructor(name) {
    this.#songElement = document.getElementById(`${name.toLowerCase().replaceAll(" ", "")}Song`);
    this.#name = name;
    this.#song;
    this.#score = 0;
    this.#percentComplete;
    this.#questions = [];
    this.#assignSong();
  }

  #assignSong() {
    this.#song = songs[Math.floor(Math.random() * songs.length)];
    this.updateSongHtml();
  }

  getName() {
    return this.#name;
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

  updateSongHtml() {
    let html = "";
    let status;
    for (var i = 0; i < this.#song.getLyrics().length; i++) {
      if (i < this.getScore()) status = "revealed";
      else status = "hidden";
      html += `<p class="${status}">${this.#song.getLyrics()[i]}</p>`;
    }
    this.#songElement.innerHTML = html;
  }

  addQuestion(question) {
    this.#questions.push(question);
  }

  getQuestions() {
    return this.#questions;
  }

  addScore() {
    this.#score++;
  }

}

function generateTeamQuestions() {
  for (let i = 0; i < 12; i++) {
    let question1 = questionData[Math.floor(Math.random() * questionData.length)];
    team1.addQuestion(question1);
    questionData.splice(questionData.indexOf(question1), 1);

    let question2 = questionData[Math.floor(Math.random() * questionData.length)];
    team2.addQuestion(question2);
    questionData.splice(questionData.indexOf(question2), 1);
  }
}

function parseSongs() {
  //songData is variable from songs.js which is referenced before this file in index.html
  for (const song of songData) songs.push(new Song(song.name, song.author, song.lyrics));
}

function checkSong(winner, loser, guessedDetails) {
  let song = winner.getSong();
  if (guessedDetails[0] == song.getName() && guessedDetails[1] == song.getAuthor()) {
    swal({
      title: "Swapped!",
      text: `Sorry ${winner.getName()} but ${loser.getName()} got it right! Start singing!`,
      icon: "success"
    })
  } else {
    swal({
      title: "Failed!",
      text: `Sorry ${loser.getName()} but you got it wrong... it was: ${song.getName()} by ${song.getAuthor()}...`,
      icon: "danger"
    })
  }

  questionModal.close();

}

function endGame() {
  let winner;
  let loser;
  if (team1.getScore() > team2.getScore()) {
    //team 1 wins
    winner = team1;
    loser = team2;
  } else if (team1.getScore() == team2.getScore()){
    swal({
      title: "Draw!",
      text: "You both get to sing! Good luck!",
      icon: "info"
    })
    return;
  } else {
    //team 2 wins
    winner = team2;
    loser = team1;
  }

  questionLabel.innerHTML = loser.getName() + " || What is the name of the winner's song and who wrote it?";
  let answers = [];

  //make html stuff for correctAnswer
  let solutionNode = document.createElement("div");
  solutionNode.classList.add("form-check");
  let input = document.createElement("input");
  input.classList.add("form-check-input");
  input.type = "radio";
  input.id = winner.getSong().getName();
  input.onclick = () => checkSong(winner, loser, [winner.getSong().getName(), winner.getSong().getAuthor()]);

  let label = document.createElement("label");
  label.classList.add("form-check-label");
  label.for = winner.getSong().getName();
  label.innerHTML = winner.getSong().getName() + " by " + winner.getSong().getAuthor();
  solutionNode.appendChild(input);
  solutionNode.appendChild(label);
  answers.push(solutionNode);

  for (let i = 0; i < songs.length; i++) {
    let song = songs[i];
    if (song.getName() == winner.getSong().getName()) continue;
    let solutionNode = document.createElement("div");
    solutionNode.classList.add("form-check");
    let input = document.createElement("input");
    input.classList.add("form-check-input");
    input.type = "radio";
    input.id = song.getName();
    input.onclick = () => checkSong(winner, loser, [song.getName(), song.getAuthor()]);

    let label = document.createElement("label");
    label.classList.add("form-check-label");
    label.for = song.getName();
    label.innerHTML = song.getName() + " by " + song.getAuthor();
    solutionNode.appendChild(input);
    solutionNode.appendChild(label);
    answers.push(solutionNode);
  }

  answers = shuffle(answers);
  for (const answer of answers) {
    solutionForm.appendChild(answer);
  }

  questionModal.show();

}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

//Recursive game function
//Really bad but I'm just rushing to get this project done so good code out the window :)
let askTeam = 1;
function askQuestion() {
  solutionForm.querySelectorAll("*").forEach(child => child.remove());
  if (askTeam == 2 && answeredQuestions == 6) {
    endGame();
    return;
  }

  let team;

  if (askTeam == 1) {
    team = team1;
  } else {
    team = team2;
  }

  let question = team.getQuestions()[answeredQuestions];


  let team1Question = team1.getQuestions()[answeredQuestions];
  let team2Question = team2.getQuestions()[answeredQuestions];

  //ask team 1 question
  questionLabel.innerHTML = team.getName() + " || " + question.name;
  let answers = [];

  //make html stuff for correctAnswer
  let solutionNode = document.createElement("div");
  solutionNode.classList.add("form-check");
  let input = document.createElement("input");
  input.classList.add("form-check-input");
  input.type = "radio";
  input.id = question.correctAnswer.value;
  input.onclick = () => checkAnswer(team, question, question.correctAnswer.value);

  let label = document.createElement("label");
  label.classList.add("form-check-label");
  label.for = question.correctAnswer.value;
  label.innerHTML = question.correctAnswer.value;
  solutionNode.appendChild(input);
  solutionNode.appendChild(label);
  answers.push(solutionNode);

  for (let i = 0; i < question.answers.length; i++) {
    let solutionNode = document.createElement("div");
    solutionNode.classList.add("form-check");
    let input = document.createElement("input");
    input.classList.add("form-check-input");
    input.type = "radio";
    input.onclick = () => checkAnswer(team, question, question.answers[i]);

    let label = document.createElement("label");
    label.classList.add("form-check-label");
    label.for = question.answers[i];
    label.innerHTML = question.answers[i];
    solutionNode.appendChild(input);
    solutionNode.appendChild(label);
    answers.push(solutionNode);
  }

  answers = shuffle(answers);
  for (const answer of answers) {
    solutionForm.appendChild(answer);
  }

  questionModal.show();

  if (askTeam == 2) {
    askTeam = 1;
    answeredQuestions++;
  } else {
    askTeam = 2;
  }
}

function checkAnswer(team, question, answer) {
  if (answer == question.correctAnswer.value) {
    //correctly answered
    swal({
      title: "Correct!",
      text: question.correctAnswer.explanation,
      icon: "success"
    }).then(() => {
      team.addScore();
      team.updateSongHtml();
      askQuestion();
    });
  } else {
    //wrong
    swal({
      title: question.correctAnswer.value,
      text: question.correctAnswer.explanation,
      icon: "warning"
    }).then(() => {
      askQuestion();
    });
  }


}

//Start the game
function start() {
  parseSongs();
  team1 = new Team("Team 1");
  team2 = new Team("Team 2");
  generateTeamQuestions();

  //game loop
  askQuestion();
}

window.onload = () => {
  let modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
  console.log(modal);
  modal.toggle();
}
