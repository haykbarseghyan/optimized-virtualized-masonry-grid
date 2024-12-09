import { keyframes } from '@emotion/react';

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
  width: 'calc(100vw - 16px)',
  justifyContent: 'center',
  '& input': {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: 'calc(100vw - 300px)',
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

const loadingAnimation = keyframes`
0% {
  left: -150px;
}
100% {
  left: 100%;
}
`;

export const Skeleton = styled.div`
  background-color: #e0e0e0;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: -150px;
    height: 100%;
    width: 150px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: ${loadingAnimation} 1.5s infinite;
  }
`;
