"use client";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import z from "zod";
import React, { useState } from "react";

import { messageSchema } from "@/schemas/messageSchema";
import { useCompletion } from "@ai-sdk/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiResponse } from "@/types/apiResponse";

const page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [issending, setsetissending] = useState(false);
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { completion, complete, isLoading } =
    useCompletion({
      api: "/api/suggest-messages",
      streamProtocol: "text",
    });

  const sendMessage = async (data: z.infer<typeof messageSchema>) => {
    setsetissending(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });

      if (!response.data.success) {
        toast.error("Error", {
          description:
            response.data.message ||
            "we're facing some issue sending the message",
        });
        return;
      }

      toast.success("Sent", {
        description: "Your anonymous message is on its way🌌",
      });
      form.reset();
    } catch (error) {
      console.log(error);
      const axioserror = error as AxiosError<apiResponse>;
      toast.error("Error sending message", {
        description:
          axioserror.response?.data.message ?? "We're facing some error",
      });
    } finally {
      setsetissending(false);
    }
  };

  const suggestedMessages = completion.split("||");

  const handleClick = (message: string) => {
    form.setValue("content", message);
  };
  
  const errorMessages = form.formState.errors.content?.message;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-black overflow-hidden font-sans">
      
      {/* Hidden Native SVG Fractal Noise Generator */}
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.75" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
      </svg>

      {/* --- 1. THE CINEMATIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* The Ambient Light Ribbons */}
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[50vh] bg-violet-600/20 blur-[120px] -rotate-12"></div>
        <div className="absolute top-[40%] -right-[20%] w-[80vw] h-[30vh] bg-blue-500/15 blur-[130px] rotate-[35deg]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[40vh] bg-amber-100/10 blur-[100px] rotate-[-25deg]"></div>

        {/* The Fully Responsive GPU-Accelerated Grain Layer */}
        <div 
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none transform translateZ(0)" 
          style={{ filter: 'url(#noiseFilter)' }} 
        />
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-3 z-20">
        <p className="text-[#9a978f] text-sm font-sans hidden sm:block">
          Get your own unique link
        </p>
        <Link href="/sign-up">
          <Button className="cursor-pointer bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 rounded-full transition-colors">
            Sign up
          </Button>
        </Link>
      </div>

      {/* --- 2. THE GLASSMORPHISM CARD --- */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-12 shadow-2xl flex flex-col gap-8 my-12 sm:my-0">
        {/* Header Section */}
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xs font-semibold mb-2 tracking-widest uppercase text-white/50">
            Mystery Message
          </h2>
          <h1 className="bg-clip-text text-transparent font-sans italic text-xl sm:text-3xl bg-[url('/purple.webp')] bg-bottom">
            Send a message... The best part? {username} won't know who sent it.
          </h1>
        </div>

        {/* Form Section */}
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(sendMessage)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 ml-1">
                      Message
                    </FormLabel>
                    <FormControl className="bg-black/20 border border-white/10 rounded-2xl focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
                      <textarea
                        className="w-full min-h-[160px] p-4 text-white placeholder:text-white/30 bg-transparent resize-y outline-none"
                        placeholder="Whatever is on your mind..."
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(sendMessage)();
                          }
                        }}
                      />
                    </FormControl>

                    {form.formState.errors.content && (
                      <p className="text-[#c4707a]/80 ml-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                        {errorMessages}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Buttons Row */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-300 hover:text-yellow-400/80 cursor-pointer hover:bg-black transition-colors"
                  disabled={isLoading}
                  onClick={() => complete("")}
                >
                  {isLoading ? "Suggesting..." : "✨ Suggest Ideas"}
                </Button>

                <Button
                  type="submit"
                  className="text-black cursor-pointer bg-white hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all px-8 py-2.5 rounded-full font-medium"
                  disabled={issending}
                >
                  {issending ? "Sending..." : "Send"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* --- 3. SUGGESTED MESSAGES GRID --- */}
        {completion && suggestedMessages.length > 0 && (
          <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-2">
            <span className="text-xs text-white/40 uppercase tracking-wider ml-1">
              Pick a suggestion
            </span>
            <div className="grid grid-cols-1 gap-2">
              {suggestedMessages.map((message, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(message)}
                  className="bg-white/5 border border-white/5 hover:border-violet-500/50 rounded-xl px-5 py-4 cursor-pointer hover:bg-white/10 transition-all group"
                >
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors">
                    {message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default page;