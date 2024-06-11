class CreateCities < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def change
    create_table :cities do |t|
      t.string :name
      t.string :traditional_names, array: true, default: [], null: false
      t.string :country, limit: 2

      t.timestamps
    end
  end
end
