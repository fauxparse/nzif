class AddBookingUrlAndSuitabilityToActivities < ActiveRecord::Migration[7.0]
  def change
    change_table :activities, bulk: true do |t|
      t.string :booking_link, null: true
      t.text :suitability, null: true
    end
  end
end
