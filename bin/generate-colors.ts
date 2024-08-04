import {
  amber,
  amberA,
  amberDark,
  amberDarkA,
  blackA,
  blue,
  blueA,
  blueDark,
  blueDarkA,
  bronze,
  bronzeA,
  bronzeDark,
  bronzeDarkA,
  brown,
  brownA,
  brownDark,
  brownDarkA,
  crimson,
  crimsonA,
  crimsonDark,
  crimsonDarkA,
  cyan,
  cyanA,
  cyanDark,
  cyanDarkA,
  gold,
  goldA,
  goldDark,
  goldDarkA,
  grass,
  grassA,
  grassDark,
  grassDarkA,
  gray,
  grayA,
  grayDark,
  grayDarkA,
  green,
  greenA,
  greenDark,
  greenDarkA,
  indigo,
  indigoA,
  indigoDark,
  indigoDarkA,
  lime,
  limeA,
  limeDark,
  limeDarkA,
  mauve,
  mauveA,
  mauveDark,
  mauveDarkA,
  mint,
  mintA,
  mintDark,
  mintDarkA,
  olive,
  oliveA,
  oliveDark,
  oliveDarkA,
  orange,
  orangeA,
  orangeDark,
  orangeDarkA,
  pink,
  pinkA,
  pinkDark,
  pinkDarkA,
  plum,
  plumA,
  plumDark,
  plumDarkA,
  purple,
  purpleA,
  purpleDark,
  purpleDarkA,
  red,
  redA,
  redDark,
  redDarkA,
  sage,
  sageA,
  sageDark,
  sageDarkA,
  sand,
  sandA,
  sandDark,
  sandDarkA,
  sky,
  skyA,
  skyDark,
  skyDarkA,
  slate,
  slateA,
  slateDark,
  slateDarkA,
  teal,
  tealA,
  tealDark,
  tealDarkA,
  tomato,
  tomatoA,
  tomatoDark,
  tomatoDarkA,
  violet,
  violetA,
  violetDark,
  violetDarkA,
  whiteA,
  yellow,
  yellowA,
  yellowDark,
  yellowDarkA,
} from '@radix-ui/colors';
import tinycolor from 'tinycolor2';

type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type VariableID = `VariableID:${number}:${number}`;

type ResolvedValue = {
  resolvedValue: RGBA;
  alias: null;
};

type Variable = {
  id: VariableID;
  name: string;
  description: string;
  type: 'COLOR';
  valuesByMode: Record<string, RGBA>;
  resolvedValuesByMode: Record<string, ResolvedValue>;
  scopes: ['ALL_SCOPES'];
};

type VariableCollectionID = `VariableCollectionId:${number}:${number}`;

type Collection = {
  id: VariableCollectionID;
  name: string;
  modes: Record<`${number}:${number}`, 'Value'>;
  variableIds: VariableID[];
  variables: Variable[];
};

const hslToRgb = (color: string): RGBA => {
  const { r, g, b, a } = tinycolor(color).toRgb();
  return { r: r / 255.0, g: g / 255.0, b: b / 255.0, a };
};

let id = 1;

const variablesFromColors = (colors: Record<string, string>, prefix: string): Variable[] => {
  const result = Object.entries(colors).map(
    ([name, value], i): Variable => ({
      id: `VariableID:8:${id + i}`,
      name: `${prefix}/${name.replace(/[^\d]+/g, '')}`,
      description: '',
      type: 'COLOR',
      valuesByMode: {
        '8:2': hslToRgb(value),
      },
      resolvedValuesByMode: {
        '8:2': {
          resolvedValue: hslToRgb(value),
          alias: null,
        },
      },
      scopes: ['ALL_SCOPES'],
    })
  );
  id += result.length;
  return result;
};

const allVariants = (
  name: string,
  palettes: { [key in 'light' | 'dark' | 'lightA' | 'darkA']: Record<string, string> }
) => [
  ...variablesFromColors(palettes.light, `${name}/Light`),
  ...variablesFromColors(palettes.dark, `${name}/Dark`),
  ...variablesFromColors(palettes.lightA, `${name}/LightA`),
  ...variablesFromColors(palettes.darkA, `${name}/DarkA`),
];

