from flask import Flask, jsonify, request, redirect
import stripe
from telegram import Bot
from decouple import config

app = Flask(__name__)
stripe.api_key = config('STRIPE_SECRET_KEY')
endpoint_secret = config('STRIPE_ENDPOINT_SECRET')
bot = Bot(token=config('TELEGRAM_BOT_TOKEN'))

@app.route('/success')
def payment_success():
    print('Pagamento concluído com sucesso.')
    return redirect("https://t.me/arbPropsBot")

@app.route('/webhook', methods=['POST'])
def webhook():
    event = None
    payload = request.data
    sig_header = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise e

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_payment_success(session)
    else:
      print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)

def handle_payment_success(session):
    telegram_user_id = session['metadata']['telegram_user_id']
    username = session['metadata']['username']
    bot.send_message(chat_id=telegram_user_id, text=f"Obrigado por comprar, {username}!")

if __name__ == '__main__':
    app.run(port=5000)
