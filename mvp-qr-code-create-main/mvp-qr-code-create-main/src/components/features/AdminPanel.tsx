import { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Loader2, Save, Power, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, trackEvent } from '@/lib/firebase';

interface SystemSetting {
  id: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

export const AdminPanel = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<SystemSetting[]>([
    { id: '1', key: 'publicMode', label: 'Modo Público', description: 'Permite que usuários não registrados criem QR Codes.', enabled: true },
    { id: '2', key: 'hiResExport', label: 'Exportação Ultra HD', description: 'Habilita resoluções de até 4000px.', enabled: true },
    { id: '3', key: 'aiDesigner', label: 'Gemini AI Designer', description: 'Ativa o assistente de design inteligente.', enabled: true },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'system', 'config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings(prev => prev.map(s => ({
            ...s,
            enabled: data[s.key] ?? s.enabled
          })));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) fetchSettings();
  }, [isAdmin]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const config: any = {
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid
      };
      settings.forEach(s => config[s.key] = s.enabled);
      
      await setDoc(doc(db, 'system', 'config'), config, { merge: true });
      trackEvent('admin_settings_save', { updated_by: user?.uid });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center p-10 bg-rose-50 rounded-[2rem] border border-rose-100">
        <h2 className="text-xl font-bold text-rose-900 mb-2">Acesso Restrito</h2>
        <p className="text-rose-600 font-medium">Você precisa de privilégios de administrador para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-3 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Painel Administrativo</h2>
            <p className="text-muted-foreground font-medium">Controle as definições globais do sistema</p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : success ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {success ? 'Salvo!' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between h-full ${setting.enabled ? 'border-primary/20 bg-primary/[0.02]' : 'border-border bg-card'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${setting.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Power className="w-5 h-5" />
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${setting.enabled ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {setting.enabled ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">{setting.label}</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                  {setting.description}
                </p>
                <Button
                  variant={setting.enabled ? "default" : "outline"}
                  onClick={() => toggleSetting(setting.id)}
                  className="w-full rounded-xl h-10 font-bold"
                >
                  {setting.enabled ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