const variables = [
  ...allVariants('Tomato', {
    light: tomato,
    dark: tomatoDark,
    lightA: tomatoA,
    darkA: tomatoDarkA,
  }),
  ...allVariants('Red', { light: red, dark: redDark, lightA: redA, darkA: redDarkA }),
  ...allVariants('Crimson', {
    light: crimson,
    dark: crimsonDark,
    lightA: crimsonA,
    darkA: crimsonDarkA,
  }),
  ...allVariants('Pink', { light: pink, dark: pinkDark, lightA: pinkA, darkA: pinkDarkA }),
  ...allVariants('Plum', { light: plum, dark: plumDark, lightA: plumA, darkA: plumDarkA }),
  ...allVariants('Purple', {
    light: purple,
    dark: purpleDark,
    lightA: purpleA,
    darkA: purpleDarkA,
  }),
  ...allVariants('Violet', {
    light: violet,
    dark: violetDark,
    lightA: violetA,
    darkA: violetDarkA,
  }),
  ...allVariants('Indigo', {
    light: indigo,
    dark: indigoDark,
    lightA: indigoA,
    darkA: indigoDarkA,
  }),
  ...allVariants('Blue', { light: blue, dark: blueDark, lightA: blueA, darkA: blueDarkA }),
  ...allVariants('Cyan', { light: cyan, dark: cyanDark, lightA: cyanA, darkA: cyanDarkA }),
  ...allVariants('Teal', { light: teal, dark: tealDark, lightA: tealA, darkA: tealDarkA }),
  ...allVariants('Green', { light: green, dark: greenDark, lightA: greenA, darkA: greenDarkA }),
  ...allVariants('Grass', { light: grass, dark: grassDark, lightA: grassA, darkA: grassDarkA }),
  ...allVariants('Orange', {
    light: orange,
    dark: orangeDark,
    lightA: orangeA,
    darkA: orangeDarkA,
  }),
  ...allVariants('Brown', { light: brown, dark: brownDark, lightA: brownA, darkA: brownDarkA }),
  ...allVariants('Sky', { light: sky, dark: skyDark, lightA: skyA, darkA: skyDarkA }),
  ...allVariants('Mint', { light: mint, dark: mintDark, lightA: mintA, darkA: mintDarkA }),
  ...allVariants('Lime', { light: lime, dark: limeDark, lightA: limeA, darkA: limeDarkA }),
  ...allVariants('Yellow', {
    light: yellow,
    dark: yellowDark,
    lightA: yellowA,
    darkA: yellowDarkA,
  }),
  ...allVariants('Amber', { light: amber, dark: amberDark, lightA: amberA, darkA: amberDarkA }),
  ...allVariants('Gray', { light: gray, dark: grayDark, lightA: grayA, darkA: grayDarkA }),
  ...allVariants('Mauve', { light: mauve, dark: mauveDark, lightA: mauveA, darkA: mauveDarkA }),
  ...allVariants('Slate', { light: slate, dark: slateDark, lightA: slateA, darkA: slateDarkA }),
  ...allVariants('Sage', { light: sage, dark: sageDark, lightA: sageA, darkA: sageDarkA }),
  ...allVariants('Olive', { light: olive, dark: oliveDark, lightA: oliveA, darkA: oliveDarkA }),
  ...allVariants('Sand', { light: sand, dark: sandDark, lightA: sandA, darkA: sandDarkA }),
  ...allVariants('Bronze', {
    light: bronze,
    dark: bronzeDark,
    lightA: bronzeA,
    darkA: bronzeDarkA,
  }),
  ...allVariants('Gold', { light: gold, dark: goldDark, lightA: goldA, darkA: goldDarkA }),
  ...variablesFromColors(blackA, 'Black'),
  ...variablesFromColors(whiteA, 'White'),
];

const output: Collection = {
  id: 'VariableCollectionId:8:24',
  name: 'Radix Colors',
  modes: { '8:2': 'Value' },
  variableIds: variables.map((v) => v.id),
  variables,
};

// eslint-disable-next-line no-console
console.log(JSON.stringify(output));
