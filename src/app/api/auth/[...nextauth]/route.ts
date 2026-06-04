import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "NextAuth is disabled. Custom JWT auth is active." }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: "NextAuth is disabled. Custom JWT auth is active." }, { status: 404 });
}
