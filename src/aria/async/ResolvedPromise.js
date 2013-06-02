Aria.classDefinition({

  $classpath : 'aria.async.ResolvedPromise',

  $implements : [
    'aria.async.Promise'
  ],

  $dependencies : [
    'aria.async.Promises'
  ],

  $constructor : function (value) {
    this.__value = value;
  },

  $prototype : {
    then : function (fulfill, error) {
      return aria.async.Promises._pipe(this, fulfill, this.__value);
    }
  }
});