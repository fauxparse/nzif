class AddPositionToVenues < ActiveRecord::Migration[7.0]
  def change
    add_column :venues, :position, :integer, null: false, default: 0
  end
end
