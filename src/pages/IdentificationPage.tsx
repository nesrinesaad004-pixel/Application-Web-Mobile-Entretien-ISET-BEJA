import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, User, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function IdentificationPage() {
  const navigate = useNavigate();
  const { setStudentInfo } = useGame();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    specialite: 'Informatique',
    professorEmail: 'isetentretien499@gmail.com'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      toast.error('Veuillez entrer votre nom');
      return false;
    }
    if (!formData.prenom.trim()) {
      toast.error('Veuillez entrer votre prénom');
      return false;
    }
    if (!formData.professorEmail.trim()) {
      toast.error('Veuillez entrer l\'email du professeur');
      return false;
    }
    // Vérifie le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.professorEmail)) {
      toast.error('Veuillez entrer un email valide');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Sauvegarde les infos dans le contexte
    setStudentInfo({
      nom: formData.nom,
      prenom: formData.prenom,
      groupe: '', // Optionnel — tu peux ajouter un champ "Groupe" si besoin
      niveau: '', // Optionnel — tu peux ajouter un champ "Niveau"
      specialite: formData.specialite,
      professorEmail: formData.professorEmail
    });

    // Redirige vers le niveau 1
    navigate('/niveau-1');
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Renseignez vos informations pour commencer
          </h1>
          <p className="text-muted-foreground">
            Ces informations seront utilisées pour personnaliser votre expérience.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
              <Input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
              <Input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Spécialité</label>
            <Select
              name="specialite"
              value={formData.specialite}
              onValueChange={(value) => setFormData(prev => ({ ...prev, specialite: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez votre spécialité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Informatique">Informatique</SelectItem>
                <SelectItem value="électrique">électrique</SelectItem>
                <SelectItem value="Mécanique">Mécanique</SelectItem>
          
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Email du professeur</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="email"
                name="professorEmail"
                value={formData.professorEmail}
                onChange={handleChange}
                placeholder="entretien@iset.tn"
                className="pl-10 w-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Les résultats seront envoyés à cette adresse
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
          >
            Commencer le jeu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}