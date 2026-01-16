import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Index from "./pages/Index";
import IdentificationPage from "./pages/IdentificationPage";
import Level1Page from "./pages/Level1Page";
import Level2Page from "./pages/Level2Page";
import Level3Page from "./pages/Level3Page";
import Level4Page from "./pages/Level4Page";
import Level5Page from "./pages/Level5Page";
import AutoEvaluationPage from "./pages/AutoEvaluationPage"; // ✅ Importé
import ResultPage from "./pages/ResultPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/identification" element={<IdentificationPage />} />
              <Route path="/niveau-1" element={<Level1Page />} />
              <Route path="/niveau-2" element={<Level2Page />} />
              <Route path="/niveau-3" element={<Level3Page />} />
              <Route path="/niveau-4" element={<Level4Page />} />
              <Route path="/niveau-5" element={<Level5Page />} />
              {/* 🔥 Nouvelle route : auto-évaluation */}
              <Route path="/auto-evaluation" element={<AutoEvaluationPage />} />
              <Route path="/resultat" element={<ResultPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}