Aria.classDefinition({

  $classpath : 'aria.async.ResolvablePromise',

  $implements : [
    'aria.async.Promise'
  ],

  $dependencies : [
    'aria.async.Promises',
    'aria.utils.Array'
  ],

  $constructor : function () {
    this.__resolvers = [];
    this.__isResolved = false;
    this.__isRejected = false;
  },

  $prototype : {
    then : function (fulfill, error) {
      if (this.__isResolved) {
        return aria.async.Promises._pipe(this, fulfill, this.__value);
      } else if (this.__isRejected) {
        return aria.async.Promises._pipe(this, error, this.__value);
      } else {
        var down = new aria.async.ResolvablePromise();
        this.__resolvers.push(function () {
          this.then(fulfill, error).then(function (value) {
            down._resolve(value);
          }, function (reason) {
            down._reject(reason);
          });
        });
        return down;
      }
    },
    _resolve : function (value) {
      this.__resolveOrReject(true, value);
    },
    _reject : function (reason) {
      this.__resolveOrReject(false, reason);
    },
    _progress : function (data) {
      this.__ensureAvailable();
      this.$raiseEvent({
        name: 'progress',
        src: this,
        data: data
      });
    },
    __resolveOrReject : function (resolve, value) {
      this.__ensureAvailable();
      if (resolve) {
        this.__isResolved = true;
      } else {
        this.__isRejected = true;
      }
      this.__value = reason;
      this.$unregisterListeners();
      aria.utils.Array.forEach(this.__resolvers, function (resolver) {
        resolver();
      });
      this.__resolvers = null;
    },
    __ensureAvailable : function () {
      if (this.__isResolved || this.__isRejected) {
        throw new Error('Promise is already resolved or rejected');
      }
    }
  }
});