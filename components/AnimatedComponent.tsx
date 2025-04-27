'use client';

import { type MotionProps, motion } from 'framer-motion';
import type { ReactNode } from 'react';

type AnimatedComponentVariants =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'button';
type AnimatedComponentProps = {
  children: ReactNode;
  className?: string;
  variant: AnimatedComponentVariants;
} & MotionProps;

export function AnimatedComponent({
  children,
  variant,
  whileTap,
  ...props
}: AnimatedComponentProps) {
  const Wrapper = motion[variant];

  const buttonWhileTap = { scale: 0.95 };
  const isButton = variant === 'button';

  return (
    <Wrapper {...props} whileTap={isButton ? buttonWhileTap : whileTap}>
      {children}
    </Wrapper>
  );
}
