import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  name, 
  className = '', 
  size = 20, 
  color 
}) => {
  // Fallback to HelpCircle if icon is not found
  const LucideIcon = (Icons as any)[name] || Icons.HelpCircle;
  
  return <LucideIcon className={className} size={size} style={color ? { color } : undefined} />;
};

export default CategoryIcon;
