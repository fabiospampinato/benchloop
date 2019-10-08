
/* TYPES */

type LogType = 'chart' | 'extended' | 'compact' | false;

type Hook<CTX> = ( ctx: CTX ) => void;
type HookAfter<CTX, DATA> = ( ctx: CTX, data: DATA ) => void;

type ProfileOptions<CTX> = {
  name: string,
  iterations: number,
  log: LogType,
  groups: string[],
  only: boolean,
  skip: boolean,
  special: boolean,
  before: Hook<CTX>,
  beforeEach: Hook<CTX>,
  after: HookAfter<CTX, ProfileData<CTX>>,
  afterEach: Hook<CTX>,
  ctx: () => CTX,
  fn: ( ctx: CTX, iteration: number ) => void
};

type ProfileData<CTX> = {
  options: ProfileOptions<CTX>,
  iterations: number,
  elapsed: number,
  profiles: number[]
};

type SchedulerOptions = {
  only: boolean,
  skip: boolean,
  special: boolean,
  fn: () => ProfileData<any> | void
};

type SchedulerData = {
  queued: number,
  skipped: number,
  elapsed: number
};

/* EXPORT */

export {LogType, ProfileOptions, ProfileData, SchedulerOptions, SchedulerData};
