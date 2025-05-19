import { Table } from 'react-bootstrap';

import { useTranslation } from '../../hooks/use-translation';

export interface ViewDetailProps {
  obj: Record<
    string,
    number | string | boolean | Date | ListValue | Array<string | boolean | Date | ListValue> | any
  >;
  default?: string | (() => string);
}

interface ListValue {
  show?: boolean | (() => boolean);
  label?: string;
  items?: Array<string | boolean | Date | ListValue>;
  text?: ListValue | string | number | boolean | Date | Array<string | boolean | Date | ListValue>;
  default?: string | (() => string);
}

function isListValue(obj: unknown): obj is ListValue {
  return obj && Object.prototype.hasOwnProperty.call(obj, 'label');
}

export default function ViewDetails(props: ViewDetailProps) {
  const { t } = useTranslation();

  const resolveText = (value: string | boolean | Date | ListValue | Function) => {
    return (
      resolveValue(value) ||
      (isListValue(value) ? resolveValue(value?.default || props.default) : null)
    );
  };

  const resolveValue = (
    value:
      | number
      | string
      | boolean
      | Date
      | ListValue
      | Function
      | Array<string | boolean | Date | ListValue>
  ) => {
    switch (typeof value) {
      case 'function':
        return value();
      case 'boolean':
        switch (value) {
          case true:
            return t('YES');
          case false:
            return t('NO');
        }
        break;
      case 'object':
        if (value instanceof Date) {
          return value.toDateString();
        }

        if (value instanceof Array) {
          return value.map((v) => t(v.toString())).join(', ');
        }
        if (isListValue(value)) return resolveValue(value.text);
        return value;
      default:
        return value?.toString();
    }
  };

  const resolveItem = (key: string, value: string | boolean | Date | ListValue, i: number) => {
    // coherse value into ListValue compatible type
    if (value && typeof value == 'object') {
      if (value instanceof Array) {
        value = {
          label: key,
          items: value,
        };
      } else if (value instanceof Date) {
        value = {
          label: key,
          text: value,
        };
      } else {
        value.label = value?.label || key;
      }
    } else {
      value = {
        label: key,
        text: value,
      };
    }

    // resolve display property
    if (isListValue(value)) {
      if (typeof value.show == 'function') {
        value.show = value.show();
      }

      if (value.show == false) return;

      if (typeof value.default == 'function') {
        value.default = value.default();
      }

      if (value.items) {
        // nested table
        const firstValue = value.items[0];
        if (typeof firstValue == 'object') {
          return (
            <tr key={key}>
              <td colSpan={2}>
                {t(value.label)}
                <hr />
                <Table>
                  <thead>
                    <tr>
                      {Object.entries(firstValue).map(([subKey, subValue], subI) => (
                        <td key={subI}>
                          <strong>{t(subValue?.label || subKey)}</strong>
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {value.items.map((v, i) => (
                      <tr key={i}>
                        {Object.values(v).map((subValue, subI) => (
                          <td key={subI}>{resolveText(subValue)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
            </tr>
          );
        } else {
          value.text = value.items;
          delete value.items;
        }
      }

      return (
        <tr key={key}>
          <td>{t(value?.label)}</td>
          <td>{resolveText(value)}</td>
        </tr>
      );
    }

    return <></>;
  };

  return (
    <Table bordered striped>
      <tbody>
        {Object.entries(props.obj).map(([key, value], i) => resolveItem(key, value, i))}
      </tbody>
    </Table>
  );
}
