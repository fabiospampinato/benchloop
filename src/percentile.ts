
/* MAIN */

const Percentile = {

  /* API */

  get: ( values: number[], percentile: number ): number => {

    if ( percentile <= 0 || percentile > 100 ) throw new Error ( 'Invalid percentile' );

    const sorted = values.sort ( ( a, b ) => a - b );
    const index = Math.ceil ( ( percentile / 100 ) * ( sorted.length - 1 ) );

    return sorted[index];

  }

};

/* EXPORT */

export default Percentile;
