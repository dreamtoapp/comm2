import BackButton from '@/components/BackButton';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ViewCategorySeoPageContent({ category }: { category: any }) {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            View SEO: <span className="text-primary">{category.name}</span>
          </h1>
          <p className="text-muted-foreground">
            SEO settings for this category.
          </p>
        </div>
        <BackButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic SEO</CardTitle>
          <CardDescription>Core search engine optimization settings.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="categoryName" className="text-sm font-medium text-muted-foreground">Category Name</Label>
              <p className="text-lg font-semibold text-foreground mt-1">{category.name}</p>
            </div>

            <div>
              <Label htmlFor="categorySlug" className="text-sm font-medium text-muted-foreground">Category Slug</Label>
              <p className="text-lg font-semibold text-foreground mt-1">{category.slug}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="metaTitle" className="text-sm font-medium text-muted-foreground">Meta Title</Label>
            <p className="text-lg text-foreground mt-1">{category.metaTitle || '-'}</p>
          </div>

          <div>
            <Label htmlFor="metaDescription" className="text-sm font-medium text-muted-foreground">Meta Description</Label>
            <p className="text-foreground mt-1 leading-relaxed">{category.metaDescription || '-'}</p>
          </div>

          <div>
            <Label htmlFor="keywords" className="text-sm font-medium text-muted-foreground">Keywords</Label>
            {category.keywords && category.keywords.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {category.keywords.map((keyword: string) => (
                  <Badge key={keyword} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-foreground mt-1">-</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
