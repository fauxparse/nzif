class AddUniqueIndexOnPlacements < ActiveRecord::Migration[7.0]
  def change
    change_table :placements do |t|
      t.index %i[session_id registration_id], unique: true
    end
  end
end
