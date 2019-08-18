
/* IMPORT */

import {LogType, ProfileData} from './types';
import Profile from './profile';
import chalk from 'chalk';
import * as ervy from 'ervy';
import * as percentile from 'percentile';
import * as termSize from 'term-size';

/* LOG */

function log ( data: ProfileData, type: LogType ): void {

  if ( !type ) return;

  function colorize ( str ) {
    str = str.replace ( /(\s)(\d+)(\S*)/g, ( match, $1, $2, $3 ) => `${$1}${chalk.yellow ( $2 )}${chalk.yellow ( $3 )}` );
    str = str.replace ( /[├─┬│├└→]+/g, match => `${chalk.gray ( match )}` );
    return str;
  }

  function getBarData ( th: number ) {
    return {
      key: `${th}th`,
      value: percentile ( th, data.profiles )
    };
  }

  let lines = [
    `${data.name} → ${Profile.format ( data.elapsed )}`
  ];

  if ( type === 'extended' ) {

    lines.push (
      `├─ 100th → ${Profile.format ( percentile ( 100, data.profiles ) )}`,
      `├─ 90th → ${Profile.format ( percentile ( 90, data.profiles ) )}`,
      `├─ 75th → ${Profile.format ( percentile ( 75, data.profiles ) )}`,
      `├─ 50th → ${Profile.format ( percentile ( 50, data.profiles ) )}`,
      `├─ 25th → ${Profile.format ( percentile ( 25, data.profiles ) )}`,
      `└─ 0th → ${Profile.format ( percentile ( 0, data.profiles ) )}`
    );

  }

  lines = lines.map ( colorize );

  if ( type === 'chart' ) {

    const chartOptions = {
      barWidth: 7,
      height: 10,
      left: 0,
      padding: 0,
      style: ervy.bg ( 'yellow' ),
      format: time => Profile.format ( time )
    };

    const chartData: { key: string, value: number }[] = [],
          chartWidth = termSize ().columns,
          barsNr = Math.floor ( chartWidth / chartOptions.barWidth ),
          barTh = chartOptions.barWidth * 100 / chartWidth;

    chartData.push ( getBarData ( 0 ) );

    for ( let i = 0, l = barsNr - 2; i < l; i++ ) {
      const th = Math.round ( ( ( i + 1 ) * barTh ) + ( barTh / 2 ) );
      chartData.push ( getBarData ( th ) );
    }

    chartData.push ( getBarData ( 100 ) );

    const chart = ervy.bar ( chartData, chartOptions );

    lines.push ( chart );

  }

  console.log ( lines.join ( '\n' ) );

}

/* EXPORT */

export default log;
