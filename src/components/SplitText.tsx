import { useState } from 'react';

export const SplitText = ({ text, gradient, delay = 0 }: { text: string; gradient: string; delay?: number }) => {
  const [offset] = useState(() => {
    try {
      return sessionStorage.getItem('introSeen') !== '1' ? 3.2 : 0;
    } catch {
      return 0;
    }
  });
  return (
    <span aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={'inline-block ' + gradient}
          style={{ animation: 'letterIn 1s cubic-bezier(.16,1,.3,1) ' + (offset + delay + i * 0.06) + 's both' }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
};
