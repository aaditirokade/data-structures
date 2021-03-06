var diaryEntries = [];

class DiaryEntry {
  constructor(primaryKey, date, round, cardHold, cardFlop, cardTurn, cardRiver, result, water, people, sentence) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.round = {};
    this.round.N = round.toString();
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
    this.water = {};
    this.water.S = water;
    this.people = {};
    this.people.N = people.toString();
    this.sentence = {};
    this.sentence.S = sentence;
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
  }
}

// diaryEntries.push(new DiaryEntry('0', 'Oct 01, 2018', '1', ['10C', '5H'], ['9C', '8H', '7H'], 'QH', '7C', 'LOST'));

diaryEntries.push(new DiaryEntry(0, 'Oct 01, 2018', 1, ['10C', '5H'], ['9C', '8H', '7H'], 'QH', '7C', 'LOST', '2.5 ltr', 7,'This is my favorite part of the week.'));
diaryEntries.push(new DiaryEntry(1, 'Oct 02, 2018', 1, ['2D', 'QC'], ['6H', 'JD', 'JH'], '4H', 'KS', 'FOLDED', '2 ltr', 4, 'Want The Onion’s email newsletter?'));
diaryEntries.push(new DiaryEntry(2, 'Oct 02, 2018', 2, ['7C', 'KH'], ['10S', 'KD', '3H'], 'QC', '2C', 'WON', '2.5 ltr', 9, 'In the end, the Christine Blasey Ford accusations collapsed.'));
diaryEntries.push(new DiaryEntry(3, 'Oct 03, 2018', 1, ['8D', '2S'], ['JH', '10H', '7C'], 'JC', '5H', 'FOLDED', '3.2 ltr', 2, 'Search Google or type a URL'));
diaryEntries.push(new DiaryEntry(4, 'Oct 04, 2018', 1, ['9S', '9H'], ['8D', '2C', '4C'], 'AD', '7D', 'LOST', '2.5 ltr', 7, 'remote: Enumerating objects: 1558, done.'));
diaryEntries.push(new DiaryEntry(5, 'Oct 05, 2018', 1, ['4C', '4S'], ['8S', '7C', '2S'], '9D', 'JH', 'LOST', '1.8 ltr', 8, 'This article lays out an approach to create stories based on data.'));
diaryEntries.push(new DiaryEntry(6, 'Oct 05, 2018', 2, ['3C', '9C'], ['10C', 'AH', '4H'], 'JD', 'AD', 'WON','2.5 ltr', 4, 'I got back to my table.'));
diaryEntries.push(new DiaryEntry(7, 'Oct 06, 2018', 1, ['10S', '4D'], ['AS', '8D', '10H'], 'AD', '7C', 'FOLDED', '1 ltr', 8,'French bread, and maybe a loaf of rye.'));
diaryEntries.push(new DiaryEntry(8, 'Oct 07, 2018', 1, ['AC', '5C'], ['6S', 'KC', '5H'], '5S', '2D', 'WON', '3.2 ltr', 9, 'I let the data do the talking.'));
diaryEntries.push(new DiaryEntry(9, 'Oct 08, 2018', 1, ['4D', '3C'], ['10S', '8D', '5C'], '2S', '6D', 'FOLDED','2 ltr', 4, 'Thus far the consensus has been that Ford was sincere and empathetic, but not credible.'));
diaryEntries.push(new DiaryEntry(10, 'Oct 09, 2018', 1, ['AD', '10H'], ['KC', '10C', 'QS'], '3D', '6S', 'LOST', '2.1 ltr', 6, 'Often these four properties of a transaction are acronymed as ACID.'));
diaryEntries.push(new DiaryEntry(11, 'Oct 09, 2018', 2, ['8S', 'KD'], ['3D', '10H', '3C'], '3C', '8S', 'FOLDED', '4 ltr', 13, 'Off the field, he became known as a strong voice for the growing contingent of Latino players in the major leagues.'));
diaryEntries.push(new DiaryEntry(12, 'Oct 09, 2018', 3, ['AS', 'QH'], ['5S', '5C', '8H'], '7D', '7C', 'LOST', '2.8 ltr', 7, 'For the first time in our company\'s history, Sales compared to the prior month decreased.'));
diaryEntries.push(new DiaryEntry(13, 'Oct 09, 2018', 4, ['3D', '4C'], ['7D', '7H', '8D'], 'AC', '3S', 'FOLDED', '1.3 ltr', 3, 'This builds towards and supports the key finding.'));
diaryEntries.push(new DiaryEntry(14, 'Oct 10, 2018', 1, ['4H', '2S'], ['6D', '3D', '5C'], '9S', '4C', 'FOLDED', '1 ltr', 5, 'What is asking a question?'));
diaryEntries.push(new DiaryEntry(15, 'Oct 11, 2018', 1, ['8H', '3C'], ['10S', '2H', '4D'], 'KD', 'AC', 'FOLDED', '2.6 ltr',9,'Turn to Section 3 of your answer sheet to answer the questions in this section.'));

console.log(diaryEntries);