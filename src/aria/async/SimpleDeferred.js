Aria.classDefinition({

  $classpath : 'aria.async.SimpleDeferred',

  $implements : [
    'aria.async.Deferred'
  ],

  $dependencies : [
    'aria.async.ResolvablePromise'
  ],

  $constructor : function () {
    this.__promise = new aria.async.ResolvablePromise();
  },

  $prototype : {
    getPromise : function () {
      return this.__promise;
    },
    resolve : function (value) {
      this.__promise._resolve(value);
    },
    reject : function (reason) {
      this.__promise._reject(reason);
    },
    progress : function (data) {
      this.__promise._progress(data);
    }
  }
});