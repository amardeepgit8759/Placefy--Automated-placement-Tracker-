import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string" || !username.trim()) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const cleanUsername = username.trim();

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: JSON.stringify({
        query,
        variables: { username: cleanUsername },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to connect to LeetCode API" }, { status: 502 });
    }

    const data = await response.json();

    if (!data?.data?.matchedUser) {
      return NextResponse.json({ error: "LeetCode user not found" }, { status: 404 });
    }

    const submitStats = data.data.matchedUser.submitStatsGlobal?.acSubmissionNum || [];

    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    submitStats.forEach((item: { difficulty: string; count: number }) => {
      if (item.difficulty === "All") totalSolved = item.count;
      if (item.difficulty === "Easy") easySolved = item.count;
      if (item.difficulty === "Medium") mediumSolved = item.count;
      if (item.difficulty === "Hard") hardSolved = item.count;
    });

    return NextResponse.json({
      username: data.data.matchedUser.username,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
    });
  } catch (error) {
    console.error("LeetCode stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch LeetCode statistics" }, { status: 500 });
  }
}
