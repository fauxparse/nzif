class DateTimeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?

    validate_after(record, attribute, value)
    validate_same(record, attribute, value)
  end

  private

  def fetch_option(record, option)
    record.send options[option]
  end

  def validate_after(record, attribute, value)
    return unless options[:after]

    limit = fetch_option(record, :after)
    record.errors.add(attribute, "must be after #{limit}") if value <= limit
  end

  def validate_same(record, attribute, value)
    options.each do |option, _limit|
      next unless option.to_s =~ /\Asame_(.+)\z/

      component = ::Regexp.last_match(1)
      other = fetch_option(record, option)
      other_value = other.respond_to?(component) ? other.send(component) : other

      unless value.send(component) == other_value
        record.errors.add(attribute, "must be the same #{component} as #{other}")
      end
    end
  end
end
