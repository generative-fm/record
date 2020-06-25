import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import noop from '../utilities/noop';

const useDismissable = ({ isOpen = true, dismissableRef, onDismiss }) => {
  const history = useHistory();
  useEffect(() => {
    if (!isOpen || !dismissableRef.current) {
      return noop;
    }

    const handleDocumentClick = (event) => {
      if (!dismissableRef.current.contains(event.target)) {
        onDismiss();
      }
    };

    const unlisten = history.listen(() => {
      onDismiss();
    });

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      unlisten();
    };
  }, [isOpen, dismissableRef, onDismiss, history]);
  return dismissableRef;
};

export default useDismissable;
