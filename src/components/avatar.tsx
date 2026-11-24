'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

/** The one extended size scale in the library; every other component uses sm | md. */
export type AvatarSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  alt?: string;
  /** Default `sm` (28 px); `xs` is 22 px. `md` (40 px) was the default before 0.21. */
  size?: AvatarSize;
  tone?: 'muted' | 'primary';
  /** `square`: a rounded square, for services, teams and other non-people. */
  shape?: 'circle' | 'square';
  /** Glyph drawn instead of the initials, sized to 62% of the avatar. */
  icon?: React.ReactNode;
}

export const avatarVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
    'font-semibold leading-none',
  ],
  {
    variants: {
      size: {
        /** 18 px: inline in property values and meta lines. */
        '2xs': 'size-[18px] text-2xs',
        xs: 'size-[22px] text-2xs',
        sm: 'size-7 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-lg',
        '2xl': 'size-20 text-xl',
      },
      tone: {
        muted: 'bg-muted text-muted-foreground',
        /** Accent disc with background-coloured bold initials. */
        primary: 'bg-primary text-primary-foreground font-bold',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md border border-border',
      },
    },
    defaultVariants: {
      size: 'sm',
      tone: 'muted',
      shape: 'circle',
    },
  }
);

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      name,
      src,
      alt,
      size = 'sm',
      tone,
      shape,
      icon,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const showImage = src && !imgError;

    // An image can fail before hydration, when onError has no listener yet.
    React.useLayoutEffect(() => {
      const img = imgRef.current;
      if (img?.complete && img.naturalWidth === 0) setImgError(true);
    }, [src]);
    const initials = name ? getInitials(name) : '?';

    return (
      <div
        ref={ref}
        data-slot="avatar"
        aria-label={showImage ? ariaLabel : (ariaLabel ?? name)}
        role={!showImage && (ariaLabel ?? name) ? 'img' : props.role}
        className={cn(avatarVariants({ size, tone, shape }), className)}
        data-shape={shape ?? 'circle'}
        {...props}
      >
        {showImage ? (
          <img
            ref={imgRef}
            src={src}
            alt={alt ?? name ?? 'Avatar'}
            className="size-full object-cover"
            onError={() => {
              setImgError(true);
            }}
          />
        ) : icon ? (
          <span className="flex size-[62%] [&_svg]:size-full" aria-hidden="true">
            {icon}
          </span>
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
