const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async function handler(req, res) {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
