import sample from 'lodash/sample';
import find from 'lodash/find';
import reject from 'lodash/reject';

export const teamIds = [
  '4402',
  '4403',
  '4404',
  '4405',
  '4406',
  '4407',
  '4408',
  '4409',
  '4410',
  '4523',
  '4524',
  '4525',
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
];

export const brokenImage = "https://i.pinimg.com/originals/e5/b3/bf/e5b3bf0dac03331937c2e783a42d5bac.jpg"

export const getTextColor = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const uicolors = [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
  const c = uicolors.map((c) => {
    if (c <= 0.03928) {
      return c / 12.92;
    } else {
      return Math.pow((c + 0.055) / 1.055, 2.4);
    }
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return (L > 0.179) ? '#000000' : '#ffffff';
}

export const getTeamFromTeamName = (teams, team) => find(teams, ['abbreviatedName', team])

export const getTeamFromTeams = (teams, team) => find(teams, ['id', team])

export const getTeamMatches = (schedule, team) => schedule.filter(match => match.competitors.some(comp => comp.id === team))

export const getCompetetorTeam = (match, notTeam) => reject(match.competitors, ['id', notTeam])[0]

export const getCompetetor = (teams, match, notTeam) => getTeamFromTeams(teams, getCompetetorTeam(match, notTeam).id)

export const getRandomTeamColor = () => sample(teamColors);
