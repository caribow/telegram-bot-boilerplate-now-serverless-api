// src/index.ts
import { Telegraf } from 'telegraf';
import { handleMessage } from './lib/telegram';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
bot.on('text', handleMessage);

// 导出 webhook 处理函数供 api/index.ts 使用
export const startWebhook = async (req: any, res: any) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ ok: false, error: String(error) });
  }
};

// 仅在开发环境启动轮询模式
if (process.env.NODE_ENV !== 'production') {
  bot.launch();
}

// Enable graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
