from flask import Flask, jsonify, request, redirect
import stripe
from telegram import Bot
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from decouple import config

app = Flask(__name__)
stripe.api_key = config('STRIPE_SECRET_KEY')
endpoint_secret = config('STRIPE_ENDPOINT_SECRET')
bot = Bot(token=config('TELEGRAM_BOT_TOKEN'))
group_chat_id = config('GROUP_CHAT_ID')  

@app.route('/success')
def payment_success():
    print('Pagamento concluído com sucesso.')
    return redirect("https://t.me/arbPropsBot")

@app.route('/webhook', methods=['POST'])
async def webhook():
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

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_checkout_session_completed(session)
    elif event['type'] == 'checkout.session.expired':
        session = event['data']['object']
        # Handle expired session if needed
    else:
        print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)

async def handle_checkout_session_completed(session):
    chat_id = session.get('client_reference_id')
    if chat_id:
        amount_total = session['amount_total'] / 100 
        currency = session['currency'].upper()
        message = f"Obrigado por sua compra! Seu pagamento de {amount_total} {currency} foi recebido com sucesso."
        await bot.send_message(chat_id=chat_id, text=message)
        invite_link = await bot.export_chat_invite_link(group_chat_id)
        await bot.send_message(chat_id=chat_id, text=f"Você pode acessar o grupo exclusivo através deste link: {invite_link}")
    else:
        print(f'Nenhum chat_id encontrado para a sessão: {session["id"]}')

if __name__ == '__main__':
    app.run(port=5000)
