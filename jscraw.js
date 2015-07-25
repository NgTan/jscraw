var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');

function Queue() {
  this.dataStore = [];
  this.enqueue = enqueue;
  this.dequeue = dequeue;
  this.front = front;
  this.back = back;
  this.toString = toString;
  this.empty = empty;
  this.count = count;
}

// Add an element to the end of a queue
function enqueue(element) {
  this.dataStore.push(element);
}

// Remove an element from the front of a queue
function dequeue() {
  return this.dataStore.shift();
}

// get first element from a queue
function front() {
  return this.dataStore[0];
}

// get last element from a queue
function back() {
  return this.dataStore[this.dataStore.length - 1];
}

// count all the elements in a queue
function count() {
  return this.dataStore.length;
}

// return true if a queue is empty
function empty() {
  return (this.dataStore.length == 0);
}

// display all the elements in a queue
function toString() {
  var result = '';
  for (var i = 0; i < this.dataStore.length; ++i) {
    result += this.dataStore[i] + "\n";
  }
  return result;
}


var seen = {};
var q = new Queue();
var i = 0;

var baseUrl = 'http://dantri.com.vn/';
var hostname = url.parse(baseUrl).hostname;
q.enqueue(baseUrl);
seen[baseUrl] = true;

function craw(uri) {
  if (!q.empty()) {
    try {
      q.dequeue();
      request(uri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);
          console.log((++i) + ' - ' + uri);
          $('a').each(function (index, element) {
            var link = element.attribs.href;
            // link = url.resolve(baseUrl, link);
            if (link && (link.indexOf(hostname) > -1) && (!seen[link])) {
              seen[link] = true;
              q.enqueue(link);
            }
          });
        }
        return craw(q.front());
      });
    } catch (error) {
      return craw(q.front());
    }
  } // END MAIN IF
}

craw(baseUrl);
console.log('All link: ', seen);
