import { getFxRates } from "@/lib/fx";

export const revalidate = 86400;

export async function GET() {
  const rates = await getFxRates();
  return Response.json(rates);
}
