import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography
} from '@mui/material';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { AnimateButton } from './mantis/AnimateButton';
import { useAuth } from '../hooks/useAuth';
import type { RegisterFormValues } from '../types/auth.types';

interface RegisterFields extends RegisterFormValues {
  submit?: string | null;
}

function passwordStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Poor', color: '#ff4d4f' };
  if (score === 2) return { label: 'Weak', color: '#faad14' };
  if (score === 3) return { label: 'Normal', color: '#1677ff' };
  return { label: 'Good', color: '#52c41a' };
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik<RegisterFields>
      initialValues={{
        name: '',
        email: '',
        age: '',
        gender: 'MALE',
        address: '',
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(100).required('Full name is required'),
        age: Yup.number().typeError('Age must be a number').min(16, 'Age must be at least 16').max(70, 'Age must be at most 70').required('Age is required'),
        gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required('Gender is required'),
        address: Yup.string().max(200).required('Address is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string()
          .required('Password is required')
          .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value?.trim()),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Confirm password does not match')
          .required('Confirm password is required')
      })}
      onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {
        try {
          await register(values);
          resetForm();
          navigate('/login', { replace: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Register failed. Please try again.';
          setErrors({ submit: message });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => {
        const strength = passwordStrength(values.password);

        return (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {errors.submit ? (
                <Grid item xs={12}>
                  <Alert severity="error">{errors.submit}</Alert>
                </Grid>
              ) : null}

              <Grid item xs={12} md={6}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="name-signup">Full Name*</InputLabel>
                  <OutlinedInput
                    id="name-signup"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nguyen Van A"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                </Stack>
                {touched.name && errors.name ? <FormHelperText error>{errors.name}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="age-signup">Age*</InputLabel>
                  <OutlinedInput
                    id="age-signup"
                    value={values.age}
                    name="age"
                    type="number"
                    inputProps={{ min: 16, max: 70 }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="20"
                    fullWidth
                    error={Boolean(touched.age && errors.age)}
                  />
                </Stack>
                {touched.age && errors.age ? <FormHelperText error>{errors.age}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="gender-signup">Gender*</InputLabel>
                  <Select
                    id="gender-signup"
                    name="gender"
                    value={values.gender}
                    onBlur={handleBlur}
                    onChange={(event) => setFieldValue('gender', event.target.value)}
                    error={Boolean(touched.gender && errors.gender)}
                    fullWidth
                  >
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </Stack>
                {touched.gender && errors.gender ? <FormHelperText error>{errors.gender}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="address-signup">Address*</InputLabel>
                  <OutlinedInput
                    id="address-signup"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ha Noi"
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                  />
                </Stack>
                {touched.address && errors.address ? <FormHelperText error>{errors.address}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-signup"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="student@ptit.edu.vn"
                  />
                </Stack>
                {touched.email && errors.email ? <FormHelperText error>{errors.email}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-signup">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
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
                    placeholder="******"
                  />
                </Stack>
                {touched.password && errors.password ? <FormHelperText error>{errors.password}</FormHelperText> : null}

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: strength.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {strength.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="confirm-password-signup">Confirm Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirm-password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="******"
                  />
                </Stack>
                {touched.confirmPassword && errors.confirmPassword ? <FormHelperText error>{errors.confirmPassword}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to create an account for Internship Matching and use your information for authentication.
                  &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
}
