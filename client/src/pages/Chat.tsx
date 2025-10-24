import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function Chat() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'join' | 'create' | 'user'>('join');
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }
    navigate(`/room/${roomName}`);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }
    toast.success(` room : ${roomName}`);
  };

  const handleMessageUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    toast.success(`User : ${username}`);
  };

  if (!currentUser?.username) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {currentUser.username}!</h1>
          <Button variant="outline" onClick={() => {
            localStorage.removeItem('currentUser');
            navigate('/');
          }}>
            Sign Out
          </Button>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'join' ? 'default' : 'outline'}
            onClick={() => setActiveTab('join')}
          >
            Join Room
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            Create Room
          </Button>
          <Button
            variant={activeTab === 'user' ? 'default' : 'outline'}
            onClick={() => setActiveTab('user')}
          >
            Message User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="capitalize">
              {activeTab === 'join' ? 'Join a Room' : 
               activeTab === 'create' ? 'Create a Room' : 'Message a User'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'join' ? 'Enter the room name to join' :
               activeTab === 'create' ? 'Create a new chat room' : 
               'Start a private chat with another user'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'join' && (
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Join Room
                </Button>
              </form>
            )}

            {activeTab === 'create' && (
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newRoomName">Room Name</Label>
                  <Input
                    id="newRoomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Room
                </Button>
              </form>
            )}

            {activeTab === 'user' && (
              <form onSubmit={handleMessageUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Start Chat
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
