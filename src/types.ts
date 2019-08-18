
/* TYPES */

type LogType = 'chart' | 'extended' | 'compact' | false;

type Hook<CTX> = ( ctx: CTX ) => void;

type Options<CTX> = {
  name: string,
  iterations: number,
  log: LogType,
  before: Hook<CTX>,
  beforeEach: Hook<CTX>,
  after: Hook<CTX>,
  afterEach: Hook<CTX>,
  ctx: () => CTX,
  fn: Hook<CTX>
};

type ProfileData = {
  name: string,
  iterations: number,
  elapsed: number,
  profiles: number[]
};

/* EXPORT */

export {LogType, Options, ProfileData};
