class RemoveOldPermissionsColumn < ActiveRecord::Migration[7.1]
  def up
    remove_column :users, :old_permissions
  end

  def down
    add_column :users, :old_permissions, :string, array: true, default: []
  end
end
