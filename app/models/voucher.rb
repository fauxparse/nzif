class Voucher < Payment
  def workshops=(workshops)
    self.amount = Registration.pricing.package_price(workshops:)
  end
end
