class RenamePermissionsColumn < ActiveRecord::Migration[7.1]
  def up
    rename_column :users, :permissions, :old_permissions
    rename_column :users, :permissions_array, :permissions
  end

  def down
    rename_column :users, :permissions, :permissions_array
    rename_column :users, :old_permissions, :permissions
  end
end
