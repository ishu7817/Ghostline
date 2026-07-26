"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-br from-violet-600/25 via-fuchsia-600/10 to-transparent blur-[130px] pointer-events-none" />

      
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-6 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Anonymous · Untraceable
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className=" h-fit text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-4xl mb-6 bg-gradient-to-br from-yellow-400/80 via-yellow-300/80 to-yellow-200/80 bg-clip-text text-transparent"
        >
          Send what you can&apos;t say.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl  text-white/60 max-w-xl mt-10 font-normal leading-relaxed"
        >
          Create your secure link, share it anywhere, and receive honest thoughts without the friction of identities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            asChild
            className="!bg-white !text-black hover:!bg-neutral-200 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all px-8 py-7 rounded-full font-semibold text-base"
          >
            <Link href="/sign-up">Create your link</Link>
          </Button>
        </motion.div>
      </section>

   
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Mechanism</h2>
          <p className="text-3xl md:text-4xl font-bold tracking-tight">How Ghostline works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col justify-between overflow-hidden"
          >
            <span className="text-7xl font-serif font-black text-white/10 absolute top-2 right-4 pointer-events-none select-none">
              01
            </span>
            <div>
              <h3 className="text-xl font-semibold mb-3 mt-4 text-white">Create your link</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Sign up in seconds and claim your unique custom link, engineered to be shared anywhere.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col justify-between overflow-hidden"
          >
            <span className="text-7xl font-serif font-black text-white/10 absolute top-2 right-4 pointer-events-none select-none">
              02
            </span>
            <div>
              <h3 className="text-xl font-semibold mb-3 mt-4 text-white">Share it wide</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Drop it into your bio, story, or DMs. Anyone can send a message instantly—no login required.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col justify-between overflow-hidden"
          >
            <span className="text-7xl font-serif font-black text-white/10 absolute top-2 right-4 pointer-events-none select-none">
              03
            </span>
            <div>
              <h3 className="text-xl font-semibold mb-3 mt-4 text-white">Read anonymously</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Messages land securely in your dashboard. No names, no clues—just pure, unfiltered feedback.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <p className="text-xs uppercase tracking-wider text-violet-400 font-semibold mb-4">Live Preview</p>
          
          <blockquote className="text-xl md:text-2xl font-medium tracking-tight text-white mb-4 italic">
            &ldquo;Your Spotify Wrapped is probably a cry for help.&rdquo;
          </blockquote>
          
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>— sent anonymously via Ghostline</span>
            <motion.div className="flex items-center ">

            <span >Just now <span className="   bg-violet-400 text-transparent bg-clip-text blur-[1px] text-2xl animate-pulse duration-400">·</span> </span> 
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-white/50 text-base md:text-lg leading-relaxed font-light"
        >
          No login required to send. No trace left behind. Just an honest thought, delivered cleanly to your space.
        </motion.p>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Ready to hear what they really think?
          </h2>
          <p className="text-white/60 mb-8 max-w-md">
            Claim your custom link in less than 30 seconds. Free and open source.
          </p>
          <Button
            asChild
            className="!bg-white !text-black hover:!bg-neutral-200 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all px-8 py-7 rounded-full font-semibold text-base"
          >
            <Link href="/sign-up">Create your link</Link>
          </Button>
        </motion.div>
      </section>

      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-12  border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
        <p>© {new Date().getFullYear()} Ghostline. All rights reserved.</p>
        <p>
          Built with <span className=" text-white">💜</span> by{" "}
          <a
            
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-violet-400 transition-colors"
          >
            Ishu
          </a>
        </p>
      </footer>
    </div>
  );
}