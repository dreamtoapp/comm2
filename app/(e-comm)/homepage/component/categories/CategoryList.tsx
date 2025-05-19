'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    description?: string | null;
    productCount: number;
}

interface CategoryListProps {
    categories: Category[];
    title: string;
    description: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
    const router = useRouter();
    const hasProducts = category.productCount > 0;

    const handleClick = () => {
        router.push(`/categories/${category.slug}`);
    };

    return (
        <motion.div
            className="group cursor-pointer overflow-hidden rounded-xl"
            variants={item}
            whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
        >
            <div className="relative h-44 w-72 overflow-hidden rounded-xl shadow-md transition-all duration-300">
                {/* Category image with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80">
                    {category.imageUrl ? (
                        <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 288px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            priority={index < 4}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                    )}
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>

                    <div className="mt-1 flex items-center justify-between">
                        <Badge className={`${hasProducts ? 'bg-primary' : 'bg-destructive'} text-white`}>
                            {hasProducts ? `${category.productCount} منتجات` : 'لا توجد منتجات'}
                        </Badge>

                        <span className="flex items-center text-sm font-medium text-white/90 transition-transform duration-300 group-hover:translate-x-1">
                            تصفح
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const CategoryList = ({ categories, title, description }: CategoryListProps) => (
    <Card className="mx-auto w-full bg-transparent shadow-sm">
        <CardContent className="p-4">
            <div className="flex items-center justify-between pb-3">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                <Link
                    href="/categories"
                    className="flex items-center text-sm font-medium text-primary hover:underline"
                >
                    عرض الكل
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Link>
            </div>

            <ScrollArea className="w-full py-3">
                <motion.div
                    className="flex gap-5 pb-3"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {categories.map((category, index) => (
                        <CategoryCard key={category.id} category={category} index={index} />
                    ))}
                </motion.div>
                <ScrollBar orientation="horizontal" className="h-2 [&>div]:bg-primary/30" />
            </ScrollArea>
        </CardContent>
    </Card>
);

export default CategoryList; 