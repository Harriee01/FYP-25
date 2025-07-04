import React, { useState } from "react";
import { Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface LoginFormProps {
  onShowRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onShowRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithWallet } = useAuth(); // <- You'll define loginWithWallet
  const { publicKey } = useWallet();

  // Handle traditional email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/app"); // 👈 redirect after login
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle wallet login
  const handleWalletLogin = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setWalletLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify-wallet-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unauthorized wallet");
      }

      const data = await response.json();

      // Custom login logic for wallet
      await loginWithWallet(data.user); // <- Make sure this method exists in your AuthContext
    } catch (error) {
      console.error("Wallet login failed:", error);
      setError(
        error instanceof Error ? error.message : "Wallet verification failed"
      );
    } finally {
      setWalletLoading(false);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-8 w-8 text-green-700" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Suite
          </CardTitle>
          <CardDescription className="text-gray-600">
            Blockchain Quality Management System
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Wallet Login Section */}
          <div className="mb-6">
            <WalletMultiButton className="w-full bg-purple-600 hover:bg-purple-700 text-white" />
            {publicKey && (
              <Button
                className="w-full mt-2 bg-green-600 hover:bg-green-700"
                onClick={handleWalletLogin}
                disabled={walletLoading}
              >
                {walletLoading ? <Spinner /> : "Verify Wallet Role"}
              </Button>
            )}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Traditional Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
                disabled={emailLoading}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-gray-600"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                disabled={emailLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={emailLoading}>
              {emailLoading ? (
                <>
                  <Spinner /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          {onShowRegister && (
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an organization account?{" "}
                <button
                  onClick={onShowRegister}
                  disabled={emailLoading || walletLoading}
                  className="text-green-700 hover:text-green-800 font-medium underline underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Register Organization
                </button>
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
