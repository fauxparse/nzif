class CreateShowWorkshops < ActiveRecord::Migration[7.0]
  def change
    create_table :show_workshops do |t|
      t.belongs_to :show, null: false, foreign_key: { to_table: :activities, obn_delete: :cascade }
      t.belongs_to :workshop, null: false,
        foreign_key: { to_table: :activities, on_delete: :cascade }

      t.timestamps
      t.index %i[show_id workshop_id], unique: true
    end
  end
end
