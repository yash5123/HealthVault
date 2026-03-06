export default function AIInsights({ medicines }) {

  const insights = [];

  const critical = medicines.filter(m => m.quantity === 0);

  if (critical.length > 0) {
    insights.push("Critical medicines detected. Immediate restock recommended.");
  }

  const low = medicines.filter(m => m.quantity < 10 && m.quantity > 0);

  if (low.length > 0) {
    insights.push("Some medicines running low.");
  }

  if (insights.length === 0) {
    insights.push("All medicine stocks look healthy.");
  }

  return (

    <div className="ai-card">

      <h3>AI Health Insights</h3>

      {insights.map((text, i) => (

        <p key={i}>{text}</p>

      ))}

    </div>

  );

}