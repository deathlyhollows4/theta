import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      const { data } = await api.post('/auth/login', form);
      login(data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-md px-4">
      {error && <div className="mb-3 rounded border border-rose-500/50 bg-rose-900/20 p-2 text-sm text-rose-200">{error}</div>}
      <AuthForm
        title="Login"
        submitText="Login"
        onSubmit={onSubmit}
        fields={[
          { label: 'Email', name: 'email', type: 'email', value: form.email, onChange },
          { label: 'Password', name: 'password', type: 'password', value: form.password, onChange }
        ]}
      />
    </main>
  );
};

export default LoginPage;
