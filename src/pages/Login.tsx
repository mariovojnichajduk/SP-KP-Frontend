import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials, setLoading } from '../store/slices/authSlice';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await authApi.login({ email, password });

      dispatch(
        setCredentials({
          user: response.user,
          token: response.access_token,
        })
      );

      toast.success('Login successful!');

      // Navigate to home page
      setTimeout(() => {
        navigate('/home');
      }, 500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Login failed. Please check your credentials.';

      // Check if user is not verified
      if (errorMessage.toLowerCase().includes('verify your email')) {
        toast.info('Redirecting to verification...');
        // Resend verification code
        try {
          await authApi.resendVerification(email);
          toast.success('Verification code sent to your email');
        } catch (resendError) {
          console.error('Failed to resend verification code', resendError);
        }
        // Switch to verification mode
        setIsVerifying(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyEmail = async (e: FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 5) {
      toast.error('Please enter a valid 5-digit verification code');
      return;
    }

    try {
      const response = await authApi.verifyEmail({
        email,
        code: verificationCode,
      });
      toast.success(response.message);

      // Reset to login form
      setIsVerifying(false);
      setVerificationCode('');
      setPassword('');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await authApi.resendVerification(email);
      toast.success(response.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to resend code. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (isVerifying) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img
              src="https://i.postimg.cc/gkJD38Lv/logo.png"
              alt="StudioPresent Logo"
              className="logo"
            />
            <h1>Verify Your Email</h1>
            <p>Enter the 5-digit code sent to {email}</p>
          </div>

          <form onSubmit={handleVerifyEmail} className="login-form">
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 5-digit code"
                maxLength={5}
                required
                autoFocus
              />
            </div>

            <button type="submit" className="login-button">
              Verify Email
            </button>

            <div className="resend-section">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                className="resend-button"
              >
                Resend Code
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>
              <button
                onClick={() => setIsVerifying(false)}
                className="back-button"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="https://i.postimg.cc/gkJD38Lv/logo.png"
            alt="StudioPresent Logo"
            className="logo"
          />
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
