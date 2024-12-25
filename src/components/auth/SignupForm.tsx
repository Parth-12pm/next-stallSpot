'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['visitor', 'organizer', 'vendor']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // Redirect to login page on success
      window.location.href = '/auth/login?registered=true';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            {...register('name')}
            type="text"
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-2">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-2">Password</label>
          <input
            {...register('password')}
            type="password"
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-2">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            className="w-full p-2 border rounded"
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-2">Role</label>
          <select
            {...register('role')}
            className="w-full p-2 border rounded"
          >
            <option value="visitor">Visitor</option>
            <option value="organizer">Organizer</option>
            <option value="vendor">Vendor</option>
          </select>
          {errors.role && (
            <span className="text-red-500">{errors.role.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}