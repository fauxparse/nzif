class CreatePlacements < ActiveRecord::Migration[7.0]
  def change
    create_table :placements do |t|
      t.belongs_to :registration, null: false, foreign_key: true
      t.belongs_to :session, null: false, foreign_key: true

      t.timestamps
    end
  end
end
