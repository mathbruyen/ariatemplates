Aria.classDefinition({

  $classpath : 'aria.async.Promises',

  $dependencies : [
    'aria.async.SimpleDeferred',
    'aria.async.ResolvedPromise',
    'aria.async.FailedPromise',
    'aria.utils.Type',
    'aria.utils.Array'
  ],

  $singleton: true,

  $prototype : {
    defer : function () {
      return new aria.async.SimpleDeferred();
    },
    when : function (value) {
      if (aria.utils.Type.isInstanceOf(value, 'aria.async.Promise')) {
        return value;
      } else {
        return new aria.async.ResolvedPromise(value);
      }
    },
    fail : function (reason) {
      return new aria.async.FailedPromise(reason);
    },
    always : function (promise, cb) {
      aria.async.Promises.when(promise).then(function (value) {
        cb(null, value);
      }, function (reason) {
        cb(reason);
      });
    },
    timeout : function (promise, time) {
      var id = window.setTimeout(function () {
        if (deferred) {
          deferred.reject();
          deferred = null;
        }
      }, time);
      var deferred = aria.async.Promises.defer();
      promise.then(function (value) {
        if (deferred) {
          deferred.resolve(value);
          deferred = null;
          window.clearTimeout(id);
        }
      }, function (reason) {
        if (deferred) {
          deferred.reject(reason);
          deferred = null;
          window.clearTimeout(id);
        }
      });
      return deferred.getPromise();
    },
    all : function () {
      var promises = aria.async.Promises.__flatten(Array.prototype.slice.call(arguments));
      var results = new Array(promises.length);
      var remaining = promises.length;
      var deferred = aria.async.Promises.defer();
      aria.utils.Array.forEach(promises, function (promise, idx) {
        promise.then(function (value) {
          if (results) {
            results[idx] = value;
            remaining--;
            if (remaining === 0) {
              deferred.resolve(results);
              results = null;
            }
          }
        }, function (reason) {
          if (results) {
            deferred.reject();
            results = null;
          }
        });
      });
      return deferred.getPromise();
    },
    any : function () {
      var promises = aria.async.Promises.__flatten(Array.prototype.slice.call(arguments));
      var reasons = new Array(promises.length);
      var remaining = promises.length;
      var deferred = aria.async.Promises.defer();
      aria.utils.Array.forEach(promises, function (promise, idx) {
        promise.then(function (value) {
          if (reasons) {
            deferred.resolve(value);
            reasons = null;
          }
        }, function (reason) {
          if (reasons) {
            reasons[idx] = reason;
            remaining--;
            if (remaining === 0) {
              deferred.reject(reasons);
              reasons = null;
            }
          }
        });
      });
      return deferred.getPromise();
    },
    _pipe : function (promise, callback, value) {
      if (aria.utils.Type.isCallback(callback)) {
        return aria.utils.Promises.when(this.$callback(callback, value));
      } else {
        return promise;
      }
    },
    __flatten : function (array) {
      var flattened = new Array(array.length);
      aria.utils.Array.forEach(array, function(item) {
        if (aria.utils.Type.isArray(item)) {
          aria.utils.Array.forEach(aria.async.Promises.__flatten(item), function (inner) {
            flattened.push(inner);
          });
        } else {
          flattened.push(item);
        }
      });
      return flattened;
    }
  }
});