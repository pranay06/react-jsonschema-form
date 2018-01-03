import React from "react";
import PropTypes from "prop-types";
import { asNumber } from "../../utils";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type, items }, value) {
  if (value === "") {
    return undefined;
  } else if (
    type === "array" &&
    items &&
    ["number", "integer"].includes(items.type)
  ) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }
  return value;
}

function getValue(event, index, value, multiple) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
  } else {
    return value;
  }
}

function SelectWidget(props) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder,
  } = props;
  const { enumOptions } = options;
  const emptyValue = multiple ? [] : "";
  return (
    <MuiThemeProvider>
      <SelectField
        id={id}
        multiple={multiple}
        // className="form-control"
        value={typeof value === "undefined" ? emptyValue : value}
        required={required}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onBlur={
          onBlur &&
          ((event, index, value) => {
            const newValue = getValue(event, index, value, multiple);
            onBlur(id, processValue(schema, newValue));
          })
        }
        onFocus={
          onFocus &&
          ((event, index, value) => {
            const newValue = getValue(event, index, value, multiple);
            onFocus(id, processValue(schema, newValue));
          })
        }
        onChange={(event, index, value) => {
          const newValue = getValue(event, index, value, multiple);
          onChange(processValue(schema, newValue));
        }}>
        {!multiple &&
          !schema.default && (
            <MenuItem
              value=""
              primaryText={placeholder ? placeholder : "Select"}
            />
          )}
        {enumOptions.map(({ value, label }, i) => {
          return <MenuItem key={i} value={value} primaryText={label} />;
        })}
      </SelectField>
    </MuiThemeProvider>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default SelectWidget;
