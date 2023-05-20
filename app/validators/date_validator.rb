class DateValidator < DateTimeValidator
  def validate_each(record, attribute, value)
    super

    return if value.blank?

    validate_on_or_before(record, attribute, value)
    validate_on_or_after(record, attribute, value)
  end

  private

  def validate_on_or_before(record, attribute, value)
    return unless options[:on_or_before]

    limit = fetch_option(record, :on_or_before).to_date
    record.errors.add(attribute, "must be on or before #{limit}") if value.to_date > limit
  end

  def validate_on_or_after(record, attribute, value)
    return unless options[:on_or_after]

    limit = fetch_option(record, :on_or_after).to_date
    record.errors.add(attribute, "must be on or after #{limit}") if value.to_date < limit
  end
end
