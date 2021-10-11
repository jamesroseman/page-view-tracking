import React, { CSSProperties, FunctionComponent } from 'react';

import styles from './Button.module.css';

export type ButtonProps = {
  label: string;
  isActive: boolean;
  inactiveColor?: string;
  activeColor?: string;
  onClick?: any;
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  isActive,
  inactiveColor,
  activeColor,
  onClick
}) => {
  const defaultInactiveColor: string = '#eee';
  const defaultActiveColor: string = '#999';

  const activeProperties: CSSProperties = {
    backgroundColor: activeColor ?? defaultActiveColor,
  }

  const inactiveProperties: CSSProperties = {
    backgroundColor: inactiveColor ?? defaultInactiveColor,
  }

  const properties: CSSProperties = isActive ? activeProperties : inactiveProperties;

  return (
    <div 
      className={styles['container']} 
      style={properties}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

export default Button;