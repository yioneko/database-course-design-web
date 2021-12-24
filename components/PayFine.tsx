import { Button, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import message from "../common/message.json";
import useInterval from "../hooks/useInterval";
import qrcode from "../public/qrcode4payment.png";

function PayFine({ fine, onFinish }: { fine: number; onFinish: () => void }) {
  const [confirmCountDown, setConfirmCountDown] = useState(5);
  const [delay, setDelay] = useState<number | null>(1000);

  useInterval(() => {
    if (confirmCountDown > 0) {
      setConfirmCountDown(confirmCountDown - 1);
    } else {
      setDelay(null);
    }
  }, delay);

  return (
    <div className="flex flex-col items-center">
      <Typography.Title level={4}>{message.scanQRToPay}</Typography.Title>
      <Image src={qrcode} alt={message.qr4Payment} />
      <Button
        onClick={onFinish}
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
