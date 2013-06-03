Aria.classDefinition({

  $classpath : 'aria.async.ResolvablePromise',

  $implements : [
    'aria.async.Promise'
  ],

  $dependencies : [
    'aria.async.FailedPromise',
    'aria.async.ResolvedPromise',
    'aria.utils.Array'
  ],

  $constructor : function () {
    this.__resolvers = [];
  },

  $prototype : {
    then : function (fulfill, error) {
      if (this.__finished) {
        return this.__finished.then(fulfill, error);
      } else {
        var down = new aria.async.ResolvablePromise();
        this.__resolvers.push(function () {
          this.__finished.then(fulfill, error).then(function (value) {
            down._resolve(value);
          }, function (reason) {
            down._reject(reason);
          });
        });
        return down;
      }
    },
    _resolve : function (value) {
      this.__resolveOrReject(new aria.async.ResolvedPromise(value));
    },
    _reject : function (reason) {
      this.__resolveOrReject(new aria.async.FailedPromise(value));
    },
    _progress : function (data) {
      this.__ensureAvailable();
      this.$raiseEvent({
        name: 'progress',
        src: this,
        data: data
      });
    },
    __resolveOrReject : function (finished) {
      this.__ensureAvailable();
      this.__finished = finished;
      this.$unregisterListeners();
      aria.utils.Array.forEach(this.__resolvers, function (resolver) {
        resolver();
      });
      this.__resolvers = null;
    },
    __ensureAvailable : function () {
      if (this.__finished) {
        throw new Error('Promise is already resolved or rejected');
      }
    }
  }
});