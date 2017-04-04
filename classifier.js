//Create a classifier object
//This object will have a dictionaries property so we can eventually export or import
//whatever it learned
var Classifier = function() {
    this.dictionaries = {};
};

//Just an average function
function average(numbers) {
    var sum = 0;
    for (var i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum / numbers.length;
}

//Classify is used to "teach" something to your machine
//You pass it a string and a group to which it's associated with
Classifier.prototype.classify = function(text, group) {
    var words = text.split(" ");
    this.dictionaries[group] ? "" : this.dictionaries[group] = {};
    var self = this;
    words.map((w) => {
        self.dictionaries[group][w] ? self.dictionaries[group][w]++ : self.dictionaries[group][w] = 1;
    });
};

//Categorize will check a string against the dictionaries to see
//in which group it falls.
Classifier.prototype.categorize = function(text) {
    var words = text.split(" ");
    var self = this;
    var probabilities = {};
    var groups = [];
    var finals = {};

    //Find the groups
    for (var k in this.dictionaries) {groups.push(k);}
    
    for (var i = 0; i < words.length; i++) {
        //Ignore small words
        if (words[i].length <= 2) continue;
        //find the word in each group
        var sums = {};
        var probs = {};
        for (var j = 0; j < groups.length; j++) {
            if (!sums[words[i]]) sums[words[i]] = 0;
            if (!this.dictionaries[groups[j]][words[i]]) this.dictionaries[groups[j]][words[i]] = 0;
            sums[words[i]] += this.dictionaries[groups[j]][words[i]];
            probs[groups[j]] = (this.dictionaries[groups[j]][words[i]]) ? this.dictionaries[groups[j]][words[i]] : 0;
        }
        // Perform calculations
        for (var j = 0; j < groups.length; j++) {
            (!probabilities[words[i]]) ? probabilities[words[i]] = {} : "";
            (!probs[groups[j]]) ? probabilities[words[i]][groups[j]] = 0 : probabilities[words[i]][groups[j]] = probs[groups[j]]/sums[words[i]];
        }
        //Average out the probabilities
        for (var j = 0; j < groups.length; j++) {
            if (!finals[groups[j]]) finals[groups[j]] = [];
            finals[groups[j]].push(probabilities[words[i]][groups[j]]);
        }
    }

    for (var i = 0; i < groups.length; i++) {
        finals[groups[i]] = average(finals[groups[i]]);
    }

    //Find the largest probability
    var highestGroup = "";
    var highestValue = 0;
    for (var group in finals) {
        if (finals[group] > highestValue) {
            highestGroup = group;
            highestValue = finals[group];
        }
    }

    return highestGroup;
};

var classifier = new Classifier();
classifier.classify("Ce texte est en francais", "fr");
classifier.classify("Celui ci est aussi en francais", "fr");
classifier.classify("This text is in english", "en");
classifier.classify("This text is also in english", "en");

console.log(classifier.categorize("text in english"));
console.log(classifier.categorize("texte en francais"));

