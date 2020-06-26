
/* IMPORT */

import {SchedulerOptions, SchedulerData} from './types';
import Utils from './utils';

/* SCHEDULER */

const Scheduler = {

  queue: [] as Partial<SchedulerOptions>[],
  data: {} as SchedulerData,
  scheduled: false,

  schedule ( options: Partial<SchedulerOptions> | SchedulerOptions['fn'] ): void {

    if ( Utils.isFunction ( options ) ) return Scheduler.schedule ({ fn: options });

    Scheduler.queue.push ( options );

    if ( Scheduler.scheduled ) return;

    Scheduler.scheduled = true;

    setTimeout ( () => {

      Scheduler.run ();

      Scheduler.scheduled = false;

    });

  },

  run (): void {

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

    Scheduler.queue.forEach ( data => {

      if ( !data.fn ) return;

      if ( !data.special ) {

        Scheduler.data.queued++;

        if ( data.skip ) return Scheduler.data.skipped++;

      }

      const profileData = data.fn ();

      Scheduler.data.elapsed += profileData ? profileData.elapsed : 0;

    });

    Scheduler.queue = [];

  }

};

/* EXPORT */

export default Scheduler;
