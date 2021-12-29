import { format } from "date-fns";

export default function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
