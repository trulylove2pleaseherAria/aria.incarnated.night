import { createFileRoute } from "@tanstack/react-router";
import { AriaApp } from "@/components/aria/AriaApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AriaApp />;
}
