// provides a way to track callbacks

var method = LoadingQueue.prototype;

function LoadingQueue(returnHandler) {
  this.queue = 0;
  this.returnHandler = returnHandler;
}

// load list of directives
method.isLoaded = function() {
  if (queue === 0)
    return true;

  return false;
};

// add to queue
method.add = function(inValue) {
  if (inValue != null)
    this.queue = this.queue + inValue;
  else
    this.queue ++;
};

// remove to queue
method.remove = function() {
  this.queue --;
  if (this.queue < 0)
    this.queue = 0;

  if (this.queue === 0)
    this.returnHandler();
};

module.exports = LoadingQueue;