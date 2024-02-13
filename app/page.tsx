"use client";

import Badge from "@/components/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserForm from "@/components/user-form";
import { FETCH_USERS } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";

export default function Home() {
  const { loading, error, data, refetch } = useQuery(FETCH_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <main className="flex max-h-screen flex-col md:flex-row gap-4 md;gap-10 p-4 md:p-10">
      <div className="w-full h-full md:w-[50%] p-4 md:p-10 flex flex-col justify-start border border-gray-400 rounded">
        <UserForm refetch={refetch} />
      </div>

      <div
        className={cn(
          "w-full md:w-[50%] p-4 md:p-10 flex flex-col justify-start border border-gray-400 rounded",
          { "justify-center": data.users.length > 0 }
        )}
      >
        <h1>List of all users</h1>
        {data.users.length > 0 ? (
          <ScrollArea className="rounded-md border">
            {data.users.map((user: Record<string, string | null | number>) => (
              <div key={user?.id}>
                <Badge user={user} refetch={refetch} />
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div>
            <h1>No records found</h1>
          </div>
        )}
      </div>
    </main>
  );
}
