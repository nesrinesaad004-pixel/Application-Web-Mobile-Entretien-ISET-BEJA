import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Target, Sparkles } from 'lucide-react';
import { Briefcase, Users, Target, Sparkles, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';


export default function WelcomePage() {
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();



  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo / Badge */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card/20 backdrop-blur-sm border border-primary-foreground/20 shadow-xl">
            <Briefcase className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground text-center mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          L'Entretien,
          <br />
          <span className="text-accent">étape par étape</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-primary-foreground/80 text-center max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Simulation immersive d'un processus de recrutement réel chez{' '}
          <span className="font-semibold text-primary-foreground">TechTunis</span>
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl w-full">
          {[
            { icon: Target, title: "5 Niveaux", desc: "Progressez étape par étape" },
            { icon: Users, title: "Interactif", desc: "Mises en situation réelles" },
            { icon: Sparkles, title: "Immersif", desc: "Voix off et animations" },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-primary-foreground/10 animate-fade-in"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-primary-foreground">{feature.title}</p>
                <p className="text-sm text-primary-foreground/70">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
<div className="text-center mt-8">
  <button
    onClick={() => setShowQR(!showQR)}
    className="flex items-center gap-2 px-4 py-2 rounded-lg 
               bg-blue-600 text-white hover:bg-blue-700 
               transition-colors shadow-md"
  >
    {showQR ? (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="16"></line>
        </svg>
        Masquer le QR Code
      </>
    ) : (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M7 7h10v10H7z"></path>
        </svg>
        Afficher le QR Code 
      </>
    )}
  </button>

  {showQR && (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-lg max-w-xs mx-auto">
      <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://application-web-mobile-entretien-is.vercel.app" 
        alt="QR Code pour jouer sur mobile"
        className="w-full h-auto"
      />
      <p className="text-sm text-gray-500 mt-2 text-center">
        Scannez pour jouer sur mobile
      </p>
    </div>
  )}
</div>
        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
          <Button
            size="xl"
            variant="outline"
            onClick={() => navigate('/identification')}
            className="bg-card/90 text-primary border-0 hover:bg-card hover:text-primary shadow-xl hover:shadow-2xl"
          >
            Commencer l'aventure
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Credit */}
        <p className="mt-12 text-sm text-primary-foreground/50 animate-fade-in" style={{ animationDelay: '700ms' }}>
          Escape Game Éducatif • 3ème année
        </p>
      </div>
    </div>
  );
}
