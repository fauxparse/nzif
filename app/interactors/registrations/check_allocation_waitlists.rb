module Registrations
  class CheckAllocationWaitlists < ApplicationInteractor
    delegate :allocation, to: :context

    def call
      skip_authorization!

      matchmaker.registrations.each_value do |registration|
        check_waitlist(registration)
      end

      allocation.save!
    end

    private

    def matchmaker
      allocation.data
    end

    def check_waitlist(registration)
      registration.preferences.each_pair do |slot_id, preferences|
        selected = registration.placements[slot_id] || 1000
        preferences.select { |(p, _)| p < selected }.each_value do |session_id|
          session = matchmaker.sessions[session_id]
          next if session.waitlist.include?(registration)

          puts "#{registration.name} missing from the waitlist for #{session.name}" # rubocop:disable Rails/Output
          session.waitlist << registration
        end
      end
    end
  end
end
