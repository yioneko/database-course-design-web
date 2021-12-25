import { Button, message as antdMessage, Typography } from "antd";
import axios from "axios";
import Image from "next/image";
import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { FinePaidCheckSuccessResponse } from "../common/interface";
import message from "../common/message.json";
import useInterval from "../hooks/useInterval";
import UserCtx from "../providers/user";
import qrcode from "../public/qrcode4payment.png";
import handleQueryError from "../utils/handleQueryError";

function PayFine({ onFinish }: { onFinish: () => void }) {
  const [confirmCountDown, setConfirmCountDown] = useState(5);
  const [delay, setDelay] = useState<number | null>(1000);

  useInterval(() => {
    if (confirmCountDown > 0) {
      setConfirmCountDown(confirmCountDown - 1);
    } else {
      setDelay(null);
    }
  }, delay);

  const queryClient = useQueryClient();
  const { userId } = useContext(UserCtx);

  const onClick = async () => {
    try {
      // TODO: How to handle this in react-query? (no cache, and instant callback)
      const res = await axios.get<FinePaidCheckSuccessResponse>(
        `/api/user/${userId}/paid`
      );
      if (res.data.isPaid) {
        onFinish();
        queryClient.invalidateQueries("borrow");
        queryClient.invalidateQueries("transactions");
      } else {
        antdMessage.error(message.notPaid);
      }
    } catch (e) {
      handleQueryError(e, antdMessage.error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Typography.Title level={4}>{message.scanQRToPay}</Typography.Title>
      <Image src={qrcode} alt={message.qr4Payment} />
      <Button
        onClick={onClick}
        type="primary"
        className="mt-4 mb-4"
        disabled={confirmCountDown > 0}
      >
        {message.ivePaid} {confirmCountDown > 0 ? `(${confirmCountDown})` : ""}
      </Button>
    </div>
  );
}

export default PayFine;
