'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      setStatus('success');
      setMessage('Password reset instructions have been sent to your email.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  return (
    <Card className="max-w-md w-full mx-auto mt-8">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive reset instructions</CardDescription>
      </CardHeader>
      <CardContent>
        {status !== 'idle' && (
          <Alert variant={status === 'success' ? 'default' : 'destructive'} className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              autoComplete='username'
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Reset Password'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}