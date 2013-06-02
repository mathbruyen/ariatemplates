Aria.interfaceDefinition({

  $classpath : 'aria.async.Promise',

  $events : {
    'progress' : {
      description : 'Some progress is made.',
      properties : {}
    }
  },

  $interface : {
    then : 'Function'
  }
});