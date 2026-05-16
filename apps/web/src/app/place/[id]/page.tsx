import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, MapPin, Phone, Clock, BadgeCheck, ArrowLeft,
  Heart, Share2, ExternalLink
} from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { CATEGORIES } from "@/lib/types";
import { fetchPlace, MOCK_PLACES } from "@/lib/api";

export const dynamic = 'force-dynamic';
export const revalidate = 0
export const dynamicParams = true;

interface Props {
  params: Promise<{ id: string }>;
}

// Generate static params from mock data
export async function generateStaticParams() {
  return MOCK_PLACES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    const place = await fetchPlace(id);
    return {
      title: place.name,
      description: place.description,
    };
  } catch {
    return { title: "Local não encontrado" };
  }
}

export default async function PlacePage({ params }: Props) {
  let place;
  try {
    const { id } = await params;
    place = await fetchPlace(id);
  } catch {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.slug === place.category_slug);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero image ──────────────────────────────────── */}
      <div className="relative h-72 sm:h-96">
        <Image
          src={place.cover_url}
          alt={place.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/60 via-transparent to-ocean-dark/20" />

        {/* Back button */}
        <Link
          href="/explorar"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm
                     flex items-center justify-center shadow-card hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-ocean-dark" />
        </Link>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            aria-label="Guardar nos favoritos"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-card hover:bg-white transition-all"
          >
            <Heart className="w-4 h-4 text-ocean-dark" />
          </button>
          <button
            aria-label="Partilhar"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-card hover:bg-white transition-all"
          >
            <Share2 className="w-4 h-4 text-ocean-dark" />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-card">
          <Star className="w-4 h-4 fill-sand text-sand" />
          <span className="font-display font-bold text-ocean-dark">{place.rating}</span>
          <span className="text-xs font-body text-muted">({place.review_count})</span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Category + verified */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="category-pill"
            style={{
              backgroundColor: `${category?.color}15`,
              borderColor: `${category?.color}30`,
              color: category?.color,
            }}
          >
            {category?.emoji} {category?.label}
          </span>
          {place.verified && (
            <div className="flex items-center gap-1 text-verde text-xs font-body font-medium">
              <BadgeCheck className="w-4 h-4" />
              Verificado
            </div>
          )}
        </div>

        <h1 className="font-display font-bold text-ocean-dark text-3xl mb-3">{place.name}</h1>
        <p className="font-body text-muted text-base leading-relaxed mb-6">{place.description}</p>

        {/* Tags */}
        {place.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {place.tags.map((tag) => (
              <span key={tag} className="text-xs font-body bg-sand-light text-ocean-dark px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Details card */}
        <div className="card p-5 space-y-4 mb-6">
          {place.address && (
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-ocean shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-body text-muted mb-0.5">Morada</p>
                <p className="text-sm font-body text-ocean-dark">{place.address}</p>
              </div>
            </div>
          )}

          {place.phone && (
            <div className="flex gap-3 items-start">
              <Phone className="w-5 h-5 text-ocean shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-body text-muted mb-0.5">Telefone</p>
                <a href={`tel:${place.phone}`} className="text-sm font-body text-ocean hover:underline">
                  {place.phone}
                </a>
              </div>
            </div>
          )}

          {place.opening_hours && (
            <div className="flex gap-3 items-start">
              <Clock className="w-5 h-5 text-ocean shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-body text-muted mb-1">Horários</p>
                <div className="space-y-1">
                  {Object.entries(place.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm font-body text-ocean-dark gap-4">
                      <span className="text-muted">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button className="btn-primary flex-1 justify-center py-3.5">
            Fazer Reserva
          </button>
          <a
            href={`https://maps.google.com/?q=${place.lat},${place.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-5 py-3.5"
          >
            <ExternalLink className="w-4 h-4" />
            Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
