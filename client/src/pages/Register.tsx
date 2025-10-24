import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UserData {
  user?: {
    id: string;
    username: string;
  };
  error?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{ username: string }>({
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          room: 'default'
        }),
      });

      const data: UserData = await response.json();
      
      if (response.ok) {
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user?.id,
          username: formData.username,
          room: 'default'
        }));
        toast.success(`Welcome, ${formData.username}!`);
        navigate('/chat');
      } else {
        toast.error(data.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your username to join the chat</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Chat'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
