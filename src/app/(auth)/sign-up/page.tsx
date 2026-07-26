"use client";

import React, { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { apiResponse } from "@/types/apiResponse";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [username, setusername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 400);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setisCheckingUsername(true);
        setusernameMessage("");
        try {
          const response = await axios.get(
            `/api/checkUsernameUnique?username=${debouncedUsername}`
          );
          setusernameMessage(response.data.message);
        } catch (error) {
          setusernameMessage("Error checking username availability");
        } finally {
          setisCheckingUsername(false);
        }
      } else {
        setusernameMessage("");
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);
    try {
      const response = await axios.post<apiResponse>("/api/sign-up", data);

      if (!response.data.success) {
        toast.error("Sign Up Failed", {
          description: response.data.message || "We're facing some error",
        });
        return;
      }

      toast.success("Success!", {
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (err) {
      console.error("There was some problem", err);
      const axiosError = err as import("axios").AxiosError<apiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "We're facing some error";

      toast.error("Sign Up Failed", {
        description: errorMessage,
      });
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-xs uppercase tracking-widest text-violet-400 font-semibold mb-2 hover:text-white transition-colors"
          >
            ← Ghostline
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Create your frequency
          </h1>
          <p className="text-sm text-white/50">
            Start receiving anonymous thoughts instantly.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-white/70 text-xs uppercase tracking-wider ml-1 font-medium mb-2"
                >
                  Username
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="ishusyncs"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    setusername(e.target.value);
                  }}
                  className="bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 rounded-2xl px-4 focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {isCheckingUsername && (
                  <p className="text-xs text-white/40 ml-2 mt-1 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Checking availability...
                  </p>
                )}
                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-xs font-medium ml-2 mt-1 ${
                      usernameMessage === "Username is available"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}
              </Field>
            )}
          />


          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-white/70 text-xs uppercase tracking-wider ml-1 font-medium mb-2"
                >
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="name@example.com"
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 rounded-2xl px-4 focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-white/70 text-xs uppercase tracking-wider ml-1 font-medium mb-2"
                >
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  className="bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 rounded-2xl px-4 focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 cursor-pointer !bg-white !text-black hover:!bg-neutral-200 font-semibold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Establishing...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        <div className="text-center mt-6 text-xs text-white/40">
          Already have a link?{" "}
          <Link
            href="/sign-in"
            className="text-white font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}