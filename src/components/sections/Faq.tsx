import { Reveal } from '@/components/Reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqsConfig } from '@/config/faqsConfig';
import { HelpCircle } from 'lucide-react';

export function Faq() {
  return (
    <section id="faq" className="relative z-10 section-padding">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Reveal>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <span className="eyebrow">Questions and Answers</span>
          </Reveal>
          <Reveal delay={200}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              Everything you need to know.
            </h2>
          </Reveal>
        </div>

        {/* Accordion */}
        <Reveal delay={300}>
          <Accordion type="single" collapsible className="w-full">
            {faqsConfig.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
