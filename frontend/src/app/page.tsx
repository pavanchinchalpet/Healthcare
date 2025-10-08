import { Button } from "@/components/ui/button"
import HeaderNav from "@/components/healthcare/header-nav"
import FeatureCard from "@/components/healthcare/feature-card"

export default function HealthcarePage() {
  return (
    <>
      <HeaderNav />

      <main id="home" className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <section aria-labelledby="page-title" className="mb-10 md:mb-16">
          <h1 id="page-title" className="text-3xl md:text-5xl font-semibold text-pretty">
            Healthcare Management System
          </h1>
          <p className="mt-3 md:mt-4 text-muted-foreground text-pretty leading-relaxed">
            Manage patients, doctors, and appointments efficiently
          </p>
          <div className="mt-6">
            <Button asChild>
              <a href="/appointments" aria-label="Create or schedule appointments">
                Create appointment
              </a>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" aria-label="Key management areas">
          <FeatureCard
            id="patients"
            title="Patients"
            description="Manage patient records and medical history"
            ctaText="Manage patients"
            href="/patients"
          />
          <FeatureCard
            id="doctors"
            title="Doctors"
            description="View and manage doctor profiles"
            ctaText="Manage doctors"
            href="/doctors"
          />
          <FeatureCard
            id="appointments"
            title="Appointments"
            description="Schedule and track appointments"
            ctaText="Manage appointments"
            href="/appointments"
          />
        </section>
      </main>
    </>
  )
}