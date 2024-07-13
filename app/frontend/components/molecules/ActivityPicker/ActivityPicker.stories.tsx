import { SearchResult } from '@/components/organisms/Search/types';
import { ActivityType } from '@/graphql/types';
import { StoryDefault } from '@ladle/react';
import { ActivityPicker } from '.';

const ACTIVITIES: SearchResult[] = [
  {
    __typename: 'ActivityResult',
    id: 'activity[bmb7nV]',
    title: 'Show from Nothing',
    activity: {
      id: 'bmb7nV',
      name: 'Show from Nothing',
      type: ActivityType.Workshop,
      slug: 'show-from-nothing',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[9GmLJw]',
    title: 'Stage Fighting Basics for Improvisors',
    activity: {
      id: '9GmLJw',
      name: 'Stage Fighting Basics for Improvisors',
      type: ActivityType.Workshop,
      slug: 'stage-fighting-basics-for-improv',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[L3w29V]',
    title: 'It Came From Beyond the Script',
    activity: {
      id: 'L3w29V',
      name: 'It Came From Beyond the Script',
      type: ActivityType.Workshop,
      slug: 'it-came-from-beyond-the-script',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[7kjopm]',
    title: 'Collaborators and Influencers',
    activity: {
      id: '7kjopm',
      name: 'Collaborators and Influencers',
      type: ActivityType.Workshop,
      slug: 'collaborators-and-influencers',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[2PwKjV]',
    title: 'The Game of Life',
    activity: {
      id: '2PwKjV',
      name: 'The Game of Life',
      type: ActivityType.Workshop,
      slug: 'the-game-of-life',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[KQk1gV]',
    title: 'All The Paints in the Paintbox',
    activity: {
      id: 'KQk1gV',
      name: 'All The Paints in the Paintbox',
      type: ActivityType.Workshop,
      slug: 'all-the-paints',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[adm5ZV]',
    title: 'Tiny Dog',
    activity: {
      id: 'adm5ZV',
      name: 'Tiny Dog',
      type: ActivityType.Show,
      slug: 'tiny-dog',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[8GVMPm]',
    title: 'Seeing Double',
    activity: {
      id: '8GVMPm',
      name: 'Seeing Double',
      type: ActivityType.Workshop,
      slug: 'seeing-double',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[1krj8k]',
    title: 'Spooky Mini Golf',
    activity: {
      id: '1krj8k',
      name: 'Spooky Mini Golf',
      type: ActivityType.SocialEvent,
      slug: 'spooky-mini-golf',
      __typename: 'SocialEvent',
    },
    description: 'SocialEvent',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[Nm6g1V]',
    title: 'Closing Night Party',
    activity: {
      id: 'Nm6g1V',
      name: 'Closing Night Party',
      type: ActivityType.SocialEvent,
      slug: 'closing-night-party',
      __typename: 'SocialEvent',
    },
    description: 'SocialEvent',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[qk7Y8V]',
    title: 'Karaoke',
    activity: {
      id: 'qk7Y8V',
      name: 'Karaoke',
      type: ActivityType.SocialEvent,
      slug: 'karaoke',
      __typename: 'SocialEvent',
    },
    description: 'SocialEvent',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[WwxDaw]',
    title: 'Grab Bag!',
    activity: {
      id: 'WwxDaw',
      name: 'Grab Bag!',
      type: ActivityType.Show,
      slug: 'grab-bag',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[Qm1Ggw]',
    title: "Child's Play",
    activity: {
      id: 'Qm1Ggw',
      name: "Child's Play",
      type: ActivityType.Workshop,
      slug: 'childs-play',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[yWkNAw]',
    title: 'Getting It Wrong',
    activity: {
      id: 'yWkNAw',
      name: 'Getting It Wrong',
      type: ActivityType.Workshop,
      slug: 'getting-it-wrong',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[2MmQ8k]',
    title: 'NZ vs the World',
    activity: {
      id: '2MmQ8k',
      name: 'NZ vs the World',
      type: ActivityType.Show,
      slug: 'nz-vs-the-world',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[zV9eQV]',
    title: 'Intro to Musical Improv',
    activity: {
      id: 'zV9eQV',
      name: 'Intro to Musical Improv',
      type: ActivityType.Workshop,
      slug: 'intro-to-musical-improv',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[KWVWNm]',
    title: 'Making Your Scene Partner Look Good: The Duty of an Experienced Improvisor',
    activity: {
      id: 'KWVWNm',
      name: 'Making Your Scene Partner Look Good: The Duty of an Experienced Improvisor',
      type: ActivityType.Workshop,
      slug: 'making-your-scene-partner-look-g',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[PYkpDk]',
    title: 'Creating Worlds by the Ghost Light: Dramaturgy for Improv',
    activity: {
      id: 'PYkpDk',
      name: 'Creating Worlds by the Ghost Light: Dramaturgy for Improv',
      type: ActivityType.Workshop,
      slug: 'creating-worlds-by-the-ghost-lig',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[gxwXdw]',
    title: 'What Would the Gods',
    activity: {
      id: 'gxwXdw',
      name: 'What Would the Gods',
      type: ActivityType.Workshop,
      slug: 'what-would-the-gods',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[gmRD5w]',
    title: 'Surprise Party',
    activity: {
      id: 'gmRD5w',
      name: 'Surprise Party',
      type: ActivityType.Workshop,
      slug: 'surprise-party',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[d1w8Dw]',
    title: 'Achieving Group Flow',
    activity: {
      id: 'd1w8Dw',
      name: 'Achieving Group Flow',
      type: ActivityType.Workshop,
      slug: 'achieving-group-flow',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[nAVn8k]',
    title: 'Creating Through Movement',
    activity: {
      id: 'nAVn8k',
      name: 'Creating Through Movement',
      type: ActivityType.Workshop,
      slug: 'creating-through-movement',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[Q7wjpm]',
    title: 'The Song of the Scene',
    activity: {
      id: 'Q7wjpm',
      name: 'The Song of the Scene',
      type: ActivityType.Workshop,
      slug: 'the-song-of-the-scene',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[dxkqQk]',
    title: 'Farce Onion: A Spoons Out Mystery',
    activity: {
      id: 'dxkqQk',
      name: 'Farce Onion: A Spoons Out Mystery',
      type: ActivityType.Workshop,
      slug: 'farce-onion-a-spoons-out-mystery',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[BywPqk]',
    title: 'Solo Improv',
    activity: {
      id: 'BywPqk',
      name: 'Solo Improv',
      type: ActivityType.Workshop,
      slug: 'solo-improv',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[XPkZAw]',
    title: 'The Coaching Codes',
    activity: {
      id: 'XPkZAw',
      name: 'The Coaching Codes',
      type: ActivityType.Workshop,
      slug: 'the-coaching-codes',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[1k87Dw]',
    title: 'Kindness',
    activity: {
      id: '1k87Dw',
      name: 'Kindness',
      type: ActivityType.Workshop,
      slug: 'kindness',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[4Ymy3w]',
    title: 'We’ll Still Be Friends After This',
    activity: {
      id: '4Ymy3w',
      name: 'We’ll Still Be Friends After This',
      type: ActivityType.Workshop,
      slug: 'well-still-be-friends-after-this',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[5AkzxV]',
    title: 'A Bit Dramatic',
    activity: {
      id: '5AkzxV',
      name: 'A Bit Dramatic',
      type: ActivityType.Show,
      slug: 'a-bit-dramatic',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[enwgRV]',
    title: 'The Solarpunk Archives',
    activity: {
      id: 'enwgRV',
      name: 'The Solarpunk Archives',
      type: ActivityType.Show,
      slug: 'the-solarpunk-archives',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[EWka7V]',
    title: 'The Solarpunk Archives',
    activity: {
      id: 'EWka7V',
      name: 'The Solarpunk Archives',
      type: ActivityType.Workshop,
      slug: 'the-solarpunk-archives',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[qYwDRm]',
    title: 'Dream Team',
    activity: {
      id: 'qYwDRm',
      name: 'Dream Team',
      type: ActivityType.Show,
      slug: 'dream-team',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[Aw4xaw]',
    title: 'What Would the Gods',
    activity: {
      id: 'Aw4xaw',
      name: 'What Would the Gods',
      type: ActivityType.Show,
      slug: 'what-would-the-gods',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[QxVEQV]',
    title: 'Cut to the Feeling',
    activity: {
      id: 'QxVEQV',
      name: 'Cut to the Feeling',
      type: ActivityType.Workshop,
      slug: 'cut-to-the-feeling',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[XdkG7k]',
    title: 'Left Unsaid',
    activity: {
      id: 'XdkG7k',
      name: 'Left Unsaid',
      type: ActivityType.Show,
      slug: 'left-unsaid',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[GVL1Jw]',
    title: 'Bad Habits',
    activity: {
      id: 'GVL1Jw',
      name: 'Bad Habits',
      type: ActivityType.Workshop,
      slug: 'bad-habits',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[QzkJgm]',
    title: 'Love.',
    activity: {
      id: 'QzkJgm',
      name: 'Love.',
      type: ActivityType.Show,
      slug: 'love',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[9rwe2k]',
    title: 'Double Dipping: Queen and Friend / The Mechanical',
    activity: {
      id: '9rwe2k',
      name: 'Double Dipping: Queen and Friend / The Mechanical',
      type: ActivityType.Show,
      slug: 'queen-friend-mechanical',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[MVQo8k]',
    title: 'It Came from Beyond the Script',
    activity: {
      id: 'MVQo8k',
      name: 'It Came from Beyond the Script',
      type: ActivityType.Show,
      slug: 'it-came-from-beyond-the-script',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[3gkR5w]',
    title: 'Five Hundred Shows Later',
    activity: {
      id: '3gkR5w',
      name: 'Five Hundred Shows Later',
      type: ActivityType.Show,
      slug: 'five-hundred-shows-later',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[K1wr8m]',
    title: 'Playing from the Heart: a Workshop in Empathy',
    activity: {
      id: 'K1wr8m',
      name: 'Playing from the Heart: a Workshop in Empathy',
      type: ActivityType.Workshop,
      slug: 'playing-from-the-heart-a-workshop-in-empathy',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[Qzm9Qm]',
    title: 'Gentle Reconnection',
    activity: {
      id: 'Qzm9Qm',
      name: 'Gentle Reconnection',
      type: ActivityType.Workshop,
      slug: 'gentle-reconnection',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[YkDyRm]',
    title: 'Pinning Jelly to the Wall: Documenting improv',
    activity: {
      id: 'YkDyRm',
      name: 'Pinning Jelly to the Wall: Documenting improv',
      type: ActivityType.Conference,
      slug: 'pinning-jelly-to-the-wall',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[EPVYbw]',
    title: 'Making Up Grades',
    activity: {
      id: 'EPVYbw',
      name: 'Making Up Grades',
      type: ActivityType.Show,
      slug: 'making-up-grades',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[pRVvxk]',
    title: 'Mo and Ralph: Chaos Theory',
    activity: {
      id: 'pRVvxk',
      name: 'Mo and Ralph: Chaos Theory',
      type: ActivityType.Show,
      slug: 'mo-and-ralph-chaos-theory',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[YVy23w]',
    title: 'Beyond the Mask',
    activity: {
      id: 'YVy23w',
      name: 'Beyond the Mask',
      type: ActivityType.Workshop,
      slug: 'beyond-the-mask',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[dmGA7w]',
    title: 'La Catrina',
    activity: {
      id: 'dmGA7w',
      name: 'La Catrina',
      type: ActivityType.Show,
      slug: 'la-catrina',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[7kdrrV]',
    title: 'No Sleep',
    activity: {
      id: '7kdrrV',
      name: 'No Sleep',
      type: ActivityType.Show,
      slug: 'no-sleep',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[KRk34m]',
    title: 'Magical Realism',
    activity: {
      id: 'KRk34m',
      name: 'Magical Realism',
      type: ActivityType.Workshop,
      slug: 'magical-realism',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[PkK6jw]',
    title: 'The Check-In: Who What Where?',
    activity: {
      id: 'PkK6jw',
      name: 'The Check-In: Who What Where?',
      type: ActivityType.Conference,
      slug: 'the-check-in-who-what-where',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[WmaB7V]',
    title: 'Creating an Immersive Storyworld',
    activity: {
      id: 'WmaB7V',
      name: 'Creating an Immersive Storyworld',
      type: ActivityType.Conference,
      slug: 'creating-an-immersive-storyworld',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[RwvWxk]',
    title: 'NZIF 2024 and Beyond',
    activity: {
      id: 'RwvWxk',
      name: 'NZIF 2024 and Beyond',
      type: ActivityType.Conference,
      slug: 'nzif-2024-and-beyond',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[rkeP2w]',
    title: 'On The Road: Creating and running a touring company',
    activity: {
      id: 'rkeP2w',
      name: 'On The Road: Creating and running a touring company',
      type: ActivityType.Conference,
      slug: 'on-the-road',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[3k2n9k]',
    title: 'Improvising Beyond the Binary',
    activity: {
      id: '3k2n9k',
      name: 'Improvising Beyond the Binary',
      type: ActivityType.Conference,
      slug: 'improvising-beyond-the-binary',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[bakogk]',
    title: 'Game of Life',
    activity: {
      id: 'bakogk',
      name: 'Game of Life',
      type: ActivityType.Show,
      slug: 'game-of-life',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[xwEBQk]',
    title: 'NZ Improv Trust: Meet the Board',
    activity: {
      id: 'xwEBQk',
      name: 'NZ Improv Trust: Meet the Board',
      type: ActivityType.Conference,
      slug: 'nz-improv-trust',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[xmqNQV]',
    title: 'Playing Moment-to-Moment',
    activity: {
      id: 'xmqNQV',
      name: 'Playing Moment-to-Moment',
      type: ActivityType.Workshop,
      slug: 'playing-moment-to-moment',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[WmN4Aw]',
    title: 'Backstage to the Front: Working with tech, music and more!',
    activity: {
      id: 'WmN4Aw',
      name: 'Backstage to the Front: Working with tech, music and more!',
      type: ActivityType.Conference,
      slug: 'backstage-to-the-front',
      __typename: 'Conference',
    },
    description: 'Conference',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[GNk61w]',
    title: 'Working from Organic Offers',
    activity: {
      id: 'GNk61w',
      name: 'Working from Organic Offers',
      type: ActivityType.Workshop,
      slug: 'working-from-organic-offers',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[57wdrm]',
    title: 'The Great NZIF Jam',
    activity: {
      id: '57wdrm',
      name: 'The Great NZIF Jam',
      type: ActivityType.SocialEvent,
      slug: 'the-great-nzif-jam',
      __typename: 'SocialEvent',
    },
    description: 'SocialEvent',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[MVB9Rm]',
    title: 'Here’s a Thing!',
    activity: {
      id: 'MVB9Rm',
      name: 'Here’s a Thing!',
      type: ActivityType.Show,
      slug: 'heres-a-thing',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[ykPpqk]',
    title: 'Opening Night Party',
    activity: {
      id: 'ykPpqk',
      name: 'Opening Night Party',
      type: ActivityType.SocialEvent,
      slug: 'opening-night-party',
      __typename: 'SocialEvent',
    },
    description: 'SocialEvent',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[zqw78k]',
    title: 'Access and Inclusion: When You Know Better, Do Better',
    activity: {
      id: 'zqw78k',
      name: 'Access and Inclusion: When You Know Better, Do Better',
      type: ActivityType.Workshop,
      slug: 'access-and-inclusion',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[WwWaNm]',
    title: 'Lightning Talks',
    activity: {
      id: 'WwWaNm',
      name: 'Lightning Talks',
      type: ActivityType.SocialEvent,
      slug: 'lightning-talks',
      __typename: 'SocialEvent',
    },
    description: 'SocialEvent',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[KAV4aw]',
    title: 'Late Night Knife Fight',
    activity: {
      id: 'KAV4aw',
      name: 'Late Night Knife Fight',
      type: ActivityType.Show,
      slug: 'late-night-knife-fight',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[Awn48m]',
    title: 'We’ll Still Be Friends After This',
    activity: {
      id: 'Awn48m',
      name: 'We’ll Still Be Friends After This',
      type: ActivityType.Show,
      slug: 'well-still-be-friends-after-this',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[PmZDAw]',
    title: 'The Made-Up Smackdown',
    activity: {
      id: 'PmZDAw',
      name: 'The Made-Up Smackdown',
      type: ActivityType.Show,
      slug: 'the-made-up-smackdown',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[xgwA5w]',
    title: 'Triptych',
    activity: {
      id: 'xgwA5w',
      name: 'Triptych',
      type: ActivityType.Show,
      slug: 'triptych',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[PwYDbV]',
    title: 'Farce Onion: A Spoons Out Mystery',
    activity: {
      id: 'PwYDbV',
      name: 'Farce Onion: A Spoons Out Mystery',
      type: ActivityType.Show,
      slug: 'farce-onion-a-spoons-out-mystery',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[dV5eZV]',
    title: 'Can I Get an Underground Location and a Mythical Creature?',
    activity: {
      id: 'dV5eZV',
      name: 'Can I Get an Underground Location and a Mythical Creature?',
      type: ActivityType.Show,
      slug: 'can-i-get-an-underground-locatio',
      __typename: 'Show',
    },
    description: 'Show',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[amoogm]',
    title: 'Butts',
    activity: {
      id: 'amoogm',
      name: 'Butts',
      type: ActivityType.Workshop,
      slug: 'butts',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[AmzMxk]',
    title: 'Poops',
    activity: {
      id: 'AmzMxk',
      name: 'Poops',
      type: ActivityType.Workshop,
      slug: 'poops',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[bMmBRm]',
    title: 'Bring the Heat',
    activity: {
      id: 'bMmBRm',
      name: 'Bring the Heat',
      type: ActivityType.Workshop,
      slug: 'bring-the-heat',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[GwM9Pw]',
    title: 'Get in the Zone',
    activity: {
      id: 'GwM9Pw',
      name: 'Get in the Zone',
      type: ActivityType.Workshop,
      slug: 'get-in-the-zone',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
  {
    __typename: 'ActivityResult',
    id: 'activity[Ybkbnk]',
    title: 'The Idiot',
    activity: {
      id: 'Ybkbnk',
      name: 'The Idiot',
      type: ActivityType.Workshop,
      slug: 'the-idiot',
      __typename: 'Workshop',
    },
    description: 'Workshop',
  },
] as const;

const searchActivities = (query: string) =>
  new Promise<SearchResult[]>((resolve) => {
    setTimeout(
      () =>
        resolve(
          ACTIVITIES.filter(({ title }) => title.toLowerCase().includes(query.toLowerCase()))
        ),
      100
    );
  });

const ActivityPickerStory = () => <ActivityPicker onSearch={searchActivities} />;

export { ActivityPickerStory as ActivityPicker };

export default {
  title: 'Molecules',
} satisfies StoryDefault;
