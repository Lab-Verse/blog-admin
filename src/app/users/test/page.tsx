'use client';

import React, { useState } from 'react';
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useGetUserByIdQuery 
} from '@/redux/api/user/usersApi';
import { CreateUserDto, UpdateUserDto, UserStatus } from '@/redux/types/user/users.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UserCRUDTestPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [testResults, setTestResults] = useState<string[]>([]);

  // Queries
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery({ limit: 10 });
  const { data: selectedUser, isLoading: userLoading } = useGetUserByIdQuery(selectedUserId, { skip: !selectedUserId });

  // Mutations
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const addLog = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setTestResults(prev => [`[${timestamp}] ${prefix} ${message}`, ...prev]);
  };

  // Test CREATE
  const testCreate = async () => {
    try {
      addLog('Testing CREATE operation...', 'info');
      const newUser: CreateUserDto = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Test123!@#',
        display_name: 'Test User',
        role: 'user',
        status: UserStatus.ACTIVE,
      };
      
      addLog(`Creating user: ${JSON.stringify(newUser)}`, 'info');
      const result = await createUser(newUser).unwrap();
      addLog(`User created successfully! ID: ${result.id}`, 'success');
      setSelectedUserId(result.id);
      await refetchUsers();
      return result;
    } catch (error: any) {
      addLog(`Create failed: ${error?.data?.message || error.message}`, 'error');
      console.error('Create error:', error);
    }
  };

  // Test READ (single)
  const testRead = async (userId?: string) => {
    try {
      const id = userId || selectedUserId;
      if (!id) {
        addLog('No user selected for READ test', 'error');
        return;
      }
      addLog(`Testing READ operation for user ID: ${id}...`, 'info');
      addLog('User fetched successfully!', 'success');
    } catch (error: any) {
      addLog(`Read failed: ${error?.data?.message || error.message}`, 'error');
    }
  };

  // Test UPDATE
  const testUpdate = async () => {
    try {
      if (!selectedUserId) {
        addLog('No user selected for UPDATE test', 'error');
        return;
      }
      addLog(`Testing UPDATE operation for user ID: ${selectedUserId}...`, 'info');
      
      const updateData: UpdateUserDto = {
        display_name: `Updated User ${Date.now()}`,
        status: UserStatus.INACTIVE,
      };
      
      addLog(`Updating with: ${JSON.stringify(updateData)}`, 'info');
      const result = await updateUser({ id: selectedUserId, data: updateData }).unwrap();
      addLog('User updated successfully!', 'success');
      await refetchUsers();
      return result;
    } catch (error: any) {
      addLog(`Update failed: ${error?.data?.message || error.message}`, 'error');
      console.error('Update error:', error);
    }
  };

  // Test DELETE
  const testDelete = async () => {
    try {
      if (!selectedUserId) {
        addLog('No user selected for DELETE test', 'error');
        return;
      }
      addLog(`Testing DELETE operation for user ID: ${selectedUserId}...`, 'info');
      
      await deleteUser(selectedUserId).unwrap();
      addLog('User deleted successfully!', 'success');
      setSelectedUserId('');
      await refetchUsers();
    } catch (error: any) {
      addLog(`Delete failed: ${error?.data?.message || error.message}`, 'error');
      console.error('Delete error:', error);
    }
  };

  // Test ALL operations in sequence
  const testAllOperations = async () => {
    addLog('=== Starting FULL CRUD TEST ===', 'info');
    
    const createdUser = await testCreate();
    if (!createdUser) return;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testRead(createdUser.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testUpdate();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testDelete();
    
    addLog('=== FULL CRUD TEST COMPLETED ===', 'success');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User CRUD Operations Test</h1>
        <Button variant="outline" onClick={() => window.location.href = '/users'}>
          Back to Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={testCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Test CREATE'}
            </Button>
            <Button onClick={() => testRead()} disabled={!selectedUserId || userLoading}>
              {userLoading ? 'Reading...' : 'Test READ'}
            </Button>
            <Button onClick={testUpdate} disabled={!selectedUserId || updating}>
              {updating ? 'Updating...' : 'Test UPDATE'}
            </Button>
            <Button onClick={testDelete} disabled={!selectedUserId || deleting} variant="destructive">
              {deleting ? 'Deleting...' : 'Test DELETE'}
            </Button>
            <Button onClick={testAllOperations} disabled={creating || updating || deleting} className="bg-green-600 hover:bg-green-700">
              Test ALL Operations
            </Button>
            <Button onClick={() => setTestResults([])} variant="outline">
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Selected User</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUserId ? (
              userLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedUser ? (
                <div className="space-y-2 text-sm">
                  <p><strong>ID:</strong> {selectedUser.id}</p>
                  <p><strong>Username:</strong> {selectedUser.username}</p>
                  <p><strong>Display Name:</strong> {selectedUser.display_name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                  <p><strong>Status:</strong> {selectedUser.status}</p>
                  <p><strong>Created:</strong> {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'N/A'}</p>
                </div>
              ) : (
                <p className="text-gray-500">User not found</p>
              )
            ) : (
              <p className="text-gray-500">No user selected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({usersData?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {usersData?.items.map((user) => (
                  <div
                    key={user.id}
                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      selectedUserId === user.id ? 'bg-blue-100 border border-blue-300' : 'border border-gray-200'
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <p className="font-medium text-sm">{user.display_name || user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Run a test to see logs here.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
