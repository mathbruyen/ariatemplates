Aria.classDefinition({

  $classpath : 'aria.async.FailedPromise',

  $implements : [
    'aria.async.Promise'
  ],

  $dependencies : [
    'aria.async.Promises'
  ],

  $constructor : function (reason) {
    this.__reason = reason;
  },

  $prototype : {
    then : function (fulfill, error) {
      return aria.async.Promises._pipe(this, error, this.__reason);
    }
  }
});