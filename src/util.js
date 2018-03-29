import sample from 'lodash/sample';

export const teamsNumbers = [
  'team0',
  'team1',
  'team2',
  'team3',
  'team4',
  'team5',
  'team6',
  'team7',
  'team8',
  'team9',
  'team10',
  'team11',
]

const teamColors = [
  { primary: '0c2340', secondary: '0072ce' },
  { primary: 'ff9e1b', secondary: '000000' },
  { primary: '000000', secondary: '97d700' },
  { primary: '174b97', secondary: 'f2df00' },
  { primary: '171c38', secondary: '0f57ea' },
  { primary: 'fc4c02', secondary: '75787b' },
  { primary: '4a7729', secondary: '000000' },
  { primary: '3c1053', secondary: '000000' },
  { primary: 'feda00', secondary: 'af272f' },
  { primary: 'd22630', secondary: '000000' },
  { primary: 'aa8a00', secondary: '000000' },
  { primary: 'ff8200', secondary: '59cbe8' },
]

export const teamFields = [
  'abbreviatedName',
  'addressCountry',
  'description',
  'handle',
  'homeLocation',
  'id',
  'name',
  'placement',
  'players',
  'primaryColor',
  'ranking',
  'schedule',
  'secondaryColor',
  'secondaryPhoto',
  'type'
];

export const playerFields = [
  'accounts',
  'attributes',
  'familyName',
  'givenName',
  'handle',
  'headshot',
  'homeLocation',
  'id',
  'name',
  'nationality',
  'type'
];

export const scheduleFields = [
  'competitors',
  'conclusionStrategy',
  'dateCreated',
  'endDate',
  'games',
  'id',
  'scores',
  'startDate',
  'state',
  'winner',
];

export const competitorFields = [
  'abbreviatedName',
  'icon',
  'id',
  'logo',
  'name',
  'primaryColor',
  'secondaryColor',
  'secondaryColor'
];

export const gameFields = [
  'attributes',
  'id',
  'points',
  'state'
];

export const brokenImage = "https://i.pinimg.com/originals/e5/b3/bf/e5b3bf0dac03331937c2e783a42d5bac.jpg"

export const getRandomTeamColor = () => sample(teamColors);
