import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type FeatureCardProps = {
  id: string
  title: string
  description: string
  ctaText: string
  href: string
}

export default function FeatureCard({ id, title, description, ctaText, href }: FeatureCardProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle id={`${id}-title`} className="text-xl">
            {title}
          </CardTitle>
          <CardDescription className="leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter>
          <Button asChild>
            <a href={href} aria-label={ctaText}>
              {ctaText}
            </a>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
