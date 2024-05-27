import { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const InputField = ({
  label,
  placeholder,
  disabled = false,
  value,
  handleValueChange,
  errorMessage,
  autoFocus = false,
  number = false,
  email = false,
  password = false,
  error = false,
  inputFieldSx = {},
  ...props
}) => {
  const [block] = useAutoAnimate();
  const [hasBeenFocused, setHasBeenFocused] = useState(!autoFocus);
  const handleChange = (event) => {
    let newValue = event.target.value;
    if (email) {
      newValue = newValue.replace(/\s+/g, '');
    }
    if (number) {
      newValue = newValue.replace(/\D/g, '');
    }
    handleValueChange(newValue);
  };

  return (
    <div style={{ position: 'relative', width: '100%', ...props }} ref={block}>
      {label && (
        <Typography
          style={{
            fontSize: '14px',
            fontWeight: '400',
            color: '#333',
            marginLeft: '15px',
            marginBottom: '4px'
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder={placeholder}
        disabled={disabled}
        error={Boolean(errorMessage) || error}
        value={value}
        onChange={handleChange}
        onFocus={() => setHasBeenFocused(true)}
        autoFocus={!hasBeenFocused}
        type={email ? 'email' : password ? 'password' : number ? 'number' : 'text'}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        sx={{
          width: '100%',
          '& .MuiInputBase-input': {
            width: '100%',
            padding: '10px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: error || errorMessage ? '#CC2E2E' : disabled ? '#D9D9D9' : '#5C5C5C',
            borderRadius: '5px',
            paddingLeft: '14px',
            fontSize: '16px',
            fontWeight: '400',
            color: '#333',
            '&::placeholder': {
              color: '#707070'
            },
            '&:disabled': {
              backgroundColor: '#FFFFFF'
            },
            ...inputFieldSx
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error || errorMessage ? '#CC2E2E' : disabled ? '#D9D9D9' : '#5C5C5C'
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black'
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
            outline: 'none'
          },
          '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CC2E2E'
          },
          '& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: disabled ? '#D9D9D9' : error || errorMessage ? '#CC2E2E' : '#5C5C5C'
          },
          '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: disabled ? '#D9D9D9' : error || errorMessage ? '#CC2E2E' : '#5C5C5C'
          }
        }}
      />
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '5px'
          }}
        >
          <Typography
            style={{
              color: '#CC2E2E',
              fontSize: '12px',
              fontWeight: '400',
              marginLeft: '5px'
            }}
          >
            {errorMessage}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default InputField;
