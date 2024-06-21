class CreateHiddenSessions < ActiveRecord::Migration[7.0]
  def change
    create_table :hidden_sessions do |t|
      t.belongs_to :session, null: false, foreign_key: { on_delete: :cascade }
      t.belongs_to :user, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
      t.index %i[session_id user_id], unique: true
    end
  end
end
