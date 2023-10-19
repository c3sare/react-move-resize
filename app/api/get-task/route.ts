import { NextRequest, NextResponse } from "next/server";

const Authorization = `Bearer ${process.env.PRINTFUL_API_KEY}`;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await fetch(
    `https://api.printful.com/mockup-generator/task?task_key=${body.taskId}`,
    {
      method: "GET",
      headers: {
        Authorization,
      },
    }
  );

  const res = await data.json();

  return NextResponse.json(res);
}
