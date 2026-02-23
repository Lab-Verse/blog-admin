'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation, useLoginMutation } from '@/redux/api/auth/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AuthTestPage() {
  const router = useRouter();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  
  const [testResults, setTestResults] = useState<string[]>([]);
  const [username, setUsername] = useState('testuser' + Date.now());
  const [email, setEmail] = useState(`test${Date.now()}@example.com`);
  const [password, setPassword] = useState('Test@123456');

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRegister = async () => {
    try {
      addResult('🔄 Testing registration...');
      const result = await register({ username, email, password }).unwrap();
      addResult('✅ Registration successful!');
      if (result?.data?.user?.email) {
        addResult(`   User: ${result.data.user.email}`);
      }
      if (result?.data?.tokens?.accessToken) {
        addResult(`   Access Token: ${result.data.tokens.accessToken.substring(0, 30)}...`);
      }
      if (result?.data?.tokens?.refreshToken) {
        addResult(`   Refresh Token: ${result.data.tokens.refreshToken.substring(0, 30)}...`);
      }
    } catch (error: any) {
      addResult('❌ Registration failed: ' + (error?.data?.message || error.message));
    }
  };

  const testLogin = async () => {
    try {
      addResult('🔄 Testing login...');
      const result = await login({ email, password }).unwrap();
      addResult('✅ Login successful!');
      if (result?.data?.user?.email) {
        addResult(`   User: ${result.data.user.email}`);
      }
      if (result?.data?.tokens?.accessToken) {
        addResult(`   Access Token: ${result.data.tokens.accessToken.substring(0, 30)}...`);
      }
      if (result?.data?.tokens?.refreshToken) {
        addResult(`   Refresh Token: ${result.data.tokens.refreshToken.substring(0, 30)}...`);
      }
    } catch (error: any) {
      addResult('❌ Login failed: ' + (error?.data?.message || error.message));
    }
  };

  const testFullFlow = async () => {
    setTestResults([]);
    const timestamp = Date.now();
    const testUser = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'Test@123456'
    };
    
    setUsername(testUser.username);
    setEmail(testUser.email);
    setPassword(testUser.password);

    try {
      addResult('🔄 Step 1: Testing registration...');
      const registerResult = await register(testUser).unwrap();
      addResult('✅ Registration successful!');
      if (registerResult?.data?.user?.id) {
        addResult(`   User ID: ${registerResult.data.user.id}`);
      }
      
      addResult('🔄 Step 2: Testing login...');
      const loginResult = await login({ email: testUser.email, password: testUser.password }).unwrap();
      addResult('✅ Login successful!');
      if (loginResult?.data?.user?.id) {
        addResult(`   User ID: ${loginResult.data.user.id}`);
      }
      
      addResult('🎉 All tests passed! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      addResult('❌ Test failed: ' + (error?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">🧪 Auth Flow Test Page</h1>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={testRegister} disabled={isRegistering}>
              {isRegistering ? 'Testing...' : 'Test Register'}
            </Button>
            <Button onClick={testLogin} disabled={isLoggingIn}>
              {isLoggingIn ? 'Testing...' : 'Test Login'}
            </Button>
            <Button onClick={testFullFlow} disabled={isRegistering || isLoggingIn} variant="primary">
              Test Full Flow
            </Button>
            <Button onClick={() => setTestResults([])} variant="outline">
              Clear Results
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">📋 Test Results</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">No tests run yet. Click a button above to start testing.</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
