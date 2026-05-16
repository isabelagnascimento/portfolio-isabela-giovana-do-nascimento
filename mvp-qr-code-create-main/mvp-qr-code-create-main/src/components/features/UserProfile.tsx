import { useAuth } from '../AuthProvider';
import { auth, db } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogIn, LogOut, User as UserIcon, Calendar, Mail, ShieldCheck, Loader2, QrCode, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export const UserProfile = () => {
  const { user, loading, isAdmin } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoadingHistory(true);
      try {
        const q = query(
          collection(db, 'history'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHistory(items);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure user document exists in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        isAdmin: false, // Default role
      }, { merge: true });

    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 text-center"
        >
          <div className="bg-blue-600 w-16 h-16 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">Welcome Back</h2>
          <p className="text-slate-500 font-medium mb-8">Sign in with your Google account to manage your profile and creations.</p>
          <Button 
            onClick={handleLogin}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 font-bold shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <UserIcon className="w-48 h-48" />
        </div>

        <div className="relative group">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Profile'} 
              referrerPolicy="no-referrer"
              className="w-32 h-32 rounded-[2rem] object-cover ring-4 ring-slate-50 group-hover:ring-blue-100 transition-all shadow-xl"
            />
          ) : (
            <div className="w-32 h-32 rounded-[2rem] bg-blue-50 flex items-center justify-center shadow-xl">
              <UserIcon className="w-16 h-16 text-blue-200" />
            </div>
          )}
          {isAdmin && (
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 border-2 border-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">{user.displayName}</h2>
            {isAdmin && <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin</span>}
          </div>
          <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">Active session verified</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 rounded-[2rem] border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Member Since</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{new Date(user.metadata.creationTime || '').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p className="text-slate-500 text-sm font-medium">Joined the platform</p>
          </div>
        </Card>

        <Card className="p-8 rounded-[2rem] border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Session Controls</h4>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-2xl h-12 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all font-bold"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Clock className="w-5 h-5 text-slate-400" />
          <h3 className="text-xl font-bold text-slate-900">Histórico Recente</h3>
        </div>
        
        {loadingHistory ? (
          <div className="flex justify-center p-12 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100">
                    <QrCode className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-xs">{item.data}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {item.format}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.size}px • {item.timestamp?.toDate().toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600" 
                  render={<a href={item.data} target="_blank" rel="noreferrer" />}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Você ainda não gerou nenhum QR Code.</p>
          </div>
        )}
      </div>
    </div>
  );
};
