module Sources
  class Accounts < BaseSource
    def fetch(registration_ids)
      records = Account.find(registration_ids).index_by(&:id)
      registration_ids.map { |id| records[id] }
    end
  end
end
