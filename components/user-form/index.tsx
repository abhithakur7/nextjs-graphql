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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { age, first_name, last_name, email } = data || {};

    try {
      await createUser({
        variables: {
          input: { age: Number(age), first_name, last_name, email },
        },
      });
      toast({
        title: "Success",
        description: "User created successfully",
      });
      refetch();
      form.reset();
    } catch (error) {
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default UserForm;
