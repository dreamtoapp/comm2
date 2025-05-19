const AboutUs = ({ aboutus, companyName }: { aboutus?: string; companyName?: string }) => {
  return (
    <div className='flex flex-col gap-4 text-center sm:text-right'>
      <div>
        <h3 className='text-right text-lg font-semibold'>نحن</h3>
        <p className='text-sm text-muted-foreground'>{companyName}</p>
      </div>
      <div>
        <h3 className='text-right text-lg font-semibold'>روئيتنا</h3>
        <p className='text-sm text-muted-foreground'>{aboutus}</p>
      </div>
    </div>
  );
};
export default AboutUs;
