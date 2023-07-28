class AddRegistrationDatesToFestival < ActiveRecord::Migration[7.0]
  def change
    change_table :festivals, bulk: true do |t|
      t.timestamp :earlybird_opens_at
      t.timestamp :earlybird_closes_at
      t.timestamp :general_opens_at
    end
  end
end
