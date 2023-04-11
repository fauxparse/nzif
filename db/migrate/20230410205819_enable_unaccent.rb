class EnableUnaccent < ActiveRecord::Migration[7.0]
  def up
    execute <<~SQL.squish
      CREATE EXTENSION IF NOT EXISTS "unaccent";
    SQL
  end

  def down; end
end
