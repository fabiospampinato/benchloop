
/* IMPORT */

import now = require ( 'performance-now' );
import * as pretty from 'pretty-ms';

/* PROFILE */

const Profile = {

  marks: {} as Record<string, number>,

  time ( mark: string = '?' ): number {

    return Profile.marks[mark] = now ();

  },

  timeEnd ( mark: string = '?' ): number {

    return now () - Profile.marks[mark];

  },

  format ( time: number ): string {

    return pretty ( time, {
      compact: true,
      formatSubMilliseconds: true
    }).slice ( 1 );

  }

};

/* EXPORT */

export default Profile;
