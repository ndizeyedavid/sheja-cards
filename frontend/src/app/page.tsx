import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Faq from "./components/Faq";
import Features from "./components/Features";
import Partners from "./components/Partners";
import About from "./components/About";
import Carousel from "./components/Carousel";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Features />
      <Carousel />
      <Faq />
      <Footer />
    </>
  );
}
