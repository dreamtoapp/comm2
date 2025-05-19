'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Promotion {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    discountValue?: number | null;
    discountType?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    active: boolean;
}

interface FeaturedPromotionsProps {
    promotions: Promotion[];
}

// Client-only date component to prevent hydration mismatch
function ClientOnlyDate({ date }: { date: Date | string | null }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        if (date) {
            // Only run on client after hydration is complete
            setFormattedDate(new Date(date).toLocaleDateString('ar-SA'));
        }
    }, [date]);

    return <>{formattedDate}</>;
}

export default function FeaturedPromotions({ promotions }: FeaturedPromotionsProps) {
    // Only show active promotions with valid dates
    const activePromotions = promotions.filter(promo =>
        promo.active &&
        (!promo.endDate || new Date(promo.endDate) > new Date()) &&
        (!promo.startDate || new Date(promo.startDate) <= new Date())
    );

    if (activePromotions.length === 0) return null;

    return (
        <section className="my-8">
            <h2 className="mb-4 text-2xl font-bold">العروض الخاصة</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activePromotions.map((promotion, index) => (
                    <motion.div
                        key={promotion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
                    >
                        {/* Promotion Image */}
                        <div className="relative aspect-video overflow-hidden">
                            {promotion.imageUrl ? (
                                <Image
                                    src={promotion.imageUrl}
                                    alt={promotion.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-r from-primary/30 to-primary/10" />
                            )}

                            {/* Discount Badge */}
                            {promotion.discountValue && promotion.discountType && (
                                <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                                    {promotion.discountType === 'PERCENTAGE'
                                        ? `${promotion.discountValue}% خصم`
                                        : `${promotion.discountValue} ريال خصم`}
                                </div>
                            )}
                        </div>

                        {/* Promotion Details */}
                        <div className="p-4">
                            <h3 className="mb-2 text-lg font-semibold">{promotion.title}</h3>
                            {promotion.description && (
                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                    {promotion.description}
                                </p>
                            )}

                            {/* Dates */}
                            {promotion.endDate && (
                                <p className="text-xs text-muted-foreground">
                                    ينتهي في: <ClientOnlyDate date={promotion.endDate} />
                                </p>
                            )}

                            {/* View Products Button */}
                            <Link
                                href={`/promotions/${encodeURIComponent(promotion.title.toLowerCase().replace(/ /g, '-'))}-${promotion.id}`}
                                className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                تصفح المنتجات
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}