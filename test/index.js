
/* IMPORT */

const {default: benchloop} = require ( '../dist' );

/* BENCHLOOP */

const fn = () => {
  for ( let i = 0, l = 100000 * Math.random (); i < l; i++ ) {
    Math.exp ( i, 10 );
  }
};

benchloop ({
  name: 'Compact',
  log: 'compact',
  fn
});

console.log ( '\n' );

benchloop ({
  name: 'Extended',
  log: 'extended',
  fn
});

console.log ( '\n' );

benchloop ({
  name: 'Chart',
  log: 'chart',
  fn
});
