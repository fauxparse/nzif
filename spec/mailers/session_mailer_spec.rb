require 'rails_helper'

RSpec.describe SessionMailer do
  let(:message) { create(:message) }

  describe '#custom' do
    subject(:mail) { described_class.custom(message:, recipients:) }

    let(:recipients) { create_list(:user, 2) }

    its(:subject) { is_expected.to eq("NZIF: #{message.subject}") }
    its(:to) { is_expected.to eq(['registrations@improvfest.nz']) }
    its(:bcc) { is_expected.to eq(recipients.map(&:email)) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }
  end
end
