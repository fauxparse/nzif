class AddRolesToUsers < ActiveRecord::Migration[7.0]
  def up
    execute <<~SQL.squish
      ALTER TABLE users
        ADD COLUMN roles role_name ARRAY DEFAULT '{}'::role_name[];
    SQL

    drop_table :roles
  end

  def down
    create_table :roles do |t|
      t.belongs_to :user, null: false, foreign_key: { on_delete: :cascade }
      t.enum :name, enum_type: :role_name, null: false

      t.timestamps

      t.index %i[user_id name], unique: true
      t.index :name
    end

    remove_column :users, :roles
  end
end
