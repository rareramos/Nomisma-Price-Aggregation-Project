import styled from 'styled-components';

export const Styled = styled.div`
  text-align: center;

  table {
    text-align: left;
  }
  .pagination {
    justify-content: center;
    li {
      cursor: pointer;
      border: solid 1px black;
      padding: 5px 10px;
      text-decoration: none;
      &.active {
      cursor: not-allowed;
        background: var(--primary);
        a {
          color: #ffffff;
        }
      }
      &:hover,
      &.previous,
      &.next {
        background: var(--primary);
        a {
          color: #ffffff;
        }
      }

      &.previous,
      &.next {
        margin: 0 10px;
      }
    }
  }
`;
