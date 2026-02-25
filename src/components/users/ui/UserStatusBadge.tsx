import React from 'react';
import { UserStatus } from '@/redux/types/user/users.types';

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className = '' }: UserStatusBadgeProps) {
  const statusStyles = {
    [UserStatus.ACTIVE]: 'bg-green-100 text-green-800 border-green-200',
    [UserStatus.INACTIVE]: 'bg-gray-100 text-gray-800 border-gray-200',
    [UserStatus.BANNED]: 'bg-red-100 text-red-800 border-red-200',
    [UserStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]} ${className}`}
    >
      {label}
    </span>
  );
}
