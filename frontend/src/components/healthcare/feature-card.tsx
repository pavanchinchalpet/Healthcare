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
  const getCardTheme = (id: string) => {
    switch (id) {
      case 'patients':
        return {
          gradient: 'from-blue-50 to-indigo-50',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          )
        }
      case 'doctors':
        return {
          gradient: 'from-green-50 to-emerald-50',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          )
        }
      case 'appointments':
        return {
          gradient: 'from-purple-50 to-violet-50',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          )
        }
      default:
        return {
          gradient: 'from-gray-50 to-slate-50',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          )
        }
    }
  }

  const theme = getCardTheme(id)

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="h-full flex flex-col">
      <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white flex flex-col">
        <CardHeader className={`bg-gradient-to-r ${theme.gradient} pb-4`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-lg ${theme.iconBg}`}>
              <svg className={`w-6 h-6 ${theme.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {theme.icon}
              </svg>
            </div>
            <CardTitle id={`${id}-title`} className="text-xl font-semibold text-gray-800">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 leading-relaxed text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Comprehensive management tools</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure and reliable platform</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Real-time updates and sync</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 mt-auto">
          <Button asChild className={`w-full ${theme.buttonClass} py-3`}>
            <a href={href} aria-label={ctaText}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {ctaText}
            </a>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
