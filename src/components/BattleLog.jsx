// BattleLog.jsx
export default function BattleLog({ log }) {
    return (
        <div style={{ marginTop: 20 }}>
            <h3>Log</h3>
            {log.slice(-5).map((entry, i) => (
                <div key={i}>{entry}</div>
            ))}
        </div>
    );
}