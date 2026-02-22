'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import UpdateUserPage from '@/components/users/pages/UpdateUserPage'; 
import { 
  useGetUserByIdQuery, 
  useUpdateUserMutation,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useUploadProfilePictureMutation
} from '@/redux/api/user/usersApi';
import { UpdateUserDto, CreateUserProfileDto } from '@/redux/types/user/users.types';

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [updateUser] = useUpdateUserMutation();
  const [createProfile] = useCreateUserProfileMutation();
  const [updateProfile] = useUpdateUserProfileMutation();
  const [uploadPicture] = useUploadProfilePictureMutation();

  const handleSubmit = async (
    data: UpdateUserDto, 
    profileData?: CreateUserProfileDto,
    profileImage?: File
  ) => {
    try {
      // Remove empty fields from user data
      const cleanUserData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      ) as UpdateUserDto;

      // Update user
      await updateUser({ id, data: cleanUserData }).unwrap();

      // Remove empty fields from profile data
      if (profileData) {
        const cleanProfileData = Object.fromEntries(
          Object.entries(profileData).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        ) as CreateUserProfileDto;
        
        if (Object.keys(cleanProfileData).length > 0) {
          await updateProfile({ id, data: cleanProfileData }).unwrap();
        }
      }

      // Upload profile picture
      if (profileImage) {
        await uploadPicture({ id, file: profileImage }).unwrap();
      }

      alert('User updated successfully!');
      router.push(`/users/${id}`);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      alert('Failed to update user: ' + (error?.data?.message || error.message));
    }
  };

  return (
    <UpdateUserPage
      user={user || null}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default Page;
