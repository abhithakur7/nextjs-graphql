"use client";

import { CREATE_USER } from "@/lib/queries";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useState } from "react";
import Image from "next/image";
import { putObjectURL } from "@/lib/actions";
import { generateFileName } from "@/lib/utils";

const formSchema = z.object({
  first_name: z.string().min(1, {
    message: "This field is required",
  }),
  last_name: z.string().min(1, {
    message: "This field is required",
  }),
  email: z.string().email().min(1, {
    message: "This field is required",
  }),
  age: z.string().min(1, {
    message: "This field is required",
  }),
  active: z.boolean(),
});

const UserForm = ({ refetch }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      active: false,
    },
  });

  const [createUser] = useMutation(CREATE_USER);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    console.log(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (file) {
        const { age, first_name, last_name, email } = data || {};
        const filename = generateFileName();
        const { success, failure } = await putObjectURL({
          key: filename,
          fileSize: file.size,
          fileType: file.type,
        });

        if (failure) return console.log(failure);

        if (success) {
          await fetch(success.url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });
          await createUser({
            variables: {
              input: {
                age: Number(age),
                first_name,
                last_name,
                email,
                profile: filename,
              },
            },
          });
          toast({
            title: "Success",
            description: "User created successfully",
          });
          refetch();
          form.reset();
          setPreviewUrl(null);
          setFile(null);
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create user");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input placeholder="Age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {previewUrl && file ? (
          <div className="relative pt-4">
            <Image
              src={previewUrl}
              alt="logo"
              width={"40"}
              height={"40"}
              layout=""
              style={{ width: "100%", height: "auto" }}
            />
            <Button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
              size={"icon"}
              className="rounded-full absolute top-1 right-[-10px]"
            >
              x
            </Button>
          </div>
        ) : (
          <FormItem>
            <FormLabel htmlFor="profile">Profile Pic</FormLabel>
            <FormControl>
              <Input type="file" name="profile" onChange={handleImageChange} />
            </FormControl>
          </FormItem>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default UserForm;
