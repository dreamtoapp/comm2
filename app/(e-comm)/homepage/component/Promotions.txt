// app/components/Promotions.tsx
interface Promotion {
  title: string;
  discount: number;
  startDate: Date;
  endDate: Date;
}

export default function Promotions({ promotions }: { promotions: Promotion[] }) {
  return (
    <section className='p-4'>
      <h2 className='text-2xl font-bold'>Active Promotions</h2>
      <div className='mt-4 flex gap-4 overflow-x-auto'>
        {promotions.map((promotion, index) => (
          <div key={index} className='min-w-[200px] rounded-lg border p-4'>
            <h3>{promotion.title}</h3>
            <p>{promotion.discount}% Off</p>
            <p>Valid until: {new Date(promotion.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
