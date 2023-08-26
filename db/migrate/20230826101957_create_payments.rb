class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_enum :payment_type, %w[CreditCardPayment InternetBankingPayment Voucher]
    create_enum :payment_state, %w[pending approved cancelled failed]

    create_table :payments do |t|
      t.belongs_to :registration, null: false, foreign_key: true
      t.enum :type, enum_type: :payment_type, null: false
      t.enum :state, enum_type: :payment_state, null: false, default: 'pending'
      t.integer :amount_cents, null: false
      t.string :reference
      t.text :notes

      t.index %i[registration_id type]

      t.timestamps
    end
  end
end
