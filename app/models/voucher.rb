class Voucher < Payment
  def workshops=(workshops)
    self.amount = Registration.pricing.package_price(workshops:)
  end

  def workshops
    Registration.pricing.workshops_from_total(total: amount)
  end
end
