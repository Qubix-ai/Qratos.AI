import React, { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react';
import './StarBorder.css';

interface StarBorderProps<T extends ElementType = 'div'> {
  as?: T;
  className?: string;
  innerClassName?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export type StarBorderComponentProps<T extends ElementType = 'div'> = StarBorderProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>;

const StarBorder = <T extends ElementType = 'div'>({
  as,
  className = '',
  innerClassName = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderComponentProps<T>) => {
  const Component = as || 'div';

  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className={`inner-content ${innerClassName}`}>{children}</div>
    </Component>
  );
};

export default StarBorder;
export { StarBorder };
