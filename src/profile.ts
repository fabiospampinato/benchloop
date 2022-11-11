
/* MAIN */

const Profile = {

  /* VARIABLES */

  marks: <Record<string, number>> {},

  /* API */

  time: ( mark: string = '?' ): number => {

    return Profile.marks[mark] = performance.now ();

  },

  timeEnd: ( mark: string = '?' ): number => {

    return performance.now () - Profile.marks[mark];

  },

  format: ( time: number ): string => {

    if ( time < 1 ) {

      return `${Number ( time.toFixed ( 3 ).slice ( 2 ) )}µs`;

    } else {

      return `${Math.round ( time )}ms`;

    }

  }

};

/* EXPORT */

export default Profile;
