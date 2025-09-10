require 'rails_helper'

RSpec.describe 'ShortUrls' do
  describe 'GET /:id' do
    context 'with an existing short URL' do
      let!(:short) { create(:short_url) }

      it 'redirects to the URL' do
        get short_url(short, host: Domains::Short::DOMAIN)

        expect(response).to redirect_to(short.url)
      end

      it 'increments the counter' do
        expect do
          get short_url(short, host: Domains::Short::DOMAIN)
          short.reload
        end.to change(short, :counter).by(1)
      end
    end

    context 'with a bad param' do
      it 'returns 404' do
        get short_url('bad', host: Domains::Short::DOMAIN)

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'from the main domain' do
      it 'does not redirect' do
        skip 'flaky'

        get short_url('bad', host: Domains::Main::DOMAIN)

        expect(response).not_to have_http_status(:moved_permanently)
      end
    end

    context 'to an external domain' do
      let!(:short) { create(:short_url, url: 'https://example.com') }

      it 'does not redirect' do
        get short_url(short, host: Domains::Short::DOMAIN)

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
