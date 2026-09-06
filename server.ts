import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const tasks = [
  {
    id: 't1',
    title: 'Design Logo',
    status: 'todo',
    priority: 'high',
    clientId: 'c1',
    clientName: 'Acme Corp',
    projectId: 'p1',
    projectName: 'Rebranding',
    noteId: 'n1',
    pomodoros: 2,
    dueDate: '2023-11-15T00:00:00.000Z',
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Wirapreneur APIs
  app.get('/api/tasks', (req, res) => res.json(tasks));
  app.post('/api/tasks', (req, res) => {
    const newTask = { id: `t${Date.now()}`, ...req.body, pomodoros: 0, status: 'todo' };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });
  app.patch('/api/tasks/:id/status', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (task) { task.status = req.body.status; res.json(task); } 
    else res.status(404).json({ error: 'Task not found' });
  });
  app.post('/api/tasks/:id/pomodoro', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (task) { task.pomodoros += 1; res.json(task); } 
    else res.status(404).json({ error: 'Task not found' });
  });
  app.post('/api/invoices/generate', async (req, res) => {
    try {
      const PDFDocument = (await import('pdfkit')).default;
      const { clientId, clientName, tasks: taskIds } = req.body;
      const invoiceTasks = tasks.filter(t => taskIds.includes(t.id));
      if (!invoiceTasks.length) return res.status(400).json({ error: 'No tasks' });
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice_${clientName || 'Client'}_${Date.now()}.pdf`);
      doc.pipe(res);
      doc.fontSize(20).text('INVOICE', { align: 'right' });
      doc.moveDown();
      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // FinancePile APIs
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, dataContext } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const systemPrompt = `Anda adalah asisten keuangan pribadi. Konteks: ${JSON.stringify(dataContext)}`;
      let validMessages = messages;
      while (validMessages.length > 0 && validMessages[0].role === 'model') validMessages = validMessages.slice(1);
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: validMessages,
        config: { systemInstruction: systemPrompt }
      });
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');
      for await (const chunk of responseStream) if (chunk.text) res.write(chunk.text);
      res.end();
    } catch (error: any) {
      if (!res.headersSent) res.status(500).json({ error: error.message });
      else res.end();
    }
  });

  // Syariah APIs
  app.get("/api/quotes", async (req, res) => {
    try {
      const tickers = {
        'issi': 'ISSI.JK',
        'jii': '^JKII',
        'jii70': 'JII70.JK',
        'djimi': '^DJIMI',
        'msci': '^136210-USD-STRD',
        'sp500sh': '^SP500SH',
        'gold': 'GC=F',
        'silver': 'SI=F',
        'usdidr': 'IDR=X'
      };
      const results: Record<string, any> = {};

      for (const [key, symbol] of Object.entries(tickers)) {
        try {
          const quote = await yahooFinance.quote(symbol);
          results[key] = {
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent
          };
        } catch (e) {
          console.error(`Failed to fetch ${symbol}`, e);
          results[key] = null;
        }
      }

      // Hitung harga emas, perak, dinar, dan dirham dalam IDR
      if (results.gold && results.silver && results.usdidr) {
        const usdidr = results.usdidr.price;
        const TROY_OUNCE_TO_GRAM = 31.1034768;
        
        const goldGramIdrPrice = (results.gold.price / TROY_OUNCE_TO_GRAM) * usdidr;
        const silverGramIdrPrice = (results.silver.price / TROY_OUNCE_TO_GRAM) * usdidr;

        // Emas & Perak (per gram)
        results.emas = { price: goldGramIdrPrice };
        results.perak = { price: silverGramIdrPrice };

        // Dinar (4.25 gr Emas) & Dirham (2.975 gr Perak)
        results.dinar = { price: goldGramIdrPrice * 4.25 };
        results.dirham = { price: silverGramIdrPrice * 2.975 };
      }

      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}
startServer();
