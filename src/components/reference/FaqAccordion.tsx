"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";

export function FaqAccordion() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={FAQ_ITEMS[0]?.id}
      className="rounded-[12px] border border-border bg-surface px-5 sm:px-6"
    >
      {FAQ_ITEMS.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

