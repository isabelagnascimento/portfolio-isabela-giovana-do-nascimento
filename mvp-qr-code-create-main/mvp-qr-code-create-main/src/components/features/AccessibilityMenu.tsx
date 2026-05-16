import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, 
  Eye, 
  Type, 
  Mic, 
  Keyboard as KeyboardIcon,
  Check
} from 'lucide-react';
import { useAccessibilityStore } from '@/store/useAccessibilityStore';
import { Label } from '@/components/ui/label';

export const AccessibilityMenu = () => {
  const { highContrast, fontSize, toggleHighContrast, setFontSize } = useAccessibilityStore();

  return (
    <Popover>
      <PopoverTrigger 
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 focus-visible:ring-blue-500"
            aria-label="Menu de Acessibilidade"
            title="Recursos de Acessibilidade"
          />
        }
      >
        <Accessibility className="w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-5 rounded-2xl shadow-xl border-border bg-card text-foreground" align="end">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Accessibility className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Acessibilidade</h2>
          </div>

          <div className="space-y-4">
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-500" />
                  Alto Contraste
                </Label>
                <p className="text-[10px] text-muted-foreground">Melhora a distinção entre elementos</p>
              </div>
              <Button 
                variant={highContrast ? "default" : "outline"} 
                size="sm"
                className={`rounded-full h-8 ${highContrast ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground border-border'}`}
                onClick={toggleHighContrast}
              >
                {highContrast ? "Ativado" : "Ativar"}
              </Button>
            </div>

            {/* Font Size Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-500" />
                Tamanho do Texto
              </Label>
              <div className="flex gap-2">
                {(['normal', 'large', 'xl'] as const).map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all ${
                      fontSize === size 
                      ? 'border-primary text-primary bg-secondary' 
                      : 'text-muted-foreground border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setFontSize(size)}
                  >
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="pt-4 border-t border-border space-y-3">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Recursos Disponíveis</h3>
              
              <div className="flex items-start gap-3">
                <div className="bg-muted p-1.5 rounded-lg">
                  <Mic className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Entrada por Voz</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">Clique no ícone de microfone no painel de conteúdo para falar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted p-1.5 rounded-lg">
                  <KeyboardIcon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Teclado Total</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Use TAB para navegar e ENTER para interagir com elementos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
