import sample from 'lodash/sample';

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

export const getRandomTeamColor = () => sample(teamColors);
