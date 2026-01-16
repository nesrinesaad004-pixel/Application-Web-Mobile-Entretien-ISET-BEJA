import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StudentResult {
  nom: string;
  prenom: string;
  groupe: string;
  niveau: string;
  specialite: string;
  score: number;
  completedLevels: number[];
  durationSeconds: number;
  durationFormatted: string;
  levelResults: {
    level: number;
    title: string;
    completed: boolean;
  }[];
}

interface EmailRequest {
  professorEmail: string;
  studentResult: StudentResult;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { professorEmail, studentResult }: EmailRequest = await req.json();

    console.log("Sending email to:", professorEmail);
    console.log("Student result:", studentResult);

    const levelResultsHtml = studentResult.levelResults
      .map(
        (result) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Niveau ${result.level}: ${result.title}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; ${
              result.completed
                ? "background-color: #dcfce7; color: #166534;"
                : "background-color: #fee2e2; color: #991b1b;"
            }">
              ${result.completed ? "✓ Complété" : "✗ Non complété"}
            </span>
          </td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Résultats de simulation d'entretien</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Résultats de Simulation</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Entretien Professionnel</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <!-- Student Info -->
          <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">👤 Informations de l'étudiant</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Nom complet:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${studentResult.prenom} ${studentResult.nom}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Niveau:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${studentResult.niveau}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Spécialité:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${studentResult.specialite}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Groupe:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${studentResult.groupe}</td>
              </tr>
            </table>
          </div>

          <!-- Score -->
          <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">🏆 Score Final</h2>
            <div style="font-size: 48px; font-weight: bold; color: ${studentResult.score >= 80 ? '#16a34a' : studentResult.score >= 60 ? '#ca8a04' : '#dc2626'};">
              ${studentResult.score}%
            </div>
            <p style="color: #6b7280; margin: 10px 0 0 0;">
              ${studentResult.completedLevels.length}/5 niveaux complétés
            </p>
          </div>

          <!-- Duration -->
          <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">⏱️ Durée du test</h2>
            <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">
              ${studentResult.durationFormatted}
            </div>
          </div>

          <!-- Level Results -->
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">📊 Détail par niveau</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Niveau</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Statut</th>
                </tr>
              </thead>
              <tbody>
                ${levelResultsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            Email généré automatiquement par le simulateur d'entretien
          </p>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Simulateur Entretien <onboarding@resend.dev>",
        to: [professorEmail],
        subject: `Résultats de ${studentResult.prenom} ${studentResult.nom} - Score: ${studentResult.score}% - Durée: ${studentResult.durationFormatted}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-results-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
