
/* IMPORT */

import benchloop from '../dist/index.js';

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

benchloop ({
  name: 'Extended',
  log: 'extended',
  fn
});

/* TEST SUITE-ISH */

// benchloop ({
//   name: 'Default',
//   log: 'compact',
//   fn: () => {}
// });

// benchloop.only ({
//   name: 'Only',
//   log: 'compact',
//   fn: () => {}
// });

// benchloop.skip ({
//   name: 'Skip',
//   log: 'compact',
//   fn: () => {}
// });

// benchloop.group ( 'Group', () => {

//   benchloop ({
//     name: 'Default',
//     log: 'compact',
//     fn: () => {}
//   });

//   benchloop.group ( 'Nested', () => {

//     benchloop ({
//       name: 'Default',
//       log: 'compact',
//       fn: () => {}
//     });

//   });

// });

// benchloop.group.only ( 'Only', () => {

//   benchloop ({
//     name: 'Default',
//     log: 'compact',
//     fn: () => {}
//   });

// });

// benchloop.group.skip ( 'Skip', () => {

//   benchloop ({
//     name: 'Default',
//     log: 'compact',
//     fn: () => {}
//   });

// });

// benchloop.summary ();
