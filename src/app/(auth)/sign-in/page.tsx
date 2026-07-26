"use client";

import React, { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema"; 
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (response?.error) {
      toast.error("Sign in failed!", {
        description: response.error || "Incorrect username or password",
      });
      setIsSubmitting(false);
      return;
    } else if (response?.url) {
      toast.success("Success!", {
        description: "Signed in successfully.",
      });
      router.replace("/dashboard");
    }
    
    setIsSubmitting(false);
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
            Welcome back
          </h1>
          <p className="text-sm text-white/50">
            Sign in to check your anonymous frequency.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-white/70 text-xs uppercase tracking-wider ml-1 font-medium mb-2"
                >
                  Username or Email
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="ishusyncs"
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
            className="w-full h-12 !bg-white !text-black hover:!bg-neutral-200 font-semibold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="text-center mt-6 text-xs text-white/40">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/sign-up"
            className="text-white font-medium hover:underline underline-offset-4 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}