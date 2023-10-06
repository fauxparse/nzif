module SMS
  class StandardisePhoneNumber < ApplicationInteractor
    def call
      skip_authorization!
      context.phone_number = standardise(context.phone_number)
    end

    def standardise(phone_number)
      p = Phony.normalize(phone_number)
      return "+#{p}" if Phony.plausible?(p)

      p = Phony.normalize("+64#{p}")
      return "+#{p}" if Phony.plausible?(p)

      nil
    end
  end
end
