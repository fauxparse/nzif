class AddRefunds < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        add_enum_value :payment_type, 'Refund'
      end
    end
  end
end
