require 'rails_helper'

RSpec.describe ShortUrl do
  subject(:short) { build(:short_url) }

  it { is_expected.to be_valid }

  it { is_expected.to be_redirect }

  context 'with a clashing URL' do
    before do
      create(:short_url, url: short.url)
    end

    it 'is invalid' do
      expect { short.save! }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end

  context 'with a URL from bats.co.nz' do
    subject(:short) { build(:short_url, url: 'https://bats.co.nz/about-bats/news/new-zealand-improv-festival-2025/?_=a') }

    it { is_expected.to be_redirect }
  end

  context 'with a URL outside the correct domain' do
    subject(:short) { build(:short_url, url: 'https://example.com') }

    it { is_expected.not_to be_redirect }
  end
end
