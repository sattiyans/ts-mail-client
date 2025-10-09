"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          firstName: formData.firstName, 
          lastName: formData.lastName 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Success - show message about verification
        alert(data.message || "Account created successfully. Please check your email for verification.");
      } else {
        // Error
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Create your account
        </h1>
        <p className="text-gray-400 text-sm">
          Get started with TS Mail Client
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-white text-sm font-medium">
                First name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="mt-1 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
                placeholder="John"
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-white text-sm font-medium">
                Last name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="mt-1 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-white text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white text-sm font-medium">
              Password
            </Label>
            <div className="mt-1 relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-white pr-10"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
              Confirm password
            </Label>
            <div className="mt-1 relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-white pr-10"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className="border-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-black mt-0.5"
          />
          <Label htmlFor="terms" className="ml-2 text-sm text-gray-300">
            I agree to the{" "}
            <Link href="/terms" className="text-white hover:text-gray-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-white hover:text-gray-300">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-gray-200 font-medium"
          disabled={isLoading || !agreeToTerms}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              Creating account...
            </div>
          ) : (
            <div className="flex items-center">
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-gray-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
