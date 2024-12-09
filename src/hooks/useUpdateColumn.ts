import { useCallback, useEffect, useState } from 'react';

import { COLUMN_SIZE, MAX_COLUMN_COUNT } from '../pages/Grid/constants';
import { getDynamicColumns } from '../pages/Grid/utils';

const useUpdateColumn = () => {
  const [columns, setColumns] = useState<number>(3);

  const updateColumns = useCallback(() => {
    const screenWidth = window.innerWidth;
    const dynamicColumns = getDynamicColumns(
      screenWidth,
      MAX_COLUMN_COUNT,
      COLUMN_SIZE,
    );
    setColumns(dynamicColumns);
  }, []);

  useEffect(() => {
    updateColumns(); // init
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [updateColumns]);

  return { columns };
};

export default useUpdateColumn;
