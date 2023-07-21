class CreatePlacenames < ActiveRecord::Migration[7.0]
  def up
    create_table :placenames do |t|
      t.string :english
      t.string :traditional
      t.timestamps

      t.index :english
      t.index :traditional
    end

    execute <<~SQL.squish
      CREATE OR REPLACE FUNCTION public.immutable_unaccent(regdictionary, text)
        RETURNS text
        LANGUAGE c IMMUTABLE PARALLEL SAFE STRICT AS '$libdir/unaccent', 'unaccent_dict';

      CREATE OR REPLACE FUNCTION public.f_unaccent(text)
        RETURNS text
        LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
        BEGIN ATOMIC
      SELECT public.immutable_unaccent(regdictionary 'public.unaccent', $1);
      END;

      ALTER TABLE placenames
      ADD COLUMN searchable tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', f_unaccent(coalesce(english, ''))), 'A') ||
        setweight(to_tsvector('english', f_unaccent(coalesce(traditional,''))), 'B')
      ) STORED;
    SQL
  end

  def down
    drop_table :placenames
  end
end
