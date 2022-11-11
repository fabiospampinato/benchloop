
/* IMPORT */

import color from 'tiny-colors';
import Percentile from './percentile';
import Profile from './profile';
import type {LogType, ProfileData, SchedulerData} from './types';

/* HELPERS */

const colorize = ( str: string ): string => {

  str = str.replace ( /(\s)(\d+)(\S*)/g, ( _, $1, $2, $3 ) => `${$1}${color.yellow ( $2 )}${color.yellow ( $3 )}` );

  str = str.replace ( /[├─┬│├└→]+/g, match => `${color.gray ( match )}` );

  return str;

};

/* MAIN */

const Log = {

  /* API */

  benchmark: <T> ( data: ProfileData<T>, type: LogType ): void => {

    if ( !type ) return;

    const lines: string[] = [];

    if ( type === 'compact' || type === 'extended' ) {

      lines.push ( `${data.options.groups.join ( ' → ' )}${data.options.groups.length ? ' → ' : ''}${data.options.name} → ${Profile.format ( data.elapsed )}` );

    }

    if ( type === 'extended' ) {

      lines.push ( `├─ 100th → ${Profile.format ( Percentile.get ( data.profiles, 100 ) )}` );
      lines.push ( `├─ 95th → ${Profile.format ( Percentile.get ( data.profiles, 95 ) )}` );
      lines.push ( `├─ 90th → ${Profile.format ( Percentile.get ( data.profiles, 90 ) )}` );
      lines.push ( `├─ 75th → ${Profile.format ( Percentile.get ( data.profiles, 75 ) )}` );
      lines.push ( `├─ 50th → ${Profile.format ( Percentile.get ( data.profiles, 50 ) )}` );
      lines.push ( `├─ 25th → ${Profile.format ( Percentile.get ( data.profiles, 25 ) )}` );
      lines.push ( `└─ 1th → ${Profile.format ( Percentile.get ( data.profiles, 1 ) )}` );

    }

    console.log ( lines.map ( colorize ).join ( '\n' ) );

  },

  summary: ( data: SchedulerData ): void => {

    const line = `Ran ${data.queued - data.skipped} of ${data.queued} in ${Profile.format ( data.elapsed )}`;

    console.log ( colorize ( line ) );

  }

};

/* EXPORT */

export default Log;
