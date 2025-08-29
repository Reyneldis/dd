import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  paths: string[];
}

const Icon: React.FC<IconProps> = ({
  paths,
  className = 'w-5 h-5 text-orange-500',
  ...props
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    {paths.map((d, index) => (
      <path key={index} strokeLinecap="round" strokeLinejoin="round" d={d} />
    ))}
  </svg>
);

export default Icon;
