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
    this.dictionaries[group] ? "" : this.dictionaries[group] = {};
    this.dictionaries[group][text] ? this.dictionaries[group][text]++ : this.dictionaries[group][text] = 1;
};

//Categorize will check a string against the dictionaries to see
//in which group it falls.
Classifier.prototype.categorize = function(text) {
    var self = this;
    var probabilities = {};
    var groups = [];
    var finals = {};

    //Find the groups
    for (var k in this.dictionaries) {groups.push(k);}
    var sums = {};
    var probs = {};
    //Loop through the groups to calculate the sums of found text
    for (var j = 0; j < groups.length; j++) {
        if (!sums[text]) sums[text] = 0;
        if (!this.dictionaries[groups[j]][text]) this.dictionaries[groups[j]][text] = 0;
        sums[text] += this.dictionaries[groups[j]][text];
        probs[groups[j]] = (this.dictionaries[groups[j]][text]) ? this.dictionaries[groups[j]][text] : 0;
    }
    // Perform calculations
    for (var j = 0; j < groups.length; j++) {
        (!probabilities[text]) ? probabilities[text] = {} : "";
        (!probs[groups[j]]) ? probabilities[text][groups[j]] = 0 : probabilities[text][groups[j]] = probs[groups[j]]/sums[text];
    }
    //Average out the probabilities
    for (var j = 0; j < groups.length; j++) {
        if (!finals[groups[j]]) finals[groups[j]] = [];
        finals[groups[j]].push(probabilities[text][groups[j]]);
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
classifier.classify("francais", "fr");
classifier.classify("francais", "fr");
classifier.classify("test", "en");
classifier.classify("english", "en");

console.log(classifier.categorize("english"));
console.log(classifier.categorize("francais"));