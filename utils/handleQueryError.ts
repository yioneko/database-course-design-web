import axios from "axios";
import { ErrorResponse } from "../common/interface";
import message from "../common/message.json";

function handleQueryError(err: unknown, onMessge: (msg: string) => void) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data) {
      const { error: msg } = data as ErrorResponse;
      onMessge(msg);
    } else {
      onMessge(message.reqFailed);
    }
  } else if (err instanceof Error) {
    onMessge(err.message);
  } else if (process.env.NODE_ENV === "development") {
    console.error(err);
  }
}

export default handleQueryError;
