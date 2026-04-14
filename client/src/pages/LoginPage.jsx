import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { api } from '../services/api.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { data } = await api.post('/auth/login', form);
    localStorage.setItem('token', data.data.token);
    navigate('/dashboard');
  };

  return (
    <main className="mx-auto mt-10 max-w-md px-4">
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
