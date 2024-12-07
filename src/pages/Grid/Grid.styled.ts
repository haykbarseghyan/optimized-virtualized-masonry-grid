import styled from '@emotion/styled';

export const GridItemContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible: boolean; width: number; height: number }>(
  ({ isVisible, width, height }) => ({
    width: width,
    height: height,
    border: '1px solid #fff',
    opacity: isVisible ? 1 : 0.5,
    transition: 'opacity 0.3s',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '8px',
    },
  }),
);
