module SMS
  class Send < ApplicationInteractor
    delegate :to, :body, to: :context

    TEST_NUMBER_DIGEST = '216a385a7c33dd0639d57820dae906dc5885539e'.freeze

    def call
      skip_authorization!
      client.sms_send_post(messages) if phone_number.present?
    end

    def phone_number
      @phone_number ||= StandardisePhoneNumber.call(phone_number: to).phone_number
    end

    def messages
      ClickSendClient::SmsMessageCollection.new.tap do |collection|
        collection.messages = [
          ClickSendClient::SmsMessage.new(
            to: phone_number,
            source: 'sdk',
            body:,
          ),
        ]
      end
    end

    def client
      @client ||= ClickSendClient::SMSApi.new
    end

    def sms_enabled?
      Rails.env.production? || Digest::SHA1.hexdigest(phone_number) == TEST_NUMBER_DIGEST
    end
  end
end
