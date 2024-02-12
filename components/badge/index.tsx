"use client";

import Image from "next/image";
import { useMutation } from "@apollo/client";
import { UPDATE_USER, DELETE_USER } from "@/lib/queries";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const Badge = ({
  user,
  refetch,
}: {
  user: Record<string, string | null | number>;
  refetch: any;
}) => {
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const updateActiveStatus = async () => {
    try {
      await updateUser({
        variables: {
          input: { id: user?.id, active: user?.active ? false : true },
        },
      });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      refetch();
    } catch (error) {
      throw new Error("Failed to update user");
    }
  };

  const deleteSelectedUser = async () => {
    try {
      await deleteUser({
        variables: {
          id: user?.id,
        },
      });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      refetch();
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  };

  return (
    <div className="w-full flex flex-row items-center justify-between bg-slate-100 p-4">
      <div className="w-full flex flex-row gap-2">
        <div className="border border-slate-400 items-center flex p-2 h-10 w-10 rounded-full bg-white">
          <Image
            src="/next.svg"
            alt="user-logo"
            width={20}
            height={20}
            className="rounded-full"
          />
        </div>
        <div className="w-full flex flex-col gap-1 flex-wrap">
          <div className="flex justify-between items-center">
            <div className="m-0 text-sm text-gray-900">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="space-x-2">
              <Button
                onClick={updateActiveStatus}
                variant={user?.active ? "default" : "secondary"}
                className="rounded-full border"
                size={"sm"}
              >
                {user?.active ? "Active" : "Offline"}
              </Button>
              <Button
                onClick={deleteSelectedUser}
                variant={"destructive"}
                className="rounded-full border"
                size={"sm"}
              >
                Delete
              </Button>
            </div>
          </div>
          <span className="text-[11px] text-gray-600">{user?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Badge;
