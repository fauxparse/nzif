class AddPhoneToProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :phone, :string, limit: 32
  end
end
