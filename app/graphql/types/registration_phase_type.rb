module Types
  class RegistrationPhaseType < BaseEnum
    value 'Pending', 'Pending', value: :pending
    value 'Earlybird', 'Earlybird', value: :earlybird
    value 'Paused', 'Paused', value: :paused
    value 'General', 'General', value: :general
    value 'Closed', 'Closed', value: :closed
  end
end
