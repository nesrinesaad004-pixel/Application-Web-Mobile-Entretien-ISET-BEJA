import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, Clock, Trophy, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentResult {
  id: string;
  nom: string;
  prenom: string;
  groupe: string;
  niveau: string;
  specialite: string;
  score: number;
  duration_seconds: number | null;
  created_at: string;
  level1_score: number | null;
  level2_score: number | null;
  level3_score: number | null;
  level4_score: number | null;
  level5_score: number | null;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
      } else {
        setResults(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Tableau de bord Professeur
              </h1>
              <p className="text-muted-foreground">Résultats des étudiants</p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchResults} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Actualiser
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{results.length}</p>
                <p className="text-sm text-muted-foreground">Étudiants</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Score moyen</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {results.length > 0 ? formatDuration(
                    Math.round(results.reduce((sum, r) => sum + (r.duration_seconds || 0), 0) / results.length)
                  ) : '-'}
                </p>
                <p className="text-sm text-muted-foreground">Durée moyenne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Étudiant</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Groupe</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Spécialité</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Durée</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Chargement...
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Aucun résultat pour le moment
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {result.prenom} {result.nom}
                          </p>
                          <p className="text-sm text-muted-foreground">{result.niveau}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{result.groupe}</td>
                      <td className="px-4 py-3 text-foreground">{result.specialite}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium",
                          result.score >= 80 ? "bg-success/10 text-success" :
                          result.score >= 60 ? "bg-warning/10 text-warning" :
                          "bg-destructive/10 text-destructive"
                        )}>
                          {result.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-foreground">
                        {formatDuration(result.duration_seconds)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {formatDate(result.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
