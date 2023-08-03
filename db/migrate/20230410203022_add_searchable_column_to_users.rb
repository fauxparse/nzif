class AddSearchableColumnToUsers < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def up
    execute <<~SQL.squish
      CREATE OR REPLACE FUNCTION my_concat(text, text[])
      RETURNS text
      LANGUAGE sql IMMUTABLE PARALLEL SAFE AS 'SELECT array_to_string($2, $1)';

      ALTER TABLE users
      ADD COLUMN searchable tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', my_concat(E' '::text, regexp_split_to_array(coalesce(email,''), E'[.@]'))), 'B')
      ) STORED;
    SQL
    add_index :users, :searchable, using: :gin, algorithm: :concurrently
  end

  def down
    remove_column :users, :searchable
  end
end
