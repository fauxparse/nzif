class CreatePeople < ActiveRecord::Migration[7.0]
  def change
    create_table :people do |t|
      t.belongs_to :activity, polymorphic: true, null: false
      t.belongs_to :profile, null: false, foreign_key: { on_delete: :restrict }
      t.string :role, null: false
      t.integer :position, null: false, default: 0

      t.timestamps

      t.index %i[activity_id activity_type role profile_id], name: 'index_people', unique: true
    end
  end
end
