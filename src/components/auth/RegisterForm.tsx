import React, { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface RegisterFormProps {
  onShowLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onShowLogin }) => {
  const [formData, setFormData] = useState({
    organizationName: '',
    industry: '',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { registerOrganization } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await registerOrganization(
        {
          name: formData.organizationName,
          industry: formData.industry
        },
        {
          name: formData.adminName,
          email: formData.adminEmail
        }
      );
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-ivory-100 to-fern-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-ivory-50 border-sage-200 shadow-xl">
        <div className="text-center mb-8">
          <button
            onClick={onShowLogin}
            className="flex items-center text-sage-700 hover:text-hunter-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
          
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-hunter-100 rounded-full">
              <Shield className="h-8 w-8 text-hunter-700" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-hunter-900">Register Organization</h1>
          <p className="text-sage-700 mt-2">Set up your quality management system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-hunter-900">Organization Details</h3>
            
            <Input
              label="Organization Name"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="TechCorp Industries"
              required
            />

            <div>
              <label className="block text-sm font-medium text-hunter-800 mb-1">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
                required
              >
                <option value="">Select Industry</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="pharmaceuticals">Pharmaceuticals</option>
                <option value="food_beverage">Food & Beverage</option>
                <option value="automotive">Automotive</option>
                <option value="electronics">Electronics</option>
                <option value="textiles">Textiles</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-hunter-900">Admin Account</h3>
            
            <Input
              label="Admin Full Name"
              value={formData.adminName}
              onChange={(e) => handleInputChange('adminName', e.target.value)}
              placeholder="John Doe"
              required
            />

            <Input
              label="Admin Email"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              placeholder="admin@company.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Register Organization
          </Button>
        </form>
      </Card>
    </div>
  );
};