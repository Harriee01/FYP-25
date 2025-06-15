import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface LoginFormProps {
  onShowRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-ivory-100 to-fern-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-ivory-50 border-sage-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-hunter-100 rounded-full">
              <Shield className="h-8 w-8 text-hunter-700" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-hunter-900">QualityChain</h1>
          <p className="text-sage-700 mt-2">Blockchain Quality Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sage-700">
            Don't have an organization account?{' '}
            <button
              onClick={onShowRegister}
              className="text-hunter-700 hover:text-hunter-800 font-medium underline decoration-hunter-300 hover:decoration-hunter-500 transition-colors"
            >
              Register Organization
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};