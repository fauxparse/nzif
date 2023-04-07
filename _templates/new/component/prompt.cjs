// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'select',
    choices: ['atom', 'molecule', 'organism', 'helper'],
    name: 'type',
    message: 'Component type',
  },
];
