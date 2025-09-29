import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Box,
  Divider,
} from '@mui/material';
import { CheckCircleOutline, VpnKey } from '@mui/icons-material';

// The enhanced OTP component
const OTPComponent = ({ user_id, onSubmit, onResend }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Effect to handle the resend timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(otp, user_id);
    setLoading(false);
  };

  const handleResendClick = () => {
    setResendCooldown(60);
    setIsResendDisabled(true);
    onResend(user_id);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
        width: { xs: '90%', sm: 400 },
        mx: 'auto',
        mt: 8,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <VpnKey sx={{ fontSize: 60, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          Verify Your Account
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          An OTP has been sent to your email. Please enter the 6-digit code below to verify your account.
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={2} alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '10px' } }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutline />}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ width: '100%' }} />

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Typography variant="body2" color="text.secondary">
            Didn't receive the code?
          </Typography>
          <Button
            variant="text"
            onClick={handleResendClick}
            disabled={isResendDisabled}
            sx={{ textTransform: 'none' }}
          >
            {isResendDisabled ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default OTPComponent;