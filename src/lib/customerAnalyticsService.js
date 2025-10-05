// src/lib/customerAnalyticsService.js
import { supabase } from "./supabaseClient";

function normalizeDateToDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDayLabel(date, mode, index) {
  if (mode === "currentWeek") {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return dayNames[new Date(date).getDay()];
  }
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function getNewUsersData(mode = "last7Days") {
  const today = new Date();
  const start = new Date(today);
  if (mode === "currentWeek") {
    const dow = today.getDay();
    const daysToMonday = dow === 0 ? 6 : dow - 1;
    start.setDate(today.getDate() - daysToMonday);
  } else {
    start.setDate(today.getDate() - 6);
  }
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  // Fetch orders (user_id, created_at)
  const { data: orders, error } = await supabase
    .from("orders")
    .select("user_id, created_at");

  if (error) {
    console.error("Failed to fetch orders for new users:", error);
    return { totalInRange: 0, todayCount: 0, chartData: [] };
  }

  // Compute first order date per user
  const firstOrderByUser = new Map();
  (orders || []).forEach((o) => {
    const uid = o.user_id;
    const created = new Date(o.created_at);
    const prev = firstOrderByUser.get(uid);
    if (!prev || created < prev) firstOrderByUser.set(uid, created);
  });

  // Build date buckets
  const days = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const countsByDay = days.map(() => 0);

  firstOrderByUser.forEach((firstDate) => {
    if (firstDate >= start && firstDate <= end) {
      const dayIndex = Math.floor((normalizeDateToDay(firstDate) - start) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < countsByDay.length) countsByDay[dayIndex] += 1;
    }
  });

  const chartData = days.map((d, idx) => ({
    day: formatDayLabel(d, mode, idx),
    users: countsByDay[idx],
    date: d.toISOString().split("T")[0],
    fullDate: d.toDateString(),
  }));

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const todayCount = Array.from(firstOrderByUser.values()).filter(
    (d) => d >= todayStart && d <= todayEnd
  ).length;

  const totalInRange = countsByDay.reduce((a, b) => a + b, 0);

  return { totalInRange, todayCount, chartData };
}

export async function getRatingsData() {
  const { data, error } = await supabase
    .from("ratings")
    .select("order_id, stars, feedback, created_at, orders!inner(user_id)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch ratings:", error);
    return { ratings: [], distribution: { 1:0,2:0,3:0,4:0,5:0 }, average: 0 };
  }

  const ratings = (data || []).map((r) => ({
    order_id: r.order_id,
    user_id: r.orders?.user_id || null,
    stars: r.stars,
    feedback: r.feedback,
    created_at: r.created_at,
  }));

  const distribution = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  let sum = 0;
  let cnt = 0;
  ratings.forEach((r) => {
    if (r.stars >= 1 && r.stars <= 5) {
      distribution[r.stars] += 1;
      sum += r.stars;
      cnt += 1;
    }
  });
  const average = cnt > 0 ? +(sum / cnt).toFixed(1) : 0;

  return { ratings, distribution, average };
}

export async function getFeedbackList() {
  const { ratings } = await getRatingsData();
  // Fetch profiles for names/emails
  const userIds = Array.from(new Set(ratings.map((r) => r.user_id).filter(Boolean)));
  let profilesMap = new Map();
  if (userIds.length > 0) {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, display_name, email")
      .in("id", userIds);
    if (!error && profiles) {
      profilesMap = new Map(profiles.map((p) => [p.id, p]));
    }
  }

  const feedback = ratings
    .filter((r) => r.feedback && r.feedback.trim())
    .map((r) => {
      const p = profilesMap.get(r.user_id);
      const name = p?.display_name || p?.email || (r.user_id ? r.user_id.slice(0, 8) : "Unknown");
      const date = new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return {
        id: `${r.order_id}-${r.created_at}`,
        rating: r.stars,
        feedback: r.feedback,
        customer: name,
        date,
      };
    });

  return feedback;
}


