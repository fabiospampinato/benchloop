
/* IMPORT */

import {Options, ProfileData} from './types';
import log from './log';
import Profile from './profile';
import Utils from './utils';

/* BENCHLOOP */

const defaultOptions: Options<any> = {
  name: 'benchmark',
  iterations: 1000,
  log: 'extended',
  before: () => {},
  beforeEach: () => {},
  after: () => {},
  afterEach: () => {},
  ctx: () => ({}),
  fn: () => {
    throw new Error ( 'You need to provide the "fn" option to benchmark it' );
  }
};

function benchloop<CTX = any> ( options: Partial<Options<CTX>> | Function ): ProfileData {

  const optsCustom = Utils.isFunction ( options ) ? { fn: options } : options || {},
        opts: Options<CTX> = Object.assign ( {}, benchloop.defaultOptions, optsCustom ),
        ctx: CTX = opts.ctx ();

  let profile = 0,
      profiles: number[] = [];

  if ( opts.before ) opts.before ( ctx );

  for ( let i = 0, l = opts.iterations; i < l; i++ ) {

    if ( opts.beforeEach ) opts.beforeEach ( ctx );

    Profile.time ();

    opts.fn ( ctx, i );

    const elapsed = Profile.timeEnd ();

    profile += elapsed;
    profiles.push ( elapsed );

    if ( opts.afterEach ) opts.afterEach ( ctx );

  }

  if ( opts.after ) opts.after ( ctx );

  const data = {
    name: opts.name,
    iterations: opts.iterations,
    elapsed: profile,
    profiles
  };

  if ( opts.log ) log ( data, opts.log );

  return data;

}

benchloop.defaultOptions = defaultOptions;

/* EXPORT */

export default benchloop;
