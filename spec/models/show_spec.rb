require 'rails_helper'
require_relative 'shared/activity_examples'

RSpec.describe Show do
  it_behaves_like 'an activity', type: :show
end
