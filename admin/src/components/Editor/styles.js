import styled from 'styled-components';
import { Box } from '@strapi/design-system/Box';

/*${({theme}) => console.log(theme.colors)}*/
export default styled(Box)`
  .menu-bar {
    .is-active {
      background: ${({theme}) =>  theme.colors.primary200};
      color: ${({theme}) =>  theme.colors.neutral0};
    }

    .button-group {
      border: 0.25em solid ${({theme}) =>  theme.colors.neutral100};
    }

    &.floating {
      border: 1px solid ${({theme}) =>  theme.colors.neutral200};
      background: ${({theme}) =>  theme.colors.neutral100};
      box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    }
  }

  .ProseMirror {
    outline: none;
    line-height: 1.25rem;

    > * + * {
      margin-top: 0.75em;

    }

    .ProseMirror-selectednode {
      border: 5px solid ${({theme}) =>  theme.colors.primary500};
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
      font-size: 1.50em;
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

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      background: #0D0D0D;
      color: #FFF;
      font-family: 'JetBrainsMono', monospace;
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
      border-left: 2px solid rgba(#0D0D0D, 0.1);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0D0D0D, 0.1);
      margin: 2rem 0;
    }

    table {
      width: 100%;
      table-layout: fixed;
      border: 1px solid ${({theme}) =>  theme.colors.neutral600};
      th, td {
        border: 1px solid ${({theme}) =>  theme.colors.neutral600};
        padding: ${({ theme }) => theme.spaces[2]};

        &.selectedCell {
          background: ${({theme}) =>  theme.colors.primary500};
        }
      }

      th {
        background: ${({theme}) =>  theme.colors.neutral300};
        vertical-align: middle;
      }
    }
  }
`
