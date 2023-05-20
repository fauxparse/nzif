class AddPermissionsToUsers < ActiveRecord::Migration[7.0]
  def up
    change_table :users, bulk: true do |t|
      t.string :permissions, array: true, null: true
      t.remove :roles

      t.index :permissions, using: :gin
    end

    drop_enum 'role_name'
  end

  def down
    create_enum :role_name, %w[admin participant_liaison]

    execute <<~SQL.squish
      ALTER TABLE users ADD COLUMN roles role_name ARRAY DEFAULT '{}'::role_name[];
    SQL

    remove_column :users, :permissions
  end
end
