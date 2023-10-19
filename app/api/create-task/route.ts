import { NextRequest, NextResponse } from "next/server";

const Authorization = `Bearer ${process.env.PRINTFUL_API_KEY}`;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await fetch(
    "https://api.printful.com/mockup-generator/create-task/677",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PF-Store-Id": "culpa sint",
        accept: "application/json",
        Authorization,
      },
      body: JSON.stringify(body),
    }
  );

  const res = await data.json();

  return NextResponse.json(res);
}
