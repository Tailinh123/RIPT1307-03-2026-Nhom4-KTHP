import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { AnimateButton } from './mantis/AnimateButton';
import { useAuth } from '../hooks/useAuth';

interface LoginFields {
  email: string;
  password: string;
  submit?: string | null;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik<LoginFields>
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string()
          .required('Password is required')
          .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value?.trim())
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          await login({
            email: values.email,
            password: values.password,
            rememberMe
          });
          navigate('/account', { replace: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
          setErrors({ submit: message });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {errors.submit ? (
              <Grid item xs={12}>
                <Alert severity="error">{errors.submit}</Alert>
              </Grid>
            ) : null}

            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
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
              </Stack>
              {touched.email && errors.email ? (
                <FormHelperText error id="helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              ) : null}
            </Grid>

            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
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
                        onClick={() => setShowPassword((current) => !current)}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password ? (
                <FormHelperText error id="helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              ) : null}
            </Grid>

            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      name="rememberMe"
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="h6">Keep me sign in</Typography>}
                />
                <Link variant="h6" component={RouterLink} to="#" color="text.primary">
                  Forgot Password?
                </Link>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
