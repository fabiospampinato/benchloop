
/* IMPORT */

import Log from './log';
import Profile from './profile';
import Scheduler from './scheduler';
import {isFunction} from './utils';
import type {ProfileOptions, ProfileData} from './types';

/* MAIN */

const defaultOptions: ProfileOptions<any> = {
  name: 'benchmark',
  iterations: 1000,
  log: 'compact',
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

const benchloop = <CTX = any> ( options: Partial<ProfileOptions<CTX>> | ProfileOptions<CTX>['fn'] ): void => {

  if ( isFunction ( options ) ) return benchloop ({ fn: options });

  const opts: ProfileOptions<CTX> = Object.assign ( {}, benchloop.defaultOptions, groupOptions, options );

  const fn = () => {

    const ctx: CTX = opts.ctx ();
    const {fn} = opts;
    const noop = ( ..._: unknown[] ) => {};

    let profile = 0;
    let profiles: number[] = [];

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

    if ( opts.log ) Log.benchmark<CTX> ( data, opts.log );

    return data;

  }

  Scheduler.schedule ({
    only: opts.only,
    skip: opts.skip,
    special: opts.special,
    fn
  });

};

benchloop.only = <CTX = any> ( options: Partial<ProfileOptions<CTX>> | Function ): void => {

  return benchloop ({ ...options, only: true });

};

benchloop.skip = <CTX = any> ( options: Partial<ProfileOptions<CTX>> | Function ): void => {

  return benchloop ({ ...options, skip: true });

};

/* GROUP */

const group = ( group: string, fn: Function ): void => {

  const {groups} = groupOptions;

  groupOptions.groups = [...groups, group];

  fn ();

  groupOptions.groups = groups;

};

group.only = ( name: string, fn: Function ): void => {

  const {only} = groupOptions;

  groupOptions.only = true;

  group ( name, fn );

  groupOptions.only = only;

};

group.skip = ( name: string, fn: Function ): void => {

  const {skip} = groupOptions;

  groupOptions.skip = true;

  group ( name, fn );

  groupOptions.skip = skip;

};

benchloop.group = group;

/* SUMMARY */

benchloop.summary = () => {

  Scheduler.schedule ({
    special: true,
    fn: () => Log.summary ( Scheduler.data )
  });

};

/* CONFIG */

benchloop.config = ( options: Partial<ProfileOptions<any>> ): void => {

  Object.assign ( benchloop.defaultOptions, options );

};

/* DEFAULT OPTIONS */

benchloop.defaultOptions = defaultOptions;

/* EXPORT */

export default benchloop;
