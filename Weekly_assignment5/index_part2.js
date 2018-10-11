var diaryEntries = [];

class DiaryEntry {
  constructor(primaryKey, date, round, cardHold, cardFlop, cardTurn, cardRiver, result) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.round = {};
    this.round.N = round;
    if (cardHold != null) {
      this.cardHold = {};
      this.cardHold.SS = cardHold; 
        }
    if (cardFlop != null) {
      this.cardFlop = {};
      this.cardFlop.SS = cardFlop; 
    }
    this.cardTurn = {};
    this.cardTurn.S = cardTurn;
    this.cardRiver = {};
    this.cardRiver.S = cardRiver;
    this.result = {};
    this.result.S = result;
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
  }
}


diaryEntries.push(new DiaryEntry(0, 'Oct 01, 2018', 1, ['10C', '5H'], ['9C', '8H', '7H'], 'QH', '7C', 'LOST'));
diaryEntries.push(new DiaryEntry(1, 'Oct 02, 2018', 1, ['2D', 'QC'], ['6H', 'JD', 'JH'], '4H', 'KS', 'FOLDED'));
diaryEntries.push(new DiaryEntry(2, 'Oct 02, 2018', 2, ['7C', 'KH'], ['10S', 'KD', '3H'], 'QC', '2C', 'WON'));
diaryEntries.push(new DiaryEntry(3, 'Oct 03, 2018', 1, ['8D', '2S'], ['JH', '10H', '7C'], 'JC', '5H', 'FOLDED'));
diaryEntries.push(new DiaryEntry(4, 'Oct 04, 2018', 1, ['9S', '9H'], ['8D', '2C', '4C'], 'AD', '7D', 'LOST'));
diaryEntries.push(new DiaryEntry(5, 'Oct 05, 2018', 1, ['4C', '4S'], ['8S', '7C', '2S'], '9D', 'JH', 'LOST'));
diaryEntries.push(new DiaryEntry(6, 'Oct 05, 2018', 2, ['3C', '9C'], ['10C', 'AH', '4H'], 'JD', 'AD', 'WON'));
diaryEntries.push(new DiaryEntry(7, 'Oct 06, 2018', 1, ['10S', '4D'], ['AS', '8D', '10H'], 'AD', '7C', 'FOLDED'));
diaryEntries.push(new DiaryEntry(8, 'Oct 07, 2018', 1, ['AC', '5C'], ['6S', 'KC', '5H'], '5S', '2D', 'WON'));
diaryEntries.push(new DiaryEntry(9, 'Oct 08, 2018', 1, ['4D', '3C'], ['10S', '8D', '5C'], '2S', '6D', 'FOLDED'));
diaryEntries.push(new DiaryEntry(10, 'Oct 09, 2018', 1, ['AD', '10H'], ['KC', '10C', 'QS'], '3D', '6S', 'LOST'));
diaryEntries.push(new DiaryEntry(11, 'Oct 09, 2018', 2, ['8S', 'KD'], ['3D', '10H', '3C'], '', '', 'FOLDED'));
diaryEntries.push(new DiaryEntry(12, 'Oct 09, 2018', 3, ['AS', 'QH'], ['5S', '5C', '8H'], '7D', '7C', 'LOST'));
diaryEntries.push(new DiaryEntry(13, 'Oct 09, 2018', 4, ['3D', '4C'], ['7D', '7H', '8D'], 'AC', '3S', 'FOLDED'));
diaryEntries.push(new DiaryEntry(14, 'Oct 10, 2018', 1, ['4H', '2S'], ['6D', '3D', '5C'], '9S', '4C', 'FOLDED'));
diaryEntries.push(new DiaryEntry(15, 'Oct 11, 2018', 1, ['8H', '3C'], ['10S', '2H', '4D'], 'KD', 'AC', 'FOLDED'));

console.log(diaryEntries);