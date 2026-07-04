import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: { container: 'w-6 h-6', text: 'text-xs' },
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'text-base' },
  xl: { container: 'w-16 h-16', text: 'text-lg' },
};

const colorPool = [
  'bg-primary-500',
  'bg-secondary-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
];

function pickColor(name = '') {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return colorPool[code % colorPool.length];
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const { container, text } = sizeMap[size];
  return (
    <div className={cn('relative rounded-full overflow-hidden shrink-0', container, className)}>
      {src ? (
        <Image src={src} alt={name || 'Avatar'} fill className="object-cover" />
      ) : (
        <div className={cn('w-full h-full flex items-center justify-center text-white font-semibold', text, pickColor(name))}>
          {getInitials(name || '?')}
        </div>
      )}
    </div>
  );
}
