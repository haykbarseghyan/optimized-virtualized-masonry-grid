import styled from '@emotion/styled';

export const Breadcrumbs = styled('div')(() => ({
  '& ul': {
    listStyle: 'none',
    display: 'flex',
    padding: 0,
    margin: 0,
  },
  '& li': {
    marginRight: '8px',
    '&:last-child': {
      fontWeight: 'bold',
      color: '#6c757d',
      '&::after': {
        content: '""',
      },
    },
    '&::after': {
      content: '"/"',
      marginLeft: '8px',
      color: '#6c757d',
    },
  },
  '& a': {
    textDecoration: 'none',
    color: '#007bff',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#0056b3',
    },
  },
}));
