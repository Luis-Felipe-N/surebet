import stripe
from decouple import config

stripe.api_key = config('STRIPE_SECRET_KEY')

def createCheckoutSession():
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'brl',
                'product_data': {
                    'name': 'Assinatura do serviço arbProps',
                },
                'unit_amount': 7500,  
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='http://127.0.0.1:5000/success',
        cancel_url='https://seusite.com/cancelamento',
    )
    return session.url
