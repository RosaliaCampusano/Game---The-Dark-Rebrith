import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const result = await pool.query(
      "SELECT name, score FROM records ORDER BY score DESC"
    );
    return res.json(result.rows);
  }

  if (req.method === "POST") {
    const { name, score } = req.body;
    if (!name || score === undefined) {
      return res.status(400).json({ error: "name and score are required" });
    }
    await pool.query("INSERT INTO records (name, score) VALUES ($1, $2)", [
      name,
      score,
    ]);
    return res.json({ name, score });
  }

  res.status(405).json({ error: "Method not allowed" });
}
