'use client';
import { useState, SyntheticEvent } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAuth } from './AuthContext';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import FormData from 'form-data';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { Eye, EyeSlash } from 'iconsax-react';
import useScriptRef from 'hooks/useScriptRef';
import { preload } from 'swr';
import Links from '@mui/material/Link';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fetcher } from 'utils/axios';

const Popup = ({ open, onClose, message, authorization }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Login Status</DialogTitle>
    <DialogContent>
      <Typography variant="body1">{message}</Typography>
      {authorization && (
        <Typography variant="subtitle2" color="textSecondary" mt={2}>
          <strong>Authorization Token:</strong> {authorization}
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

const AuthLogin = ({ providers, csrfToken }:any) => {
  const scriptedRef = useScriptRef();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthData } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [authorization, setAuthorization] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);  // New state for "Keep me signed in"

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const handleCheckboxChange = (event) => {
    setKeepSignedIn(event.target.checked);  // Update "Keep me signed in" state
  };

  return (
    <>
      <Formik
        initialValues={{
          email: 'minmattral@gmail.com',
          password: 'aAertyuiop@1',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const data = new FormData();
            data.append('email', values.email);
            data.append('password', values.password);
        
            const config = {
              method: 'post',
              url: 'https://lawonearth.co.uk/api/auth/core/login',
              headers: {
                'COMPANY-CODE': 'def-mc-admin',
                'FRONTEND-KEY': 'XXX',
              },
              data: data,
            };
        
            const response = await axios(config);
        
            if (response.status === 200 && response.data.status === 'treatmentSuccess') {
              const authToken = response.data.data.primaryData.authorization;
              setStatus({ success: true });
              setSubmitting(false);
              preload('api/menu/dashboard', fetcher);
              setAuthData(response.data);
              localStorage.setItem('authData', JSON.stringify(response.data));
              sessionStorage.setItem('authData', JSON.stringify(response.data));
        
              setPopupMessage('Login succeeded!');
              setAuthorization(authToken);
              setShowPopup(true);
        
              preload('api/menu/dashboard', fetcher);
              await signIn('credentials', { redirect: false, email: values.email, password: values.password });
              setStatus({ success: true });
              setSubmitting(false);
              window.location.href = '/dashboard/default';

            } else {
              throw new Error(response.data.message || 'Login failed');
            }
          } catch (error) {
            setStatus({ success: false });
            setAuthorization(''); // Clear authorization on error
        
            if (axios.isAxiosError(error) && error.response) {
              const apiErrors = error.response.data;
        
              if (apiErrors.status === 'treatmentFailure') {
                // Set the specific error message from the API response
                setPopupMessage(apiErrors.data.primaryData.msg || 'An error occurred');
              } else {
                setPopupMessage('An error occurred during login');
              }
            } else if (error instanceof Error) {
              setPopupMessage(error.message);
            } else {
              setPopupMessage('An unknown error occurred');
            }
        
            setShowPopup(true);
            setSubmitting(false);
          }
        }}
        
        
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Popup open={showPopup} onClose={() => setShowPopup(false)} message={popupMessage} authorization={authorization} />

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {/* "Keep me signed in" checkbox */}
              <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={keepSignedIn}
                      onChange={handleCheckboxChange}
                      name="checked"
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="h6">Keep me signed in</Typography>}
                />
                <Links variant="h6" component={Link} href={session ? '/auth/forgot-password' : '/forgot-password'} color="text.primary">
                  Forgot Password?
              </Links>
              </Stack>
            </Grid>

              

              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
