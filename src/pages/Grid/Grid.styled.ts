import styled from '@emotion/styled';

export const GridItemContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible: boolean; width: number; height: number }>(
  ({ isVisible, width, height }) => ({
    width: width,
    height: height,
    border: '0.5px solid #fff',
    borderRadius: '7px',
    opacity: isVisible ? 1 : 0.5,
    // transition: 'opacity 0.3s',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '8px',
    },
  }),
);

export const SearchStyled = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  top: '20px',
  left: '120px',
  '& input': {
    width: '500px',
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  '& button': {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
}));
