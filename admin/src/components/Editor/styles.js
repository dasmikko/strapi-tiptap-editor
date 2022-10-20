import styled from "styled-components";
import { Box } from "@strapi/design-system/Box";


export default styled(Box)`
  ${({ theme }) => {
    // Uncomment this for debugging styles
    /*console.log(theme)*/
  }}
  .menu-bar {
    .is-active {
      background: ${({ theme }) => theme.colors.primary200};
      color: ${({ theme }) => theme.colors.neutral0};
    }

    .button-group {
      border: 0.25em solid ${({ theme }) => theme.colors.neutral100};
    }

    &.floating {
      border: 1px solid ${({ theme }) => theme.colors.neutral200};
      background: ${({ theme }) => theme.colors.neutral100};
      box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
        rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    }

    button {

      &.medium-icon {
        padding: 7px;

        svg {
          height: 100%;
          width: 100%;
        }
      }

      &.large-icon {
        padding: 6px;

        svg {
          height: 100%;
          width: 100%;
        }
      }

    }
  }

  .ProseMirror {
    outline: none;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.neutral800};
    min-height: 80px;

    > * + * {
      margin-top: 0.75em;
    }

    .ProseMirror-selectednode {
      border: 5px solid ${({ theme }) => theme.colors.neutral800};
      box-sizing: border-box;
    }

    strong {
      font-weight: bold;
    }

    em {
      font-style: italic;
    }

    ul,
    ol {
      margin-left: 1rem;
      padding: 0 1rem;

      li {
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0rem;
        }
      }
    }

    ul {
      li {
        list-style: disc;
      }
    }

    ol {
      li {
        list-style: decimal;
      }
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.75em;
    }

    h3 {
      font-size: 1.5em;
    }

    h4 {
      font-size: 1.25em;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      border: 0;
      border-top: 2px solid rgba(13, 13, 13, 0.1);
      margin: 1rem 0;
    }

    table {
      width: 100%;
      table-layout: fixed;
      border: 1px solid ${({ theme }) => theme.colors.neutral600};
      th,
      td {
        border: 1px solid ${({ theme }) => theme.colors.neutral600};
        padding: ${({ theme }) => theme.spaces[2]};

        &.selectedCell {
          background: ${({ theme }) => theme.colors.primary500};
        }
      }

      th {
        background: ${({ theme }) => theme.colors.neutral300};
        vertical-align: middle;
      }
    }
  }
`;
