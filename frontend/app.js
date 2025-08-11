const App = () => {
  const [propertyId, setPropertyId] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);
  const [history, setHistory] = React.useState([]);

  const upload = async () => {
    if (!image || !propertyId) return;
    const form = new FormData();
    form.append('image', image);
    form.append('propertyId', propertyId);
    const res = await fetch('/api/analysis', { method: 'POST', body: form });
    const data = await res.json();
    setTasks(data.tasks || []);
    loadHistory(propertyId);
  };

  const loadHistory = async (id) => {
    const res = await fetch(`/api/history/${id}`);
    const data = await res.json();
    setHistory(data);
  };

  return (
    <div>
      <h1>Landscape Assistant</h1>
      <input placeholder="Property ID" value={propertyId} onChange={e => setPropertyId(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={upload}>Analyze</button>
      <h2>Recommended Tasks</h2>
      <ul>
        {tasks.map((t, i) => <li key={i}>{t.task}: {t.recommendation}</li>)}
      </ul>
      <h2>History</h2>
      <button onClick={() => loadHistory(propertyId)}>Refresh History</button>
      <ul>
        {history.map((h, i) => (
          <li key={i}>{h.date}: {h.tasks.map(t => t.task).join(', ')}</li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
