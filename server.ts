import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI client server-side with required User-Agent
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Dynamic analysis endpoint using Gemini 3.5-flash to get custom CRM advisor justifications and scripts
  app.post('/api/nbanbo/analyze', async (req: express.Request, res: express.Response) => {
    try {
      const { clientData, rules, customPrompt } = req.body;
      if (!clientData) {
        return res.status(400).json({ error: 'Client data is required.' });
      }

      const prompt = `Vous êtes le moteur d'optimisation CRM de la banque. Analysez le dossier client suivant :
Données Client :
- ID Client: ${clientData.id}
- Segment: ${clientData.segment}
- Âge: ${clientData.age} ans
- Salaire domicilié: ${clientData.salaireDomicilie ? 'Oui' : 'Non'}
- Nombre de produits: ${clientData.produitsCount}
- Package actif: ${clientData.packageActif ? 'Oui' : 'Non'}
- Carte active: ${clientData.carteActive ? 'Oui' : 'Non'}
- Usage digital: ${clientData.usageDigital}
- Dernière opération: ${clientData.derniereOperationMois} mois
- Contacts récents (30j): ${clientData.contactsRecents}

Résultats des Règles Métier de base calculées :
- Client sous-équipé: ${rules.sousEquipe ? 'OUI' : 'NON'}
- Package détenu: ${rules.packageDetenu ? 'OUI' : 'NON'}
- Pression commerciale acceptable: ${rules.pressionAcceptable ? 'OUI' : 'NON'}
- Éligibilité crédit: ${rules.eligibiliteCredit ? 'OUI' : 'NON'}
- Conventionné: ${rules.conventionne ? 'OUI' : 'NON'}

${customPrompt ? `Consigne spécifique de l'utilisateur : "${customPrompt}"` : ''}

Générez une analyse hyper-précise et structurée pour le conseiller bancaire. La réponse doit être en JSON avec la structure exacte demandée.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: "Vous êtes un expert en CRM bancaire et en marketing relationnel (Next Best Option / Next Best Action). Vos recommandations de contact et d'offres doivent être argumentées avec rigueur pour optimiser l'ancrage et la réactivation des clients dormants.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['recommendedNbo', 'recommendedNba', 'recommendedChannel', 'priority', 'justification', 'salesPitch', 'smsScript'],
            properties: {
              recommendedNbo: {
                type: Type.STRING,
                description: "Le produit ou service optimal recommandé (ex: 'Package conventionné', 'Carte bancaire', 'Activation digitale', 'Crédit consommation', 'Pas d'offre')."
              },
              recommendedNba: {
                type: Type.STRING,
                description: "L'action prioritaire à mener (ex: 'Appel conseiller', 'SMS personnalisé', 'Notification mobile', 'Invitation agence', 'Ne pas contacter')."
              },
              recommendedChannel: {
                type: Type.STRING,
                description: "Le canal de distribution recommandé (ex: 'Téléphone', 'Mobile App', 'SMS', 'Agence')."
              },
              priority: {
                type: Type.STRING,
                description: "Le niveau d'urgence calculé: 'Haute', 'Moyenne', 'Faible' ou 'Critique'."
              },
              justification: {
                type: Type.STRING,
                description: "Une phrase synthétique résumant pourquoi cette recommandation a été formulée en se basant sur les scores d'dormance et d'équipement."
              },
              salesPitch: {
                type: Type.STRING,
                description: "Un argumentaire de vente en 3-4 points clés pour guider le conseiller lors de son échange téléphonique ou physique avec le client."
              },
              smsScript: {
                type: Type.STRING,
                description: "Un script d'un message SMS court (max 160 car.) ultra-percutant, rédigé de façon professionnelle mais chaleureuse."
              }
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Aucune réponse reçue du modèle AI.');
      }

      res.json(JSON.parse(responseText.trim()));
    } catch (err: any) {
      console.error('Error in /api/nbanbo/analyze:', err);
      res.status(500).json({ error: err.message || "Une erreur est survenue lors de l'analyse IA." });
    }
  });

  // Conversational advisor chatbot route
  app.post('/api/nbanbo/chat', async (req: express.Request, res: express.Response) => {
    try {
      const { clientData, history = [], userMessage } = req.body;
      if (!clientData || !userMessage) {
        return res.status(400).json({ error: 'Données client et message requis.' });
      }

      const formattedContents = [
        {
          role: 'user',
          parts: [{ text: `Je travaille actuellement sur le dossier client suivant :
ID Client: ${clientData.id}
Segment: ${clientData.segment}
Age: ${clientData.age} ans
Dernière opération: ${clientData.derniereOperationMois} mois
Moteur recommandation: NBO recommandé: ${clientData.nboRecommendation || 'Package conventionné'}, NBA: ${clientData.nbaRecommendation || 'Appel conseiller'}, Canal: ${clientData.canalRecommendation || 'Téléphone'}.

S'il s'agit du début de la discussion, présentez-vous brièvement comme l'Assistant Intelligent d'Aide à la Décision CRM (conçu pour optimiser l'ancrage et la réactivation des dormants).
Répondez aux questions avec professionnalisme bancaire, formulez des propositions de scripts d'appel hyper percutants, ou proposez des techniques d'approche selon son profil et segment.` }]
        }
      ];

      // Multi-turn translation
      if (history && history.length > 0) {
        for (const item of history) {
          formattedContents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }]
          });
        }
      }

      // Latest message
      formattedContents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: "Vous êtes l'Oracle CRM Interactif de la banque. Vous conseillez les directeurs d'agence et chargés de clientèle avec une expertise poussée en techniques de rebond commercial, gestion de l'insatisfaction ou d'ancrage relationnel. Vos réponses doivent être rédigées en Français, claires, dynamiques, structurées avec du Markdown."
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('Error in /api/nbanbo/chat:', err);
      res.status(500).json({ error: err.message || "Une erreur est survenue durant l'échange." });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`[NBA/NBO server] Listening on port ${port}`);
  });
}

startServer();
