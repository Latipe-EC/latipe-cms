import {useCallback, useEffect, useState} from "react";
import {debounce} from "lodash";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number | null;
    height: number | null
  }>({width: null, height: null});
  const handleResize = useCallback(
      debounce(() => {
        if (window) setWindowSize({width: window.innerWidth, height: window.innerHeight});
      }, 250),
      []
  );
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;