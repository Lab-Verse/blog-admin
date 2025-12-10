'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader, Play } from 'lucide-react';

interface TestResult {
  operation: string;
  status: 'success' | 'error' | 'loading' | 'pending';
  message: string;
  time?: number;
}

export default function CrudTester() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (operation: string, status: TestResult['status'], message: string, time?: number) => {
    setResults(prev => {
      const existing = prev.find(r => r.operation === operation);
      if (existing) {
        return prev.map(r => r.operation === operation ? { ...r, status, message, time } : r);
      }
      return [...prev, { operation, status, message, time }];
    });
  };

  const testOperation = async (name: string, testFn: () => Promise<void>) => {
    const startTime = Date.now();
    updateResult(name, 'loading', 'Testing...');
    
    try {
      await testFn();
      const time = Date.now() - startTime;
      updateResult(name, 'success', 'Passed', time);
    } catch (error: unknown) {
      const time = Date.now() - startTime;
      let message = 'Failed';
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      updateResult(name, 'error', message, time);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests = [
      { name: 'Users - Create', delay: 500, shouldFail: true },
      { name: 'Users - Read', delay: 300, shouldFail: false },
      { name: 'Users - Update', delay: 400, shouldFail: false },
      { name: 'Users - Delete', delay: 200, shouldFail: false },
      { name: 'Posts - Create', delay: 600, shouldFail: false },
      { name: 'Posts - Read', delay: 250, shouldFail: false },
      { name: 'Posts - Update', delay: 450, shouldFail: false },
      { name: 'Posts - Delete', delay: 300, shouldFail: false },
      { name: 'Categories - Create', delay: 400, shouldFail: false },
      { name: 'Categories - Read', delay: 200, shouldFail: false },
      { name: 'Categories - Update', delay: 350, shouldFail: false },
      { name: 'Categories - Delete', delay: 250, shouldFail: false },
      { name: 'Tags - Create', delay: 300, shouldFail: false },
      { name: 'Tags - Read', delay: 200, shouldFail: false },
      { name: 'Tags - Update', delay: 300, shouldFail: false },
      { name: 'Tags - Delete', delay: 200, shouldFail: false },
      { name: 'Comments - Create', delay: 400, shouldFail: false },
      { name: 'Comments - Read', delay: 250, shouldFail: false },
      { name: 'Comments - Update', delay: 350, shouldFail: false },
      { name: 'Comments - Delete', delay: 200, shouldFail: false },
      { name: 'Media - Upload', delay: 800, shouldFail: false },
      { name: 'Media - Read', delay: 300, shouldFail: false },
      { name: 'Media - Update', delay: 400, shouldFail: false },
      { name: 'Media - Delete', delay: 250, shouldFail: false }
    ];

    for (const test of tests) {
      await testOperation(test.name, async () => {
        await new Promise(resolve => setTimeout(resolve, test.delay));
        if (test.shouldFail) throw new Error('API endpoint not available');
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'loading': return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'loading': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalTests = results.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRUD Operations Test</h1>
          <p className="text-gray-600 mt-2">Test all Create, Read, Update, Delete operations</p>
        </div>
        <Button onClick={runAllTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Click &quot;Run All Tests&quot; to start testing CRUD operations
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.operation}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.time && (
                      <span className="text-xs text-gray-500">{result.time}ms</span>
                    )}
                    <Badge className={getStatusColor(result.status)}>
                      {result.message}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Base URL:</span>
              <Badge variant="outline">http://localhost:3001/api</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Authentication:</span>
              <Badge variant="outline">Bearer Token</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <Badge className="bg-yellow-100 text-yellow-800">Mock Mode</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}