class RenamePeopleToCast < ActiveRecord::Migration[7.0]
  def change
    rename_table :people, :cast
  end
end
