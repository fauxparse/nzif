class CreateRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :roles do |t|
      t.belongs_to :user, null: false, foreign_key: { on_delete: :cascade }
      t.string :name

      t.timestamps

      t.index %i[user_id name], unique: true
      t.index :name
    end
  end
end
