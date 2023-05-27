class ChangePreferencesToSettings < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :preferences, :settings
  end
end
