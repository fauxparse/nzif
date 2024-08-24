require 'sorted_set'

module Matchmaker
  class SortedList < Set
    attr_reader :session

    def initialize(session, *)
      super(*)
      @session = session
    end

    def pop
      largest = to_a.max
      delete largest
      largest
    end

    def delete(registration)
      super(find { |r| r.id == registration.id })
    end

    delegate :map, to: :sort
  end
end
