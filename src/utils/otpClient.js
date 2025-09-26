export async function fetchRoutes(from, to) {
  const OTP_PREFIX = window.__OTP_PREFIX__ || "/otp";

  const url = `${OTP_PREFIX}/routers/default/plan?fromPlace=${encodeURIComponent(
    from
  )}&toPlace=${encodeURIComponent(to)}&mode=TRANSIT,WALK&numItineraries=3`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("OTP request failed");

  const data = await res.json();
  const itineraries = data.plan?.itineraries || [];

  return itineraries.map((it, idx) => ({
    label: `Option ${idx + 1}`,
    geometry: it.legs.map((leg) => [leg.from.lat, leg.from.lon]),
  }));
}
