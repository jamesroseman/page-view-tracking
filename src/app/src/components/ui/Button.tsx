import React, { FunctionComponent } from 'react';

import styles from './Button.module.css';

export type ButtonProps = {
  label: string;
  isActive: boolean;
  onClick?: any;
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  isActive,
  onClick
}) => {
  return (
    <div 
      className={isActive ? styles['active'] : styles['inactive']}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

export default Button;