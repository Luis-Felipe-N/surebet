from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from decouple import config
from stripePayment import createCheckoutSession

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(f'Olá, {update.effective_user.first_name}! Bem-vindo ao bot.')

async def comprar(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    telegramChatId = update.message.chat_id
    sessionUrl = createCheckoutSession(telegramChatId)
    await update.message.reply_text(f'Para comprar a assinatura, por favor clique no link: {sessionUrl}')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Aqui estão os comandos disponíveis:\n/start - Inicia o bot\n/help - Exibe esta mensagem de ajuda')

async def get_chat_id(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    chat_id = update.message.chat_id
    print(chat_id)
    await update.message.reply_text(f'O ID deste grupo/canal é: {chat_id}')

def main() -> None:
    telegramToken = config('TELEGRAM_BOT_TOKEN')
    application = ApplicationBuilder().token(telegramToken).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("comprar", comprar))
    application.add_handler(CommandHandler("get_chat_id", get_chat_id))

    application.run_polling()

if __name__ == '__main__':
    main()
