require 'graphql/rake_task'

GraphQL::RakeTask.new(
  schema_name: 'NZIFSchema',
  directory: './app/frontend/graphql',
  dependencies: [:environment],
)
