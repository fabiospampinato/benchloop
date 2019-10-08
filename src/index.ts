
/* IMPORT */

import merge from 'conf-merge';
import {ProfileOptions, ProfileData} from './types';
import Log from './log';
import Profile from './profile';
import Scheduler from './scheduler';
import Utils from './utils';

/* BENCHLOOP */

const defaultOptions: ProfileOptions<any> = {
  name: 'benchmark',
  iterations: 1000,
  log: 'extended',
  groups: [],
  only: false,
  skip: false,
  special: false,
  before: () => {},
  beforeEach: () => {},
  after: () => {},
  afterEach: () => {},
  ctx: () => ({}),
  fn: () => {
    throw new Error ( 'You need to provide the "fn" option to benchmark it' );
  }
};

const groupOptions: Pick<ProfileOptions<any>, 'groups' | 'only' | 'skip'> = {
  groups: [],
  only: false,
  skip: false
};

function benchloop<CTX = any> ( options: Partial<ProfileOptions<CTX>> | ProfileOptions<CTX>['fn'] ): void {

  if ( Utils.isFunction ( options ) ) return benchloop ({ fn: options });

  const opts: ProfileOptions<CTX> = merge ( {}, benchloop.defaultOptions, groupOptions, options );

  function fn () {

    const ctx: CTX = opts.ctx (),
          {fn} = opts,
          noop = ( ...args: any[] ) => {};

    let profile = 0,
        profiles: number[] = [];

    if ( opts.before ) opts.before ( ctx );

    for ( let i = 0, l = opts.iterations; i < l; i++ ) {

      if ( opts.beforeEach ) opts.beforeEach ( ctx );

      Profile.time ();

      noop ( ctx, i );

      const elapsedNoop = Profile.timeEnd ();

      Profile.time ();

      fn ( ctx, i );

      const elapsed = Math.max ( 0, Profile.timeEnd () - elapsedNoop );

      profile += elapsed;
      profiles.push ( elapsed );

      if ( opts.afterEach ) opts.afterEach ( ctx );

    }

    const data: ProfileData<CTX> = {
      options: opts,
      iterations: opts.iterations,
      elapsed: profile,
      profiles
    };

    if ( opts.after ) opts.after ( ctx, data );

    if ( opts.log ) Log.items.benchmark<CTX> ( data, opts.log );

    return data;

  }

  Scheduler.schedule ({
    only: opts.only,
    skip: opts.skip,
    special: opts.special,
    fn
  });

}

benchloop.only = function only<CTX = any> ( options: Partial<ProfileOptions<CTX>> | Function ): void {

  return benchloop ({ ...options, only: true });

};

benchloop.skip = function skip<CTX = any> ( options: Partial<ProfileOptions<CTX>> | Function ): void {

  return benchloop ({ ...options, skip: true });

};

/* GROUP */

function group ( group: string, fn: Function ): void {

  const {groups} = groupOptions;

  groupOptions.groups = [...groups, group];

  fn ();

  groupOptions.groups = groups;

}

group.only = function only ( name: string, fn: Function ): void {

  const {only} = groupOptions;

  groupOptions.only = true;

  group ( name, fn );

  groupOptions.only = only;

};

group.skip = function skip ( name: string, fn: Function ): void {

  const {skip} = groupOptions;

  groupOptions.skip = true;

  group ( name, fn );

  groupOptions.skip = skip;

};

benchloop.group = group;

/* SUMMARY */

benchloop.summary = function summary () {

  Scheduler.schedule ({
    special: true,
    fn: () => Log.items.summary ( Scheduler.data )
  });

};

/* DEFAULT OPTIONS */

benchloop.defaultOptions = defaultOptions;

/* EXPORT */

export {group};
export default benchloop;
