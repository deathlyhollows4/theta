const AuthForm = ({ title, onSubmit, fields, submitText }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      {fields.map((field) => (
        <label key={field.name} className="block text-sm">
          <span className="mb-1 block text-slate-300">{field.label}</span>
          <input
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400"
            required
          />
        </label>
      ))}
      <button className="w-full rounded-md bg-cyan-600 px-4 py-2 font-medium hover:bg-cyan-500">{submitText}</button>
    </form>
  );
};

export default AuthForm;
