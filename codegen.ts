import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'app/frontend/graphql/schema.graphql',
  documents: [],
  generates: {
    'app/frontend/graphql/types.ts': {
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
          ISO8601DateTime: 'luxon#DateTime',
          ISODate: 'luxon#DateTime',
          Country: 'string',
          Upload: 'File',
          Money: 'number',
        },
        scalarTypePolicies: {
          ISO8601DateTime: './policies/dateTimePolicy#dateTimePolicy',
          ISODate: './policies/dateTimePolicy#datePolicy',
        },
      },
    },
  },
};

export default config;
