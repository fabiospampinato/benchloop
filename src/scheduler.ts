
/* IMPORT */

import {isFunction} from './utils';
import type {SchedulerOptions, SchedulerData} from './types';

/* MAIN */

const Scheduler = {

  /* VARIABLES */

  queue: <Partial<SchedulerOptions>[]> [],
  data: <SchedulerData> {},
  scheduled: false,

  /* API */

  schedule: ( options: Partial<SchedulerOptions> | SchedulerOptions['fn'] ): void => {

    if ( isFunction ( options ) ) return Scheduler.schedule ({ fn: options });

    Scheduler.queue.push ( options );

    if ( Scheduler.scheduled ) return;

    Scheduler.scheduled = true;

    setTimeout ( async () => {

      await Scheduler.run ();

      Scheduler.scheduled = false;

    });

  },

  run: async (): Promise<void> => {

    Scheduler.data = {
      skipped: 0,
      queued: 0,
      elapsed: 0
    };

    const hasOnly = !!Scheduler.queue.find ( data => data.only );

    if ( hasOnly ) {

      Scheduler.queue.forEach ( data => {

        if ( !data.only ) data.skip = true;

      });

    }

    for ( const data of Scheduler.queue ) {

      if ( !data.fn ) continue;

      if ( !data.special ) {

        Scheduler.data.queued++;

        if ( data.skip ) {

          Scheduler.data.skipped++;

          continue;

        }

      }

      const profileData = await data.fn ();

      Scheduler.data.elapsed += profileData ? profileData.elapsed : 0;

    }

    Scheduler.queue = [];

  }

};

/* EXPORT */

export default Scheduler;
