import { useEffect } from 'react';

function PopupCloseEsc({ children, onClose }) {
  useEffect(() => {
    const handleEscKey = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return <div>{children}</div>;
}

export default PopupCloseEsc;
