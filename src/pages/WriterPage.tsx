import React from 'react';
import { WriterDashboard } from '../components/writer/WriterDashboard';
import { useAuthContext } from '../components/auth/AuthContext';

export const WriterPage: React.FC = () => {
  const { user } = useAuthContext();

  if (!user || user.userType !== 'writer') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-amber-700">
            Esta área é exclusiva para usuários do tipo "Escritor". 
            Faça login com uma conta de escritor para acessar o painel de criação de músicas.
          </p>
        </div>
      </div>
    );
  }

  return <WriterDashboard />;
};