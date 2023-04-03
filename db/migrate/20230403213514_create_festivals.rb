class CreateFestivals < ActiveRecord::Migration[7.0]
  def change
    create_table :festivals do |t|
      t.date :start_date
      t.date :end_date
      t.timestamps
    end
  end
end
