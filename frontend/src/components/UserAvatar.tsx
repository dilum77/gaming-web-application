import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarUrl } from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const fallbackTextSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  size = 'md',
  className,
  showFallback = true,
}) => {
  const avatarUrl = getAvatarUrl(username);
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatarUrl} alt={username} />
      {showFallback && (
        <AvatarFallback className={cn(fallbackTextSizes[size], 'bg-primary/20 text-primary font-semibold')}>
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

