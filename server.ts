import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse json
  app.use(express.json());

  // API Route: Health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Lazy load wrapper for Gemini to avoid crashing when GEMINI_API_KEY is missing
  function getGeminiClient() {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes("MY_GEMINI_API_KEY") || key === "") {
      return null;
    }
    try {
      return new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
      return null;
    }
  }

  // API Route: AI Smart Search Analysis
  app.post("/api/gemini/search-analyze", async (req, res) => {
    const { query, language } = req.body;
    try {
      const ai = getGeminiClient();

      if (!ai) {
        let text = "";
        if (language === "ru") {
          text = `**⚡ Q-GO AI Интеллект**: Вы искали "${query}". Наш сенсорный каталог рекомендует зайти во 2-й проход (Полка ПП / Спорт-Питание) или выбрать Органику. Также рекомендуем наше Фермерское Молоко 3.2% без лактозы!`;
        } else if (language === "kk") {
          text = `**⚡ Q-GO AI Интеллект**: Сіз "${query}" іздедіңіз. Біздің сенсорлық каталогымыз 2-ші өту жолына (ПП / спорттық тағамдар сөресі) баруды немесе Органиканы таңдауды ұсынады. Лактозасыз 3.2% ферма сүтіміз де тамаша таңдау болады!`;
        } else {
          text = `**⚡ Q-GO AI Intelligence**: You typed "${query}". Our smart cart recommends heading of Aisle 2 (Fitness / PP Shelves) or choosing organic fruit cups. Check out our Farm Fresh Organic Milk in Dairy section!`;
        }
        return res.json({ result: text, isMock: true });
      }

      const prompt = `You are the core AI product consultant of the Q-GO Smart Retail Retail Ecosystem.
The customer scanned or typed user query: "${query}" (Preferred language: ${language || 'en'}).
Instantly analyze query, classify it, and write a helpful analysis suggesting product category or shelf location. Keep it to 3 stylish sentences.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error("Gemini Search Analysis Error:", err);
      res.json({
        result: `⚡ Q-GO AI Analysis: Search completed for "${query}". Head to matching shelf area for premium items.`,
        error: err.message
      });
    }
  });

  // API Route: Chef Recipe Recommendation
  app.post("/api/gemini/recipe-suggest", async (req, res) => {
    try {
      const { items, language } = req.body;
      const ai = getGeminiClient();

      if (!ai || !items || items.length === 0) {
        let text = "";
        if (language === "ru") {
          text = `### 🧑‍🍳 Экспресс AI-Рецепт Q-GO
По вашему выбору (${items?.join(", ") || "Корзина пока пуста"}), мы рекомендуем быстрый фитнес-салат:
* **Ингредиенты**: Авокадо Хасс + свежий хлеб цельнозерновой + горсть голубики на гарнир.
* **Приготовление**: Подрумяньте хлеб, положите слайсы сочного сливочного авокадо и добавьте ягоды сверху. Запейте стаканом прохладного органического молока Turan.
* *Энергетическая ценность*: Сбалансировано (~380 ккал), богато клетчаткой и антиоксидантами!`;
        } else if (language === "kk") {
          text = `### 🧑‍🍳 Экспресс AI-Рецепт Q-GO
Себетіңіздегі (${items?.join(", ") || "Себет бос"}) негізінде, біз тез дайындалатын пайдалы салатты ұсынамыз:
* **Құрамы**: Хасс Авокадосы + балғын тұтас тұқымды нан + сәндеу үшін көкжидек.
* **Қадамдары**: Нанды кептіріп, үстіне балғын авокадо тілімдерін салыңыз. Органикалық сүт немесе Turan минералды суымен бірге қолданыңыз.
* *Құндылығы*: Өте пайдалы (~380 ккал), табиғи дәрумендер!`;
        } else {
          text = `### 🧑‍🍳 Q-GO Express AI Recipe
Based on your smart cart items (${items?.join(", ") || "No items currently in cart"}), we suggest a quick Healthy Toast:
* **Ingredients**: High-fiber bread sourdough + creamy Hass avocado + handpicked blueberries.
* **Process**: Toast the sourdough, arrange thin creamy Hass avocado slices, and top with antioxidants-rich blueberries. Serve with high-protein shake or pure water.
* *Calories*: Balanced nutrition (~380 kcal). Perfect pre-workout load!`;
        }
        return res.json({ result: text, isMock: true });
      }

      const prompt = `You are Chef Q-GO, the AI chef integrated inside the smart-cart screen.
The shopper has these ingredients in their shopping cart: ${items.join(", ")}.
Suggest a quick, delicious, eco-friendly recipe matching this selection. Format using beautiful concise markdown headers and bullet points.
Language: ${language || 'en'}. Ensure the reply matches this language precisely. Max 140 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error("Gemini Recipe Suggestion Error:", err);
      res.json({
        result: `### 🧑‍🍳 Quick Smart-Cart Combo\nSimply enjoy your milk, fresh bread bread and organic blueberries for a wonderful natural snack. Balanced and rich in vitamin and nutrient blocks!`
      });
    }
  });

  // Vite integration as middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Q-GO Server] Express server dynamically running on Host 0.0.0.0, Port ${PORT}`);
  });
}

startServer();
