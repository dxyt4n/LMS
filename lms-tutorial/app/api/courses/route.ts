import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { date } from "zod";

export async function POST(req: Request) {
  try {
    const authData = await auth();
    const { userId } = authData;
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
