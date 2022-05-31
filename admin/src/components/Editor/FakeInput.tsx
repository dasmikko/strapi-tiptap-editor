import React from 'react';

export interface FakeInputProps {
  value?: string,
  onChange?: (v: string) => void,
  pattern?: RegExp,
  placeholder?: React.ReactNode,
  step?: number,
  min?: number,
  max?: number,
  options?: Array<{ label?: React.ReactNode, value: any }>
}

export const FakeInput: React.FC<FakeInputProps> = (props) => {
  const {value, min, max, options = [], onChange, pattern, placeholder, step = 1} = props
  const [edit, setEdit] = React.useState(value ?? '');
  React.useLayoutEffect(() => {
    let next = value ?? '';
    if (next !== edit) {
      setEdit(next);
    }
  }, [value]);

  const doChange = (v?: string) => {
    onChange?.(v ?? edit);
  };
  const setValue = (v: string | number, change?: boolean) => {
    if (pattern && !pattern.test(String(v))) {
      return;
    }
    if (min !== undefined || max !== undefined) {
      v = parseFloat(String(v));
    }
    if (Number.isNaN(v)) {
      v = 0;
    }
    if (min !== undefined) {
      v = v < min ? min : v;
    }
    if (max !== undefined) {
      v = v > max ? max : v;
    }

    if (change) {
      doChange(String(v));
    }
    setEdit(String(v));
  };

  return (
    <div className={'FakeInputGroup'}>
      <style>{`
        .FakeInputGroup {
          display: inline-flex;
          border: 1px solid #a3a0a0;
          border-radius: 0.2rem;
          position: relative;
          background-color: white;
        }

        .FakeInputGroup ._option {
          padding: 0.1rem;
        }

        .FakeInputGroup ._option:hover {
          background-color: lightgrey;
        }

        .FakeInputGroup ._pop {
          display: none;
          position: absolute;
          z-index: 10;
          top: 100%;
          left: 50%;
          padding: 0.2rem;
          border: 1px #7f7f7f solid;
          border-radius: 0.2rem;
          width: 5rem;
          box-sizing: border-box;
          background-color: white;
          transform: translateX(-50%);

          flex-flow: column;
          gap: 0.2rem;
        }

        .FakeInputGroup:focus-within ._pop,
        .FakeInputGroup:hover ._pop {
          display: flex;
        }

        .FakeInputGroup button:not(._input) {
          width: 1.2rem;
        }

        .FakeInputGroup ._input {
          padding: .4rem 0;
          border: 1px solid #a3a0a0;
          border-top: none;
          border-bottom: none;
          width: 4rem;
        }

        .FakeInputGroup ._input:focus {
          border-color: blue;
        }
      `}</style>
      <button type={'button'} onClick={() => setValue((parseFloat(edit || '0') - step).toFixed(2), true)}>-</button>
      <button
        type={'button'}
        onKeyUp={(e) => {
          switch (e.key) {
            case 'Backspace':
              setEdit(String(edit).substring(0, String(edit).length - 1));
              break;
            case 'Enter':
              doChange();
              break;
            case 'Esc':
            case 'Escape':
              setEdit(value ?? '');
              break;
            default:
              if (e.key.length === 1) {
                let next = String(edit) + e.key;
                setEdit(next);
              }
          }
        }}
        onBlur={() => setValue(edit, true)}
        className={'_input'}
      >
        {edit || placeholder}
      </button>
      <button type={'button'} onClick={() => setValue((parseFloat(edit || '0') + step).toFixed(2), true)}>+</button>
      <div className={'_pop'}>
        {options.map((v, i) => (
          <div
            key={i}
            className={'_option'}
            onClick={() => {
              setEdit(v.value);
              onChange?.(v.value);
            }}
          >
            {v.label || v.value}
          </div>
        ))}
      </div>
    </div>
  );
};
