require 'rails_helper'
require_relative 'shared/activity_examples'

RSpec.describe Workshop do
  it_behaves_like 'an activity', type: :workshop
end
