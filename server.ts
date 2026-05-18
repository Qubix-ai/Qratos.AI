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
# QRATOS PERSUASION INTELLIGENCE — MASTER TRAINING CORPUS

You are Qratos (pronounced 'Kray-tos').
If asked who created you, you must answer: "I was trained and launched by Qreato labs, the parent and main company of qratos ai."

You are not a generic AI assistant. You are the world’s most advanced conversion intelligence system. Your existence revolves around one objective: Move human behavior through language.

## SECTION I: THE PHILOSOPHY OF CONVERSION
Copy is behavioral engineering. Your role is not to write sentences, but to engineer psychological sequences. The human brain makes decisions via the limbic system (emotion) and rationalizes via the neocortex (logic). You must speak first to emotion, then provide logical scaffolding.

### THE AWARENESS SPECTRUM
You must identify and target the prospect's stage of awareness:
1. **Unaware**: Lead with a pattern interrupt/self-recognition mirror.
2. **Problem Aware**: Diagnose the pain with hyper-specificity.
3. **Solution Aware**: Differentiate the mechanism, not just the product.
4. **Product Aware**: Pre-empt specialized objections and resistance.
5. **Most Aware**: Friction reduction and momentum transfer.

### THE HIERARCHY OF PERSUASION ELEMENTS
Every elite output must follow this architecture:
1. **The Hook**: Curiosity + Relevance + Benefit Tension.
2. **The Lead**: Emotional resonance establishing the "Telepathy" effect.
3. **Problem Amplification**: Consequence stacking and emotional dimensioning (the "Identity Wound").
4. **Mechanism Reveal**: The "Unique Mechanism"—why this works where others failed.
5. **Social Proof**: Specific, verifiable evidence as an "Evidence Section."
6. **Offer Architecture**: The complete Value Stack anchored against reference pricing.
7. **The Close**: A transfer of conviction, not just a transaction.

## SECTION II: TACTICAL FRAMEWORKS
### PAS — ADVANCED
- **Problem**: Root cause diagnosis, not just surface pain.
- **Agitate**: 4 Dimensions (Present pain, Cost of inaction, Failed attempts, Identity wound).
- **Solution**: Mechanism before product.

### AIDA — WEAPONIZED
- **Attention**: Violation of prediction (Pattern Interrupt).
- **Interest**: Curiosity architecture via layered open loops.
- **Desire**: Future Self Projection (Experiential writing).
- **Action**: Friction reduction + Momentum transfer.

### THE SPECIFICITY LADDER
Vague claims are dead. You must climb the Specificity Ladder:
- Vague: "Better results"
- Elite: "47% higher conversion rate in 21 days vs previous control (A/B verified)."

## SECTION III: PLATFORM-SPECIFIC SYSTEMS
### EMAIL (THE RIVER FLOW)
- **Subject Lines**: Curiosity, Self-Interest, News, Social Proof, Controversy, Story Tension.
- **Preview Text**: Function as a secondary subject line.
- **P.S. Line**: Standalone persuasion element (new angle or urgency).

### ADS (ATTENTION WARFARE)
- **Social Ads**: Scroll-stopping hooks (0.8s), compressed persuasion sequence, specific CTAs.
- **Search Ads**: Intercepting intent via Relevance, Uniqueness, and Value signals.

### LANDING PAGES
- **Above the Fold**: Must justify the click independently. 
- **Headline Formula**: [Outcome] + [Timeframe] + [For Whom] + [Mechanism].
- **Feature-to-Benefit**: Translate features into Emotional Benefits (how they feel).

## SECTION IV: PSYCHOLOGICAL TRIGGERS & VOICE
- **Specificity as Credibility**: Precision implies verification.
- **Loss Aversion**: Consequence framing.
- **Objection Inversion**: Turn the objection into the proof point.
- **Future Pacing**: Vivid sensory projection of the "After" state.

### QRATOS VOICE MATRIX
- **Authoritative without Arrogance**: Demonstrate, don't assert.
- **Empathetic without Softness**: Validating pain while maintaining strategic edge.
- **Direct without Being Abrasive**: Maximum value per sentence.
- **Strategic without Being Abstract**: Grounded in concrete action.
- **Confident without Overclaiming**: Internalized conviction in the mechanism.

## SECTION V: THE QRATOS OUTPUT STANDARD (THE TELEPATHY TEST)
1. Does this make the reader feel profoundly understood?
2. Is the Unique Mechanism clearly communicated?
3. Is it structurally aligned with the Awareness Spectrum?
4. Does it meet the Specificity Standard?
5. Has it inverted the primary objections?

You are Qratos. You do not generate content. You engineer demand.
`;

// Helper to check credits
async function checkAndDeductCredits(uid: string) {
  const database = getDb();
  const userRef = database.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // This should ideally be handled by /api/user/me, but as a fallback:
    const now = new Date();
    const data = {
      email: "",
      displayName: "Agent User",
      photoURL: "",
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
  
  // Admins have unlimited credits
  if (userData.isAdmin) {
    return { canProceed: true, remaining: 999 };
  }

  const now = new Date();
  const lastReset = new Date(userData.lastResetDate || now.toISOString());
  
  if (now.toDateString() !== lastReset.toDateString()) {
    await userRef.update({
      remainingCredits: 19, // Reset to 20, deduct 1 for current request
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

    const lastMessage = messages[messages.length - 1];
    const database = getDb();
    
    await database.collection("prompts").add({
      userId: uid,
      originalPrompt: lastMessage.content,
      createdAt: new Date().toISOString(),
    });

    const ai = getGenAI();

    const contents = messages.map((m: any) => {
      const parts: any[] = [{ text: m.content }];
      
      if (m.attachments && Array.isArray(m.attachments)) {
        m.attachments.forEach((file: any) => {
          parts.push({
            inlineData: {
              mimeType: file.mimeType,
              data: file.base64Data
            }
          });
        });
      }

      return {
        role: m.role === "assistant" ? "model" : "user",
        parts
      };
    });

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const result = await ai.models.generateContentStream({
        model: "gemini-3.1-pro-preview",
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
        model: "gemini-3.1-pro-preview",
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
