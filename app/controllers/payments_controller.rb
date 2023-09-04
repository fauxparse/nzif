class PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:webhook]

  def webhook
    event = stripe_event

    return if event.blank?

    Payments::ProcessStripeEvent.call(event:)

    render json: { status: 'success' }
  end

  def create_intent
    payment_intent = Stripe::PaymentIntent.create(
      amount: params[:amount].to_i,
      currency: 'nzd',
      customer: customer&.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        registration_id: params[:registration_id],
      },
    )

    render json: { clientSecret: payment_intent.client_secret }
  rescue Stripe::StripeError => e
    render json: { error: e.message }, status: :bad_request
  end

  private

  def stripe_event
    payload = request.body.read

    # Retrieve the event by verifying the signature using the raw body and secret.
    signature = request.env['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = ENV.fetch('STRIPE_SIGNING_SECRET', nil)

    Stripe::Webhook.construct_event(payload, signature, endpoint_secret)
  rescue JSON::ParserError => e
    render json: { error: "⚠️  Malformed JSON data. #{e.message}" }, status: :bad_request
    nil
  rescue Stripe::SignatureVerificationError => e
    render json: { error: "⚠️  Webhook signature verification failed. #{e.message}" },
      status: :bad_request
    nil
  end

  def customer
    @customer ||=
      Payments::GetStripeCustomer.call(
        registration:,
        current_user:,
      ).customer
  end

  def registration
    @registration ||= Registration.find(params[:registration_id])
  end
end
