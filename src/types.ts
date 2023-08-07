
/* MAIN */

type LogType = 'extended' | 'compact' | false;

type Hook<T> = ( ctx: T ) => void;
type HookAfter<T, U> = ( ctx: T, data: U ) => void;

type ProfileOptions<T> = {
  name: string,
  iterations: number,
  log: LogType,
  groups: string[],
  only: boolean,
  skip: boolean,
  special: boolean,
  before: Hook<T>,
  beforeEach: Hook<T>,
  after: HookAfter<T, ProfileData<T>>,
  afterEach: Hook<T>,
  ctx: () => T,
  fn: ( ctx: T, iteration: number ) => void
};

type ProfileData<T> = {
  options: ProfileOptions<T>,
  iterations: number,
  elapsed: number,
  profiles: number[]
};

type SchedulerOptions = {
  only: boolean,
  skip: boolean,
  special: boolean,
  fn: () => Promise<ProfileData<any>> | ProfileData<any> | void
};

type SchedulerData = {
  queued: number,
  skipped: number,
  elapsed: number
};

/* EXPORT */

export type {LogType, ProfileOptions, ProfileData, SchedulerOptions, SchedulerData};
