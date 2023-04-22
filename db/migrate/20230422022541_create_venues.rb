class CreateVenues < ActiveRecord::Migration[7.0]
  def up
    create_table :venues do |t|
      t.string :room, null: true
      t.string :building, null: false
      t.string :address, null: false
      t.decimal :latitude, precision: 15, scale: 10, required: true
      t.decimal :longitude, precision: 15, scale: 10, required: true

      t.timestamps

      t.index %i[latitude longitude]
    end

    execute <<~SQL.squish
      CREATE EXTENSION IF NOT EXISTS postgis;

      ALTER TABLE venues
      ADD COLUMN searchable tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(room, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(building,'')), 'B')
      ) STORED;
    SQL
  end

  def down
    drop_table :venues
  end
end
