class AddStartDateIndexToFestivals < ActiveRecord::Migration[7.1]
  def change
    add_index :festivals, :start_date
  end
end
