# Benchloop

<p align="center">
  <img src="./resources/demo.png" width="631" alt="Demo">
</p>

Simple benchmarking library with a pretty output.

## Install

```sh
npm install --save-dev benchloop
```

## Usage

The following interface is provided:

```ts
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

function benchloop<CTX> ( options?: Partial<Options<CTX>> | Function ): ProfileData;
benchloop.defaultOptions: Options;
```

You can use the library like so:

```ts
import benchloop from 'benchloop';

benchloop ({
  name: 'Example benchmark',
  fn: () => {
    for ( let i = 0, l = 100000 * Math.random (); i < l; i++ ) {
      Math.exp ( i, 10 );
    }
  }
});
```

Multiple kinds of outputs are supported, the screenshot above is the result of running [this](./test/index.js).

## License

MIT © Fabio Spampinato
