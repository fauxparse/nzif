class DropPeopleIndexes < ActiveRecord::Migration[7.0]
  def up
    execute <<~SQL.squish
      DROP INDEX index_people;
      DROP INDEX index_people_on_activity;
    SQL
  end

  def down; end
end
