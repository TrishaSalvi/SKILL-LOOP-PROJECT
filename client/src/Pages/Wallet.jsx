import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Loading from "../Components/Loading.jsx";
import StatCard from "../Components/StatCard.jsx";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [walletRes, transactionRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/transactions")
      ]);

      setWallet(walletRes.data);
      setTransactions(transactionRes.data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="text-4xl font-black text-ink">Credit wallet</h1>
        <p className="mt-2 text-slate-600">Your wallet shows spendable credits and credits locked in escrow.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <StatCard label="Available Balance" value={wallet.balance} hint="Can be spent on sessions" />
        <StatCard label="Escrow Balance" value={wallet.escrowBalance} hint="Locked until session completion/cancellation" />
      </section>

      <section className="card">
        <h2 className="text-2xl font-black text-ink">Transaction history</h2>
        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Description</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="p-4 font-bold text-ink">{tx.type}</td>
                  <td className={`p-4 font-black ${tx.amount >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{tx.amount}</td>
                  <td className="p-4 text-slate-600">{tx.description}</td>
                  <td className="p-4 text-slate-500">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {!transactions.length && (
                <tr><td className="p-6 text-center text-slate-500" colSpan="4">No transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
