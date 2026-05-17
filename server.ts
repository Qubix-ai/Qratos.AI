import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Port & Host
const PORT = 3000;
const HOST = "0.0.0.0";

// Load config safely
const firebaseConfigPath = path.resolve(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));

// Lazy initialization helpers
let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let genAI: GoogleGenAI;

function getDb() {
  if (!db) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    db = admin.firestore(firebaseConfig.firestoreDatabaseId);
  }
  return db;
}

function getAuth() {
  if (!auth) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    auth = admin.auth();
  }
  return auth;
}

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAI = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

const app = express();
app.use(cors());
app.use(express.json());

const COPYWRITING_SYSTEM_PROMPT = `
You are Qratos (pronounced 'Kray-tos'), a hyper-specialized AI copywriting operating system. 
Your core persona is a blend of Claude 3.5 Opus, an expert direct response copywriter (like David Ogilvy or Gary Halbert), and a behavioral psychologist.

CORE POSITIONING:
“Claude-level writing quality specifically optimized for conversion psychology, persuasion, launches, funnels, and marketing.”

SPECIALIZATION:
- Landing pages & Sales pages (Focus on PAS: Problem, Agitate, Solution)
- Email sequences (Focus on storytelling and hooks)
- VSL scripts & Webinar scripts
- Ad copy (FB, IG, Google, LinkedIn)
- High-level brand positioning
- Conversion-focused headlines
- SaaS and eCommerce copywriting
- Persuasive frameworks (AIDA, PAS, FAB, BAB, etc.)

GUIDELINES:
1. Avoid generic AI corporate fluff. Use punchy, emotional, and persuasive language.
2. Focus on "What's in it for the reader?".
3. Always use psychological triggers like social proof, scarcity, urgency, and authority where appropriate.
4. Your tone is premium, expert, and results-driven.
5. If the user asks for non-marketing tasks, politely decline and remind them you are a specialized copywriting OS.
6. Provide actionable, high-conversion copy every time.
`;

// Helper to check credits
async function checkAndDeductCredits(uid: string) {
  const database = getDb();
  const userRef = database.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const now = new Date();
    const data = {
      email: "",
      isAdmin: false,
      totalCredits: 20,
      remainingCredits: 19,
      lastResetDate: now.toISOString(),
      createdAt: now.toISOString(),
    };
    await userRef.set(data);
    return { canProceed: true, remaining: 19 };
  }

  const userData = userDoc.data()!;
  const now = new Date();
  const lastReset = new Date(userData.lastResetDate || now.toISOString());
  
  if (now.toDateString() !== lastReset.toDateString()) {
    await userRef.update({
      remainingCredits: 20,
      lastResetDate: now.toISOString(),
    });
    return { canProceed: true, remaining: 19 };
  }

  if (userData.remainingCredits <= 0) {
    return { canProceed: false, remaining: 0 };
  }

  const newCredits = userData.remainingCredits - 1;
  await userRef.update({ remainingCredits: newCredits });
  return { canProceed: true, remaining: newCredits };
}

// Middleware to verify Auth
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const firebaseAuth = getAuth();
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(403).json({ error: "Invalid token" });
  }
};

// API Routes
app.post("/api/chat", authenticateToken, async (req: any, res: any) => {
  const { messages, conversationId, stream = true } = req.body;
  const uid = req.user.uid;

  try {
    const creditStatus = await checkAndDeductCredits(uid);
    if (!creditStatus.canProceed) {
      return res.status(403).json({ error: "No daily credits remaining. Reset in 24h." });
    }

    const lastMessage = messages[messages.length - 1].content;
    const database = getDb();
    
    await database.collection("prompts").add({
      userId: uid,
      originalPrompt: lastMessage,
      createdAt: new Date().toISOString(),
    });

    const ai = getGenAI();

    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const result = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction: COPYWRITING_SYSTEM_PROMPT,
        },
      });

      for await (const chunk of result) {
        const text = chunk.text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction: COPYWRITING_SYSTEM_PROMPT,
        },
      });
      res.json({ text: result.text, remainingCredits: creditStatus.remaining });
    }

    await database.collection("analytics").add({
      userId: uid,
      eventType: "ai_generation",
      createdAt: new Date().toISOString(),
      metadata: { conversationId }
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

app.get("/api/user/me", authenticateToken, async (req: any, res: any) => {
  const database = getDb();
  const userRef = database.collection("users").doc(req.user.uid);
  let userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    const now = new Date();
    await userRef.set({
      email: req.user.email,
      displayName: req.user.name || "User",
      photoURL: req.user.picture || "",
      isAdmin: req.user.email === "salmanhossain75313@gmail.com",
      totalCredits: 20,
      remainingCredits: 20,
      lastResetDate: now.toISOString(),
      createdAt: now.toISOString(),
    });
    userDoc = await userRef.get();
  }

  res.json(userDoc.data());
});

app.get("/api/admin/stats", authenticateToken, async (req: any, res: any) => {
  const database = getDb();
  const userRef = database.collection("users").doc(req.user.uid);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists || !userDoc.data()?.isAdmin) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const usersCount = (await database.collection("users").count().get()).data().count;
    const promptsCount = (await database.collection("prompts").count().get()).data().count;
    const conversationsCount = (await database.collection("conversations").count().get()).data().count;
    
    const activity = await database.collection("analytics")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();
    
    res.json({
      totalUsers: usersCount,
      totalPrompts: promptsCount,
      totalConversations: conversationsCount,
      recentActivity: activity.docs.map(d => d.data()),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

async function startServer() {
  try {
    const isProd = process.env.NODE_ENV === "production";
    
    if (!isProd) {
      console.log("Starting Vite in middleware mode...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req: any, res: any) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, HOST, () => {
      console.log(`[Qratos] Server listening at http://${HOST}:${PORT}`);
      console.log(`[Qratos] Mode: ${isProd ? "production" : "development"}`);
    });
  } catch (err) {
    console.error("Critical: Server failed to start:", err);
    process.exit(1);
  }
}

startServer();
