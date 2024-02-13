"use client";

import Image from "next/image";
import { useMutation } from "@apollo/client";
import { UPDATE_USER, DELETE_USER } from "@/lib/queries";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useCallback, useEffect, useState } from "react";
import { deleteObjectURL, getObjectURL } from "@/lib/actions";

const Badge = ({
  user,
  refetch,
}: {
  user: Record<string, string | null | number>;
  refetch: any;
}) => {
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [profile, setProfile] = useState<string | null>(null);

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
      if (user) {
        const { success } = await deleteObjectURL(user.profile as string);
        await fetch(success.url, {
          method: "DELETE",
        });
        await deleteUser({
          variables: {
            id: user.id,
          },
        });
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        refetch();
      }
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  };

  const handleProfile = useCallback(async () => {
    try {
      const { success } = await getObjectURL(user.profile as string);
      if (success) {
        setProfile(success.url);
      }
    } catch (error) {
      setProfile(null);
    }
  }, [user.profile]);

  useEffect(() => {
    if (user && user.profile) {
      handleProfile();
    }
  }, [handleProfile, user]);

  return (
    <div className="w-full flex flex-row items-center justify-between bg-slate-100 p-4">
      <div className="w-full flex flex-row gap-2">
        <div className="border border-slate-400 items-center p-0 flex h-10 w-10 rounded-full bg-white">
          <Image
            src={profile ?? "/next.svg"}
            alt="user-logo"
            className="rounded-full"
            width={40}
            height={40}
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
