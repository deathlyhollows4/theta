import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { api } from '../services/api.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('token', data.data.token);
    navigate('/dashboard');
  };

  return (
    <main className="mx-auto mt-10 max-w-md px-4">
      <AuthForm
        title="Create Account"
        submitText="Register"
        onSubmit={onSubmit}
        fields={[
          { label: 'Name', name: 'name', type: 'text', value: form.name, onChange },
          { label: 'Email', name: 'email', type: 'email', value: form.email, onChange },
          { label: 'Password', name: 'password', type: 'password', value: form.password, onChange }
        ]}
      />
    </main>
  );
};

export default RegisterPage;
