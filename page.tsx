"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const messageSchema = z.object({
  content: z.string().min(2, "Message must be at least 2 characters").max(300, "Message must be under 300 characters"),
});

export default function SendMessagePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    // TODO: wire this to your /api/send-message route
    // - set isSubmitting true
    // - axios.post("/api/send-message", { username, content: data.content })
    // - check response.data.success, toast accordingly
    // - form.reset() on success
    // - set isSubmitting false in finally
  };

  const fetchSuggestedMessages = async () => {
    // TODO: wire this to your /api/suggest-messages route
    // - set isSuggesting true
    // - axios call to the endpoint
    // - split the returned text on "||", trim each piece
    // - setSuggestedMessages(...)
    // - set isSuggesting false in finally
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-[#e8e6e1] font-sans flex justify-center px-6 py-16 overflow-hidden">
      {/* glow */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.16)_0%,rgba(139,92,246,0)_70%)] -top-24 left-1/2 -translate-x-1/2 pointer-events-none" />

      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-[520px] w-full text-center">
        <p className="text-[13px] tracking-[0.15em] uppercase text-[#9b8fd9] mb-5">
          Anonymous · Unfiltered
        </p>

        <h1 className="font-serif italic text-[clamp(2rem,5vw,3.2rem)] leading-[1.15]">
          Send @{username} a message
        </h1>

        <p className="mt-4 text-[#9a978f] text-[0.95rem]">
          They won&apos;t know it&apos;s you. Say what you actually mean.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 text-left">
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Your message</FieldLabel>
                <textarea
                  {...field}
                  id={field.name}
                  rows={5}
                  placeholder="Type something honest..."
                  aria-invalid={fieldState.invalid}
                  className="w-full bg-white/[0.04] border border-[#35323d] rounded-xl px-4 py-3.5 text-[#e8e6e1] text-[0.95rem] resize-y focus:outline-none focus:border-violet-500"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
            {isSubmitting ? "Sending..." : "Send message"}
          </Button>
        </form>




        <div className="mt-8">
          <Button
            type="button"
            onClick={fetchSuggestedMessages}
            disabled={isSuggesting}
            className="w-full"
          >
            {isSuggesting ? "Thinking..." : "Suggest messages"}
          </Button>

          {suggestedMessages.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {suggestedMessages.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => form.setValue("content", msg, { shouldValidate: true })}
                  className="text-left bg-white/[0.03] border border-[#2c2a33] rounded-[10px] px-4 py-2.5 text-[#cfcdc7] text-[0.9rem] hover:border-violet-500 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-12 text-[12px] text-[#55524d] tracking-[0.08em] uppercase">
          Mystery Message
        </p>
      </div>
    </div>
  );
}