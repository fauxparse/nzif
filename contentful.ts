import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    'https://graphql.contentful.com/content/v1/spaces/4hh9rxfdoza6': {
      headers: {
        Authorization: `Bearer yOfSEJ4VUqP4uj_dPMEfVryXFV2F_CgA2gSjMoREqc8`,
      },
    },
  },
  documents: ['.contentful/*.graphql'],
  generates: {
    'app/frontend/contentful/types.ts': {
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        '@thx/graphql-typescript-scalar-type-policies',
      ],
      config: {
        avoidOptionals: true,
        nonOptionalTypename: true,
        emitLegacyCommonJSImports: false,
        strictScalars: true,
        scalars: {
          DateTime: 'luxon#DateTime',
          Dimension: 'number',
          HexColor: 'string',
          Quality: 'number',
          JSON: '@contentful/rich-text-types#Document',
        },
        scalarTypePolicies: {
          DateTime: '../graphql/policies/dateTimePolicy#dateTimePolicy',
          Document: './policies/richTextPolicy#richTextPolicy',
        },
      },
    },
  },
};

export default config;
