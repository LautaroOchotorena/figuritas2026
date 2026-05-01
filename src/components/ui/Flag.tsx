import React from 'react';

interface FlagProps {
  emoji: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Flag({ emoji, className = '', style }: FlagProps) {
  if (emoji === 'CC_LOGO') {
    return (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"
        alt="Coca-Cola"
        className={className}
        style={{
          width: '2.8em',
          height: '1em',
          objectFit: 'contain',
          verticalAlign: '-0.1em',
          filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))',
          ...style
        }}
        draggable={false}
      />
    );
  }

  // Convert the emoji string to its unicode code points for the Twemoji CDN
  const codePoints = [];
  for (const char of emoji) {
    const codePoint = char.codePointAt(0);
    if (codePoint) {
      codePoints.push(codePoint.toString(16));
    }
  }
  const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoints.join('-')}.svg`;

  return (
    <img
      src={url}
      alt={emoji}
      className={className}
      style={{
        width: '1em',
        height: '1em',
        verticalAlign: '-0.1em',
        ...style
      }}
      draggable={false}
      onError={(e) => {
        // Fallback to text if the image fails to load
        (e.target as HTMLImageElement).style.display = 'none';
        if (e.currentTarget.nextElementSibling) {
          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline';
        }
      }}
    />
  );
}
