import { useState } from 'react';
import type { FormEvent } from 'react';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.phone && { phone: formData.phone }),
      };

      const response = await authApi.register(registerData);
      toast.success(response.message);
      setRegisteredEmail(formData.email);
      setIsVerifying(true);
    } catch (error: any) {
      // Check for 409 Conflict - user already exists
      if (error.response?.status === 409) {
        toast.error('User with this email already exists. Please sign in instead.');
      } else {
        const errorMessage =
          error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      }
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
        email: registeredEmail,
        code: verificationCode,
      });
      toast.success(response.message);

      // Redirect to login after successful verification
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await authApi.resendVerification(registeredEmail);
      toast.success(response.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to resend code. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (isVerifying) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <img
              src="https://i.postimg.cc/gkJD38Lv/logo.png"
              alt="StudioPresent Logo"
              className="logo"
            />
            <h1>Verify Your Email</h1>
            <p>Enter the 5-digit code sent to {registeredEmail}</p>
          </div>

          <form onSubmit={handleVerifyEmail} className="register-form">
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
              />
            </div>

            <button type="submit" className="register-button">
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
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <img
            src="https://i.postimg.cc/gkJD38Lv/logo.png"
            alt="StudioPresent Logo"
            className="logo"
          />
          <h1>Create Account</h1>
          <p>Join StudioPresent Marketplace today</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
