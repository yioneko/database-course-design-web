import { EditOutlined } from "@ant-design/icons";
import { Input, message as antdMessage } from "antd";
import { useEffect, useRef, useState } from "react";
import { useUserNameMutation } from "../hooks/queries";
import message from "../common/message.json";

function NameEdit({ userId, name }: { userId: string; name: string }) {
  const mutation = useUserNameMutation(userId);
  const [editing, setEditing] = useState(false);

  const inputRef = useRef<Input>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // TODO: avoid unmount - remount
  if (editing) {
    return (
      <Input
        name="name"
        ref={inputRef}
        className="max-w-xs"
        defaultValue={name}
        placeholder={message.enterName}
        disabled={mutation.isLoading}
        onPressEnter={(e) => {
          mutation
            .mutateAsync((e.target as HTMLInputElement).value as string)
            .then(() => {
              antdMessage.success(message.nameModified);
              setEditing(false);
            });
        }}
        onBlur={() => {
          setEditing(false);
        }}
      />
    );
  } else {
    return (
      <>
        {name}
        <EditOutlined
          className="relative top-0.5 left-1 text-purple-500 hover:text-gray-400 transition-colors cursor-pointer"
          onClick={() => {
            setEditing(true);
          }}
        />
      </>
    );
  }
}

export default NameEdit;
