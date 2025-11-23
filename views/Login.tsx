
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Button, Input, Card } from '../components/Shared';
import { Mail, Lock, Cpu, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, register, isLoading } = useGame();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      // Clean up firebase error messages
      let msg = err.message;
      if (msg.includes('auth/invalid-email')) msg = "Invalid email format.";
      if (msg.includes('auth/user-not-found')) msg = "No mechanic found with these credentials.";
      if (msg.includes('auth/wrong-password')) msg = "Incorrect access code.";
      if (msg.includes('auth/email-already-in-use')) msg = "Email already registered to a mechanic.";
      if (msg.includes('auth/weak-password')) msg = "Password is too weak (min 6 chars).";
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 bg-grid-pattern relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] mb-4 rotate-45">
                <Cpu size={32} className="text-cyan-400 -rotate-45" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-widest uppercase font-mono mb-2">Mechanica</h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest">Battle of the Machines</p>
        </div>

        <Card className="border-cyan-500/30 backdrop-blur-xl bg-slate-900/80 shadow-2xl">
            <div className="flex mb-6 border-b border-slate-800">
                <button 
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${isLoginView ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => { setIsLoginView(true); setError(null); }}
                >
                    Login
                </button>
                <button 
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${!isLoginView ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => { setIsLoginView(false); setError(null); }}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block ml-1">Identity (Email)</label>
                    <Input 
                        type="email" 
                        placeholder="mechanic@guild.net" 
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                        icon={<Mail size={16} className="text-slate-500" />}
                    />
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block ml-1">Access Code (Password)</label>
                    <Input 
                        type="text" // Using text type temporarily based on shared component limitations, ideally password type
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        icon={<Lock size={16} className="text-slate-500" />}
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded p-3 flex items-start gap-2 text-red-200 text-xs">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Button 
                    variant="primary" 
                    className="w-full py-3 mt-4 shadow-[0_0_20px_rgba(8,145,178,0.3)] group"
                    disabled={isSubmitting || isLoading}
                >
                    {isSubmitting ? 'Establishing Connection...' : (
                        <span className="flex items-center justify-center">
                            {isLoginView ? 'Initialize Session' : 'Create New Dossier'} 
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                </Button>
            </form>
        </Card>
        
        <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                Restricted Access. Unauthorized entry is a Class A felony in the City of Mechanica.
            </p>
        </div>
    </div>
    </div>
  );
};

export default Login;
