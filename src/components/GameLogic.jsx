import React from 'react';
import ask4 from '../data/ask4.tsv';
import guess4 from '../data/guess4.tsv';
import ask5 from '../data/ask5.tsv';
import guess5 from '../data/guess5.tsv';
import ask6 from '../data/ask6.tsv';
import guess6 from '../data/guess6.tsv';
import ask7 from '../data/ask7.tsv';
import guess7 from '../data/guess7.tsv';

class GameLogic extends React.Component {
  wordList = {
    "char4": {
      "askable": [], "guessable": []
    },
    "char5": {
      "askable": [], "guessable": []
    },
    "char6": {
      "askable": [], "guessable": []
    },
    "char7": {
      "askable": [], "guessable": []
    },
  };
  unicode = ["𐑐","𐑑","𐑒","𐑓","𐑔","𐑕","𐑖","𐑗","𐑘","𐑙","𐑤","𐑥","𐑦","𐑧","𐑨","𐑩","𐑪","𐑫","𐑬","𐑭","𐑚","𐑛","𐑜","𐑝","𐑞","𐑟","𐑠","𐑡","𐑢","𐑣","𐑮","𐑯","𐑰","𐑱","𐑲","𐑳","𐑴","𐑵","𐑶","𐑷","𐑸","𐑹","𐑺","𐑻","𐑼","𐑽","𐑾","𐑿"];
  recoded = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩","⑪","⑫","⑬","⑭","⑮","⑯","⑰","⑱","⑲","⑳","⑴","⑵","⑶","⑷","⑸","⑹","⑺","⑻","⑼","⑽","⑾","⑿","⒀","⒁","⒂","⒃","⒄","⒅","⒆","⒇","⒈","⒉","⒊","⒋","⒌","⒍","⒎","⒏"];
  constructor(props) {
    super(props);
    this.state = {
    };
  };
  numToUni(numText) {
    let newText = "";
    for (let i = 0; i < numText.length; i++) {
      let char = numText[i];
      let index = this.recoded.indexOf(char, 0);
      newText += index == -1 ? char : this.unicode[index];
    }
    return newText;
  }
  sortDict(a, b) {
    return a[0] == b[0] ? 0 : // if value is 0, they are the same value
    a[0] < b[0] ? -1 : // if value is negative, they are in the right order
    1; // if value is positive, they are in the wrong order
  }
  async loadWords(charCount) {
    console.log("gameState.loadWords()");
    if (this.wordList[`char${charCount}`].length > 0) {
      return;
    }
    const askable = fetch(
      {4: ask4, 5: ask5, 6: ask6, 7: ask7}[charCount],
    ).then((askable) => {
      return askable.text();
    }).then((askableContent) => {
      const askableLines = askableContent.split('\n'); // '\r' might remain at the ends of lines
      askableLines.forEach((value, index) => {
        let elems = value.split("\t");
        elems[0] = this.numToUni(elems[0]);
        elems[1] = elems[1].trim();
        this.wordList[`char${charCount}`].askable.push(elems);
      })
      // sort these so we can binary search
      this.wordList[`char${charCount}`].askable.sort(this.sortDict);
      return;
    });
    const guessable = fetch(
      {4: guess4, 5: guess5, 6: guess6, 7: guess7}[charCount],
    ).then((guessable) =>{
      return guessable.text();
    }).then((guessableContent) => {
      const guessableLines = guessableContent.split('\n'); // '\r' might remain at the ends of lines
      guessableLines.forEach((value, index) => {
        let elems = value.split("\t");
        elems[0] = this.numToUni(elems[0]);
        elems[1] = elems[1].trim();
        this.wordList[`char${charCount}`].guessable.push(elems);
      })
      // sort these so we can binary search
      this.wordList[`char${charCount}`].guessable.sort(this.sortDict);
      return;
    });
    await Promise.all([askable, guessable]);
    console.log(this.wordList[`char${charCount}`]);
    return;
  }
  randomSecret(charCount) {
    let target = this.wordList[`char${charCount}`].askable;
    let index = Math.floor(Math.random() * target.length);
    console.log("GameLogic.randomSecret: Secret index is", index);
    return target[index];
  }
  // Searches the guessable word list. Returns an Array of 2 elements.
  // If it's in there, returns the index of the word and the Latin-script transcription.
  // If it's not in there, returns -1 and an empty string.
  isGuessable(text, charCount) {
    // binary search the word list
    let target = this.wordList[`char${charCount}`].guessable;
    let low = 0;
    let high = target.length;
    while (low < high) {
      let mid = (low + high) >> 1;
      console.log("GameLogic.isGuessable", mid, target[mid][0], text);
      if (target[mid][0] === text) {
        return [mid, target[mid][1]];
      } else if (target[mid][0] > text) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    if (target[low][0] == text) {
      return [low, target[low][1]];
    }
    return [-1, ""];
  }

  getClues(guess, secret) {
    let clues = new Array(secret.length);
    // get hits
    for (let i = 0; i < secret.length; i++) {
      if (secret[i] == guess[i]) {
        secret[i] = "";
        guess[i] = "";
        clues[i] = 3;
      } else {
        clues[i] = 1;
      }
    }
    // get grazes
    for (let diff = 1; diff < secret.length - 1; diff++) {
      for (let i = 0; i < secret.length; i++) {
        if (guess[i] === "") {continue;}
        if (
          i + diff < secret.length &&
          secret[i + diff] !== ""
        ) {
          if (secret[i + diff] == guess[i]) {
            secret[i + diff] = "";
            guess[i] = "";
            clues[i] = 2;
          }
        } else
        if (
          i - diff >= 0 &&
          secret[i - diff] !== ""
        ) {
          if (secret[i - diff] == guess[i]) {
            secret[i - diff] = "";
            guess[i] = "";
            clues[i] = 2;
          }
        }
      }
    }
    // all done
    return clues;
  }
}

export default new GameLogic();