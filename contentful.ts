import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'app/frontend/contentful/contentful.graphql',
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
