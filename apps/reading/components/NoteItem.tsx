/**
 * Renders a personal note (annotation) attached to a highlight.
 *
 * Displayed with an accent-colored left border and a small "NOTE"
 * label to visually distinguish notes from highlight quotes.
 *
 * @param text - The note text written by the reader.
 */
export function NoteItem({ text }: { text: string }) {
  return (
    <div className="mb-4 border-l-2 border-accent pl-4">
      <p className="font-body text-[12px] italic leading-[1.7] text-text-body">
        {text}
      </p>
      <p className="mt-1 font-mono text-[9px] text-accent">&#9998; NOTE</p>
    </div>
  );
}
