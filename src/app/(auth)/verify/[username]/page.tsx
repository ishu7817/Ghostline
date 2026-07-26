"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { verifySchema } from "@/schemas/verifySchema";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiResponse } from "@/types/apiResponse";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username,
        verifycode: data.code, 
      });

      if (!response.data.success) {
        toast.error("Verification Failed", {
          description: response.data.message,
        });
        return;
      }

      toast.success("Success", {
        description: "You're now verified!!🦖🐍🐢",
      });
      router.replace("/sign-in");

    } catch (err) {
      console.error("Verification error:", err);
      const axiosError = err as import("axios").AxiosError<apiResponse>;
      toast.error("Verification failed", {
        description: axiosError.response?.data.message ?? "We're facing some error from our end",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xs uppercase tracking-widest text-violet-400 font-semibold mb-2 hover:text-white transition-colors">
            ← Ghostline
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Verify your frequency
          </h1>
          <p className="text-sm text-white/50">
            Enter the verification code sent to your email.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <label htmlFor={field.name} className="block text-white/70 text-xs uppercase tracking-wider ml-1 font-medium mb-2">
                  Security Code
                </label>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="123456"
                  aria-invalid={fieldState.invalid}
                  className="bg-black/45 border-white/10 text-white placeholder:text-white/20 h-12 rounded-2xl px-4 focus-visible:ring-violet-500 focus-visible:border-violet-500 transition-all text-center tracking-[0.3em] text-lg font-mono"
                />
                {fieldState.invalid && (
                  <p className="text-red-400 text-xs font-medium ml-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {fieldState.error?.message}
                  </p>
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
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>


      </motion.div>
    </div>
  );
}