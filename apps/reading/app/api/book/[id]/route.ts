/**
 * API route for fetching a single book with all its highlights.
 *
 * Accepts a book ID as a URL parameter, validates it, and returns the
 * book data paired with its highlights from the Readwise API.
 *
 * @route GET /api/book/:id
 * @param id - The Readwise book ID (numeric).
 * @returns 200 with BookWithHighlights JSON on success.
 * @returns 400 if the ID is not a valid number.
 * @returns 404 if the book is not found.
 */
import { NextResponse } from "next/server";
import { getBookWithHighlights } from "@/lib/readwise";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);

  if (isNaN(bookId)) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const data = await getBookWithHighlights(bookId);

  if (!data) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
