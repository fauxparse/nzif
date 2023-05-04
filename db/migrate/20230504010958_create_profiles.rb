class CreateProfiles < ActiveRecord::Migration[7.0]
  def up
    create_table :profiles do |t|
      t.belongs_to :user, null: true, foreign_key: { on_delete: :nullify }
      t.string :pronouns
      t.string :name
      t.string :city
      t.string :country
      t.text :bio

      t.timestamps
    end

    execute <<~SQL.squish
      CREATE EXTENSION IF NOT EXISTS postgis;

      ALTER TABLE profiles
      ADD COLUMN searchable tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A')
      ) STORED;
    SQL

    User.find_each do |user|
      user.create_profile!(name: user.name)
    end
  end

  def down
    drop_table :profiles
  end
end
