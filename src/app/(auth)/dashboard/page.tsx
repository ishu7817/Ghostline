"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Trash2, LogOut, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Message } from "@/models/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { apiResponse } from "@/types/apiResponse";


export default function UserDashboard() {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<apiResponse>("/api/acceptMessage");
      setValue("acceptMessages", response.data.isAcceptingMessage || false);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message || "Could not load settings.",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<apiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Inbox refreshed");
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to load messages.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAllMessages();
    fetchAcceptMessages();
  }, [fetchAcceptMessages, fetchAllMessages, session]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<apiResponse>("/api/acceptMessage", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Settings updated", {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to update settings.",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete<apiResponse>(`/api/delete-message/${messageId}`);
      setMessages((prev) => prev.filter((message) => message._id.toString() !== messageId));
      toast.success("Message deleted");
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to delete message.",
      });
    }
  };

  const username = session?.user?.username;
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied!", {
      description: "Paste it anywhere to start receiving messages.",
    });
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4 p-8 rounded-2xl bg-white/[0.03] border border-white/10">
          <h2 className="text-2xl font-bold tracking-tight text-white">Please sign in</h2>
          <p className="text-white/60 text-sm">You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Ghostline
          </div>
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Log Out
            <LogOut className="w-4  cursor-pointer h-4" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isLogoutDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Log Out</h3>
              <p className="text-white/60 text-sm mb-6">
                Are you sure you want to log out of your account?
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsLogoutDialogOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  No
                </button>
                <button
                onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            signOut({ callbackUrl: '/' })
                          }
                        }}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 cursor-pointer py-2 rounded-xl text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-white/60 text-base max-w-2xl">
            Share your link to receive messages, and read them here anonymously.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
            <h2 className="text-sm font-medium text-white/60 mb-4">
              Your Public Link
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full bg-black/50 border border-white/10 text-white/90 rounded-xl px-4 py-3 focus:outline-none text-sm truncate"
              />
              <button
                onClick={copyToClipboard}
                className="shrink-0 bg-white hover:bg-neutral-200 text-black px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
              >
                <Copy className="h-4 cursor-pointer w-4" />
                Copy
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
            <h2 className="text-sm font-medium text-white/60 mb-4">
              Message Status
            </h2>
            <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-white/90">
                Accepting messages
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...form.register("acceptMessages")}
                  onChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
              </label>
            </div>
          </div>
        </div>

        <hr className="border-white/10" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-white">Your Messages</h2>
            <button
              onClick={(e) => {
                e.preventDefault();
                fetchAllMessages(true);
              }}
              disabled={isLoading}
              className=" cursor-pointer flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 cursor-pointer h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message._id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <p className="text-white/90 text-base leading-relaxed mb-6">
                      {message.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        Anonymous
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(message._id.toString())}
                        className="text-white/40 hover:text-red-400 transition-colors p-1"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <MessageSquare className="w-8 h-8 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">No messages yet</h3>
              <p className="text-white/50 text-sm max-w-sm">
                Copy your public link above and share it on your socials to start receiving messages.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}